<?php
/**
 * Configuration des Custom Fields natifs pour Vanalexcars
 * Solution légère et gratuite
 */

// Fonction pour ajouter des meta boxes personnalisées
add_action('add_meta_boxes', 'vanalexcars_add_custom_meta_boxes');

function vanalexcars_add_custom_meta_boxes() {
    // Meta box pour les véhicules
    add_meta_box(
        'vehicle_details',
        'Détails du véhicule',
        'vanalexcars_vehicle_meta_box_callback',
        'vehicles',
        'normal',
        'high'
    );
    
    // Meta box pour les témoignages
    add_meta_box(
        'testimonial_details',
        'Détails du témoignage',
        'vanalexcars_testimonial_meta_box_callback',
        'testimonials',
        'normal',
        'high'
    );
    
    // Meta box pour les FAQ
    add_meta_box(
        'faq_details',
        'Détails de la FAQ',
        'vanalexcars_faq_meta_box_callback',
        'faqs',
        'normal',
        'high'
    );
    
    // Meta box pour les services
    add_meta_box(
        'service_details',
        'Détails du service',
        'vanalexcars_service_meta_box_callback',
        'services',
        'normal',
        'high'
    );
}

// Callback pour les véhicules
function vanalexcars_vehicle_meta_box_callback($post) {
    wp_nonce_field('vanalexcars_vehicle_meta_box', 'vanalexcars_vehicle_meta_box_nonce');
    
    $price = get_post_meta($post->ID, '_vehicle_price', true);
    $year = get_post_meta($post->ID, '_vehicle_year', true);
    $mileage = get_post_meta($post->ID, '_vehicle_mileage', true);
    $power = get_post_meta($post->ID, '_vehicle_power', true);
    $owners = get_post_meta($post->ID, '_vehicle_owners', true);
    $transmission = get_post_meta($post->ID, '_vehicle_transmission', true);
    $fuel = get_post_meta($post->ID, '_vehicle_fuel', true);
    $consumption = get_post_meta($post->ID, '_vehicle_consumption', true);
    $co2 = get_post_meta($post->ID, '_vehicle_co2', true);
    $location = get_post_meta($post->ID, '_vehicle_location', true);
    $seller = get_post_meta($post->ID, '_vehicle_seller', true);
    $seller_type = get_post_meta($post->ID, '_vehicle_seller_type', true);
    $featured = get_post_meta($post->ID, '_vehicle_featured', true);
    $sold = get_post_meta($post->ID, '_vehicle_sold', true);
    
    echo '<table class="form-table">';
    echo '<tr><th><label for="vehicle_price">Prix (€)</label></th>';
    echo '<td><input type="text" id="vehicle_price" name="vehicle_price" value="' . esc_attr($price) . '" size="25" /></td></tr>';
    
    echo '<tr><th><label for="vehicle_year">Année</label></th>';
    echo '<td><input type="text" id="vehicle_year" name="vehicle_year" value="' . esc_attr($year) . '" size="25" /></td></tr>';
    
    echo '<tr><th><label for="vehicle_mileage">Kilométrage (km)</label></th>';
    echo '<td><input type="text" id="vehicle_mileage" name="vehicle_mileage" value="' . esc_attr($mileage) . '" size="25" /></td></tr>';
    
    echo '<tr><th><label for="vehicle_power">Puissance (CH)</label></th>';
    echo '<td><input type="text" id="vehicle_power" name="vehicle_power" value="' . esc_attr($power) . '" size="25" /></td></tr>';
    
    echo '<tr><th><label for="vehicle_owners">Nombre de propriétaires</label></th>';
    echo '<td><input type="text" id="vehicle_owners" name="vehicle_owners" value="' . esc_attr($owners) . '" size="25" /></td></tr>';
    
    echo '<tr><th><label for="vehicle_transmission">Transmission</label></th>';
    echo '<td><select id="vehicle_transmission" name="vehicle_transmission">';
    echo '<option value="manuelle"' . selected($transmission, 'manuelle', false) . '>Manuelle</option>';
    echo '<option value="automatique"' . selected($transmission, 'automatique', false) . '>Automatique</option>';
    echo '<option value="semi-automatique"' . selected($transmission, 'semi-automatique', false) . '>Semi-automatique</option>';
    echo '</select></td></tr>';
    
    echo '<tr><th><label for="vehicle_fuel">Carburant</label></th>';
    echo '<td><select id="vehicle_fuel" name="vehicle_fuel">';
    echo '<option value="essence"' . selected($fuel, 'essence', false) . '>Essence</option>';
    echo '<option value="diesel"' . selected($fuel, 'diesel', false) . '>Diesel</option>';
    echo '<option value="hybride"' . selected($fuel, 'hybride', false) . '>Hybride</option>';
    echo '<option value="electrique"' . selected($fuel, 'electrique', false) . '>Électrique</option>';
    echo '</select></td></tr>';
    
    echo '<tr><th><label for="vehicle_consumption">Consommation (l/100km)</label></th>';
    echo '<td><input type="text" id="vehicle_consumption" name="vehicle_consumption" value="' . esc_attr($consumption) . '" size="25" /></td></tr>';
    
    echo '<tr><th><label for="vehicle_co2">Émissions CO2 (g/km)</label></th>';
    echo '<td><input type="text" id="vehicle_co2" name="vehicle_co2" value="' . esc_attr($co2) . '" size="25" /></td></tr>';
    
    echo '<tr><th><label for="vehicle_location">Localisation</label></th>';
    echo '<td><input type="text" id="vehicle_location" name="vehicle_location" value="' . esc_attr($location) . '" size="25" /></td></tr>';
    
    echo '<tr><th><label for="vehicle_seller">Vendeur</label></th>';
    echo '<td><input type="text" id="vehicle_seller" name="vehicle_seller" value="' . esc_attr($seller) . '" size="25" /></td></tr>';
    
    echo '<tr><th><label for="vehicle_seller_type">Type de vendeur</label></th>';
    echo '<td><select id="vehicle_seller_type" name="vehicle_seller_type">';
    echo '<option value="Pro"' . selected($seller_type, 'Pro', false) . '>Professionnel</option>';
    echo '<option value="Particulier"' . selected($seller_type, 'Particulier', false) . '>Particulier</option>';
    echo '</select></td></tr>';
    
    echo '<tr><th><label for="vehicle_featured">Véhicule en vedette</label></th>';
    echo '<td><input type="checkbox" id="vehicle_featured" name="vehicle_featured" value="1"' . checked($featured, '1', false) . ' /></td></tr>';
    
    echo '<tr><th><label for="vehicle_sold">Véhicule vendu</label></th>';
    echo '<td><input type="checkbox" id="vehicle_sold" name="vehicle_sold" value="1"' . checked($sold, '1', false) . ' /></td></tr>';
    
    echo '</table>';
}

