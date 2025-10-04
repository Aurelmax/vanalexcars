<?php
/**
 * Configuration WordPress pour Vanalexcars
 * Correction des avertissements Carbon Fields
 */

// Masquer les avertissements de dépréciation pour Carbon Fields
error_reporting(E_ALL & ~E_DEPRECATED & ~E_STRICT);

// Configuration pour le développement
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);

// Configuration API REST
define('WP_REST_API_ENABLED', true);

// Configuration CORS pour le frontend Next.js
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        header('Access-Control-Allow-Origin: http://localhost:3000');
        header('Access-Control-Allow-Origin: http://localhost:3006');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce');
        header('Access-Control-Allow-Credentials: true');
        return $value;
    });
});

// Configuration pour les Custom Post Types
add_action('init', function() {
    // Véhicules
    register_post_type('vehicles', array(
        'public' => true,
        'show_in_rest' => true,
        'rest_base' => 'vehicles',
        'supports' => array('title', 'editor', 'thumbnail', 'custom-fields'),
        'labels' => array(
            'name' => 'Véhicules',
            'singular_name' => 'Véhicule',
            'add_new' => 'Ajouter un véhicule',
            'add_new_item' => 'Ajouter un nouveau véhicule',
            'edit_item' => 'Modifier le véhicule',
            'new_item' => 'Nouveau véhicule',
            'view_item' => 'Voir le véhicule',
            'search_items' => 'Rechercher des véhicules',
            'not_found' => 'Aucun véhicule trouvé',
            'not_found_in_trash' => 'Aucun véhicule dans la corbeille'
        )
    ));

    // Témoignages
    register_post_type('testimonials', array(
        'public' => true,
        'show_in_rest' => true,
        'rest_base' => 'testimonials',
        'supports' => array('title', 'editor', 'custom-fields'),
        'labels' => array(
            'name' => 'Témoignages',
            'singular_name' => 'Témoignage',
            'add_new' => 'Ajouter un témoignage',
            'add_new_item' => 'Ajouter un nouveau témoignage',
            'edit_item' => 'Modifier le témoignage',
            'new_item' => 'Nouveau témoignage',
            'view_item' => 'Voir le témoignage',
            'search_items' => 'Rechercher des témoignages',
            'not_found' => 'Aucun témoignage trouvé',
            'not_found_in_trash' => 'Aucun témoignage dans la corbeille'
        )
    ));

    // FAQ
    register_post_type('faqs', array(
        'public' => true,
        'show_in_rest' => true,
        'rest_base' => 'faqs',
        'supports' => array('title', 'editor', 'custom-fields'),
        'labels' => array(
            'name' => 'FAQ',
            'singular_name' => 'FAQ',
            'add_new' => 'Ajouter une FAQ',
            'add_new_item' => 'Ajouter une nouvelle FAQ',
            'edit_item' => 'Modifier la FAQ',
            'new_item' => 'Nouvelle FAQ',
            'view_item' => 'Voir la FAQ',
            'search_items' => 'Rechercher des FAQ',
            'not_found' => 'Aucune FAQ trouvée',
            'not_found_in_trash' => 'Aucune FAQ dans la corbeille'
        )
    ));

    // Services
    register_post_type('services', array(
        'public' => true,
        'show_in_rest' => true,
        'rest_base' => 'services',
        'supports' => array('title', 'editor', 'custom-fields'),
        'labels' => array(
            'name' => 'Services',
            'singular_name' => 'Service',
            'add_new' => 'Ajouter un service',
            'add_new_item' => 'Ajouter un nouveau service',
            'edit_item' => 'Modifier le service',
            'new_item' => 'Nouveau service',
            'view_item' => 'Voir le service',
            'search_items' => 'Rechercher des services',
            'not_found' => 'Aucun service trouvé',
            'not_found_in_trash' => 'Aucun service dans la corbeille'
        )
    ));
});

// Configuration des taxonomies
add_action('init', function() {
    // Marques de véhicules
    register_taxonomy('vehicle_brand', 'vehicles', array(
        'public' => true,
        'show_in_rest' => true,
        'labels' => array(
            'name' => 'Marques',
            'singular_name' => 'Marque'
        )
    ));

    // Types de véhicules
    register_taxonomy('vehicle_type', 'vehicles', array(
        'public' => true,
        'show_in_rest' => true,
        'labels' => array(
            'name' => 'Types',
            'singular_name' => 'Type'
        )
    ));

    // Catégories FAQ
    register_taxonomy('faq_category', 'faqs', array(
        'public' => true,
        'show_in_rest' => true,
        'labels' => array(
            'name' => 'Catégories FAQ',
            'singular_name' => 'Catégorie FAQ'
        )
    ));
});
