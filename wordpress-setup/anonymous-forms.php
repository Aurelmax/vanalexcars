<?php
/**
 * Permettre les soumissions anonymes de formulaires
 */

// Permettre les requêtes anonymes pour les soumissions de formulaires
add_filter('rest_authentication_errors', 'vanalexcars_allow_anonymous_form_submissions', 20);
function vanalexcars_allow_anonymous_form_submissions($result) {
    // Si l'utilisateur est déjà authentifié, pas de problème
    if (!is_wp_error($result)) {
        return $result;
    }
    
    // Vérifier si c'est une requête vers form-submissions
    $request_uri = $_SERVER['REQUEST_URI'];
    if (strpos($request_uri, '/wp-json/wp/v2/form-submissions') !== false) {
        // Permettre les requêtes POST anonymes pour les soumissions de formulaires
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
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
