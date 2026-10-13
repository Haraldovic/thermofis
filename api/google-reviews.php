<?php
declare(strict_types=1);

// Credentials and the short-lived raw response cache belong OUTSIDE public_html.
// This endpoint only reads Google's Business Profile APIs; it never writes reviews.
ini_set('display_errors', '0');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, private');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');

const TF_REVIEWS_FRESH_SECONDS = 21600;
const TF_REVIEWS_MAX_SECONDS = 86400;
const TF_REVIEWS_RETRY_SECONDS = 900;
const TF_REVIEWS_MAX_PAGES = 5;
const TF_REVIEWS_SEARCH_URL = 'https://www.google.com/maps/search/?api=1&query=Thermofis%20Hanau';

function tfReply(array $data, int $statusCode = 200): void {
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE);
    exit;
}

function tfWithin(string $path, string $root): bool {
    $root = rtrim($root, DIRECTORY_SEPARATOR);
    return $path === $root || strpos($path, $root . DIRECTORY_SEPARATOR) === 0;
}

function tfPublicPath(string $path): bool {
    $roots = [realpath(dirname(__DIR__))];
    if (!empty($_SERVER['DOCUMENT_ROOT'])) {
        $roots[] = realpath((string) $_SERVER['DOCUMENT_ROOT']);
    }
    foreach ($roots as $root) {
        if ($root !== false && $root !== '' && tfWithin($path, $root)) {
            return true;
        }
    }
    return false;
}

function tfSetting(array $config, string $key, string $environment): string {
    $value = getenv($environment);
    return trim($value !== false && $value !== '' ? $value : (string) ($config[$key] ?? ''));
}

function tfMapsUrl(string $url): string {
    $parts = parse_url($url);
    if (!is_array($parts) || ($parts['scheme'] ?? '') !== 'https' || isset($parts['user']) || isset($parts['pass'])) {
        return TF_REVIEWS_SEARCH_URL;
    }
    $host = strtolower((string) ($parts['host'] ?? ''));
    $path = (string) ($parts['path'] ?? '');
    $allowed = $host === 'maps.app.goo.gl' || $host === 'g.page'
        || (in_array($host, ['www.google.com', 'google.com', 'www.google.de', 'google.de'], true)
            && strpos($path, '/maps') === 0);
    return $allowed && strlen($url) <= 2048 ? $url : TF_REVIEWS_SEARCH_URL;
}

function tfReadJson(string $file): ?array {
    if (is_link($file) || !is_file($file) || !is_readable($file)) {
        return null;
    }
    $size = @filesize($file);
    if ($size === false || $size > 3000000) {
        return null;
    }
    $raw = @file_get_contents($file);
    $decoded = is_string($raw) ? json_decode($raw, true) : null;
    return is_array($decoded) ? $decoded : null;
}

function tfWriteJson(string $file, array $data): bool {
    if (is_link($file)) {
        return false;
    }
    $temporary = @tempnam(dirname($file), '.reviews-');
    if ($temporary === false) {
        return false;
    }
    @chmod($temporary, 0600);
    $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE);
    $ok = is_string($json) && @file_put_contents($temporary, $json, LOCK_EX) !== false
        && @rename($temporary, $file);
    if (!$ok) {
        @unlink($temporary);
    }
    return $ok;
}

function tfGoogleRequest(string $url, ?array $post, array $headers, float $deadline): ?array {
    if (!function_exists('curl_init') || microtime(true) >= $deadline) {
        return null;
    }
    // Every caller uses one of the hardcoded Google endpoints below. No input URL.
    $handle = curl_init($url);
    if ($handle === false) {
        return null;
    }
    $body = '';
    $milliseconds = max(1, min(6000, (int) (($deadline - microtime(true)) * 1000)));
    curl_setopt_array($handle, [
        CURLOPT_FOLLOWLOCATION => false,
        CURLOPT_CONNECTTIMEOUT_MS => min(3000, $milliseconds),
        CURLOPT_TIMEOUT_MS => $milliseconds,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_SSL_VERIFYHOST => 2,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_WRITEFUNCTION => static function ($ch, string $chunk) use (&$body): int {
            if (strlen($body) + strlen($chunk) > 1000000) {
                return 0;
            }
            $body .= $chunk;
            return strlen($chunk);
        },
    ]);
    if ($post !== null) {
        curl_setopt($handle, CURLOPT_POST, true);
        curl_setopt($handle, CURLOPT_POSTFIELDS, http_build_query($post));
    }
    $ok = curl_exec($handle);
    $http = (int) curl_getinfo($handle, CURLINFO_RESPONSE_CODE);
    curl_close($handle);
    if ($ok === false || $http < 200 || $http >= 300) {
        return null;
    }
    $data = json_decode($body, true);
    return is_array($data) ? $data : null;
}

