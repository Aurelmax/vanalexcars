<?php
/**
 * Plugin Name: Form Submission Endpoint
 * Description: Endpoint personnalisé pour les soumissions de formulaires
 * Version: 1.0
 * Author: Vanalexcars
 */

if (!defined('ABSPATH')) {
    exit;
}

// Ajouter l'endpoint pour les soumissions de formulaires
add_action('rest_api_init', 'register_form_submission_endpoint');

// Exposer les meta fields à l'API REST
add_action('rest_api_init', 'expose_form_meta_fields');

function register_form_submission_endpoint() {
    register_rest_route('vanalexcars/v1', '/submit-form', array(
        'methods' => 'POST',
        'callback' => 'handle_form_submission',
        'permission_callback' => '__return_true', // Permettre les soumissions anonymes
    ));
}

function handle_form_submission($request) {
    $form_type = $request->get_param('form_type');
    $form_data = $request->get_param('form_data');
    
    if (!$form_type || !$form_data) {
        return new WP_Error('missing_data', 'Form type and data are required', array('status' => 400));
    }
    
    // Créer un post pour la soumission
    $post_data = array(
        'post_title' => ucfirst($form_type) . ' - ' . date('Y-m-d H:i:s'),
        'post_content' => json_encode($form_data, JSON_PRETTY_PRINT),
        'post_status' => 'publish',
        'post_type' => 'post',
        'meta_input' => array(
            'form_type' => $form_type,
            'form_data' => $form_data,
            'submission_date' => current_time('mysql'),
        )
    );
    
    $post_id = wp_insert_post($post_data);
    
    if (is_wp_error($post_id)) {
        return new WP_Error('submission_failed', 'Failed to create submission', array('status' => 500));
    }
    
    return array(
        'success' => true,
        'message' => 'Form submitted successfully',
        'submission_id' => $post_id,
        'form_type' => $form_type,
        'form_data' => $form_data
    );
}

// Exposer les meta fields pour les posts
function expose_form_meta_fields() {
    register_rest_field('post', 'meta', array(
        'get_callback' => function($object) {
            $meta = get_post_meta($object['id']);
            $clean_meta = [];
            foreach ($meta as $key => $value) {
                $clean_meta[$key] = maybe_unserialize($value[0]);
            }
            return $clean_meta;
        },
        'update_callback' => null,
        'schema' => null,
    ));
}

// Ajouter les en-têtes CORS
add_action('rest_api_init', 'add_cors_headers');

function add_cors_headers() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', 'cors_headers_callback');
}

function cors_headers_callback($value) {
    $origin = get_http_origin();
    $allowed_origins = array(
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        'http://localhost:3003',
        'http://localhost:3004',
        'http://localhost:3005',
        'http://localhost:3006',
    );

    if (in_array($origin, $allowed_origins)) {
        header('Access-Control-Allow-Origin: ' . $origin);
    } else {
        header('Access-Control-Allow-Origin: ' . $allowed_origins[0]);
    }

    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce');
    header('Access-Control-Max-Age: 86400');

    return $value;
}
