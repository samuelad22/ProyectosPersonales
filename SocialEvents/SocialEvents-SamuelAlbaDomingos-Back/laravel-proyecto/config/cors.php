<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'broadcasting/auth', 'api/broadcasting/auth'],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:80', 'http://192.168.10.169:5173','http://192.168.10.168:5173',
                        'https://samuelad26.iesmontenaranco.com:8000',
                        'https://samuelad26.iesmontenaranco.com'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
