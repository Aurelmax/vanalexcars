# 🔗 Guide - URLs Personnalisées pour les Véhicules

## 🎯 **Objectif : URLs Conviviales**

### **URLs Actuelles :**

- `http://localhost:3000/vehicule/1` (BMW M3 Competition)
- `http://localhost:3000/vehicule/2` (Porsche 911 Carrera 4S)

### **URLs Personnalisées Souhaitées :**

- `http://localhost:3000/vehicule/bmw-m3-competition-2023`
- `http://localhost:3000/vehicule/porsche-911-carrera-4s-2022`

## 🚀 **Méthodes de Personnalisation**

### **Méthode 1 : Slug dans l'API (Recommandée)**

**1. Modifier les données dans l'API :**

```typescript
// pages/api/vehicles/index.ts et [id].ts
let mockVehicles = [
  {
    id: 1,
    slug: 'bmw-m3-competition-2023', // ← Ajouter le slug
    title: 'BMW M3 Competition 2023',
    // ... autres propriétés
  },
  {
    id: 2,
    slug: 'porsche-911-carrera-4s-2022', // ← Ajouter le slug
    title: 'Porsche 911 Carrera 4S 2022',
    // ... autres propriétés
  },
];
```

**2. Modifier la page dynamique :**

```typescript
// pages/vehicule/[slug].tsx (renommer le fichier)
export default function VehiclePage() {
  const router = useRouter();
  const { slug } = router.query; // ← Utiliser slug au lieu de id

  useEffect(() => {
    const fetchVehicle = async () => {
      if (!slug || typeof slug !== 'string') return;

      try {
        setLoading(true);
        // Récupérer par slug au lieu d'ID
        const response = await fetch(`/api/vehicles/slug/${slug}`);
        // ... reste du code
      } catch (err) {
        // ... gestion d'erreur
      }
    };

    fetchVehicle();
  }, [slug]);
}
```

**3. Créer une nouvelle API route :**

```typescript
// pages/api/vehicles/slug/[slug].ts
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { slug } = req.query;

  if (req.method === 'GET') {
    try {
      const vehicle = mockVehicles.find(v => v.slug === slug);

      if (!vehicle) {
        return res.status(404).json({ error: 'Véhicule non trouvé' });
      }

      res.status(200).json(vehicle);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération' });
    }
  }
}
```

### **Méthode 2 : Redirection avec Rewrites**

**1. Configuration Next.js :**

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/vehicule/:slug',
        destination: '/vehicule/:slug',
      },
    ];
  },
  // ... reste de la config
};
```

**2. Page avec slug :**

```typescript
// pages/vehicule/[slug].tsx
export default function VehiclePage() {
  const router = useRouter();
  const { slug } = router.query;

  // Logique pour récupérer le véhicule par slug
  // ...
}
```

### **Méthode 3 : Génération Automatique de Slugs**

**1. Fonction de génération de slug :**

```typescript
// utils/slug.ts
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Supprimer caractères spéciaux
    .replace(/\s+/g, '-') // Remplacer espaces par tirets
    .replace(/-+/g, '-') // Supprimer tirets multiples
    .trim();
}

// Exemple d'utilisation :
// "BMW M3 Competition 2023" → "bmw-m3-competition-2023"
```

**2. Intégration dans l'API :**

```typescript
// pages/api/vehicles/index.ts
import { generateSlug } from '../../utils/slug';

let mockVehicles = [
  {
    id: 1,
    title: 'BMW M3 Competition 2023',
    slug: generateSlug('BMW M3 Competition 2023'), // ← Génération automatique
    // ... autres propriétés
  },
];
```

## 🔧 **Implémentation Complète**

### **Étape 1 : Ajouter les Slugs aux Données**

```typescript
// pages/api/vehicles/index.ts et [id].ts
let mockVehicles = [
  {
    id: 1,
    slug: 'bmw-m3-competition-2023',
    title: 'BMW M3 Competition 2023',
    // ... autres propriétés
  },
  {
    id: 2,
    slug: 'porsche-911-carrera-4s-2022',
    title: 'Porsche 911 Carrera 4S 2022',
    // ... autres propriétés
  },
];
```

### **Étape 2 : Créer l'API Route pour les Slugs**

```typescript
// pages/api/vehicles/slug/[slug].ts
import { NextApiRequest, NextApiResponse } from 'next';