// Callback pour les témoignages
function vanalexcars_testimonial_meta_box_callback($post) {
    wp_nonce_field('vanalexcars_testimonial_meta_box', 'vanalexcars_testimonial_meta_box_nonce');
    
    $name = get_post_meta($post->ID, '_testimonial_name', true);
    $location = get_post_meta($post->ID, '_testimonial_location', true);
    $rating = get_post_meta($post->ID, '_testimonial_rating', true);
    $vehicle = get_post_meta($post->ID, '_testimonial_vehicle', true);
    $verified = get_post_meta($post->ID, '_testimonial_verified', true);
    $date = get_post_meta($post->ID, '_testimonial_date', true);
    
    echo '<table class="form-table">';
    echo '<tr><th><label for="testimonial_name">Nom du client</label></th>';
    echo '<td><input type="text" id="testimonial_name" name="testimonial_name" value="' . esc_attr($name) . '" size="25" /></td></tr>';
    
    echo '<tr><th><label for="testimonial_location">Localisation</label></th>';
    echo '<td><input type="text" id="testimonial_location" name="testimonial_location" value="' . esc_attr($location) . '" size="25" /></td></tr>';
    
    echo '<tr><th><label for="testimonial_rating">Note (sur 5)</label></th>';
    echo '<td><select id="testimonial_rating" name="testimonial_rating">';
    for ($i = 1; $i <= 5; $i++) {
        echo '<option value="' . $i . '"' . selected($rating, $i, false) . '>' . $i . ' étoile' . ($i > 1 ? 's' : '') . '</option>';
    }
    echo '</select></td></tr>';
    
    echo '<tr><th><label for="testimonial_vehicle">Véhicule acheté</label></th>';
    echo '<td><input type="text" id="testimonial_vehicle" name="testimonial_vehicle" value="' . esc_attr($vehicle) . '" size="25" /></td></tr>';
    
    echo '<tr><th><label for="testimonial_verified">Témoignage vérifié</label></th>';
    echo '<td><input type="checkbox" id="testimonial_verified" name="testimonial_verified" value="1"' . checked($verified, '1', false) . ' /></td></tr>';
    
    echo '<tr><th><label for="testimonial_date">Date d\'achat</label></th>';
    echo '<td><input type="date" id="testimonial_date" name="testimonial_date" value="' . esc_attr($date) . '" /></td></tr>';
    
    echo '</table>';
}

