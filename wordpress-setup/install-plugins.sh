#!/bin/bash

# Script d'installation des plugins WordPress pour Vanalexcars
# Headless CMS Configuration

echo "🔌 Installation des plugins WordPress pour Vanalexcars..."

# Attendre que WordPress soit prêt
echo "⏳ Attente du démarrage de WordPress..."
sleep 30

# Installation des plugins via WP-CLI
docker exec vanalexcars-wp wp plugin install carbon-fields --activate
docker exec vanalexcars-wp wp plugin install custom-post-type-ui --activate
docker exec vanalexcars-wp wp plugin install wp-rest-api-controller --activate
docker exec vanalexcars-wp wp plugin install jwt-authentication-for-wp-rest-api --activate
docker exec vanalexcars-wp wp plugin install cors --activate

# Configuration des Custom Post Types
echo "📝 Configuration des Custom Post Types..."

# Véhicules
docker exec vanalexcars-wp wp post-type create vehicles \
  --label="Véhicules" \
  --singular_label="Véhicule" \
  --public=true \
  --show_in_rest=true \
  --rest_base="vehicles" \
  --supports="title,editor,thumbnail,custom-fields"

# Témoignages
docker exec vanalexcars-wp wp post-type create testimonials \
  --label="Témoignages" \
  --singular_label="Témoignage" \
  --public=true \
  --show_in_rest=true \
  --rest_base="testimonials" \
  --supports="title,editor,custom-fields"

# FAQ
docker exec vanalexcars-wp wp post-type create faqs \
  --label="FAQ" \
  --singular_label="FAQ" \
  --public=true \
  --show_in_rest=true \
  --rest_base="faqs" \
  --supports="title,editor,custom-fields"

# Services
docker exec vanalexcars-wp wp post-type create services \
  --label="Services" \
  --singular_label="Service" \
  --public=true \
  --show_in_rest=true \
  --rest_base="services" \
  --supports="title,editor,custom-fields"

# Configuration des taxonomies
echo "🏷️ Configuration des taxonomies..."

# Marques de véhicules
docker exec vanalexcars-wp wp taxonomy create vehicle_brand \
  --label="Marques" \
  --singular_label="Marque" \
  --public=true \
  --show_in_rest=true \
  --object_type="vehicles"

# Types de véhicules
docker exec vanalexcars-wp wp taxonomy create vehicle_type \
  --label="Types" \
  --singular_label="Type" \
  --public=true \
  --show_in_rest=true \
  --object_type="vehicles"

# Catégories FAQ
docker exec vanalexcars-wp wp taxonomy create faq_category \
  --label="Catégories FAQ" \
  --singular_label="Catégorie FAQ" \
  --public=true \
  --show_in_rest=true \
  --object_type="faqs"

# Copier la configuration Carbon Fields
echo "🔧 Configuration Carbon Fields..."
docker cp wordpress-setup/carbon-fields-config.php vanalexcars-wp:/var/www/html/wp-content/themes/twentytwentyfour/functions.php

# Créer un thème personnalisé pour Vanalexcars
docker exec vanalexcars-wp wp theme install twentytwentyfour --activate

# Configuration finale
echo "🎯 Configuration finale..."

# Créer un utilisateur admin
docker exec vanalexcars-wp wp user create admin admin@vanalexcars.com --role=administrator --user_pass=admin123

# Configurer les permalinks
docker exec vanalexcars-wp wp rewrite structure '/%postname%/'

# Vider le cache
docker exec vanalexcars-wp wp cache flush

echo "✅ Configuration terminée !"
echo "🌐 WordPress: http://localhost:8080"
echo "📊 phpMyAdmin: http://localhost:8081"
echo "🔧 API REST: http://localhost:8080/wp-json/wp/v2/"
echo "👤 Admin: admin / admin123"
echo ""
echo "📋 Endpoints disponibles:"
echo "  - Véhicules: /wp-json/wp/v2/vehicles"
echo "  - Témoignages: /wp-json/wp/v2/testimonials"
echo "  - FAQ: /wp-json/wp/v2/faqs"
echo "  - Services: /wp-json/wp/v2/services"
echo "  - Blog: /wp-json/wp/v2/posts"
