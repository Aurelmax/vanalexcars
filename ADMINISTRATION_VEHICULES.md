# 🚗 Administration des Véhicules - Vanalexcars

## Vue d'ensemble

Ce document explique comment rendre administrable le composant "Véhicules Disponibles" en utilisant WordPress comme CMS headless.

## 🏗️ Architecture Actuelle

### Composants Existants

- **`VehicleGrid.tsx`** : Affichage des véhicules (données mockées)
- **`useWordPressVehicles`** : Hook pour récupérer les données WordPress
- **`vehicleService.ts`** : Service de gestion des véhicules
- **`VanalexcarsVehicule`** : Interface TypeScript

## 📋 Plan d'Administration

### 1. Configuration WordPress

#### A. Custom Post Type "Véhicules"

```php
// Dans votre plugin WordPress
function create_vehicles_cpt() {
    register_post_type('vehicules', array(
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
        'has_archive' => true,
        'supports' => array('title', 'editor', 'thumbnail', 'custom-fields'),
        'show_in_rest' => true, // Important pour l'API REST
        'menu_icon' => 'dashicons-car',
        'menu_position' => 5
    ));
}
add_action('init', 'create_vehicles_cpt');
```

#### B. Champs Personnalisés (Custom Fields)

```php
// Métadonnées pour chaque véhicule
function add_vehicle_meta_boxes() {
    add_meta_box(
        'vehicle_details',
        'Détails du Véhicule',
        'vehicle_details_callback',
        'vehicules',
        'normal',
        'high'
    );
}

function vehicle_details_callback($post) {
    // Prix
    $price = get_post_meta($post->ID, '_vehicle_price', true);
    echo '<label>Prix: </label>';
    echo '<input type="text" name="vehicle_price" value="' . esc_attr($price) . '" />';

    // Année
    $year = get_post_meta($post->ID, '_vehicle_year', true);
    echo '<label>Année: </label>';
    echo '<input type="number" name="vehicle_year" value="' . esc_attr($year) . '" />';

    // Kilométrage
    $mileage = get_post_meta($post->ID, '_vehicle_mileage', true);
    echo '<label>Kilométrage: </label>';
    echo '<input type="text" name="vehicle_mileage" value="' . esc_attr($mileage) . '" />';

    // Localisation
    $location = get_post_meta($post->ID, '_vehicle_location', true);
    echo '<label>Localisation: </label>';
    echo '<input type="text" name="vehicle_location" value="' . esc_attr($location) . '" />';

    // Type de carburant
    $fuel_type = get_post_meta($post->ID, '_vehicle_fuel_type', true);
    echo '<label>Type de carburant: </label>';
    echo '<select name="vehicle_fuel_type">';
    echo '<option value="Essence"' . selected($fuel_type, 'Essence', false) . '>Essence</option>';
    echo '<option value="Diesel"' . selected($fuel_type, 'Diesel', false) . '>Diesel</option>';
    echo '<option value="Électrique"' . selected($fuel_type, 'Électrique', false) . '>Électrique</option>';
    echo '<option value="Hybride"' . selected($fuel_type, 'Hybride', false) . '>Hybride</option>';
    echo '</select>';

    // Transmission
    $transmission = get_post_meta($post->ID, '_vehicle_transmission', true);
    echo '<label>Transmission: </label>';
    echo '<select name="vehicle_transmission">';
    echo '<option value="Manuelle"' . selected($transmission, 'Manuelle', false) . '>Manuelle</option>';
    echo '<option value="Automatique"' . selected($transmission, 'Automatique', false) . '>Automatique</option>';
    echo '</select>';

    // Puissance
    $power = get_post_meta($post->ID, '_vehicle_power', true);
    echo '<label>Puissance: </label>';
    echo '<input type="text" name="vehicle_power" value="' . esc_attr($power) . '" placeholder="ex: 450 ch" />';

    // Statut (Nouveau/Ancien)
    $is_new = get_post_meta($post->ID, '_vehicle_is_new', true);
    echo '<label>Nouveau véhicule: </label>';
    echo '<input type="checkbox" name="vehicle_is_new" value="1"' . checked($is_new, '1', false) . ' />';

    // Véhicule en vedette
    $is_featured = get_post_meta($post->ID, '_vehicle_is_featured', true);
    echo '<label>Véhicule en vedette: </label>';
    echo '<input type="checkbox" name="vehicle_is_featured" value="1"' . checked($is_featured, '1', false) . ' />';
}
add_action('add_meta_boxes', 'add_vehicle_meta_boxes');
```