// Callback pour les FAQ
function vanalexcars_faq_meta_box_callback($post) {
    wp_nonce_field('vanalexcars_faq_meta_box', 'vanalexcars_faq_meta_box_nonce');
    
    $category = get_post_meta($post->ID, '_faq_category', true);
    $order = get_post_meta($post->ID, '_faq_order', true);
    $published = get_post_meta($post->ID, '_faq_published', true);
    $keywords = get_post_meta($post->ID, '_faq_keywords', true);
    
    echo '<table class="form-table">';
    echo '<tr><th><label for="faq_category">Catégorie</label></th>';
    echo '<td><input type="text" id="faq_category" name="faq_category" value="' . esc_attr($category) . '" size="25" /></td></tr>';
    
    echo '<tr><th><label for="faq_order">Ordre d\'affichage</label></th>';
    echo '<td><input type="number" id="faq_order" name="faq_order" value="' . esc_attr($order) . '" size="25" /></td></tr>';
    
    echo '<tr><th><label for="faq_published">Publié</label></th>';
    echo '<td><input type="checkbox" id="faq_published" name="faq_published" value="1"' . checked($published, '1', false) . ' /></td></tr>';
    
    echo '<tr><th><label for="faq_keywords">Mots-clés</label></th>';
    echo '<td><input type="text" id="faq_keywords" name="faq_keywords" value="' . esc_attr($keywords) . '" size="50" /></td></tr>';
    
    echo '</table>';
}

// Callback pour les services
function vanalexcars_service_meta_box_callback($post) {
    wp_nonce_field('vanalexcars_service_meta_box', 'vanalexcars_service_meta_box_nonce');
    
    $price = get_post_meta($post->ID, '_service_price', true);
    $category = get_post_meta($post->ID, '_service_category', true);
    $popular = get_post_meta($post->ID, '_service_popular', true);
    $duration = get_post_meta($post->ID, '_service_duration', true);
    
    echo '<table class="form-table">';
    echo '<tr><th><label for="service_price">Prix</label></th>';
    echo '<td><input type="text" id="service_price" name="service_price" value="' . esc_attr($price) . '" size="25" /></td></tr>';
    
    echo '<tr><th><label for="service_category">Catégorie</label></th>';
    echo '<td><select id="service_category" name="service_category">';
    echo '<option value="essentiel"' . selected($category, 'essentiel', false) . '>Essentiel</option>';
    echo '<option value="confort"' . selected($category, 'confort', false) . '>Confort</option>';
    echo '<option value="vip"' . selected($category, 'vip', false) . '>VIP Premium</option>';
    echo '</select></td></tr>';
    
    echo '<tr><th><label for="service_popular">Service populaire</label></th>';
    echo '<td><input type="checkbox" id="service_popular" name="service_popular" value="1"' . checked($popular, '1', false) . ' /></td></tr>';
    
    echo '<tr><th><label for="service_duration">Durée</label></th>';
    echo '<td><input type="text" id="service_duration" name="service_duration" value="' . esc_attr($duration) . '" size="25" /></td></tr>';
    
    echo '</table>';
}

