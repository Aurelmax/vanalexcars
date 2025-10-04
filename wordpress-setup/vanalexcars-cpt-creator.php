<?php
/**
 * Plugin Name: Vanalexcars CPT Creator
 * Description: Création automatique des Custom Post Types pour Vanalexcars
 * Version: 1.0.0
 * Author: Vanalexcars
 */

// Empêcher l'accès direct
if (!defined('ABSPATH')) {
    exit;
}

// Hook pour créer les CPT au démarrage
add_action('init', 'vanalexcars_create_custom_post_types', 0);

function vanalexcars_create_custom_post_types() {
    
    // 1. Créer le CPT Véhicules
    $vehicles_args = array(
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
        ),
        'public' => true,
        'show_in_rest' => true,
        'rest_base' => 'vehicles',
        'supports' => array('title', 'editor', 'thumbnail', 'custom-fields'),
        'menu_icon' => 'dashicons-car',
        'menu_position' => 5,
        'has_archive' => true,
        'rewrite' => array('slug' => 'vehicules')
    );
    register_post_type('vehicles', $vehicles_args);

    // 2. Créer le CPT Témoignages
    $testimonials_args = array(
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
        ),
        'public' => true,
        'show_in_rest' => true,
        'rest_base' => 'testimonials',
        'supports' => array('title', 'editor', 'custom-fields'),
        'menu_icon' => 'dashicons-format-quote',
        'menu_position' => 6,
        'has_archive' => true,
        'rewrite' => array('slug' => 'temoignages')
    );
    register_post_type('testimonials', $testimonials_args);

    // 3. Créer le CPT FAQ
    $faqs_args = array(
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
        ),
        'public' => true,
        'show_in_rest' => true,
        'rest_base' => 'faqs',
        'supports' => array('title', 'editor', 'custom-fields'),
        'menu_icon' => 'dashicons-editor-help',
        'menu_position' => 7,
        'has_archive' => true,
        'rewrite' => array('slug' => 'faq')
    );
    register_post_type('faqs', $faqs_args);

    // 4. Créer le CPT Services
    $services_args = array(
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
        ),
        'public' => true,
        'show_in_rest' => true,
        'rest_base' => 'services',
        'supports' => array('title', 'editor', 'custom-fields'),
        'menu_icon' => 'dashicons-admin-tools',
        'menu_position' => 8,
        'has_archive' => true,
        'rewrite' => array('slug' => 'services')
    );
    register_post_type('services', $services_args);
}

// Hook pour créer les taxonomies
add_action('init', 'vanalexcars_create_taxonomies', 0);

function vanalexcars_create_taxonomies() {
    
    // Marques de véhicules
    $vehicle_brand_args = array(
        'labels' => array(
            'name' => 'Marques de Véhicules',
            'singular_name' => 'Marque',
            'search_items' => 'Rechercher des marques',
            'all_items' => 'Toutes les marques',
            'edit_item' => 'Modifier la marque',
            'update_item' => 'Mettre à jour la marque',
            'add_new_item' => 'Ajouter une nouvelle marque',
            'new_item_name' => 'Nom de la nouvelle marque',
            'menu_name' => 'Marques'
        ),
        'public' => true,
        'show_in_rest' => true,
        'hierarchical' => true
    );
    register_taxonomy('vehicle_brand', array('vehicles'), $vehicle_brand_args);

    // Types de véhicules
    $vehicle_type_args = array(
        'labels' => array(
            'name' => 'Types de Véhicules',
            'singular_name' => 'Type',
            'search_items' => 'Rechercher des types',
            'all_items' => 'Tous les types',
            'edit_item' => 'Modifier le type',
            'update_item' => 'Mettre à jour le type',
            'add_new_item' => 'Ajouter un nouveau type',
            'new_item_name' => 'Nom du nouveau type',
            'menu_name' => 'Types'
        ),
        'public' => true,
        'show_in_rest' => true,
        'hierarchical' => true
    );
    register_taxonomy('vehicle_type', array('vehicles'), $vehicle_type_args);

    // Catégories de FAQ
    $faq_category_args = array(
        'labels' => array(
            'name' => 'Catégories FAQ',
            'singular_name' => 'Catégorie FAQ',
            'search_items' => 'Rechercher des catégories',
            'all_items' => 'Toutes les catégories',
            'edit_item' => 'Modifier la catégorie',
            'update_item' => 'Mettre à jour la catégorie',
            'add_new_item' => 'Ajouter une nouvelle catégorie',
            'new_item_name' => 'Nom de la nouvelle catégorie',
            'menu_name' => 'Catégories FAQ'
        ),
        'public' => true,
        'show_in_rest' => true,
        'hierarchical' => true
    );
    register_taxonomy('faq_category', array('faqs'), $faq_category_args);

    // Catégories de services
    $service_category_args = array(
        'labels' => array(
            'name' => 'Catégories de Services',
            'singular_name' => 'Catégorie de Service',
            'search_items' => 'Rechercher des catégories',
            'all_items' => 'Toutes les catégories',
            'edit_item' => 'Modifier la catégorie',
            'update_item' => 'Mettre à jour la catégorie',
            'add_new_item' => 'Ajouter une nouvelle catégorie',
            'new_item_name' => 'Nom de la nouvelle catégorie',
            'menu_name' => 'Catégories de Services'
        ),
        'public' => true,
        'show_in_rest' => true,
        'hierarchical' => true
    );
    register_taxonomy('service_category', array('services'), $service_category_args);
}
