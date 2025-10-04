<?php
/**
 * Plugin Name: Vanalexcars Forms Manager
 * Description: Gère les soumissions de formulaires du frontend Vanalexcars
 * Version: 1.0
 * Author: Vanalexcars
 */

if (!defined('ABSPATH')) {
    exit;
}

class Vanalexcars_Forms_Manager {
    
    public function __construct() {
        add_action('init', [$this, 'register_form_submissions_cpt']);
        add_action('add_meta_boxes', [$this, 'add_form_meta_boxes']);
        add_action('save_post', [$this, 'save_form_meta']);
        add_action('admin_menu', [$this, 'add_admin_menu']);
        add_action('rest_api_init', [$this, 'register_rest_fields']);
    }
    
    // Enregistrer le CPT pour les soumissions
    public function register_form_submissions_cpt() {
        $labels = array(
            'name' => 'Soumissions de Formulaires',
            'singular_name' => 'Soumission',
            'menu_name' => 'Formulaires',
            'add_new' => 'Ajouter',
            'add_new_item' => 'Ajouter une soumission',
            'edit_item' => 'Modifier la soumission',
            'new_item' => 'Nouvelle soumission',
            'view_item' => 'Voir la soumission',
            'search_items' => 'Rechercher',
            'not_found' => 'Aucune soumission trouvée',
            'not_found_in_trash' => 'Aucune soumission dans la corbeille'
        );
        
        $args = array(
            'labels' => $labels,
            'public' => false,
            'publicly_queryable' => false,
            'show_ui' => true,
            'show_in_menu' => true,
            'menu_position' => 25,
            'menu_icon' => 'dashicons-feedback',
            'capability_type' => 'post',
            'supports' => array('title', 'editor'),
            'show_in_rest' => true,
            'rest_base' => 'form-submissions'
        );
        
        register_post_type('form-submission', $args);
    }
    
    // Ajouter les meta boxes
    public function add_form_meta_boxes() {
        add_meta_box(
            'form_details',
            'Détails du Formulaire',
            [$this, 'form_details_callback'],
            'form-submission',
            'normal',
            'high'
        );
    }
    
    // Callback pour les détails du formulaire
    public function form_details_callback($post) {
        wp_nonce_field('save_form_meta', 'form_meta_nonce');
        
        $form_type = get_post_meta($post->ID, 'form_type', true);
        $form_data = get_post_meta($post->ID, 'form_data', true);
        $submission_date = get_post_meta($post->ID, 'submission_date', true);
        $status = get_post_meta($post->ID, 'form_status', true);
        
        echo '<table class="form-table">';
        echo '<tr><th>Type de formulaire:</th><td>' . esc_html($form_type) . '</td></tr>';
        echo '<tr><th>Date de soumission:</th><td>' . esc_html($submission_date) . '</td></tr>';
        echo '<tr><th>Statut:</th><td>';
        echo '<select name="form_status">';
        echo '<option value="pending"' . selected($status, 'pending', false) . '>En attente</option>';
        echo '<option value="read"' . selected($status, 'read', false) . '>Lu</option>';
        echo '<option value="archived"' . selected($status, 'archived', false) . '>Archivé</option>';
        echo '</select></td></tr>';
        echo '</table>';
        
        if ($form_data && is_array($form_data)) {
            echo '<h3>Données du formulaire:</h3>';
            echo '<table class="form-table">';
            foreach ($form_data as $key => $value) {
                echo '<tr><th>' . esc_html(ucfirst(str_replace('_', ' ', $key))) . ':</th><td>' . esc_html($value) . '</td></tr>';
            }
            echo '</table>';
        }
    }
    
    // Sauvegarder les meta
    public function save_form_meta($post_id) {
        if (!isset($_POST['form_meta_nonce']) || !wp_verify_nonce($_POST['form_meta_nonce'], 'save_form_meta')) {
            return;
        }
        
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }
        
        if (!current_user_can('edit_post', $post_id)) {
            return;
        }
        
        if (isset($_POST['form_status'])) {
            update_post_meta($post_id, 'form_status', sanitize_text_field($_POST['form_status']));
        }
    }
    
    // Ajouter le menu admin
    public function add_admin_menu() {
        add_menu_page(
            'Formulaires Vanalexcars',
            'Formulaires',
            'manage_options',
            'vanalexcars-forms',
            [$this, 'admin_page_callback'],
            'dashicons-feedback',
            25
        );
    }
    
    // Page admin
    public function admin_page_callback() {
        $submissions = get_posts(array(
            'post_type' => 'form-submission',
            'posts_per_page' => -1,
            'orderby' => 'date',
            'order' => 'DESC'
        ));
        
        echo '<div class="wrap">';
        echo '<h1>Soumissions de Formulaires</h1>';
        
        if (empty($submissions)) {
            echo '<p>Aucune soumission trouvée.</p>';
        } else {
            echo '<table class="wp-list-table widefat fixed striped">';
            echo '<thead><tr>';
            echo '<th>ID</th><th>Titre</th><th>Type</th><th>Date</th><th>Statut</th><th>Actions</th>';
            echo '</tr></thead><tbody>';
            
            foreach ($submissions as $submission) {
                $form_type = get_post_meta($submission->ID, 'form_type', true);
                $status = get_post_meta($submission->ID, 'form_status', true);
                
                echo '<tr>';
                echo '<td>' . $submission->ID . '</td>';
                echo '<td><a href="' . get_edit_post_link($submission->ID) . '">' . $submission->post_title . '</a></td>';
                echo '<td>' . esc_html($form_type) . '</td>';
                echo '<td>' . $submission->post_date . '</td>';
                echo '<td>' . esc_html($status) . '</td>';
                echo '<td><a href="' . get_edit_post_link($submission->ID) . '">Modifier</a></td>';
                echo '</tr>';
            }
            
            echo '</tbody></table>';
        }
        
        echo '</div>';
    }
    
    // Exposer les champs à l'API REST
    public function register_rest_fields() {
        register_rest_field('form-submission', 'meta', array(
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
}

new Vanalexcars_Forms_Manager();
