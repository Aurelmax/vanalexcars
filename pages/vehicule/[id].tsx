import Link from 'next/link';
import { useRouter } from 'next/router';
import VehicleDetail from '../../components/VehicleDetail';

// Données mockées des véhicules
const vehicles = {
  'porsche-911-s-cabriolet': {
    id: 'porsche-911-s-cabriolet',
    name: 'Porsche 911 S Cabriolet',
    price: 87899,
    image:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop&crop=center',
    year: '04/2012',
    mileage: 42579,
    power: 400,
    owners: 2,
    transmission: 'Automatique',
    fuel: 'Essence',
    consumption: 10.3,
    co2: 305,
    location: 'Grünwald, Allemagne',
    seller: 'Auto Galerie München',
    sellerType: 'Pro' as const,
    features: [
      'Climatisation automatique',
      'Système de navigation',
      'Sièges sport en cuir',
      'Jantes alliage 19"',
      'Régulateur de vitesse',
      'Bluetooth',
      'Toit ouvrant électrique',
      'ABS',
      'ESP',
      'Airbags frontaux et latéraux',
      'Direction assistée',
      'Freins ABS',
    ],
    description:
      'Magnifique Porsche 911 S Cabriolet de 2012 en excellent état. Véhicule entretenu selon les préconisations constructeur avec historique complet. Toit électrique fonctionnel, intérieur cuir noir impeccable. Idéal pour les amateurs de sport automobile.',
    history: [
      'Premier propriétaire : 2012-2018 (München)',
      'Entretien régulier chez Porsche Center',
      'Révision complète en 2020',
      'Changement courroie de distribution en 2021',
      "Contrôle technique valide jusqu'en 2024",
    ],
    technicalSpecs: {
      engine: '6 cylindres à plat',
      displacement: '3.8L',
      acceleration: '0-100 km/h en 4.3s',
      topSpeed: '302 km/h',
      weight: '1,580 kg',
      dimensions: '4.49m x 1.85m x 1.30m',
    },
  },
  'porsche-911-carrera-4-cabrio': {
    id: 'porsche-911-carrera-4-cabrio',
    name: 'Porsche 911 Carrera 4 Cabrio',
    price: 67000,
    image:
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&crop=center',
    year: '01/2008',
    mileage: 38000,
    power: 325,
    owners: 3,
    transmission: 'Manuelle',
    fuel: 'Essence',
    location: 'Rust, Allemagne',
    seller: 'Privatverkauf',
    sellerType: 'Particulier' as const,
    features: [
      'Climatisation',
      'Sièges sport',
      'Jantes alliage 18"',
      'Régulateur de vitesse',
      'Toit ouvrant',
      'ABS',
      'ESP',
      'Airbags',
      'Direction assistée',
    ],
    description:
      'Porsche 911 Carrera 4 Cabrio de 2008 en très bon état général. Véhicule garé dans un garage, peu utilisée. Transmission manuelle pour le plaisir de conduite. Parfait pour les collectionneurs.',
    history: [
      'Trois propriétaires successifs',
      'Entretien régulier',
      'Garage depuis 2019',
      'Contrôle technique récent',
    ],
    technicalSpecs: {
      engine: '6 cylindres à plat',
      displacement: '3.6L',
      acceleration: '0-100 km/h en 5.0s',
      topSpeed: '285 km/h',
      weight: '1,520 kg',
      dimensions: '4.43m x 1.80m x 1.28m',
    },
  },
  'porsche-911-carrera-4-cabrio-wartenberg': {
    id: 'porsche-911-carrera-4-cabrio-wartenberg',
    name: 'Porsche 911 Carrera 4 Cabrio',
    price: 49997,
    image:
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop&crop=center',
    year: '04/2006',
    mileage: 92183,
    power: 325,
    owners: 2,
    transmission: 'Manuelle',
    fuel: 'Essence',
    consumption: 11.3,
    co2: 272,
    location: 'Wartenberg, Allemagne',
    seller: 'Autogalerie Wartenberg',
    sellerType: 'Pro' as const,
    features: [
      'Climatisation',
      'Sièges sport',
      'Jantes alliage 18"',
      'Régulateur de vitesse',
      'Toit ouvrant',
      'ABS',
      'ESP',
      'Airbags',
      'Direction assistée',
      'Système audio premium',
    ],
    description:
      'Porsche 911 Carrera 4 Cabrio de 2006 en bon état. Véhicule entretenu par un professionnel avec historique complet. Idéal pour les passionnés de Porsche.',
    history: [
      'Deux propriétaires',
      'Entretien professionnel',
      'Révision récente',
      'Contrôle technique valide',
    ],
    technicalSpecs: {
      engine: '6 cylindres à plat',
      displacement: '3.6L',
      acceleration: '0-100 km/h en 5.2s',
      topSpeed: '280 km/h',
      weight: '1,510 kg',
      dimensions: '4.43m x 1.80m x 1.28m',
    },
  },
  'porsche-911-carrera-mannheim': {
    id: 'porsche-911-carrera-mannheim',
    name: 'Porsche 911 Carrera',
    price: 84900,
    image:
      'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&h=600&fit=crop&crop=center',
    year: '12/2013',
    mileage: 69096,
    power: 349,
    owners: 4,
    transmission: 'Automatique',
    fuel: 'Essence',
    location: 'Mannheim, Allemagne',
    seller: 'Porsche Zentrum Mannheim',
    sellerType: 'Pro' as const,
    features: [
      'Climatisation automatique',
      'Système de navigation',
      'Sièges sport en cuir',
      'Jantes alliage 20"',
      'Régulateur de vitesse',
      'Bluetooth',
      'Toit ouvrant électrique',
      'ABS',
      'ESP',
      'Airbags frontaux et latéraux',
      'Direction assistée',
      'Freins ABS',
      'Système audio Bose',
    ],
    description:
      'Porsche 911 Carrera de 2013 en excellent état. Véhicule entretenu chez Porsche avec historique complet. Parfait pour les amateurs de sport automobile.',
    history: [
      'Quatre propriétaires successifs',
      'Entretien Porsche Center',
      'Révision complète en 2022',
      'Contrôle technique valide',
    ],
    technicalSpecs: {
      engine: '6 cylindres à plat',
      displacement: '3.4L',
      acceleration: '0-100 km/h en 4.6s',
      topSpeed: '295 km/h',
      weight: '1,540 kg',
      dimensions: '4.49m x 1.85m x 1.30m',
    },
  },
};

export default function VehiclePage() {
  const router = useRouter();
  const { id } = router.query;

  if (!id || typeof id !== 'string') {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-900 mb-4'>
            Véhicule non trouvé
          </h1>
          <Link href='/' className='text-premium-gold hover:underline'>
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  const vehicle = vehicles[id as keyof typeof vehicles];

  if (!vehicle) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-900 mb-4'>
            Véhicule non trouvé
          </h1>
          <p className='text-gray-600 mb-4'>
            Le véhicule demandé n'existe pas.
          </p>
          <Link href='/' className='text-premium-gold hover:underline'>
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return <VehicleDetail vehicle={vehicle} />;
}
