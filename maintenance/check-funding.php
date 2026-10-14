<?php
/** CLI only: checks official source changes. Never rewrites legal rules. PHP 8.1+, cURL. */
declare(strict_types=1);
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
if (!extension_loaded('curl')) { fwrite(STDERR, "PHP cURL fehlt.\n"); exit(1); }
$stateDir = getenv('THERMOFIS_FUNDING_STATE_DIR') ?: dirname(__DIR__, 2) . '/thermofis-private/funding';
$publicDir = dirname(__DIR__);
if (!$stateDir || !is_dir($stateDir) || !is_writable($stateDir)) {
    fwrite(STDERR, "Privates THERMOFIS_FUNDING_STATE_DIR anlegen und setzen.\n"); exit(1);
}
$realState = realpath($stateDir);
$realPublic = realpath($publicDir);
if (!$realState || !$realPublic || $realState === $realPublic || str_starts_with($realState, $realPublic . DIRECTORY_SEPARATOR)) {
    fwrite(STDERR, "Statusverzeichnis muss ausserhalb public_html liegen.\n"); exit(1);
}
$lock = fopen($stateDir . '/funding-check.lock', 'c');
if (!$lock || !flock($lock, LOCK_EX | LOCK_NB)) { exit(0); }
$baselineFile = $stateDir . '/funding-baseline.json';
$outputFile = $publicDir . '/assets/data/foerder-status.json';
$initialize = in_array('--approve-baseline', $argv, true);
$sources = [
    'kfw458' => 'https://www.kfw.de/inlandsfoerderung/Privatpersonen/Bestehende-Immobilie/F%C3%B6rderprodukte/Heizungsf%C3%B6rderung-f%C3%BCr-Privatpersonen-Wohngeb%C3%A4ude-(458)/',
    'kfw458-merkblatt' => 'https://www.kfw.de/PDF/Download-Center/F%C3%B6rderprogramme-(Inlandsf%C3%B6rderung)/PDF-Dokumente/6000005131_M_458.pdf',
    'bafa-optimierung' => 'https://www.bafa.de/DE/Energie/Effiziente_Gebaeude/Sanierung_Wohngebaeude/Heizungsoptimierung/heizungsoptimierung_node.html',
];
$now = gmdate('Y-m-d');
function writeJson(string $path, array $data, int $permissions = 0644): void {
    $tmp = tempnam(dirname($path), 'tf-');
    if ($tmp === false) { throw new RuntimeException('Datei konnte nicht angelegt werden'); }
    try {
        $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
        if (file_put_contents($tmp, $json, LOCK_EX) === false) { throw new RuntimeException('Schreiben fehlgeschlagen'); }
        chmod($tmp, $permissions);
        if (!rename($tmp, $path)) { throw new RuntimeException('Ersetzen fehlgeschlagen'); }
    } finally { if (file_exists($tmp)) { unlink($tmp); } }
}
function fetchSource(string $url): string {
    $ch = curl_init($url);
    curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_CONNECTTIMEOUT => 8, CURLOPT_TIMEOUT => 22,
        CURLOPT_FOLLOWLOCATION => false, CURLOPT_PROTOCOLS => CURLPROTO_HTTPS,
        CURLOPT_USERAGENT => 'Thermofis-Foerderpruefung/1.0', CURLOPT_MAXFILESIZE => 3000000]);
    $body = curl_exec($ch); $code = curl_getinfo($ch, CURLINFO_HTTP_CODE); curl_close($ch);
    if (!is_string($body) || $code !== 200 || strlen($body) < 1000 || strlen($body) > 3000000) {
        throw new RuntimeException('Amtliche Quelle derzeit nicht erreichbar');
    }
    if (str_starts_with($body, '%PDF')) { return hash('sha256', $body); }
    // Exclude changing consent/scripts/navigation; retain the main funding text.
    if (preg_match('~<main\b[^>]*>([\s\S]*?)</main>~i', $body, $m)) { $body = $m[1]; }
    $body = preg_replace('~<(script|style|nav|header|footer)\b[^>]*>[\s\S]*?</\1>~i', '', $body) ?? $body;
    $body = html_entity_decode(strip_tags($body), ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $body = preg_replace('/\s+/u', ' ', trim($body)) ?? $body;
    return hash('sha256', $body);
}
try {
    $hashes = [];
    foreach ($sources as $key => $url) { $hashes[$key] = fetchSource($url); }
    $baseline = is_file($baselineFile) ? json_decode((string)file_get_contents($baselineFile), true) : null;
    if ($initialize) {
        // Run only AFTER a human has verified foerder-regeln.js against the fetched sources.
        writeJson($baselineFile, ['approvedAt' => $now, 'hashes' => $hashes], 0600);
        writeJson($outputFile, ['schemaVersion' => 1, 'status' => 'checked', 'checkedAt' => $now,
            'reason' => 'Amtliche Quellen entsprechen der redaktionell freigegebenen Vergleichsversion.']);
        fwrite(STDOUT, "Vergleichsbasis freigegeben. Regel-Pruefdatum in foerder-regeln.js separat pflegen.\n");
    } elseif (!$baseline || !isset($baseline['hashes'])) {
        writeJson($outputFile, ['schemaVersion' => 1, 'status' => 'needs-review', 'checkedAt' => $now,
            'reason' => 'Amtliche Quellen muessen mit dem hinterlegten Regelstand abgeglichen werden.']);
        fwrite(STDOUT, "Redaktionelle Freigabe erforderlich.\n");
    } else {
        $changed = [];
        foreach ($hashes as $key => $hash) { if (($baseline['hashes'][$key] ?? '') !== $hash) { $changed[] = $key; } }
        writeJson($outputFile, ['schemaVersion' => 1, 'status' => $changed ? 'needs-review' : 'checked',
            'checkedAt' => $now, 'reason' => $changed ? 'Amtliche Quellen wurden geaendert; Foerderwerte werden bis zur Pruefung ausgeblendet.' : 'Keine Quellenaenderung gegenueber freigegebener Vergleichsversion erkannt.',
            'changedSources' => $changed]);
        fwrite(STDOUT, $changed ? "Quellen geaendert: redaktionell pruefen.\n" : "Keine Quellenaenderung erkannt.\n");
    }
} catch (Throwable $e) {
    try { writeJson($outputFile, ['schemaVersion' => 1, 'status' => 'unavailable', 'checkedAt' => $now,
        'reason' => 'Amtliche Quellen konnten nicht erfolgreich geprueft werden.']); } catch (Throwable $ignored) {}
    fwrite(STDERR, "Quellenpruefung fehlgeschlagen. Foerderwerte bis zur Pruefung ausgeblendet.\n");
    exit(1);
}
