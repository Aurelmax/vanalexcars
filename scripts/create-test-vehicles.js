import fetch from 'node-fetch';

const testVehicles = [
  {
    title: 'Porsche 911 Carrera 4S',
    content: 'Véhicule de prestige en excellent état',
    status: 'publish',
    meta: {
      price: '€ 89 900',
      year: 2022,
      mileage: '12 500 km',
      location: 'Antibes',
      fuel_type: 'Essence',
      transmission: 'Automatique',
      power: '450 ch',
      is_featured: true,
      is_new: false,
      image_url:
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80',
    },
  },
  {
    title: 'BMW M3 Competition',
    content: 'Véhicule neuf avec toutes les options',
    status: 'publish',
    meta: {
      price: '€ 95 000',
      year: 2023,
      mileage: '8 200 km',
      location: 'Nice',
      fuel_type: 'Essence',
      transmission: 'Automatique',
      power: '510 ch',
      is_featured: false,
      is_new: true,
      image_url:
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80',
    },
  },
  {
    title: 'Mercedes-AMG GT 63S',
    content: 'Véhicule de sport haut de gamme',
    status: 'publish',
    meta: {
      price: '€ 125 000',
      year: 2022,
      mileage: '15 200 km',
      location: 'Monaco',
      fuel_type: 'Essence',
      transmission: 'Automatique',
      power: '630 ch',
      is_featured: true,
      is_new: false,
      image_url:
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80',
    },
  },
  {
    title: 'Audi RS6 Avant',
    content: 'Break de sport familial',
    status: 'publish',
    meta: {
      price: '€ 78 500',
      year: 2021,
      mileage: '25 800 km',
      location: 'Cannes',
      fuel_type: 'Essence',
      transmission: 'Automatique',
      power: '600 ch',
      is_featured: false,
      is_new: false,
      image_url:
        'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80',
    },
  },
];

async function createVehicles() {
  const baseUrl = 'http://localhost:8080/wp-json/wp/v2';

  for (const vehicle of testVehicles) {
    try {
      console.log(`Création du véhicule: ${vehicle.title}`);

      // Créer le post
      const postResponse = await fetch(`${baseUrl}/vehicules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: vehicle.title,
          content: vehicle.content,
          status: vehicle.status,
        }),
      });

      if (!postResponse.ok) {
        const error = await postResponse.text();
        console.error(`Erreur lors de la création du post: ${error}`);
        continue;
      }

      const post = await postResponse.json();
      console.log(`Post créé avec l'ID: ${post.id}`);

      // Ajouter les meta fields
      for (const [key, value] of Object.entries(vehicle.meta)) {
        const metaResponse = await fetch(`${baseUrl}/vehicules/${post.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            meta: {
              [key]: value,
            },
          }),
        });

        if (!metaResponse.ok) {
          const error = await metaResponse.text();
          console.error(`Erreur lors de l'ajout du meta ${key}: ${error}`);
        } else {
          console.log(`Meta ${key} ajouté`);
        }
      }
    } catch (error) {
      console.error(`Erreur pour ${vehicle.title}:`, error.message);
    }
  }
}

createVehicles()
  .then(() => {
    console.log('Création des véhicules terminée');
  })
  .catch(console.error);
