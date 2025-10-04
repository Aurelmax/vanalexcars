<?php
/**
 * Plugin Name: Vanalexcars Admin Forms Dashboard
 * Description: Interface d'administration pour gérer les soumissions de formulaires
 * Version: 1.0
 * Author: Vanalexcars
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

class Vanalexcars_Admin_Forms_Dashboard {
    
    public function __construct() {
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_scripts'));
        add_action('wp_ajax_handle_form_submission', array($this, 'handle_form_submission'));
        add_action('wp_ajax_update_form_status', array($this, 'update_form_status'));
        add_action('wp_ajax_delete_form_submission', array($this, 'delete_form_submission'));
    }
    
    /**
     * Ajouter le menu d'administration
     */
    public function add_admin_menu() {
        add_menu_page(
            'Formulaires Vanalexcars',
            'Formulaires',
            'manage_options',
            'vanalexcars-forms',
            array($this, 'admin_page'),
            'dashicons-feedback',
            30
        );
        
        add_submenu_page(
            'vanalexcars-forms',
            'Toutes les soumissions',
            'Toutes les soumissions',
            'manage_options',
            'vanalexcars-forms',
            array($this, 'admin_page')
        );
        
        add_submenu_page(
            'vanalexcars-forms',
            'Contact',
            'Contact',
            'manage_options',
            'vanalexcars-contact',
            array($this, 'contact_page')
        );
        
        add_submenu_page(
            'vanalexcars-forms',
            'Demandes véhicules',
            'Demandes véhicules',
            'manage_options',
            'vanalexcars-vehicles',
            array($this, 'vehicles_page')
        );
        
        add_submenu_page(
            'vanalexcars-forms',
            'Documents d\'immatriculation',
            'Documents d\'immatriculation',
            'manage_options',
            'vanalexcars-documents',
            array($this, 'documents_page')
        );
        
        add_submenu_page(
            'vanalexcars-forms',
            'Témoignages',
            'Témoignages',
            'manage_options',
            'vanalexcars-testimonials',
            array($this, 'testimonials_page')
        );
        
        add_submenu_page(
            'vanalexcars-forms',
            'Newsletter',
            'Newsletter',
            'manage_options',
            'vanalexcars-newsletter',
            array($this, 'newsletter_page')
        );
    }
    
    /**
     * Enqueue les scripts et styles d'administration
     */
    public function enqueue_admin_scripts($hook) {
        if (strpos($hook, 'vanalexcars') === false) {
            return;
        }
        
        wp_enqueue_style('vanalexcars-admin', plugin_dir_url(__FILE__) . 'admin-styles.css');
        wp_enqueue_script('vanalexcars-admin', plugin_dir_url(__FILE__) . 'admin-scripts.js', array('jquery'), '1.0', true);
        
        wp_localize_script('vanalexcars-admin', 'vanalexcars_ajax', array(
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('vanalexcars_nonce')
        ));
    }
    
    /**
     * Page principale - Toutes les soumissions
     */
    public function admin_page() {
        $submissions = $this->get_all_submissions();
        $stats = $this->get_form_stats();
        
        include plugin_dir_path(__FILE__) . 'templates/admin-dashboard.php';
    }
    
    /**
     * Page Contact
     */
    public function contact_page() {
        $submissions = $this->get_submissions_by_type('contact');
        include plugin_dir_path(__FILE__) . 'templates/contact-page.php';
    }
    
    /**
     * Page Demandes véhicules
     */
    public function vehicles_page() {
        $submissions = $this->get_submissions_by_type('vehicle_request');
        include plugin_dir_path(__FILE__) . 'templates/vehicles-page.php';
    }
    
    /**
     * Page Documents d'immatriculation
     */
    public function documents_page() {
        $submissions = $this->get_submissions_by_type('documents');
        include plugin_dir_path(__FILE__) . 'templates/documents-page.php';
    }
    
    /**
     * Page Témoignages
     */
    public function testimonials_page() {
        $submissions = $this->get_submissions_by_type('testimonial');
        include plugin_dir_path(__FILE__) . 'templates/testimonials-page.php';
    }
    
    /**
     * Page Newsletter
     */
    public function newsletter_page() {
        $submissions = $this->get_submissions_by_type('newsletter');
        include plugin_dir_path(__FILE__) . 'templates/newsletter-page.php';
    }
    
    /**
     * Récupérer toutes les soumissions
     */
    private function get_all_submissions($limit = 50, $offset = 0) {
        $args = array(
            'post_type' => 'form-submissions',
            'posts_per_page' => $limit,
            'offset' => $offset,
            'orderby' => 'date',
            'order' => 'DESC'
        );
        
        $posts = get_posts($args);
        $submissions = array();
        
        foreach ($posts as $post) {
            $meta = get_post_meta($post->ID);
            $submissions[] = array(
                'id' => $post->ID,
                'title' => $post->post_title,
                'content' => $post->post_content,
                'date' => $post->post_date,
                'status' => $post->post_status,
                'type' => isset($meta['form_type'][0]) ? $meta['form_type'][0] : 'unknown',
                'form_data' => isset($meta['form_data'][0]) ? maybe_unserialize($meta['form_data'][0]) : array(),
                'submission_date' => isset($meta['submission_date'][0]) ? $meta['submission_date'][0] : $post->post_date
            );
        }
        
        return $submissions;
    }
    
    /**
     * Récupérer les soumissions par type
     */
    private function get_submissions_by_type($type) {
        $args = array(
            'post_type' => 'form-submissions',
            'posts_per_page' => -1,
            'orderby' => 'date',
            'order' => 'DESC',
            'meta_query' => array(
                array(
                    'key' => 'form_type',
                    'value' => $type,
                    'compare' => '='
                )
            )
        );
        
        $posts = get_posts($args);
        $submissions = array();
        
        foreach ($posts as $post) {
            $meta = get_post_meta($post->ID);
            $submissions[] = array(
                'id' => $post->ID,
                'title' => $post->post_title,
                'content' => $post->post_content,
                'date' => $post->post_date,
                'status' => $post->post_status,
                'type' => $type,
                'form_data' => isset($meta['form_data'][0]) ? maybe_unserialize($meta['form_data'][0]) : array(),
                'submission_date' => isset($meta['submission_date'][0]) ? $meta['submission_date'][0] : $post->post_date
            );
        }
        
        return $submissions;
    }
    
    /**
     * Récupérer les statistiques des formulaires
     */
    private function get_form_stats() {
        $stats = array();
        
        $types = array('contact', 'vehicle_request', 'documents', 'testimonial', 'newsletter');
        
        foreach ($types as $type) {
            $count = get_posts(array(
                'post_type' => 'form-submissions',
                'posts_per_page' => -1,
                'meta_query' => array(
                    array(
                        'key' => 'form_type',
                        'value' => $type,
                        'compare' => '='
                    )
                )
            ));
            
            $stats[$type] = count($count);
        }
        
        return $stats;
    }
    
    /**
     * Gérer la soumission de formulaire (AJAX)
     */
    public function handle_form_submission() {
        check_ajax_referer('vanalexcars_nonce', 'nonce');
        
        $form_data = $_POST['form_data'];
        $form_type = $_POST['form_type'];
        
        $post_id = wp_insert_post(array(
            'post_title' => $form_data['name'] . ' - ' . $form_type,
            'post_content' => $form_data['message'] ?? '',
            'post_status' => 'publish',
            'post_type' => 'form-submissions'
        ));
        
        if ($post_id) {
            update_post_meta($post_id, 'form_type', $form_type);
            update_post_meta($post_id, 'form_data', $form_data);
            update_post_meta($post_id, 'submission_date', current_time('mysql'));
            
            wp_send_json_success('Formulaire soumis avec succès');
        } else {
            wp_send_json_error('Erreur lors de la soumission');
        }
    }
    
    /**
     * Mettre à jour le statut d'une soumission (AJAX)
     */
    public function update_form_status() {
        check_ajax_referer('vanalexcars_nonce', 'nonce');
        
        $post_id = intval($_POST['post_id']);
        $status = sanitize_text_field($_POST['status']);
        
        $result = wp_update_post(array(
            'ID' => $post_id,
            'post_status' => $status
        ));
        
        if ($result) {
            wp_send_json_success('Statut mis à jour');
        } else {
            wp_send_json_error('Erreur lors de la mise à jour');
        }
    }
    
    /**
     * Supprimer une soumission (AJAX)
     */
    public function delete_form_submission() {
        check_ajax_referer('vanalexcars_nonce', 'nonce');
        
        $post_id = intval($_POST['post_id']);
        $result = wp_delete_post($post_id, true);
        
        if ($result) {
            wp_send_json_success('Soumission supprimée');
        } else {
            wp_send_json_error('Erreur lors de la suppression');
        }
    }
}

// Initialiser le plugin
new Vanalexcars_Admin_Forms_Dashboard();
