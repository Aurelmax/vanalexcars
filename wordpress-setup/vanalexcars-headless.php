<?php
/**
 * Plugin Name: Vanalexcars Headless CMS
 * Description: Configuration WordPress pour Vanalexcars - CMS Headless
 * Version: 1.0.0
 * Author: Vanalexcars
 */

// Empêcher l'accès direct
if (!defined('ABSPATH')) {
    exit;
}

class VanalexcarsHeadless {
    
    private $frontend_url = 'http://localhost:3002'; // URL de votre frontend Next.js
    
    public function __construct() {
        add_action('init', [$this, 'init']);
    }
    
    public function init() {
        // 1. Rediriger toutes les pages publiques vers le frontend Next.js
        add_action('template_redirect', [$this, 'redirect_to_frontend']);
        
        // 2. Désactiver l'exécution du thème WordPress
        add_filter('template_include', [$this, 'disable_theme_rendering']);
        
        // 3. Désactiver les scripts et styles inutiles
        add_action('wp_enqueue_scripts', [$this, 'disable_unnecessary_assets'], 100);
        
        // 4. Désactiver les commentaires pour les posts
        add_action('init', [$this, 'disable_comments']);
        
        // 5. Optimiser l'API REST
        add_action('rest_api_init', [$this, 'optimize_rest_api']);
        
        // 6. Désactiver les fonctionnalités inutiles
        add_action('init', [$this, 'disable_unnecessary_features']);
    }
    
    /**
     * Rediriger toutes les pages publiques vers le frontend Next.js
     */
    public function redirect_to_frontend() {
        // Ne pas rediriger l'admin, l'API REST, ou les uploads
        if (is_admin() || defined('REST_REQUEST') || $this->is_upload_request() || $this->is_wp_admin_request()) {
            return;
        }
        
        // Construire l'URL de redirection
        $request_uri = $_SERVER['REQUEST_URI'];
        $redirect_url = $this->frontend_url . $request_uri;
        
        // Redirection 301 permanente
        wp_redirect($redirect_url, 301);
        exit;
    }
    
    /**
     * Désactiver l'exécution du thème WordPress
     */
    public function disable_theme_rendering($template) {
        // Ne pas bloquer l'admin ou l'API REST
        if (is_admin() || defined('REST_REQUEST')) {
            return $template;
        }
        
        // Retourner une 404 pour toutes les autres requêtes
        status_header(404);
        exit;
    }
    
    /**
     * Désactiver les scripts et styles inutiles
     */
    public function disable_unnecessary_assets() {
        // Désactiver jQuery (si pas nécessaire)
        wp_dequeue_script('jquery');
        wp_deregister_script('jquery');
        
        // Désactiver les styles de blocs WordPress
        wp_dequeue_style('wp-block-library');
        wp_dequeue_style('wp-block-library-theme');
        
        // Désactiver les styles de l'éditeur
        wp_dequeue_style('wp-edit-blocks');
        
        // Désactiver les styles de l'éditeur classique
        wp_dequeue_style('classic-theme-styles');
        
        // Désactiver les styles global
        wp_dequeue_style('global-styles');
        
        // Désactiver les emoji
        remove_action('wp_head', 'print_emoji_detection_script', 7);
        remove_action('wp_print_styles', 'print_emoji_styles');
        
        // Désactiver les liens RSD
        remove_action('wp_head', 'rsd_link');
        
        // Désactiver les liens wlwmanifest
        remove_action('wp_head', 'wlwmanifest_link');
        
        // Désactiver les liens shortlink
        remove_action('wp_head', 'wp_shortlink_wp_head');
        
        // Désactiver les générateurs
        remove_action('wp_head', 'wp_generator');
    }
    
    /**
     * Désactiver les commentaires
     */
    public function disable_comments() {
        // Fermer les commentaires sur les posts existants
        update_option('default_comment_status', 'closed');
        
        // Désactiver les commentaires sur les nouveaux posts
        add_filter('comments_open', '__return_false', 20, 2);
        add_filter('pings_open', '__return_false', 20, 2);
        
        // Masquer les colonnes de commentaires dans l'admin
        add_filter('manage_posts_columns', [$this, 'remove_comments_column']);
        add_filter('manage_pages_columns', [$this, 'remove_comments_column']);
    }
    
    /**
     * Optimiser l'API REST
     */
    public function optimize_rest_api() {
        // Ajouter des headers CORS pour le frontend
        add_filter('rest_pre_serve_request', [$this, 'add_cors_headers']);
        
        // Optimiser les réponses API
        add_filter('rest_prepare_post', [$this, 'optimize_post_response'], 10, 3);
        add_filter('rest_prepare_page', [$this, 'optimize_page_response'], 10, 3);
    }
    
    /**
     * Désactiver les fonctionnalités inutiles
     */
    public function disable_unnecessary_features() {
        // Désactiver les révisions
        remove_post_type_support('post', 'revisions');
        remove_post_type_support('page', 'revisions');
        
        // Désactiver les trackbacks
        remove_post_type_support('post', 'trackbacks');
        
        // Désactiver les formats de post
        remove_theme_support('post-formats');
        
        // Désactiver les couleurs personnalisées
        remove_theme_support('custom-background');
        remove_theme_support('custom-header');
    }
    
    /**
     * Vérifier si c'est une requête d'upload
     */
    private function is_upload_request() {
        $request_uri = $_SERVER['REQUEST_URI'];
        return strpos($request_uri, '/wp-content/uploads/') !== false;
    }
    
    /**
     * Vérifier si c'est une requête d'admin WordPress
     */
    private function is_wp_admin_request() {
        $request_uri = $_SERVER['REQUEST_URI'];
        return strpos($request_uri, '/wp-admin/') !== false || 
               strpos($request_uri, '/wp-login.php') !== false ||
               strpos($request_uri, '/wp-json/') !== false ||
               strpos($request_uri, '/wp-includes/') !== false;
    }
    
    /**
     * Supprimer les colonnes de commentaires
     */
    public function remove_comments_column($columns) {
        unset($columns['comments']);
        return $columns;
    }
    
    /**
     * Ajouter les headers CORS
     */
    public function add_cors_headers($value) {
        header('Access-Control-Allow-Origin: http://localhost:3002');
        header('Access-Control-Allow-Origin: http://localhost:3000');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce');
        header('Access-Control-Allow-Credentials: true');
        return $value;
    }
    
    /**
     * Optimiser les réponses des posts
     */
    public function optimize_post_response($response, $post, $request) {
        // Supprimer les données inutiles
        unset($response->data['guid']);
        unset($response->data['ping_status']);
        unset($response->data['comment_status']);
        
        return $response;
    }
    
    /**
     * Optimiser les réponses des pages
     */
    public function optimize_page_response($response, $page, $request) {
        // Supprimer les données inutiles
        unset($response->data['guid']);
        unset($response->data['ping_status']);
        unset($response->data['comment_status']);
        
        return $response;
    }
}

// Initialiser le plugin
new VanalexcarsHeadless();

// Fonction pour mettre à jour l'URL du frontend
function vanalexcars_update_frontend_url($new_url) {
    $plugin = new VanalexcarsHeadless();
    $plugin->frontend_url = $new_url;
}

// Hook pour les mises à jour de l'URL
add_action('update_option_siteurl', function($old_value, $value) {
    // Mettre à jour l'URL du frontend si nécessaire
    vanalexcars_update_frontend_url('http://localhost:3002');
}, 10, 2);
