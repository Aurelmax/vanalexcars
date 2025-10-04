<?php
/**
 * Intégration Form Submissions dans le thème Vanalexcars
 * CPT pour gérer les soumissions de formulaires
 */

// Créer le CPT Form Submissions
add_action('init', 'vanalexcars_create_form_submissions_cpt');

function vanalexcars_create_form_submissions_cpt() {
    $args = array(
        'labels' => array(
            'name' => 'Soumissions de Formulaires',
            'singular_name' => 'Soumission',
            'add_new' => 'Ajouter une soumission',
            'add_new_item' => 'Ajouter une nouvelle soumission',
            'edit_item' => 'Modifier la soumission',
            'new_item' => 'Nouvelle soumission',
            'view_item' => 'Voir la soumission',
            'search_items' => 'Rechercher des soumissions',
            'not_found' => 'Aucune soumission trouvée',
            'not_found_in_trash' => 'Aucune soumission dans la corbeille'
        ),
        'public' => false,
        'show_ui' => true,
        'show_in_rest' => true,
        'rest_base' => 'form-submissions',
        'supports' => array('title', 'editor', 'custom-fields'),
        'menu_icon' => 'dashicons-email-alt',
        'menu_position' => 9,
        'capability_type' => 'post'
    );
    
    register_post_type('form_submissions', $args);
}

// Meta box pour les détails de la soumission
add_action('add_meta_boxes', 'vanalexcars_add_form_submission_meta_box');

function vanalexcars_add_form_submission_meta_box() {
    add_meta_box(
        'form_submission_details',
        'Détails de la soumission',
        'vanalexcars_form_submission_meta_box_callback',
        'form_submissions',
        'normal',
        'high'
    );
}

function vanalexcars_form_submission_meta_box_callback($post) {
    wp_nonce_field('vanalexcars_form_submission_meta_box', 'vanalexcars_form_submission_meta_box_nonce');
    
    $form_type = get_post_meta($post->ID, '_form_type', true);
    $form_data = get_post_meta($post->ID, '_form_data', true);
    $form_status = get_post_meta($post->ID, '_form_status', true);
    $submission_date = get_post_meta($post->ID, '_submission_date', true);
    
    echo '<table class="form-table">';
    echo '<tr><th><label>Type de formulaire</label></th>';
    echo '<td><strong>' . esc_html($form_type) . '</strong></td></tr>';
    
    echo '<tr><th><label>Statut</label></th>';
    echo '<td><select name="form_status">';
    echo '<option value="new"' . selected($form_status, 'new', false) . '>Nouveau</option>';
    echo '<option value="read"' . selected($form_status, 'read', false) . '>Lu</option>';
    echo '<option value="replied"' . selected($form_status, 'replied', false) . '>Répondu</option>';
    echo '<option value="archived"' . selected($form_status, 'archived', false) . '>Archivé</option>';
    echo '</select></td></tr>';
    
    echo '<tr><th><label>Date de soumission</label></th>';
    echo '<td>' . esc_html($submission_date) . '</td></tr>';
    
    echo '<tr><th><label>Données du formulaire</label></th>';
    echo '<td><pre>' . esc_html(print_r($form_data, true)) . '</pre></td></tr>';
    
    echo '</table>';
}

// Sauvegarder les meta boxes
add_action('save_post', 'vanalexcars_save_form_submission_meta_boxes');

function vanalexcars_save_form_submission_meta_boxes($post_id) {
    if (!isset($_POST['vanalexcars_form_submission_meta_box_nonce']) ||
        !wp_verify_nonce($_POST['vanalexcars_form_submission_meta_box_nonce'], 'vanalexcars_form_submission_meta_box')) {
        return;
    }
    
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }
    
    if (isset($_POST['form_status'])) {
        update_post_meta($post_id, '_form_status', sanitize_text_field($_POST['form_status']));
    }
}

// Exposer les champs personnalisés dans l'API REST
add_action('rest_api_init', 'vanalexcars_register_form_submission_rest_fields');

function vanalexcars_register_form_submission_rest_fields() {
    register_rest_field('form_submissions', 'form_meta', array(
        'get_callback' => function($post) {
            return array(
                'form_type' => get_post_meta($post['id'], '_form_type', true),
                'form_data' => get_post_meta($post['id'], '_form_data', true),
                'form_status' => get_post_meta($post['id'], '_form_status', true),
                'submission_date' => get_post_meta($post['id'], '_submission_date', true)
            );
        }
    ));
}

// Fonction pour créer une nouvelle soumission
function vanalexcars_create_form_submission($form_type, $form_data, $title = '') {
    $post_id = wp_insert_post(array(
        'post_title' => $title ?: 'Soumission ' . $form_type . ' - ' . date('Y-m-d H:i:s'),
        'post_content' => $form_data['message'] ?? '',
        'post_status' => 'publish',
        'post_type' => 'form_submissions'
    ));
    
    if ($post_id) {
        update_post_meta($post_id, '_form_type', $form_type);
        update_post_meta($post_id, '_form_data', $form_data);
        update_post_meta($post_id, '_form_status', 'new');
        update_post_meta($post_id, '_submission_date', current_time('mysql'));
        
        return $post_id;
    }
    
    return false;
}
