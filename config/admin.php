<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Back-office credentials
    |--------------------------------------------------------------------------
    |
    | Identifiants du mini panneau d'administration (/admin/login), indépendant
    | du système de comptes utilisateurs. À surcharger via .env en production.
    |
    */

    'email'    => env('ADMIN_EMAIL', 'admin@example.com'),
    'password' => env('ADMIN_PASSWORD', 'password'),

];
