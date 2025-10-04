<?php
/**
 * Configuration CORS pour WordPress
 * Permet aux requêtes frontend d'accéder à l'API REST
 */

// Ajouter les en-têtes CORS
add_action('rest_api_init', 'vanalexcars_add_cors_headers');
function vanalexcars_add_cors_headers() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', 'vanalexcars_send_cors_headers');
}

function vanalexcars_send_cors_headers($value) {
    $origin = get_http_origin();
    $allowed_origins = array(
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        'http://localhost:3003',
        'http://localhost:3004',
        'http://localhost:3005',
        'https://vanalexcars.com',
        'https://www.vanalexcars.com'
    );
    
    if (in_array($origin, $allowed_origins)) {
        header('Access-Control-Allow-Origin: ' . $origin);
    }
    
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce');
    header('Access-Control-Max-Age: 86400');
    
    return $value;
}

// Gérer les requêtes OPTIONS (preflight)
add_action('init', 'vanalexcars_handle_preflight_requests');
function vanalexcars_handle_preflight_requests() {
    if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        $origin = get_http_origin();
        $allowed_origins = array(
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:3002',
            'http://localhost:3003',
            'http://localhost:3004',
            'http://localhost:3005',
            'https://vanalexcars.com',
            'https://www.vanalexcars.com'
        );
        
        if (in_array($origin, $allowed_origins)) {
            header('Access-Control-Allow-Origin: ' . $origin);
        }
        
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce');
        header('Access-Control-Max-Age: 86400');
        header('Content-Length: 0');
        header('HTTP/1.1 200 OK');
        exit();
    }
}

// Permettre les requêtes anonymes pour les soumissions de formulaires
add_filter('rest_authentication_errors', 'vanalexcars_allow_anonymous_form_submissions', 20);
function vanalexcars_allow_anonymous_form_submissions($result) {
    // Si l'utilisateur est déjà authentifié, pas de problème
    if (!is_wp_error($result)) {
        return $result;
    }
    
    // Vérifier si c'est une requête vers form-submissions
    $request_uri = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '';
    if (strpos($request_uri, '/wp-json/wp/v2/form-submissions') !== false) {
        // Permettre les requêtes POST anonymes pour les soumissions de formulaires
        if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'POST') {
            return true;
        }
    }
    
    return $result;
}

// Ajouter des champs personnalisés à l'API REST
add_action('rest_api_init', 'vanalexcars_register_form_submission_rest_fields');
function vanalexcars_register_form_submission_rest_fields() {
    register_rest_field('form-submissions', 'meta', array(
        'get_callback' => function($object) {
            $meta = get_post_meta($object['id']);
            $clean_meta = [];
            foreach ($meta as $key => $value) {
                $clean_meta[$key] = maybe_unserialize($value[0]);
            }
            return $clean_meta;
        },
        'update_callback' => function($value, $object, $field_name) {
            if (!is_array($value)) {
                return new WP_Error('rest_invalid_param', esc_html__('Meta value must be an array.', 'vanalexcars'), array('status' => 400));
            }
            foreach ($value as $meta_key => $meta_value) {
                update_post_meta($object->ID, $meta_key, $meta_value);
            }
            return true;
        },
        'schema' => null,
    ));
}

// Ajouter des en-têtes de sécurité
add_action('send_headers', 'vanalexcars_add_security_headers');
function vanalexcars_add_security_headers() {
    if (is_rest_request()) {
        header('X-Content-Type-Options: nosniff');
        header('X-Frame-Options: SAMEORIGIN');
        header('X-XSS-Protection: 1; mode=block');
    }
}
