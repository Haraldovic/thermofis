<?php
// EXAMPLE ONLY. Copy beside public_html into thermofis-private/google-reviews-config.php.
// That private sibling path is auto-detected. An environment override is also supported.
// Never fill credentials into this public example or upload a populated copy here.
return [
    'client_id' => '',
    'client_secret' => '',
    'refresh_token' => '',
    'account_id' => '', // ID only, without "accounts/".
    'location_id' => '', // ID only, without "locations/".
    'cache_dir' => __DIR__ . '/cache', // Safe only after copying this file OUTSIDE public_html.
    'google_maps_url' => '', // Exact HTTPS profile URL verified by the business owner.
];
