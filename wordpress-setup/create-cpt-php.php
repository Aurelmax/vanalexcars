<?php
/**
 * Script PHP pour créer automatiquement les Custom Post Types Vanalexcars
 * À exécuter dans l'environnement WordPress
 */

// Vérifier que nous sommes dans WordPress
if (!defined('ABSPATH')) {
    die('Ce script doit être exécuté dans l\'environnement WordPress');
}

echo "🚀 Création automatique des Custom Post Types pour Vanalexcars...\n";

// Fonction pour créer un CPT
function create_custom_post_type($slug, $labels, $args) {
    $post_type = register_post_type($slug, $args);
    if (is_wp_error($post_type)) {
        echo "❌ Erreur lors de la création du CPT $slug: " . $post_type->get_error_message() . "\n";
        return false;
    }
    echo "✅ CPT $slug créé avec succès\n";
    return true;
}

// Fonction pour créer une taxonomie
function create_custom_taxonomy($slug, $labels, $args) {
    $taxonomy = register_taxonomy($slug, $args['object_type'], $args);
    if (is_wp_error($taxonomy)) {
        echo "❌ Erreur lors de la création de la taxonomie $slug: " . $taxonomy->get_error_message() . "\n";
        return false;
    }
    echo "✅ Taxonomie $slug créée avec succès\n";
    return true;
}

// 1. Créer le CPT Véhicules
echo "🚗 Création du CPT Véhicules...\n";
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
create_custom_post_type('vehicles', $vehicles_args['labels'], $vehicles_args);

// 2. Créer le CPT Témoignages
echo "💬 Création du CPT Témoignages...\n";
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
create_custom_post_type('testimonials', $testimonials_args['labels'], $testimonials_args);

// 3. Créer le CPT FAQ
echo "❓ Création du CPT FAQ...\n";
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
create_custom_post_type('faqs', $faqs_args['labels'], $faqs_args);

// 4. Créer le CPT Services
echo "🔧 Création du CPT Services...\n";
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
create_custom_post_type('services', $services_args['labels'], $services_args);

// 5. Créer les taxonomies
echo "🏷️ Création des taxonomies...\n";

// Marques de véhicules
echo "🚗 Création de la taxonomie Marques de véhicules...\n";
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
    'hierarchical' => true,
    'object_type' => array('vehicles')
);
create_custom_taxonomy('vehicle_brand', $vehicle_brand_args['labels'], $vehicle_brand_args);

// Types de véhicules
echo "🚙 Création de la taxonomie Types de véhicules...\n";
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
    'hierarchical' => true,
    'object_type' => array('vehicles')
);
create_custom_taxonomy('vehicle_type', $vehicle_type_args['labels'], $vehicle_type_args);

// Catégories de FAQ
echo "❓ Création de la taxonomie Catégories FAQ...\n";
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
    'hierarchical' => true,
    'object_type' => array('faqs')
);
create_custom_taxonomy('faq_category', $faq_category_args['labels'], $faq_category_args);

// Catégories de services
echo "🔧 Création de la taxonomie Catégories de services...\n";
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
    'hierarchical' => true,
    'object_type' => array('services')
);
create_custom_taxonomy('service_category', $service_category_args['labels'], $service_category_args);

// Vider le cache
echo "🧹 Nettoyage du cache...\n";
wp_cache_flush();

echo "✅ Configuration automatique terminée !\n";
echo "\n";
echo "🎯 Custom Post Types créés :\n";
echo "  - Véhicules: /wp-json/wp/v2/vehicles\n";
echo "  - Témoignages: /wp-json/wp/v2/testimonials\n";
echo "  - FAQ: /wp-json/wp/v2/faqs\n";
echo "  - Services: /wp-json/wp/v2/services\n";
echo "\n";
echo "🏷️ Taxonomies créées :\n";
echo "  - Marques de véhicules\n";
echo "  - Types de véhicules\n";
echo "  - Catégories FAQ\n";
echo "  - Catégories de services\n";
echo "\n";
echo "🌐 Admin WordPress: http://localhost:8080/wp-admin/\n";
echo "🔧 API REST: http://localhost:8080/index.php?rest_route=/wp/v2/\n";
