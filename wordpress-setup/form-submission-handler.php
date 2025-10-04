<?php
/**
 * Plugin Name: Form Submission Handler
 * Description: Gère les soumissions de formulaires depuis le frontend
 * Version: 1.0
 */

if (!defined('ABSPATH')) {
    exit;
}

// Ajouter l'endpoint pour recevoir les soumissions
add_action('rest_api_init', 'register_form_submission_endpoint');

function register_form_submission_endpoint() {
    register_rest_route('vanalexcars/v1', '/submit-form', array(
        'methods' => 'POST',
        'callback' => 'handle_form_submission',
        'permission_callback' => '__return_true',
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
        'post_type' => 'form-submission',
        'meta_input' => array(
            'form_type' => $form_type,
            'form_data' => $form_data,
            'submission_date' => current_time('mysql'),
            'form_status' => 'pending'
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
        'form_type' => $form_type
    );
}

// Ajouter les en-têtes CORS
add_action('rest_api_init', 'add_cors_headers');

function add_cors_headers() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function ($value) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        return $value;
    });
}
