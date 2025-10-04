import { NextApiRequest, NextApiResponse } from 'next';

// Vos véhicules réels - Remplacez par vos données
const mockVehicles = [
  {
    id: 1,
    slug: 'bmw-m3-competition-2023',
    title: 'BMW M3 Competition 2023',
    content:
      'BMW M3 Competition neuve, livrée directement du concessionnaire. Performance et confort au rendez-vous avec son moteur 6 cylindres en ligne de 510 chevaux.',
    price: 95000,
    year: 2023,
    mileage: 8200,
    location: 'Nice',
    fuel_type: 'Essence',
    transmission: 'Automatique',
    power: '510 ch',
    description:
      'BMW M3 Competition neuve, livrée directement du concessionnaire. Performance et confort au rendez-vous avec son moteur 6 cylindres en ligne de 510 chevaux.',
    is_featured: true,
    is_new: true,
    is_sold: false,
    image_url:
      'http://localhost:8080/wp-content/uploads/2025/01/bmw-m3-competition.jpg',
    featured_image: {
      id: 1,
      url: 'http://localhost:8080/wp-content/uploads/2025/01/bmw-m3-competition.jpg',
      alt: 'BMW M3 Competition 2023',
    },
    gallery: [
      {
        id: 1,
        url: 'http://localhost:8080/wp-content/uploads/2025/01/bmw-m3-competition.jpg',
        alt: 'BMW M3 Competition - Vue avant',
        order: 1,
      },
      {
        id: 2,
        url: 'http://localhost:8080/wp-content/uploads/2025/01/bmw-m3-interieur.jpg',
        alt: 'BMW M3 Competition - Intérieur',
        order: 2,
      },
      {
        id: 3,
        url: 'http://localhost:8080/wp-content/uploads/2025/01/bmw-m3-competition.jpg',
        alt: 'BMW M3 Competition - Moteur',
        order: 3,
      },
    ],
  },
  {
    id: 2,
    slug: 'porsche-911-carrera-4s-2022',
    title: 'Porsche 911 Carrera 4S 2022',
    content:
      'Porsche 911 Carrera 4S en excellent état, parfaitement entretenu. Véhicule vedette de notre collection avec sa transmission intégrale et son moteur flat-6.',
    price: 89900,
    year: 2022,
    mileage: 12500,
    location: 'Antibes',
    fuel_type: 'Essence',
    transmission: 'Automatique',
    power: '450 ch',
    description:
      'Porsche 911 Carrera 4S en excellent état, parfaitement entretenu. Véhicule vedette de notre collection avec sa transmission intégrale et son moteur flat-6.',
    is_featured: false,
    is_new: false,
    is_sold: false,
    image_url:
      'http://localhost:8080/wp-content/uploads/2025/01/porsche-911-carrera-4s.jpg',
    featured_image: {
      id: 4,
      url: 'http://localhost:8080/wp-content/uploads/2025/01/porsche-911-carrera-4s.jpg',
      alt: 'Porsche 911 Carrera 4S 2022',
    },
    gallery: [
      {
        id: 4,
        url: 'http://localhost:8080/wp-content/uploads/2025/01/porsche-911-carrera-4s.jpg',
        alt: 'Porsche 911 Carrera 4S - Vue latérale',
        order: 1,
      },
      {
        id: 5,
        url: 'http://localhost:8080/wp-content/uploads/2025/01/bmw-m3-interieur.jpg',
        alt: 'Porsche 911 Carrera 4S - Intérieur sport',
        order: 2,
      },
    ],
  },
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const vehicleId = parseInt(id as string);

  if (req.method === 'PUT') {
    try {
      const vehicleData = req.body;

      // Simuler un délai de mise à jour
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Trouver et mettre à jour le véhicule
      const vehicleIndex = mockVehicles.findIndex(v => v.id === vehicleId);

      if (vehicleIndex === -1) {
        return res.status(404).json({ error: 'Véhicule non trouvé' });
      }

      // Mettre à jour le véhicule avec la galerie
      mockVehicles[vehicleIndex] = {
        ...mockVehicles[vehicleIndex],
        ...vehicleData,
        // S'assurer que la galerie est bien formatée
        gallery:
          vehicleData.gallery || mockVehicles[vehicleIndex].gallery || [],
        updated_at: new Date().toISOString(),
      };

      res.status(200).json(mockVehicles[vehicleIndex]);
    } catch (error) {
      console.error('Erreur API vehicles PUT:', error);
      res
        .status(500)
        .json({ error: 'Erreur lors de la mise à jour du véhicule' });
    }
  } else if (req.method === 'DELETE') {
    try {
      // Simuler un délai de suppression
      await new Promise(resolve => setTimeout(resolve, 500));

      // Trouver et supprimer le véhicule
      const vehicleIndex = mockVehicles.findIndex(v => v.id === vehicleId);

      if (vehicleIndex === -1) {
        return res.status(404).json({ error: 'Véhicule non trouvé' });
      }

      // Supprimer le véhicule
      mockVehicles.splice(vehicleIndex, 1);

      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Erreur API vehicles DELETE:', error);
      res
        .status(500)
        .json({ error: 'Erreur lors de la suppression du véhicule' });
    }
  } else if (req.method === 'GET') {
    try {
      // Simuler un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 500));

      // Trouver le véhicule par ID
      const vehicle = mockVehicles.find(v => v.id === vehicleId);

      if (!vehicle) {
        return res.status(404).json({ error: 'Véhicule non trouvé' });
      }

      res.status(200).json(vehicle);
    } catch (error) {
      console.error('Erreur API vehicles GET:', error);
      res
        .status(500)
        .json({ error: 'Erreur lors de la récupération du véhicule' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).json({ error: 'Méthode non autorisée' });
  }
}
