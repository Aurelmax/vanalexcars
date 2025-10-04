<?php
/**
 * Configuration WordPress pour Vanalexcars
 * Headless CMS Configuration
 */

// Configuration de base
define('DB_NAME', 'vanalexcars');
define('DB_USER', 'wordpress');
define('DB_PASSWORD', 'wordpress_password');
define('DB_HOST', 'db:3306');
define('DB_CHARSET', 'utf8mb4');
define('DB_COLLATE', '');

// Clés de sécurité (à changer en production)
define('AUTH_KEY',         'votre-cle-auth-ici');
define('SECURE_AUTH_KEY',  'votre-cle-secure-auth-ici');
define('LOGGED_IN_KEY',    'votre-cle-logged-in-ici');
define('NONCE_KEY',         'votre-cle-nonce-ici');
define('AUTH_SALT',        'votre-salt-auth-ici');
define('SECURE_AUTH_SALT', 'votre-salt-secure-auth-ici');
define('LOGGED_IN_SALT',   'votre-salt-logged-in-ici');
define('NONCE_SALT',       'votre-salt-nonce-ici');

// Configuration pour le développement
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);

// Configuration API REST
define('WP_REST_API_ENABLED', true);

// Configuration CORS pour le frontend Next.js
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        header('Access-Control-Allow-Origin: http://localhost:3000');
        header('Access-Control-Allow-Origin: http://localhost:3006');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce');
        header('Access-Control-Allow-Credentials: true');
        return $value;
    });
});

// Configuration pour les Custom Post Types
add_action('init', function() {
    // Activer les Custom Post Types
    register_post_type('vehicles', array(
        'public' => true,
        'show_in_rest' => true,
        'rest_base' => 'vehicles',
        'supports' => array('title', 'editor', 'thumbnail', 'custom-fields'),
        'labels' => array(
            'name' => 'Véhicules',
            'singular_name' => 'Véhicule'
        )
    ));

    register_post_type('testimonials', array(
        'public' => true,
        'show_in_rest' => true,
        'rest_base' => 'testimonials',
        'supports' => array('title', 'editor', 'custom-fields'),
        'labels' => array(
            'name' => 'Témoignages',
            'singular_name' => 'Témoignage'
        )
    ));

    register_post_type('faqs', array(
        'public' => true,
        'show_in_rest' => true,
        'rest_base' => 'faqs',
        'supports' => array('title', 'editor', 'custom-fields'),
        'labels' => array(
            'name' => 'FAQ',
            'singular_name' => 'FAQ'
        )
    ));
});

// Configuration de la table
$table_prefix = 'wp_';

// Configuration WordPress
if (!defined('ABSPATH')) {
    define('ABSPATH', __DIR__ . '/');
}

require_once ABSPATH . 'wp-settings.php';
