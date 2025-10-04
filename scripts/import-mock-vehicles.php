<?php
/**
 * Script d'import des véhicules mockés dans WordPress
 * 
 * Ce script importe les données mockées du composant VehicleGrid
 * dans le Custom Post Type "vehicules" de WordPress
 */

// Vérifier que nous sommes dans WordPress
if (!defined('ABSPATH')) {
    die('Accès direct interdit');
}

// Données mockées à importer
$mock_vehicles = [
    [
        'title' => 'Porsche 911 Carrera 4S',
        'content' => 'Porsche 911 Carrera 4S en excellent état, parfaitement entretenu. Véhicule vedette de notre collection.',
        'price' => 89900,
        'year' => 2022,
        'mileage' => 12500,
        'location' => 'Antibes',
        'fuel_type' => 'Essence',
        'transmission' => 'Automatique',
        'power' => '450 ch',
        'description' => 'Porsche 911 Carrera 4S en excellent état, parfaitement entretenu. Véhicule vedette de notre collection.',
        'is_featured' => true,
        'is_new' => false,
        'is_sold' => false,
        'image_url' => 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80'
    ],
    [
        'title' => 'BMW M3 Competition',
        'content' => 'BMW M3 Competition neuve, livrée directement du concessionnaire. Performance et confort au rendez-vous.',
        'price' => 95000,
        'year' => 2023,
        'mileage' => 8200,
        'location' => 'Nice',
        'fuel_type' => 'Essence',
        'transmission' => 'Automatique',
        'power' => '510 ch',
        'description' => 'BMW M3 Competition neuve, livrée directement du concessionnaire. Performance et confort au rendez-vous.',
        'is_featured' => false,
        'is_new' => true,
        'is_sold' => false,
        'image_url' => 'https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80'
    ],
    [
        'title' => 'Mercedes-AMG GT 63 S',
        'content' => 'Mercedes-AMG GT 63 S, berline de sport haut de gamme. Puissance et élégance allemande.',
        'price' => 125000,
        'year' => 2021,
        'mileage' => 15800,
        'location' => 'Cannes',
        'fuel_type' => 'Essence',
        'transmission' => 'Automatique',
        'power' => '630 ch',
        'description' => 'Mercedes-AMG GT 63 S, berline de sport haut de gamme. Puissance et élégance allemande.',
        'is_featured' => true,
        'is_new' => false,
        'is_sold' => false,
        'image_url' => 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80'
    ],
    [
        'title' => 'Audi RS6 Avant',
        'content' => 'Audi RS6 Avant, break sportif familial. Performance et praticité réunies.',
        'price' => 78500,
        'year' => 2022,
        'mileage' => 18500,
        'location' => 'Monaco',
        'fuel_type' => 'Essence',
        'transmission' => 'Automatique',
        'power' => '600 ch',
        'description' => 'Audi RS6 Avant, break sportif familial. Performance et praticité réunies.',
        'is_featured' => false,
        'is_new' => false,
        'is_sold' => false,
        'image_url' => 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80'
    ],
    [
        'title' => 'Porsche Taycan Turbo S',
        'content' => 'Porsche Taycan Turbo S électrique, technologie de pointe. Avenir de l\'automobile sportive.',
        'price' => 145000,
        'year' => 2023,
        'mileage' => 5200,
        'location' => 'Antibes',
        'fuel_type' => 'Électrique',
        'transmission' => 'Automatique',
        'power' => '761 ch',
        'description' => 'Porsche Taycan Turbo S électrique, technologie de pointe. Avenir de l\'automobile sportive.',
        'is_featured' => true,
        'is_new' => true,
        'is_sold' => false,
        'image_url' => 'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80'
    ],
    [
        'title' => 'Ferrari 488 GTB',
        'content' => 'Ferrari 488 GTB, supercar italienne légendaire. Émotions pures garanties.',
        'price' => 195000,
        'year' => 2020,
        'mileage' => 12000,
        'location' => 'Nice',
        'fuel_type' => 'Essence',
        'transmission' => 'Automatique',
        'power' => '670 ch',
        'description' => 'Ferrari 488 GTB, supercar italienne légendaire. Émotions pures garanties.',
        'is_featured' => true,
        'is_new' => false,
        'is_sold' => false,
        'image_url' => 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80'
    ]
];

/**
 * Fonction pour importer les véhicules mockés
 */
