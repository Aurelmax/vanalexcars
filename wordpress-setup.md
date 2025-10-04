# Configuration WordPress Headless pour Vanalexcars

## 🎯 Objectif

Configurer WordPress comme CMS headless pour gérer le contenu de Vanalexcars (véhicules, FAQ, témoignages, blog).

## 📋 Structure WordPress Nécessaire

### 1. **Custom Post Types**

- `vehicles` - Véhicules disponibles
- `testimonials` - Témoignages clients
- `faqs` - Questions fréquentes
- `services` - Services proposés

### 2. **Custom Fields (ACF)**

- Prix, kilométrage, année, etc. pour les véhicules
- Note, véhicule acheté pour les témoignages
- Catégorie pour les FAQ

### 3. **Taxonomies**

- `vehicle_brand` - Marques de véhicules
- `vehicle_type` - Types de véhicules
- `faq_category` - Catégories FAQ

## 🔧 Configuration Requise

### Plugins Nécessaires

1. **Advanced Custom Fields (ACF)**
2. **Custom Post Type UI**
3. **WP REST API Controller**
4. **CORS Headers**
5. **JWT Authentication**

### Configuration API REST

- Activer l'API REST
- Configurer CORS pour le frontend
- Authentification JWT
- Endpoints personnalisés

## 📊 Structure de Contenu

### Véhicules

```json
{
  "id": 123,
  "title": "Porsche 911 Carrera",
  "content": "Description complète...",
  "meta": {
    "price": 87900,
    "year": "2019",
    "mileage": 42579,
    "power": 400,
    "transmission": "Automatique",
    "fuel": "Essence",
    "location": "Grünwald, Allemagne",
    "seller_type": "Pro",
    "features": ["Climatisation", "GPS", "Cuir"],
    "images": ["url1", "url2"]
  }
}
```

### Témoignages

```json
{
  "id": 124,
  "title": "Marc Dubois",
  "content": "Service exceptionnel !",
  "meta": {
    "rating": 5,
    "vehicle": "Porsche 911",
    "location": "Nice",
    "verified": true,
    "date": "2024-01-15"
  }
}
```

## 🚀 Étapes d'Installation

### Option 1: WordPress Local

1. Télécharger WordPress Local
2. Créer un nouveau site "Vanalexcars"
3. Installer les plugins requis
4. Configurer la structure

### Option 2: Docker

```yaml
version: '3.8'
services:
  wordpress:
    image: wordpress:latest
    ports:
      - '8080:80'
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_USER: wordpress
      WORDPRESS_DB_PASSWORD: wordpress
      WORDPRESS_DB_NAME: wordpress
    volumes:
      - wordpress_data:/var/www/html

  db:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wordpress
      MYSQL_PASSWORD: wordpress
      MYSQL_ROOT_PASSWORD: rootpassword
    volumes:
      - db_data:/var/lib/mysql

volumes:
  wordpress_data:
  db_data:
```

## 🔗 Configuration Frontend

### Variables d'environnement

```env
NEXT_PUBLIC_WORDPRESS_URL=http://localhost:8080
NEXT_PUBLIC_WORDPRESS_API_URL=http://localhost:8080/wp-json/wp/v2
```

### Endpoints API

- `/wp-json/wp/v2/vehicles` - Véhicules
- `/wp-json/wp/v2/testimonials` - Témoignages
- `/wp-json/wp/v2/faqs` - FAQ
- `/wp-json/wp/v2/posts` - Blog

## 📝 Prochaines Étapes

1. **Installer WordPress** (choisir l'option)
2. **Configurer les Custom Post Types**
3. **Installer et configurer ACF**
4. **Créer la structure de contenu**
5. **Tester l'API REST**
6. **Connecter le frontend**

## 🎯 Résultat Attendu

WordPress fonctionnant comme CMS headless avec :

- ✅ API REST configurée
- ✅ Custom Post Types créés
- ✅ CORS configuré
- ✅ Contenu structuré
- ✅ Frontend connecté
