<?php
/**
 * Configuration Carbon Fields pour Vanalexcars
 * Headless CMS Configuration
 */

// Vérifier que Carbon Fields est actif
if (!class_exists('Carbon_Fields\Carbon_Fields')) {
    return;
}

use Carbon_Fields\Container;
use Carbon_Fields\Field;

// Configuration des champs pour les Véhicules
add_action('carbon_fields_register_fields', function() {
    
    // === VÉHICULES ===
    Container::make('post_meta', 'Informations Véhicule')
        ->where('post_type', '=', 'vehicles')
        ->add_fields([
            Field::make('text', 'vehicle_price', 'Prix')
                ->set_required(true)
                ->set_help_text('Prix en euros'),
            
            Field::make('text', 'vehicle_year', 'Année')
                ->set_required(true)
                ->set_help_text('Année de mise en circulation'),
            
            Field::make('text', 'vehicle_mileage', 'Kilométrage')
                ->set_required(true)
                ->set_help_text('Kilométrage en km'),
            
            Field::make('text', 'vehicle_power', 'Puissance')
                ->set_required(true)
                ->set_help_text('Puissance en chevaux'),
            
            Field::make('text', 'vehicle_owners', 'Nombre de propriétaires')
                ->set_required(true),
            
            Field::make('select', 'vehicle_transmission', 'Transmission')
                ->set_options([
                    'manuelle' => 'Manuelle',
                    'automatique' => 'Automatique',
                    'semi-automatique' => 'Semi-automatique'
                ])
                ->set_required(true),
            
            Field::make('select', 'vehicle_fuel', 'Carburant')
                ->set_options([
                    'essence' => 'Essence',
                    'diesel' => 'Diesel',
                    'hybride' => 'Hybride',
                    'electrique' => 'Électrique'
                ])
                ->set_required(true),
            
            Field::make('text', 'vehicle_consumption', 'Consommation')
                ->set_help_text('Consommation en l/100km'),
            
            Field::make('text', 'vehicle_co2', 'Émissions CO2')
                ->set_help_text('Émissions en g/km'),
            
            Field::make('text', 'vehicle_location', 'Localisation')
                ->set_required(true)
                ->set_help_text('Ville, Pays'),
            
            Field::make('text', 'vehicle_seller', 'Vendeur')
                ->set_required(true),
            
            Field::make('select', 'vehicle_seller_type', 'Type de vendeur')
                ->set_options([
                    'Pro' => 'Professionnel',
                    'Particulier' => 'Particulier'
                ])
                ->set_required(true),
            
            Field::make('complex', 'vehicle_features', 'Équipements')
                ->add_fields([
                    Field::make('text', 'feature_name', 'Nom de l\'équipement')
                        ->set_required(true)
                ])
                ->set_layout('tabbed-vertical'),
            
            Field::make('complex', 'vehicle_history', 'Historique')
                ->add_fields([
                    Field::make('text', 'history_item', 'Élément d\'historique')
                        ->set_required(true)
                ])
                ->set_layout('tabbed-vertical'),
            
            Field::make('complex', 'vehicle_technical_specs', 'Caractéristiques Techniques')
                ->add_fields([
                    Field::make('text', 'engine', 'Moteur'),
                    Field::make('text', 'displacement', 'Cylindrée'),
                    Field::make('text', 'acceleration', 'Accélération'),
                    Field::make('text', 'top_speed', 'Vitesse maximale'),
                    Field::make('text', 'weight', 'Poids'),
                    Field::make('text', 'dimensions', 'Dimensions')
                ])
                ->set_layout('tabbed-vertical'),
            
            Field::make('media_gallery', 'vehicle_gallery', 'Galerie Photos')
                ->set_type(['image'])
                ->set_help_text('Photos du véhicule'),
            
            Field::make('checkbox', 'vehicle_featured', 'Véhicule en vedette')
                ->set_help_text('Afficher ce véhicule en vedette sur la page d\'accueil')
        ]);

    // === TÉMOIGNAGES ===
    Container::make('post_meta', 'Informations Témoignage')
        ->where('post_type', '=', 'testimonials')
        ->add_fields([
            Field::make('text', 'testimonial_name', 'Nom du client')
                ->set_required(true),
            
            Field::make('text', 'testimonial_location', 'Localisation')
                ->set_required(true)
                ->set_help_text('Ville du client'),
            
            Field::make('number', 'testimonial_rating', 'Note')
                ->set_required(true)
                ->set_min(1)
                ->set_max(5)
                ->set_help_text('Note sur 5 étoiles'),
            
            Field::make('text', 'testimonial_vehicle', 'Véhicule acheté')
                ->set_required(true)
                ->set_help_text('Modèle du véhicule acheté'),
            
            Field::make('checkbox', 'testimonial_verified', 'Témoignage vérifié')
                ->set_help_text('Ce témoignage a été vérifié'),
            
            Field::make('date', 'testimonial_date', 'Date d\'achat')
                ->set_required(true)
        ]);

    // === FAQ ===
    Container::make('post_meta', 'Informations FAQ')
        ->where('post_type', '=', 'faqs')
        ->add_fields([
            Field::make('text', 'faq_category', 'Catégorie')
                ->set_required(true)
                ->set_help_text('Catégorie de la FAQ'),
            
            Field::make('number', 'faq_order', 'Ordre d\'affichage')
                ->set_help_text('Ordre d\'affichage dans la liste'),
            
            Field::make('checkbox', 'faq_published', 'Publié')
                ->set_default_value(true)
        ]);

    // === SERVICES ===
    Container::make('post_meta', 'Informations Service')
        ->where('post_type', '=', 'services')
        ->add_fields([
            Field::make('text', 'service_price', 'Prix')
                ->set_help_text('Prix du service'),
            
            Field::make('complex', 'service_features', 'Fonctionnalités')
                ->add_fields([
                    Field::make('text', 'feature_name', 'Nom de la fonctionnalité')
                        ->set_required(true)
                ])
                ->set_layout('tabbed-vertical'),
            
            Field::make('select', 'service_category', 'Catégorie')
                ->set_options([
                    'essentiel' => 'Essentiel',
                    'confort' => 'Confort',
                    'vip' => 'VIP Premium'
                ])
                ->set_required(true),
            
            Field::make('checkbox', 'service_popular', 'Service populaire')
                ->set_help_text('Marquer comme service populaire')
        ]);
});

