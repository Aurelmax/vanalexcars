# 🚗 Guide de Remplacement des Données

## 📝 **Comment Remplacer par Vos Véhicules Réels**

### **1. Accédez aux Fichiers de Données**

Vous devez modifier ces deux fichiers :

- `pages/api/vehicles/index.ts`
- `pages/api/vehicles/[id].ts`

### **2. Remplacez les Informations de Base**

Pour chaque véhicule, remplacez :

```javascript
{
  id: 1, // Gardez l'ID unique
  title: 'Votre Premier Véhicule', // ← Remplacez par le nom réel
  content: 'Description de votre premier véhicule...', // ← Description réelle
  price: 0, // ← Prix réel en euros
  year: 2024, // ← Année réelle
  mileage: 0, // ← Kilométrage réel
  location: 'Votre Ville', // ← Votre ville
  fuel_type: 'Essence', // ← Type de carburant (Essence/Diesel/Électrique/Hybride)
  transmission: 'Automatique', // ← Transmission (Manuelle/Automatique/Semi-automatique)
  power: '0 ch', // ← Puissance réelle
  description: 'Description détaillée de votre véhicule.', // ← Description détaillée
  is_featured: false, // ← true si c'est un véhicule vedette
  is_new: true, // ← true si c'est neuf
  is_sold: false, // ← true si c'est vendu
}
```

### **3. Ajoutez Vos Images**

#### **Image Principale :**

```javascript
featured_image: {
  id: 1,
  url: 'URL_DE_VOTRE_IMAGE', // ← URL de votre image principale
  alt: 'Nom de votre véhicule', // ← Description de l'image
},
```

#### **Galerie d'Images :**

```javascript
gallery: [
  {
    id: 1,
    url: 'URL_DE_VOTRE_IMAGE_1', // ← URL de votre première image
    alt: 'Description de l\'image 1', // ← Description
    order: 1, // ← Ordre d'affichage
  },
  {
    id: 2,
    url: 'URL_DE_VOTRE_IMAGE_2', // ← URL de votre deuxième image
    alt: 'Description de l\'image 2', // ← Description
    order: 2, // ← Ordre d'affichage
  },
  // Ajoutez autant d'images que nécessaire
],
```

## 🖼️ **Comment Ajouter Vos Images**

### **Option 1 : Images en Ligne**

Si vos images sont déjà en ligne :

```javascript
url: 'https://votre-site.com/images/voiture1.jpg';
```

### **Option 2 : Images Locales**

Si vous voulez utiliser des images locales :

1. Placez vos images dans le dossier `public/images/`
2. Utilisez l'URL relative :

```javascript
url: '/images/voiture1.jpg';
```

### **Option 3 : Images WordPress**

Si vous utilisez WordPress :

```javascript
url: 'http://localhost:8080/wp-content/uploads/2025/01/votre-image.jpg';
```

## 📋 **Exemple Complet**

Voici un exemple avec des données réelles :

```javascript
{
  id: 1,
  title: 'BMW M3 Competition 2023',
  content: 'BMW M3 Competition neuve, livrée directement du concessionnaire. Performance et confort au rendez-vous.',
  price: 95000,
  year: 2023,
  mileage: 8200,
  location: 'Nice',
  fuel_type: 'Essence',
  transmission: 'Automatique',
  power: '510 ch',
  description: 'BMW M3 Competition neuve, livrée directement du concessionnaire. Performance et confort au rendez-vous.',
  is_featured: true, // Véhicule vedette
  is_new: true,
  is_sold: false,
  image_url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e',
  featured_image: {
    id: 1,
    url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e',
    alt: 'BMW M3 Competition 2023',
  },
  gallery: [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e',
      alt: 'BMW M3 Competition - Vue avant',
      order: 1,
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1549317336-206569e8475c',
      alt: 'BMW M3 Competition - Intérieur',
      order: 2,
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e',
      alt: 'BMW M3 Competition - Moteur',
      order: 3,
    },
  ],
}
```

## 🔧 **Étapes de Remplacement**

### **1. Ouvrez les Fichiers**

```bash
# Ouvrez ces fichiers dans votre éditeur
pages/api/vehicles/index.ts
pages/api/vehicles/[id].ts
```

### **2. Remplacez les Données**

- Modifiez les informations de base (titre, prix, année, etc.)
- Ajoutez vos URLs d'images
- Définissez les statuts (vedette, neuf, vendu)

### **3. Testez l'Interface**

```bash
# Vérifiez que l'interface se charge
curl http://localhost:3000/admin-vehicles
```

### **4. Vérifiez l'API**

```bash
# Vérifiez que l'API retourne vos données
curl http://localhost:3000/api/vehicles
```

## 🎯 **Conseils**

### **Pour les Images :**

- **Format** : JPG, PNG, WEBP recommandés
- **Taille** : Optimisez pour le web (max 2MB)
- **Résolution** : 1200x800px minimum
- **Qualité** : Images nettes et bien éclairées

### **Pour les Descriptions :**

- **Titre** : Court et accrocheur
- **Description** : Détails techniques et avantages
- **Localisation** : Ville ou région
- **Prix** : Prix net en euros

### **Pour les Statuts :**

- **is_featured: true** : Pour vos meilleures offres
- **is_new: true** : Pour les véhicules neufs
- **is_sold: true** : Pour les véhicules vendus

## 🚀 **Après le Remplacement**

Une fois vos données remplacées :

1. **Testez l'interface** : `http://localhost:3000/admin-vehicles`
2. **Vérifiez les images** : Elles doivent s'afficher correctement
3. **Testez les fonctionnalités** : Upload, suppression, réorganisation
4. **Sauvegardez** : Vos modifications sont automatiquement sauvegardées

---

## 🎉 **Résultat Final**

Vous aurez maintenant :

- ✅ **Vos véhicules réels** dans l'interface
- ✅ **Vos images** dans la galerie
- ✅ **Vos informations** correctes
- ✅ **Interface fonctionnelle** pour la gestion

**Votre interface d'administration est prête avec vos données !** 🚗✨
