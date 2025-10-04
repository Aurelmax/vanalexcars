<?php
/**
 * Plugin Name: Vanalexcars Vehicles Manager
 * Description: Gestion des véhicules pour Vanalexcars
 * Version: 1.0.0
 * Author: Vanalexcars Team
 */

// Empêcher l'accès direct
if (!defined('ABSPATH')) {
    exit;
}

class VanalexcarsVehiclesManager {
    
    public function __construct() {
        add_action('init', array($this, 'create_vehicles_cpt'));
        add_action('add_meta_boxes', array($this, 'add_vehicle_meta_boxes'));
        add_action('save_post', array($this, 'save_vehicle_meta'));
        add_action('rest_api_init', array($this, 'add_vehicle_meta_to_rest'));
        add_filter('manage_vehicules_posts_columns', array($this, 'add_vehicle_columns'));
        add_action('manage_vehicules_posts_custom_column', array($this, 'populate_vehicle_columns'), 10, 2);
    }
    
    /**
     * Créer le Custom Post Type "Véhicules"
     */
    public function create_vehicles_cpt() {
        $labels = array(
            'name' => 'Véhicules',
            'singular_name' => 'Véhicule',
            'add_new' => 'Ajouter un véhicule',
            'add_new_item' => 'Ajouter un nouveau véhicule',
            'edit_item' => 'Modifier le véhicule',
            'new_item' => 'Nouveau véhicule',
            'view_item' => 'Voir le véhicule',
            'search_items' => 'Rechercher des véhicules',
            'not_found' => 'Aucun véhicule trouvé',
            'not_found_in_trash' => 'Aucun véhicule dans la corbeille',
            'all_items' => 'Tous les véhicules',
            'archives' => 'Archives des véhicules',
            'attributes' => 'Attributs du véhicule',
            'insert_into_item' => 'Insérer dans le véhicule',
            'uploaded_to_this_item' => 'Téléchargé vers ce véhicule',
            'featured_image' => 'Image mise en avant',
            'set_featured_image' => 'Définir l\'image mise en avant',
            'remove_featured_image' => 'Supprimer l\'image mise en avant',
            'use_featured_image' => 'Utiliser comme image mise en avant',
            'menu_name' => 'Véhicules',
            'filter_items_list' => 'Filtrer la liste des véhicules',
            'items_list_navigation' => 'Navigation de la liste des véhicules',
            'items_list' => 'Liste des véhicules',
        );

        $args = array(
            'labels' => $labels,
            'public' => true,
            'publicly_queryable' => true,
            'show_ui' => true,
            'show_in_menu' => true,
            'show_in_rest' => true, // Important pour l'API REST
            'query_var' => true,
            'rewrite' => array('slug' => 'vehicules'),
            'capability_type' => 'post',
            'has_archive' => true,
            'hierarchical' => false,
            'menu_position' => 5,
            'menu_icon' => 'dashicons-car',
            'supports' => array('title', 'editor', 'thumbnail', 'custom-fields', 'excerpt'),
            'show_in_nav_menus' => true,
            'can_export' => true,
        );

        register_post_type('vehicules', $args);
    }
    
    /**
     * Ajouter les métadonnées du véhicule
     */
    public function add_vehicle_meta_boxes() {
        add_meta_box(
            'vehicle_details',
            'Détails du Véhicule',
            array($this, 'vehicle_details_callback'),
            'vehicules',
            'normal',
            'high'
        );
        
        add_meta_box(
            'vehicle_status',
            'Statut du Véhicule',
            array($this, 'vehicle_status_callback'),
            'vehicules',
            'side',
            'high'
        );
    }
    
