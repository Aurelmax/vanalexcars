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
        url: 'http://localhost:8080/wp-content/uploads/2025/01/bmw-m3-moteur.jpg',
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
        url: 'http://localhost:8080/wp-content/uploads/2025/01/porsche-911-interieur.jpg',
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
  if (req.method === 'GET') {
    try {
      // Simuler un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 500));

      res.status(200).json(mockVehicles);
    } catch (error) {
      console.error('Erreur API vehicles:', error);
      res
        .status(500)
        .json({ error: 'Erreur lors de la récupération des véhicules' });
    }
  } else if (req.method === 'POST') {
    try {
      const vehicleData = req.body;

      // Simuler un délai de sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Créer un nouveau véhicule avec un ID unique
      const newVehicle = {
        id: Math.max(...mockVehicles.map(v => v.id), 0) + 1,
        ...vehicleData,
        created_at: new Date().toISOString(),
        // S'assurer que la galerie est bien formatée
        gallery: vehicleData.gallery || [],
      };

      // Ajouter à la liste mockée
      mockVehicles.push(newVehicle);

      res.status(201).json(newVehicle);
    } catch (error) {
      console.error('Erreur API vehicles POST:', error);
      res.status(500).json({ error: 'Erreur lors de la création du véhicule' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ error: 'Méthode non autorisée' });
  }
}