// Import des données (même source que [id].ts)
let mockVehicles = [
  // ... vos données avec slugs
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { slug } = req.query;

  if (req.method === 'GET') {
    try {
      const vehicle = mockVehicles.find(v => v.slug === slug);

      if (!vehicle) {
        return res.status(404).json({ error: 'Véhicule non trouvé' });
      }

      res.status(200).json(vehicle);
    } catch (error) {
      console.error('Erreur API vehicles slug:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: 'Méthode non autorisée' });
  }
}
```

### **Étape 3 : Renommer et Modifier la Page**

```typescript
// pages/vehicule/[slug].tsx (renommer de [id].tsx)
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import VehicleDetail from '../../components/VehicleDetail';

export default function VehiclePage() {
  const router = useRouter();
  const { slug } = router.query; // ← Utiliser slug
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicle = async () => {
      if (!slug || typeof slug !== 'string') return;

      try {
        setLoading(true);
        const response = await fetch(`/api/vehicles/slug/${slug}`); // ← API par slug
        if (!response.ok) {
          if (response.status === 404) {
            setError('Véhicule non trouvé');
          } else {
            throw new Error('Erreur lors du chargement du véhicule');
          }
        } else {
          const data = await response.json();
          setVehicle(data);
        }
      } catch (err) {
        console.error('Erreur lors du chargement du véhicule:', err);
        setError('Erreur lors du chargement du véhicule');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [slug]);

  // ... reste du code identique
}
```

### **Étape 4 : Mettre à Jour les Liens**

```typescript
// components/VehicleGrid.tsx
<Link
  href={`/vehicule/${vehicle.slug}`} // ← Utiliser slug au lieu d'ID
  className='block w-full bg-premium-gold text-premium-black text-center py-2 px-4 rounded font-semibold hover:bg-yellow-400 transition-colors duration-300'
>
  Voir les détails
</Link>
```

## 🎯 **Avantages des URLs Personnalisées**

### **SEO et Référencement :**

- **URLs descriptives** : Plus faciles à comprendre
- **Mots-clés** : Inclus dans l'URL
- **Partage** : Plus attractives sur les réseaux sociaux

### **Expérience Utilisateur :**

- **Lisibilité** : URLs plus claires
- **Mémorisation** : Plus faciles à retenir
- **Navigation** : Plus intuitives

### **Maintenance :**

- **Flexibilité** : Possibilité de changer les slugs
- **Redirection** : Gestion des anciennes URLs
- **Analytics** : Meilleur suivi des pages

## 🔄 **Migration des URLs Existantes**

### **Redirection des Anciennes URLs :**

```typescript
// pages/vehicule/[id].tsx (garder pour compatibilité)
export default function VehiclePage() {
  const router = useRouter();
  const { id } = router.query;

  // Rediriger vers la nouvelle URL avec slug
  useEffect(() => {
    if (id) {
      // Récupérer le slug correspondant à l'ID
      fetch(`/api/vehicles/${id}`)
        .then(res => res.json())
        .then(vehicle => {
          router.replace(`/vehicule/${vehicle.slug}`);
        });
    }
  }, [id, router]);

  return <div>Redirection...</div>;
}
```

## 🎉 **Résultat Final**

**URLs Personnalisées Opérationnelles :**

- ✅ **URLs descriptives** : `/vehicule/bmw-m3-competition-2023`
- ✅ **SEO optimisé** : Mots-clés dans l'URL
- ✅ **Expérience utilisateur** : URLs plus claires
- ✅ **Compatibilité** : Redirection des anciennes URLs
- ✅ **Maintenance** : Gestion flexible des slugs

**Vos URLs sont maintenant personnalisées !** 🚗✨

**Exemples d'URLs :**

- **BMW M3** : `http://localhost:3000/vehicule/bmw-m3-competition-2023`
- **Porsche 911** : `http://localhost:3000/vehicule/porsche-911-carrera-4s-2022`