    /**
     * Callback pour les détails du véhicule
     */
    public function vehicle_details_callback($post) {
        // Ajouter un nonce pour la sécurité
        wp_nonce_field('vehicle_meta_nonce', 'vehicle_meta_nonce');
        
        // Récupérer les valeurs existantes
        $price = get_post_meta($post->ID, '_vehicle_price', true);
        $year = get_post_meta($post->ID, '_vehicle_year', true);
        $mileage = get_post_meta($post->ID, '_vehicle_mileage', true);
        $location = get_post_meta($post->ID, '_vehicle_location', true);
        $fuel_type = get_post_meta($post->ID, '_vehicle_fuel_type', true);
        $transmission = get_post_meta($post->ID, '_vehicle_transmission', true);
        $power = get_post_meta($post->ID, '_vehicle_power', true);
        $description = get_post_meta($post->ID, '_vehicle_description', true);
        
        echo '<table class="form-table">';
        
        // Prix
        echo '<tr>';
        echo '<th><label for="vehicle_price">Prix (€)</label></th>';
        echo '<td><input type="text" id="vehicle_price" name="vehicle_price" value="' . esc_attr($price) . '" class="regular-text" placeholder="ex: 89 900" /></td>';
        echo '</tr>';
        
        // Année
        echo '<tr>';
        echo '<th><label for="vehicle_year">Année</label></th>';
        echo '<td><input type="number" id="vehicle_year" name="vehicle_year" value="' . esc_attr($year) . '" class="regular-text" min="1990" max="' . date('Y') . '" /></td>';
        echo '</tr>';
        
        // Kilométrage
        echo '<tr>';
        echo '<th><label for="vehicle_mileage">Kilométrage</label></th>';
        echo '<td><input type="text" id="vehicle_mileage" name="vehicle_mileage" value="' . esc_attr($mileage) . '" class="regular-text" placeholder="ex: 12 500 km" /></td>';
        echo '</tr>';
        
        // Localisation
        echo '<tr>';
        echo '<th><label for="vehicle_location">Localisation</label></th>';
        echo '<td><input type="text" id="vehicle_location" name="vehicle_location" value="' . esc_attr($location) . '" class="regular-text" placeholder="ex: Nice, Antibes" /></td>';
        echo '</tr>';
        
        // Type de carburant
        echo '<tr>';
        echo '<th><label for="vehicle_fuel_type">Type de carburant</label></th>';
        echo '<td>';
        echo '<select id="vehicle_fuel_type" name="vehicle_fuel_type">';
        echo '<option value="">Sélectionner...</option>';
        echo '<option value="Essence"' . selected($fuel_type, 'Essence', false) . '>Essence</option>';
        echo '<option value="Diesel"' . selected($fuel_type, 'Diesel', false) . '>Diesel</option>';
        echo '<option value="Électrique"' . selected($fuel_type, 'Électrique', false) . '>Électrique</option>';
        echo '<option value="Hybride"' . selected($fuel_type, 'Hybride', false) . '>Hybride</option>';
        echo '<option value="GPL"' . selected($fuel_type, 'GPL', false) . '>GPL</option>';
        echo '</select>';
        echo '</td>';
        echo '</tr>';
        
        // Transmission
        echo '<tr>';
        echo '<th><label for="vehicle_transmission">Transmission</label></th>';
        echo '<td>';
        echo '<select id="vehicle_transmission" name="vehicle_transmission">';
        echo '<option value="">Sélectionner...</option>';
        echo '<option value="Manuelle"' . selected($transmission, 'Manuelle', false) . '>Manuelle</option>';
        echo '<option value="Automatique"' . selected($transmission, 'Automatique', false) . '>Automatique</option>';
        echo '<option value="Semi-automatique"' . selected($transmission, 'Semi-automatique', false) . '>Semi-automatique</option>';
        echo '</select>';
        echo '</td>';
        echo '</tr>';
        
        // Puissance
        echo '<tr>';
        echo '<th><label for="vehicle_power">Puissance</label></th>';
        echo '<td><input type="text" id="vehicle_power" name="vehicle_power" value="' . esc_attr($power) . '" class="regular-text" placeholder="ex: 450 ch" /></td>';
        echo '</tr>';
        
        // Description technique
        echo '<tr>';
        echo '<th><label for="vehicle_description">Description technique</label></th>';
        echo '<td><textarea id="vehicle_description" name="vehicle_description" rows="4" cols="50" class="large-text">' . esc_textarea($description) . '</textarea></td>';
        echo '</tr>';
        
        echo '</table>';
    }
    
    /**
     * Callback pour le statut du véhicule
     */
    public function vehicle_status_callback($post) {
        $is_new = get_post_meta($post->ID, '_vehicle_is_new', true);
        $is_featured = get_post_meta($post->ID, '_vehicle_is_featured', true);
        $is_sold = get_post_meta($post->ID, '_vehicle_is_sold', true);
        
        echo '<div class="vehicle-status-options">';
        
        // Nouveau véhicule
        echo '<p>';
        echo '<label>';
        echo '<input type="checkbox" name="vehicle_is_new" value="1"' . checked($is_new, '1', false) . ' /> ';
        echo 'Nouveau véhicule';
        echo '</label>';
        echo '</p>';
        
        // Véhicule en vedette
        echo '<p>';
        echo '<label>';
        echo '<input type="checkbox" name="vehicle_is_featured" value="1"' . checked($is_featured, '1', false) . ' /> ';
        echo 'Véhicule en vedette';
        echo '</label>';
        echo '</p>';
        
        // Véhicule vendu
        echo '<p>';
        echo '<label>';
        echo '<input type="checkbox" name="vehicle_is_sold" value="1"' . checked($is_sold, '1', false) . ' /> ';
        echo 'Véhicule vendu';
        echo '</label>';
        echo '</p>';
        
        echo '</div>';
    }
    
    /**
     * Sauvegarder les métadonnées du véhicule
     */
    public function save_vehicle_meta($post_id) {
        // Vérifications de sécurité
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
        if (!current_user_can('edit_post', $post_id)) return;
        if (!isset($_POST['vehicle_meta_nonce']) || !wp_verify_nonce($_POST['vehicle_meta_nonce'], 'vehicle_meta_nonce')) return;
        
        // Liste des champs à sauvegarder
        $fields = array(
            'vehicle_price',
            'vehicle_year',
            'vehicle_mileage',
            'vehicle_location',
            'vehicle_fuel_type',
            'vehicle_transmission',
            'vehicle_power',
            'vehicle_description',
            'vehicle_is_new',
            'vehicle_is_featured',
            'vehicle_is_sold'
        );
        
        // Sauvegarder chaque champ
        foreach ($fields as $field) {
            if (isset($_POST[$field])) {
                $value = sanitize_text_field($_POST[$field]);
                update_post_meta($post_id, '_' . $field, $value);
            } else {
                // Pour les checkboxes non cochées
                if (in_array($field, array('vehicle_is_new', 'vehicle_is_featured', 'vehicle_is_sold'))) {
                    update_post_meta($post_id, '_' . $field, '0');
                }
            }
        }
    }
    
