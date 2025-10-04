<?php
/**
 * Endpoint personnalisé pour les soumissions de formulaires
 * Accepte les requêtes anonymes
 */

// Enregistrer l'endpoint personnalisé
add_action('rest_api_init', 'vanalexcars_register_form_endpoint');
function vanalexcars_register_form_endpoint() {
    register_rest_route('vanalexcars/v1', '/submit-form', array(
        'methods' => 'POST',
        'callback' => 'vanalexcars_handle_form_submission',
        'permission_callback' => '__return_true', // Permettre les requêtes anonymes
        'args' => array(
            'form_type' => array(
                'required' => true,
                'type' => 'string',
                'sanitize_callback' => 'sanitize_text_field',
            ),
            'form_data' => array(
                'required' => true,
                'type' => 'object',
            ),
        ),
    ));
}

// Gérer la soumission de formulaire
function vanalexcars_handle_form_submission($request) {
    $form_type = $request->get_param('form_type');
    $form_data = $request->get_param('form_data');
    
    // Validation basique
    if (empty($form_type) || empty($form_data)) {
        return new WP_Error('invalid_data', 'Données de formulaire invalides', array('status' => 400));
    }
    
    // Créer le post
    $post_data = array(
        'post_type' => 'form-submissions',
        'post_title' => vanalexcars_generate_form_title($form_type, $form_data),
        'post_content' => vanalexcars_generate_form_content($form_type, $form_data),
        'post_status' => 'publish',
        'meta_input' => array(
            'form_type' => $form_type,
            'form_data' => $form_data,
            'submission_date' => current_time('mysql'),
            'ip_address' => vanalexcars_get_client_ip(),
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? '',
            'form_status' => 'pending',
        ),
    );
    
    $post_id = wp_insert_post($post_data);
    
    if (is_wp_error($post_id)) {
        return new WP_Error('submission_failed', 'Échec de la soumission', array('status' => 500));
    }
    
    // Retourner la réponse
    return array(
        'success' => true,
        'message' => 'Formulaire soumis avec succès',
        'submission_id' => $post_id,
        'data' => array(
            'id' => $post_id,
            'type' => $form_type,
            'data' => $form_data,
            'status' => 'pending',
            'date' => current_time('mysql'),
        ),
    );
}

// Générer un titre pour le formulaire
function vanalexcars_generate_form_title($form_type, $form_data) {
    $titles = array(
        'contact' => 'Contact: ' . ($form_data['name'] ?? 'Anonyme'),
        'vehicle_request' => 'Demande véhicule: ' . ($form_data['brand'] ?? '') . ' ' . ($form_data['model'] ?? ''),
        'registration_documents' => 'Documents immatriculation: ' . ($form_data['name'] ?? 'Anonyme'),
        'testimonial' => 'Témoignage: ' . ($form_data['name'] ?? 'Anonyme'),
        'newsletter' => 'Newsletter: ' . ($form_data['email'] ?? 'Anonyme'),
    );
    
    return $titles[$form_type] ?? 'Soumission de formulaire';
}

// Générer le contenu du formulaire
function vanalexcars_generate_form_content($form_type, $form_data) {
    $content = '<h3>Données du formulaire :</h3><ul>';
    
    foreach ($form_data as $key => $value) {
        if (is_array($value)) {
            $value = implode(', ', $value);
        }
        $content .= '<li><strong>' . ucfirst(str_replace('_', ' ', $key)) . ':</strong> ' . esc_html($value) . '</li>';
    }
    
    $content .= '</ul>';
    return $content;
}

// Obtenir l'adresse IP du client
function vanalexcars_get_client_ip() {
    $ip_keys = array('HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR');
    
    foreach ($ip_keys as $key) {
        if (array_key_exists($key, $_SERVER) === true) {
            foreach (explode(',', $_SERVER[$key]) as $ip) {
                $ip = trim($ip);
                if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) !== false) {
                    return $ip;
                }
            }
        }
    }
    
    return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
}
