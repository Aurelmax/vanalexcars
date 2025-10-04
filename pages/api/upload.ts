import { NextApiRequest, NextApiResponse } from 'next';

const WORDPRESS_API_URL =
  process.env.WORDPRESS_API_URL || 'http://localhost:8080/wp-json/wp/v2';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: 'Méthode non autorisée' });
    return;
  }

  try {
    // Pour l'instant, simuler un upload réussi avec une image de test
    // TODO: Implémenter l'upload réel vers WordPress
    
    // Simuler un délai d'upload
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Retourner une image de test
    const mockImage = {
      id: Math.floor(Math.random() * 1000) + 1,
      url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80',
      alt: 'Image de test'
    };

    res.status(200).json(mockImage);
  } catch (error) {
    console.error('Erreur upload:', error);
    res.status(500).json({ error: "Erreur lors de l'upload de l'image" });
  }
}