// Sauvegarder les meta boxes
add_action('save_post', 'vanalexcars_save_meta_boxes');

function vanalexcars_save_meta_boxes($post_id) {
    // Vérifier les nonces et permissions
    if (!isset($_POST['vanalexcars_vehicle_meta_box_nonce']) && 
        !isset($_POST['vanalexcars_testimonial_meta_box_nonce']) &&
        !isset($_POST['vanalexcars_faq_meta_box_nonce']) &&
        !isset($_POST['vanalexcars_service_meta_box_nonce'])) {
        return;
    }
    
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }
    
    // Sauvegarder les champs des véhicules
    if (isset($_POST['vanalexcars_vehicle_meta_box_nonce']) && 
        wp_verify_nonce($_POST['vanalexcars_vehicle_meta_box_nonce'], 'vanalexcars_vehicle_meta_box')) {
        
        $fields = ['vehicle_price', 'vehicle_year', 'vehicle_mileage', 'vehicle_power', 
                  'vehicle_owners', 'vehicle_transmission', 'vehicle_fuel', 'vehicle_consumption',
                  'vehicle_co2', 'vehicle_location', 'vehicle_seller', 'vehicle_seller_type'];
        
        foreach ($fields as $field) {
            if (isset($_POST[$field])) {
                update_post_meta($post_id, '_' . $field, sanitize_text_field($_POST[$field]));
            }
        }
        
        // Checkboxes
        update_post_meta($post_id, '_vehicle_featured', isset($_POST['vehicle_featured']) ? '1' : '0');
        update_post_meta($post_id, '_vehicle_sold', isset($_POST['vehicle_sold']) ? '1' : '0');
    }
    
    // Sauvegarder les champs des témoignages
    if (isset($_POST['vanalexcars_testimonial_meta_box_nonce']) && 
        wp_verify_nonce($_POST['vanalexcars_testimonial_meta_box_nonce'], 'vanalexcars_testimonial_meta_box')) {
        
        $fields = ['testimonial_name', 'testimonial_location', 'testimonial_rating', 
                  'testimonial_vehicle', 'testimonial_date'];
        
        foreach ($fields as $field) {
            if (isset($_POST[$field])) {
                update_post_meta($post_id, '_' . $field, sanitize_text_field($_POST[$field]));
            }
        }
        
        update_post_meta($post_id, '_testimonial_verified', isset($_POST['testimonial_verified']) ? '1' : '0');
    }
    
    // Sauvegarder les champs des FAQ
    if (isset($_POST['vanalexcars_faq_meta_box_nonce']) && 
        wp_verify_nonce($_POST['vanalexcars_faq_meta_box_nonce'], 'vanalexcars_faq_meta_box')) {
        
        $fields = ['faq_category', 'faq_order', 'faq_keywords'];
        
        foreach ($fields as $field) {
            if (isset($_POST[$field])) {
                update_post_meta($post_id, '_' . $field, sanitize_text_field($_POST[$field]));
            }
        }
        
        update_post_meta($post_id, '_faq_published', isset($_POST['faq_published']) ? '1' : '0');
    }
    
    // Sauvegarder les champs des services
    if (isset($_POST['vanalexcars_service_meta_box_nonce']) && 
        wp_verify_nonce($_POST['vanalexcars_service_meta_box_nonce'], 'vanalexcars_service_meta_box')) {
        
        $fields = ['service_price', 'service_category', 'service_duration'];
        
        foreach ($fields as $field) {
            if (isset($_POST[$field])) {
                update_post_meta($post_id, '_' . $field, sanitize_text_field($_POST[$field]));
            }
        }
        
        update_post_meta($post_id, '_service_popular', isset($_POST['service_popular']) ? '1' : '0');
    }
}