function tfStars($value): int {
    return ['ONE' => 1, 'TWO' => 2, 'THREE' => 3, 'FOUR' => 4, 'FIVE' => 5][(string) $value] ?? 0;
}

function tfDate($value): ?string {
    if (!is_string($value) || strlen($value) > 50) {
        return null;
    }
    $time = strtotime($value);
    return $time !== false && $time > 0 ? gmdate('c', $time) : null;
}

function tfReady(?array $snapshot, string $mapsUrl): ?array {
    if ($snapshot === null || !isset($snapshot['fetchedAt'], $snapshot['pages'][0])
        || !is_array($snapshot['pages']) || !is_array($snapshot['pages'][0])) {
        return null;
    }
    $fetchedAt = (int) $snapshot['fetchedAt'];
    $age = time() - $fetchedAt;
    if ($age < 0 || $age >= TF_REVIEWS_MAX_SECONDS) {
        return null;
    }
    $first = $snapshot['pages'][0];
    $count = $first['totalReviewCount'] ?? null;
    $rating = $first['averageRating'] ?? null;
    if (!is_numeric($count) || (int) $count < 0
        || ((int) $count > 0 && (!is_numeric($rating) || (float) $rating < 1 || (float) $rating > 5))) {
        return null;
    }
    $reviews = [];
    foreach (array_slice($snapshot['pages'], 0, TF_REVIEWS_MAX_PAGES) as $page) {
        foreach (array_slice((array) ($page['reviews'] ?? []), 0, 50) as $review) {
            if (!is_array($review) || tfStars($review['starRating'] ?? '') === 0) {
                continue;
            }
            $reviews[] = [
                'author' => (string) ($review['reviewer']['displayName'] ?? 'Google-Nutzer'),
                'rating' => tfStars($review['starRating']),
                'text' => (string) ($review['comment'] ?? ''),
                'publishedAt' => tfDate($review['createTime'] ?? null),
                'updatedAt' => tfDate($review['updateTime'] ?? null),
            ];
        }
    }
    return [
        'status' => 'ready',
        'source' => 'google-business-profile',
        'rating' => (int) $count > 0 ? (float) $rating : null,
        'count' => (int) $count,
        'updatedAt' => gmdate('c', $fetchedAt),
        'stale' => $age >= TF_REVIEWS_FRESH_SECONDS,
        'reviews' => $reviews,
        'googleMapsUrl' => $mapsUrl,
    ];
}

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
    header('Allow: GET');
    tfReply(['status' => 'method-not-allowed', 'reviews' => [], 'googleMapsUrl' => TF_REVIEWS_SEARCH_URL], 405);
}

$config = [];
$configPath = getenv('THERMOFIS_GOOGLE_CONFIG_FILE');
if (!is_string($configPath) || $configPath === '') {
    $configPath = dirname(__DIR__, 2) . '/thermofis-private/google-reviews-config.php';
}
if (is_string($configPath) && $configPath !== '') {
    $resolved = realpath($configPath);
    if ($resolved !== false && !tfPublicPath($resolved) && is_file($resolved) && is_readable($resolved)) {
        try {
            $loaded = (static function (string $path) { return require $path; })($resolved);
            $config = is_array($loaded) ? $loaded : [];
        } catch (Throwable $error) {
            $config = [];
        }
    }
}

$mapsUrl = tfMapsUrl(tfSetting($config, 'google_maps_url', 'THERMOFIS_GOOGLE_MAPS_URL'));
$fallback = ['status' => 'not-configured', 'reviews' => [], 'googleMapsUrl' => $mapsUrl];
$clientId = tfSetting($config, 'client_id', 'THERMOFIS_GOOGLE_CLIENT_ID');
$clientSecret = tfSetting($config, 'client_secret', 'THERMOFIS_GOOGLE_CLIENT_SECRET');
$refreshToken = tfSetting($config, 'refresh_token', 'THERMOFIS_GOOGLE_REFRESH_TOKEN');
$accountId = tfSetting($config, 'account_id', 'THERMOFIS_GOOGLE_ACCOUNT_ID');
$locationId = tfSetting($config, 'location_id', 'THERMOFIS_GOOGLE_LOCATION_ID');
$cacheDirectory = tfSetting($config, 'cache_dir', 'THERMOFIS_GOOGLE_CACHE_DIR');
if ($clientId === '' || $clientSecret === '' || $refreshToken === '' || $cacheDirectory === ''
    || !preg_match('/^[A-Za-z0-9_-]{1,128}$/D', $accountId)
    || !preg_match('/^[A-Za-z0-9_-]{1,128}$/D', $locationId)) {
    tfReply($fallback);
}