#### C. Sauvegarde des Métadonnées

```php
function save_vehicle_meta($post_id) {
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $post_id)) return;

    $fields = array(
        'vehicle_price',
        'vehicle_year',
        'vehicle_mileage',
        'vehicle_location',
        'vehicle_fuel_type',
        'vehicle_transmission',
        'vehicle_power',
        'vehicle_is_new',
        'vehicle_is_featured'
    );

    foreach ($fields as $field) {
        if (isset($_POST[$field])) {
            update_post_meta($post_id, '_' . $field, sanitize_text_field($_POST[$field]));
        }
    }
}
add_action('save_post', 'save_vehicle_meta');
```

### 2. API REST WordPress

#### A. Exposition des Métadonnées

```php
// Exposer les métadonnées dans l'API REST
function add_vehicle_meta_to_rest() {
    register_rest_field('vehicules', 'vehicle_meta', array(
        'get_callback' => function($post) {
            return array(
                'price' => get_post_meta($post['id'], '_vehicle_price', true),
                'year' => get_post_meta($post['id'], '_vehicle_year', true),
                'mileage' => get_post_meta($post['id'], '_vehicle_mileage', true),
                'location' => get_post_meta($post['id'], '_vehicle_location', true),
                'fuel_type' => get_post_meta($post['id'], '_vehicle_fuel_type', true),
                'transmission' => get_post_meta($post['id'], '_vehicle_transmission', true),
                'power' => get_post_meta($post['id'], '_vehicle_power', true),
                'is_new' => get_post_meta($post['id'], '_vehicle_is_new', true),
                'is_featured' => get_post_meta($post['id'], '_vehicle_is_featured', true)
            );
        }
    ));
}
add_action('rest_api_init', 'add_vehicle_meta_to_rest');
```

### 3. Frontend Next.js

#### A. Mise à jour du Hook useWordPressVehicles

```typescript
// hooks/useWordPressVehicles.ts
export function useWordPressVehicles(params?: {
  page?: number;
  per_page?: number;
  search?: string;
  orderby?: string;
  order?: 'asc' | 'desc';
  featured?: boolean;
  is_new?: boolean;
}) {
  const [vehicles, setVehicles] = useState<VanalexcarsVehicule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await wordpressService.getVehicles(params);
      setVehicles(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Erreur lors du chargement des véhicules'
      );
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  return { vehicles, loading, error, refetch: fetchVehicles };
}
```

#### B. Mise à jour du Service WordPress

```typescript
// lib/services/wordpressService.ts
export class WordPressService {
  private baseUrl: string;

  constructor() {
    this.baseUrl =
      process.env.NEXT_PUBLIC_WORDPRESS_URL || 'http://localhost:8080';
  }

  async getVehicles(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    orderby?: string;
    order?: 'asc' | 'desc';
    featured?: boolean;
    is_new?: boolean;
  }): Promise<VanalexcarsVehicule[]> {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.per_page)
      searchParams.append('per_page', params.per_page.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.orderby) searchParams.append('orderby', params.orderby);
    if (params?.order) searchParams.append('order', params.order);

    const response = await fetch(
      `${this.baseUrl}/wp-json/wp/v2/vehicules?${searchParams.toString()}`
    );

    if (!response.ok) {
      throw new Error('Erreur lors du chargement des véhicules');
    }

    return response.json();
  }
}
```

#### C. Mise à jour du Composant VehicleGrid

```typescript
// components/VehicleGrid.tsx
import { useWordPressVehicles } from '../hooks/useWordPress';

interface VehicleGridProps {
  title?: string;
  showLoadMore?: boolean;
  featured?: boolean;
  is_new?: boolean;
  limit?: number;
}

export default function VehicleGrid({
  title = 'Nos meilleures offres',
  showLoadMore = true,
  featured,
  is_new,
  limit = 8
}: VehicleGridProps) {
  const { vehicles, loading, error } = useWordPressVehicles({
    per_page: limit,
    featured,
    is_new
  });

  if (loading) {
    return (
      <section className='py-12 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto'></div>
            <p className='mt-4 text-gray-600'>Chargement des véhicules...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className='py-12 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <p className='text-red-600'>Erreur: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='py-12 bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {title && (
          <div className='text-center mb-8'>
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>{title}</h2>
            <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
              Découvrez les meilleures annonces de véhicules d'occasion premium
            </p>
          </div>
        )}

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {vehicles.map(vehicle => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>

        {showLoadMore && (
          <div className='text-center mt-8'>
            <button className='bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors'>
              Voir plus de véhicules
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
```