    /**
     * Exposer les métadonnées dans l'API REST
     */
    public function add_vehicle_meta_to_rest() {
        register_rest_field('vehicules', 'vehicle_meta', array(
            'get_callback' => array($this, 'get_vehicle_meta_for_rest'),
            'update_callback' => null,
            'schema' => array(
                'description' => 'Métadonnées du véhicule',
                'type' => 'object',
                'context' => array('view', 'edit')
            )
        ));
    }
    
    /**
     * Callback pour récupérer les métadonnées dans l'API REST
     */
    public function get_vehicle_meta_for_rest($post) {
        return array(
            'price' => get_post_meta($post['id'], '_vehicle_price', true),
            'year' => get_post_meta($post['id'], '_vehicle_year', true),
            'mileage' => get_post_meta($post['id'], '_vehicle_mileage', true),
            'location' => get_post_meta($post['id'], '_vehicle_location', true),
            'fuel_type' => get_post_meta($post['id'], '_vehicle_fuel_type', true),
            'transmission' => get_post_meta($post['id'], '_vehicle_transmission', true),
            'power' => get_post_meta($post['id'], '_vehicle_power', true),
            'description' => get_post_meta($post['id'], '_vehicle_description', true),
            'is_new' => get_post_meta($post['id'], '_vehicle_is_new', true) === '1',
            'is_featured' => get_post_meta($post['id'], '_vehicle_is_featured', true) === '1',
            'is_sold' => get_post_meta($post['id'], '_vehicle_is_sold', true) === '1'
        );
    }
    
    /**
     * Ajouter des colonnes personnalisées dans la liste des véhicules
     */
    public function add_vehicle_columns($columns) {
        $new_columns = array();
        $new_columns['cb'] = $columns['cb'];
        $new_columns['title'] = $columns['title'];
        $new_columns['vehicle_image'] = 'Image';
        $new_columns['vehicle_price'] = 'Prix';
        $new_columns['vehicle_year'] = 'Année';
        $new_columns['vehicle_location'] = 'Localisation';
        $new_columns['vehicle_status'] = 'Statut';
        $new_columns['date'] = $columns['date'];
        return $new_columns;
    }
    
    /**
     * Remplir les colonnes personnalisées
     */
    public function populate_vehicle_columns($column, $post_id) {
        switch ($column) {
            case 'vehicle_image':
                if (has_post_thumbnail($post_id)) {
                    echo get_the_post_thumbnail($post_id, array(50, 50));
                } else {
                    echo '<span class="dashicons dashicons-format-image" style="font-size: 20px; color: #ccc;"></span>';
                }
                break;
                
            case 'vehicle_price':
                $price = get_post_meta($post_id, '_vehicle_price', true);
                echo $price ? '€ ' . $price : '-';
                break;
                
            case 'vehicle_year':
                $year = get_post_meta($post_id, '_vehicle_year', true);
                echo $year ?: '-';
                break;
                
            case 'vehicle_location':
                $location = get_post_meta($post_id, '_vehicle_location', true);
                echo $location ?: '-';
                break;
                
            case 'vehicle_status':
                $is_new = get_post_meta($post_id, '_vehicle_is_new', true);
                $is_featured = get_post_meta($post_id, '_vehicle_is_featured', true);
                $is_sold = get_post_meta($post_id, '_vehicle_is_sold', true);
                
                $statuses = array();
                if ($is_sold === '1') {
                    $statuses[] = '<span style="color: #dc3232;">Vendu</span>';
                } else {
                    if ($is_new === '1') {
                        $statuses[] = '<span style="color: #00a32a;">Nouveau</span>';
                    }
                    if ($is_featured === '1') {
                        $statuses[] = '<span style="color: #ff6b00;">Vedette</span>';
                    }
                }
                
                echo implode(' | ', $statuses);
                break;
        }
    }
}

// Initialiser le plugin
new VanalexcarsVehiclesManager();

// Fonction d'activation du plugin
function vanalexcars_vehicles_activate() {
    // Créer le CPT
    $manager = new VanalexcarsVehiclesManager();
    $manager->create_vehicles_cpt();
    
    // Flush les règles de réécriture
    flush_rewrite_rules();
}
register_activation_hook(__FILE__, 'vanalexcars_vehicles_activate');

// Fonction de désactivation du plugin
function vanalexcars_vehicles_deactivate() {
    // Flush les règles de réécriture
    flush_rewrite_rules();
}
register_deactivation_hook(__FILE__, 'vanalexcars_vehicles_deactivate');
?>