// A persistent private directory is mandatory; never fall back to the web root.
if ($cacheDirectory[0] !== DIRECTORY_SEPARATOR || is_link($cacheDirectory)) {
    tfReply($fallback);
}
$parent = realpath(dirname($cacheDirectory));
if ($parent === false || tfPublicPath($parent) || tfPublicPath($cacheDirectory)) {
    tfReply($fallback);
}
if (!is_dir($cacheDirectory) && !@mkdir($cacheDirectory, 0700)) {
    tfReply($fallback);
}
$privateDirectory = realpath($cacheDirectory);
if ($privateDirectory === false || tfPublicPath($privateDirectory) || !is_writable($privateDirectory)) {
    tfReply($fallback);
}
@chmod($privateDirectory, 0700);

$cacheFile = $privateDirectory . '/reviews.json';
$retryFile = $privateDirectory . '/retry.json';
$lockFile = $privateDirectory . '/refresh.lock';
$snapshot = tfReadJson($cacheFile);
$cached = tfReady($snapshot, $mapsUrl);
if ($cached !== null && !$cached['stale']) {
    tfReply($cached);
}
if ($snapshot !== null && $cached === null) {
    @unlink($cacheFile); // No old snapshots survive the hard 24-hour expiry.
}
$fallback['status'] = 'temporarily-unavailable';
$retry = tfReadJson($retryFile);
if ((int) ($retry['retryAfter'] ?? 0) > time()) {
    tfReply($cached ?? $fallback);
}
if (is_link($lockFile)) {
    tfReply($cached ?? $fallback);
}
$lock = @fopen($lockFile, 'c+b');
if ($lock === false) {
    tfReply($cached ?? $fallback);
}
@chmod($lockFile, 0600);
if (!flock($lock, LOCK_EX | LOCK_NB)) {
    fclose($lock);
    tfReply($cached ?? $fallback);
}

try {
    $deadline = microtime(true) + 18;
    $token = tfGoogleRequest('https://oauth2.googleapis.com/token', [
        'client_id' => $clientId,
        'client_secret' => $clientSecret,
        'refresh_token' => $refreshToken,
        'grant_type' => 'refresh_token',
    ], ['Content-Type: application/x-www-form-urlencoded'], $deadline);
    $accessToken = (string) ($token['access_token'] ?? '');
    if ($accessToken === '' || preg_match('/[\r\n]/', $accessToken)) {
        throw new RuntimeException('Authorization unavailable');
    }
    $base = 'https://mybusiness.googleapis.com/v4/accounts/' . rawurlencode($accountId)
        . '/locations/' . rawurlencode($locationId) . '/reviews';
    $pages = [];
    $pageToken = '';
    $seenTokens = [];
    for ($index = 0; $index < TF_REVIEWS_MAX_PAGES; $index++) {
        $query = ['pageSize' => 50, 'orderBy' => 'updateTime desc'];
        if ($pageToken !== '') {
            $query['pageToken'] = $pageToken;
        }
        $page = tfGoogleRequest($base . '?' . http_build_query($query), null,
            ['Authorization: Bearer ' . $accessToken, 'Accept: application/json'], $deadline);
        if ($page === null || !isset($page['totalReviewCount'])) {
            throw new RuntimeException('Reviews unavailable');
        }
        $pages[] = $page; // Store the short-lived Google response without rewriting it.
        $pageToken = (string) ($page['nextPageToken'] ?? '');
        if ($pageToken === '' || isset($seenTokens[$pageToken])) {
            break;
        }
        $seenTokens[$pageToken] = true;
    }
    $newSnapshot = ['fetchedAt' => time(), 'pages' => $pages];
    $ready = tfReady($newSnapshot, $mapsUrl);
    if ($ready === null || !tfWriteJson($cacheFile, $newSnapshot)) {
        throw new RuntimeException('Private cache unavailable');
    }
    @unlink($retryFile);
    $answer = $ready;
} catch (Throwable $error) {
    tfWriteJson($retryFile, ['retryAfter' => time() + TF_REVIEWS_RETRY_SECONDS]);
    // The 24-hour boundary may have passed during the bounded upstream request.
    $stillValid = tfReady($snapshot, $mapsUrl);
    if ($snapshot !== null && $stillValid === null) {
        @unlink($cacheFile);
    }
    $answer = $stillValid ?? $fallback;
} finally {
    flock($lock, LOCK_UN);
    fclose($lock);
}
tfReply($answer);