### 4. Interface d'Administration WordPress

#### A. Personnalisation de l'Interface Admin

```php
// Ajouter des colonnes personnalisées dans la liste des véhicules
function add_vehicle_columns($columns) {
    $new_columns = array();
    $new_columns['cb'] = $columns['cb'];
    $new_columns['title'] = $columns['title'];
    $new_columns['vehicle_price'] = 'Prix';
    $new_columns['vehicle_year'] = 'Année';
    $new_columns['vehicle_location'] = 'Localisation';
    $new_columns['vehicle_status'] = 'Statut';
    $new_columns['date'] = $columns['date'];
    return $new_columns;
}
add_filter('manage_vehicules_posts_columns', 'add_vehicle_columns');

function populate_vehicle_columns($column, $post_id) {
    switch ($column) {
        case 'vehicle_price':
            echo get_post_meta($post_id, '_vehicle_price', true);
            break;
        case 'vehicle_year':
            echo get_post_meta($post_id, '_vehicle_year', true);
            break;
        case 'vehicle_location':
            echo get_post_meta($post_id, '_vehicle_location', true);
            break;
        case 'vehicle_status':
            $is_new = get_post_meta($post_id, '_vehicle_is_new', true);
            $is_featured = get_post_meta($post_id, '_vehicle_is_featured', true);
            if ($is_new) echo '<span class="dashicons dashicons-star-filled" style="color: #ff6b6b;"></span> Nouveau';
            if ($is_featured) echo '<span class="dashicons dashicons-awards" style="color: #ffd93d;"></span> Vedette';
            break;
    }
}
add_action('manage_vehicules_posts_custom_column', 'populate_vehicle_columns', 10, 2);
```

### 5. Utilisation dans les Pages

#### A. Page d'Accueil

```typescript
// pages/index.tsx
import VehicleGrid from '../components/VehicleGrid';

export default function Home() {
  return (
    <div>
      {/* Autres sections */}

      {/* Véhicules Disponibles */}
      <VehicleGrid
        title="Véhicules Disponibles"
        featured={true}
        limit={8}
      />

      {/* Véhicules Nouveaux */}
      <VehicleGrid
        title="Nouveaux Arrivages"
        is_new={true}
        limit={4}
      />
    </div>
  );
}
```

#### B. Page de Tous les Véhicules

```typescript
// pages/vehicules.tsx
import VehicleGrid from '../components/VehicleGrid';

export default function Vehicules() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <h1 className='text-4xl font-bold text-gray-900 mb-8'>
          Tous nos Véhicules
        </h1>

        <VehicleGrid
          showLoadMore={true}
          limit={12}
        />
      </div>
    </div>
  );
}
```

## 🎯 Avantages de cette Approche

### Pour les Administrateurs

- ✅ Interface WordPress familière
- ✅ Gestion des images via la médiathèque
- ✅ Édition en temps réel
- ✅ Sauvegarde automatique
- ✅ Gestion des statuts (brouillon, publié)

### Pour les Développeurs

- ✅ API REST standardisée
- ✅ Types TypeScript cohérents
- ✅ Hooks réutilisables
- ✅ Composants modulaires
- ✅ Cache et performance optimisés

### Pour les Utilisateurs

- ✅ Contenu dynamique
- ✅ Mise à jour en temps réel
- ✅ Interface responsive
- ✅ Performance optimisée

## 🚀 Prochaines Étapes

1. **Implémenter le Custom Post Type** dans WordPress
2. **Créer les champs personnalisés** pour les métadonnées
3. **Mettre à jour les services** Next.js
4. **Tester l'intégration** complète
5. **Former les administrateurs** à l'interface WordPress

Cette approche vous donne une solution complète et professionnelle pour administrer vos véhicules !
