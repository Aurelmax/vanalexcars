<?php
/**
 * Correction des avertissements WordPress pour Vanalexcars
 * Masque les avertissements de dépréciation et les erreurs d'en-têtes
 */

// Masquer les avertissements de dépréciation pour Carbon Fields
error_reporting(E_ALL & ~E_DEPRECATED & ~E_STRICT & ~E_NOTICE);

// Configuration pour le développement
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);

// Masquer les erreurs d'en-têtes déjà envoyés
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Correction spécifique pour Carbon Fields
add_action('init', function() {
    // Masquer les avertissements de dépréciation
    if (function_exists('error_reporting')) {
        error_reporting(E_ALL & ~E_DEPRECATED & ~E_STRICT);
    }
}, 1);

// Correction pour les en-têtes déjà envoyés
add_action('wp_loaded', function() {
    if (!headers_sent()) {
        // Les en-têtes ne sont pas encore envoyés, on peut continuer
        return;
    }
    
    // Si les en-têtes sont déjà envoyés, on nettoie le buffer
    if (ob_get_level()) {
        ob_end_clean();
    }
}, 1);

// Désactiver les mises à jour de Carbon Fields (source des avertissements)
add_filter('carbon_fields_show_update_warning', '__return_false');

// Correction pour les constantes dupliquées
if (!defined('WP_REST_API_ENABLED')) {
    define('WP_REST_API_ENABLED', true);
}

// Configuration pour masquer les avertissements dans l'admin
add_action('admin_init', function() {
    if (is_admin()) {
        error_reporting(E_ALL & ~E_DEPRECATED & ~E_STRICT & ~E_NOTICE);
    }
});

// Correction pour les en-têtes dans l'API REST
add_action('rest_api_init', function() {
    if (!headers_sent()) {
        header('Content-Type: application/json; charset=utf-8');
    }
}, 1);
