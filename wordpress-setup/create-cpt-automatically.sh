#!/bin/bash

# Script d'automatisation pour créer les Custom Post Types Vanalexcars
# Utilise WP-CLI pour créer les CPT directement

echo "🚀 Création automatique des Custom Post Types pour Vanalexcars..."

# Attendre que WordPress soit prêt
echo "⏳ Attente du démarrage de WordPress..."
sleep 5

# Vérifier que WP-CLI fonctionne
echo "🔍 Vérification de WP-CLI..."
docker exec vanalexcars-wp wp --info

# Créer le CPT Véhicules
echo "🚗 Création du CPT Véhicules..."
docker exec vanalexcars-wp wp post-type create vehicles \
    --label="Véhicules" \
    --singular_label="Véhicule" \
    --public=true \
    --show_in_rest=true \
    --rest_base="vehicles" \
    --supports="title,editor,thumbnail,custom-fields" \
    --menu_icon="dashicons-car" \
    --menu_position=5

# Créer le CPT Témoignages
echo "💬 Création du CPT Témoignages..."
docker exec vanalexcars-wp wp post-type create testimonials \
    --label="Témoignages" \
    --singular_label="Témoignage" \
    --public=true \
    --show_in_rest=true \
    --rest_base="testimonials" \
    --supports="title,editor,custom-fields" \
    --menu_icon="dashicons-format-quote" \
    --menu_position=6

# Créer le CPT FAQ
echo "❓ Création du CPT FAQ..."
docker exec vanalexcars-wp wp post-type create faqs \
    --label="FAQ" \
    --singular_label="FAQ" \
    --public=true \
    --show_in_rest=true \
    --rest_base="faqs" \
    --supports="title,editor,custom-fields" \
    --menu_icon="dashicons-editor-help" \
    --menu_position=7

# Créer le CPT Services
echo "🔧 Création du CPT Services..."
docker exec vanalexcars-wp wp post-type create services \
    --label="Services" \
    --singular_label="Service" \
    --public=true \
    --show_in_rest=true \
    --rest_base="services" \
    --supports="title,editor,custom-fields" \
    --menu_icon="dashicons-admin-tools" \
    --menu_position=8

# Créer les taxonomies pour les véhicules
echo "🏷️ Création des taxonomies..."

# Marques de véhicules
docker exec vanalexcars-wp wp taxonomy create vehicle_brand \
    --label="Marques de Véhicules" \
    --singular_label="Marque" \
    --public=true \
    --show_in_rest=true \
    --object_type="vehicles"

# Types de véhicules
docker exec vanalexcars-wp wp taxonomy create vehicle_type \
    --label="Types de Véhicules" \
    --singular_label="Type" \
    --public=true \
    --show_in_rest=true \
    --object_type="vehicles"

# Catégories de FAQ
docker exec vanalexcars-wp wp taxonomy create faq_category \
    --label="Catégories FAQ" \
    --singular_label="Catégorie FAQ" \
    --public=true \
    --show_in_rest=true \
    --object_type="faqs"

# Catégories de services
docker exec vanalexcars-wp wp taxonomy create service_category \
    --label="Catégories de Services" \
    --singular_label="Catégorie de Service" \
    --public=true \
    --show_in_rest=true \
    --object_type="services"

# Vider le cache
echo "🧹 Nettoyage du cache..."
docker exec vanalexcars-wp wp cache flush

# Test des endpoints API
echo "🧪 Test des endpoints API..."

echo "Test véhicules..."
curl -s "http://localhost:8080/index.php?rest_route=/wp/v2/vehicles" | head -3

echo "Test témoignages..."
curl -s "http://localhost:8080/index.php?rest_route=/wp/v2/testimonials" | head -3

echo "Test FAQ..."
curl -s "http://localhost:8080/index.php?rest_route=/wp/v2/faqs" | head -3

echo "Test services..."
curl -s "http://localhost:8080/index.php?rest_route=/wp/v2/services" | head -3

echo "✅ Configuration automatique terminée !"
echo ""
echo "🎯 Custom Post Types créés :"
echo "  - Véhicules: /wp-json/wp/v2/vehicles"
echo "  - Témoignages: /wp-json/wp/v2/testimonials"
echo "  - FAQ: /wp-json/wp/v2/faqs"
echo "  - Services: /wp-json/wp/v2/services"
echo ""
echo "🏷️ Taxonomies créées :"
echo "  - Marques de véhicules"
echo "  - Types de véhicules"
echo "  - Catégories FAQ"
echo "  - Catégories de services"
echo ""
echo "🌐 Admin WordPress: http://localhost:8080/wp-admin/"
echo "🔧 API REST: http://localhost:8080/index.php?rest_route=/wp/v2/"