function import_mock_vehicles() {
    global $mock_vehicles;
    
    $imported_count = 0;
    $errors = [];
    
    foreach ($mock_vehicles as $vehicle_data) {
        // Vérifier si le véhicule existe déjà
        $existing_posts = get_posts([
            'post_type' => 'vehicules',
            'post_title' => $vehicle_data['title'],
            'post_status' => 'publish',
            'numberposts' => 1
        ]);
        
        if (!empty($existing_posts)) {
            $errors[] = "Véhicule '{$vehicle_data['title']}' existe déjà";
            continue;
        }
        
        // Créer le post
        $post_data = [
            'post_title' => $vehicle_data['title'],
            'post_content' => $vehicle_data['content'],
            'post_status' => 'publish',
            'post_type' => 'vehicules',
            'post_author' => 1, // Admin
            'meta_input' => [
                'price' => $vehicle_data['price'],
                'year' => $vehicle_data['year'],
                'mileage' => $vehicle_data['mileage'],
                'location' => $vehicle_data['location'],
                'fuel_type' => $vehicle_data['fuel_type'],
                'transmission' => $vehicle_data['transmission'],
                'power' => $vehicle_data['power'],
                'description' => $vehicle_data['description'],
                'is_featured' => $vehicle_data['is_featured'] ? '1' : '0',
                'is_new' => $vehicle_data['is_new'] ? '1' : '0',
                'is_sold' => $vehicle_data['is_sold'] ? '1' : '0',
                'image_url' => $vehicle_data['image_url']
            ]
        ];
        
        $post_id = wp_insert_post($post_data);
        
        if (is_wp_error($post_id)) {
            $errors[] = "Erreur lors de la création de '{$vehicle_data['title']}': " . $post_id->get_error_message();
        } else {
            $imported_count++;
            echo "✅ Véhicule importé: {$vehicle_data['title']} (ID: {$post_id})\n";
        }
    }
    
    return [
        'imported' => $imported_count,
        'errors' => $errors
    ];
}

/**
 * Fonction pour nettoyer les véhicules existants (optionnel)
 */
function clear_existing_vehicles() {
    $existing_posts = get_posts([
        'post_type' => 'vehicules',
        'post_status' => 'publish',
        'numberposts' => -1
    ]);
    
    $deleted_count = 0;
    foreach ($existing_posts as $post) {
        if (wp_delete_post($post->ID, true)) {
            $deleted_count++;
        }
    }
    
    return $deleted_count;
}

// Exécution du script
if (isset($_GET['action'])) {
    switch ($_GET['action']) {
        case 'import':
            echo "<h2>Import des véhicules mockés</h2>";
            $result = import_mock_vehicles();
            echo "<p><strong>Résultat:</strong></p>";
            echo "<ul>";
            echo "<li>Véhicules importés: {$result['imported']}</li>";
            echo "<li>Erreurs: " . count($result['errors']) . "</li>";
            echo "</ul>";
            
            if (!empty($result['errors'])) {
                echo "<h3>Erreurs:</h3>";
                echo "<ul>";
                foreach ($result['errors'] as $error) {
                    echo "<li style='color: red;'>{$error}</li>";
                }
                echo "</ul>";
            }
            break;
            
        case 'clear':
            echo "<h2>Nettoyage des véhicules existants</h2>";
            $deleted = clear_existing_vehicles();
            echo "<p>Véhicules supprimés: {$deleted}</p>";
            break;
            
        case 'status':
            echo "<h2>Statut des véhicules</h2>";
            $vehicles = get_posts([
                'post_type' => 'vehicules',
                'post_status' => 'publish',
                'numberposts' => -1
            ]);
            echo "<p>Nombre de véhicules: " . count($vehicles) . "</p>";
            echo "<ul>";
            foreach ($vehicles as $vehicle) {
                $price = get_post_meta($vehicle->ID, 'price', true);
                $year = get_post_meta($vehicle->ID, 'year', true);
                echo "<li>{$vehicle->post_title} - {$year} - €{$price}</li>";
            }
            echo "</ul>";
            break;
    }
} else {
    echo "<h2>Gestion des véhicules mockés</h2>";
    echo "<p>Actions disponibles:</p>";
    echo "<ul>";
    echo "<li><a href='?action=status'>Voir le statut</a></li>";
    echo "<li><a href='?action=import'>Importer les véhicules</a></li>";
    echo "<li><a href='?action=clear'>Nettoyer les véhicules existants</a></li>";
    echo "</ul>";
}
?>