// Configuration pour exposer les champs dans l'API REST
add_action('rest_api_init', function() {
    // Véhicules
    register_rest_field('vehicles', 'vehicle_meta', [
        'get_callback' => function($post) {
            return [
                'price' => carbon_get_post_meta($post['id'], 'vehicle_price'),
                'year' => carbon_get_post_meta($post['id'], 'vehicle_year'),
                'mileage' => carbon_get_post_meta($post['id'], 'vehicle_mileage'),
                'power' => carbon_get_post_meta($post['id'], 'vehicle_power'),
                'owners' => carbon_get_post_meta($post['id'], 'vehicle_owners'),
                'transmission' => carbon_get_post_meta($post['id'], 'vehicle_transmission'),
                'fuel' => carbon_get_post_meta($post['id'], 'vehicle_fuel'),
                'consumption' => carbon_get_post_meta($post['id'], 'vehicle_consumption'),
                'co2' => carbon_get_post_meta($post['id'], 'vehicle_co2'),
                'location' => carbon_get_post_meta($post['id'], 'vehicle_location'),
                'seller' => carbon_get_post_meta($post['id'], 'vehicle_seller'),
                'seller_type' => carbon_get_post_meta($post['id'], 'vehicle_seller_type'),
                'features' => carbon_get_post_meta($post['id'], 'vehicle_features'),
                'history' => carbon_get_post_meta($post['id'], 'vehicle_history'),
                'technical_specs' => carbon_get_post_meta($post['id'], 'vehicle_technical_specs'),
                'gallery' => carbon_get_post_meta($post['id'], 'vehicle_gallery'),
                'featured' => carbon_get_post_meta($post['id'], 'vehicle_featured')
            ];
        }
    ]);

    // Témoignages
    register_rest_field('testimonials', 'testimonial_meta', [
        'get_callback' => function($post) {
            return [
                'name' => carbon_get_post_meta($post['id'], 'testimonial_name'),
                'location' => carbon_get_post_meta($post['id'], 'testimonial_location'),
                'rating' => carbon_get_post_meta($post['id'], 'testimonial_rating'),
                'vehicle' => carbon_get_post_meta($post['id'], 'testimonial_vehicle'),
                'verified' => carbon_get_post_meta($post['id'], 'testimonial_verified'),
                'date' => carbon_get_post_meta($post['id'], 'testimonial_date')
            ];
        }
    ]);

    // FAQ
    register_rest_field('faqs', 'faq_meta', [
        'get_callback' => function($post) {
            return [
                'category' => carbon_get_post_meta($post['id'], 'faq_category'),
                'order' => carbon_get_post_meta($post['id'], 'faq_order'),
                'published' => carbon_get_post_meta($post['id'], 'faq_published')
            ];
        }
    ]);

    // Services
    register_rest_field('services', 'service_meta', [
        'get_callback' => function($post) {
            return [
                'price' => carbon_get_post_meta($post['id'], 'service_price'),
                'features' => carbon_get_post_meta($post['id'], 'service_features'),
                'category' => carbon_get_post_meta($post['id'], 'service_category'),
                'popular' => carbon_get_post_meta($post['id'], 'service_popular')
            ];
        }
    ]);
});

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
