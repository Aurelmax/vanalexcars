<?php
/**
 * Script WP-CLI pour ajouter des véhicules de test
 */

if (!class_exists('WP_CLI')) {
    return;
}

/**
 * Commande WP-CLI pour ajouter des véhicules de test
 */
class AddSampleVehiclesCommand {
    
    /**
     * Ajouter des véhicules de test
     */
    public function add_sample_vehicles() {
        $sample_vehicles = array(
            array(
                'title' => 'Porsche 911 Carrera 4S',
                'content' => 'Porsche 911 Carrera 4S en excellent état, toutes options, entretien suivi chez Porsche.',
                'meta' => array(
                    'price' => '89 900',
                    'year' => '2022',
                    'mileage' => '12 500 km',
                    'location' => 'Antibes',
                    'fuel_type' => 'Essence',
                    'transmission' => 'Automatique',
                    'power' => '450 ch',
                    'description' => 'Porsche 911 Carrera 4S avec transmission PDK, système de traction intégrale, et toutes les options premium.',
                    'is_new' => '0',
                    'is_featured' => '1',
                    'is_sold' => '0'
                )
            ),
            array(
                'title' => 'BMW M3 Competition',
                'content' => 'BMW M3 Competition 2023, moteur S58, transmission automatique, finition Competition.',
                'meta' => array(
                    'price' => '95 000',
                    'year' => '2023',
                    'mileage' => '8 200 km',
                    'location' => 'Nice',
                    'fuel_type' => 'Essence',
                    'transmission' => 'Automatique',
                    'power' => '510 ch',
                    'description' => 'BMW M3 Competition avec moteur S58 biturbo, transmission M Steptronic, et système de traction intégrale M xDrive.',
                    'is_new' => '1',
                    'is_featured' => '0',
                    'is_sold' => '0'
                )
            ),
            array(
                'title' => 'Mercedes-AMG GT 63 S',
                'content' => 'Mercedes-AMG GT 63 S 4MATIC+, berline sportive de luxe avec moteur V8 biturbo.',
                'meta' => array(
                    'price' => '125 000',
                    'year' => '2021',
                    'mileage' => '15 800 km',
                    'location' => 'Cannes',
                    'fuel_type' => 'Essence',
                    'transmission' => 'Automatique',
                    'power' => '630 ch',
                    'description' => 'Mercedes-AMG GT 63 S avec moteur V8 biturbo AMG, transmission AMG SPEEDSHIFT MCT 9G, et système 4MATIC+.',
                    'is_new' => '0',
                    'is_featured' => '1',
                    'is_sold' => '0'
                )
            ),
            array(
                'title' => 'Audi RS6 Avant',
                'content' => 'Audi RS6 Avant, break sportif avec moteur V8 biturbo et transmission automatique.',
                'meta' => array(
                    'price' => '78 500',
                    'year' => '2022',
                    'mileage' => '18 500 km',
                    'location' => 'Monaco',
                    'fuel_type' => 'Essence',
                    'transmission' => 'Automatique',
                    'power' => '600 ch',
                    'description' => 'Audi RS6 Avant avec moteur V8 biturbo, transmission tiptronic, et système de traction intégrale quattro.',
                    'is_new' => '0',
                    'is_featured' => '0',
                    'is_sold' => '0'
                )
            ),
            array(
                'title' => 'Porsche Taycan Turbo S',
                'content' => 'Porsche Taycan Turbo S, berline électrique de luxe avec performances exceptionnelles.',
                'meta' => array(
                    'price' => '145 000',
                    'year' => '2023',
                    'mileage' => '5 200 km',
                    'location' => 'Antibes',
                    'fuel_type' => 'Électrique',
                    'transmission' => 'Automatique',
                    'power' => '761 ch',
                    'description' => 'Porsche Taycan Turbo S avec moteurs électriques sur les deux essieux, transmission automatique à 2 vitesses, et batterie lithium-ion de 93,4 kWh.',
                    'is_new' => '1',
                    'is_featured' => '1',
                    'is_sold' => '0'
                )
            ),
            array(
                'title' => 'Ferrari 488 GTB',
                'content' => 'Ferrari 488 GTB, supercar italienne avec moteur V8 turbo et transmission automatique.',
                'meta' => array(
                    'price' => '195 000',
                    'year' => '2020',
                    'mileage' => '12 000 km',
                    'location' => 'Nice',
                    'fuel_type' => 'Essence',
                    'transmission' => 'Automatique',
                    'power' => '670 ch',
                    'description' => 'Ferrari 488 GTB avec moteur V8 turbo F154, transmission automatique F1 à 7 rapports, et système de traction arrière.',
                    'is_new' => '0',
                    'is_featured' => '1',
                    'is_sold' => '0'
                )
            )
        );
        
        WP_CLI::log('Création des véhicules de test...');
        
        foreach ($sample_vehicles as $vehicle) {
            $post_data = array(
                'post_title' => $vehicle['title'],
                'post_content' => $vehicle['content'],
                'post_status' => 'publish',
                'post_type' => 'vehicules',
                'post_author' => 1
            );
            
            $post_id = wp_insert_post($post_data);
            
            if ($post_id && !is_wp_error($post_id)) {
                // Ajouter les métadonnées
                foreach ($vehicle['meta'] as $key => $value) {
                    update_post_meta($post_id, '_vehicle_' . $key, $value);
                }
                
                WP_CLI::success("Véhicule créé: {$vehicle['title']} (ID: $post_id)");
            } else {
                WP_CLI::error("Erreur lors de la création de: {$vehicle['title']}");
            }
        }
        
        WP_CLI::success('Tous les véhicules de test ont été créés !');
    }
}

// Enregistrer la commande WP-CLI
WP_CLI::add_command('vanalexcars add-vehicles', array('AddSampleVehiclesCommand', 'add_sample_vehicles'));
?>
