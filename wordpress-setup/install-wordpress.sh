#!/bin/bash

echo "🚀 Installation de WordPress pour Vanalexcars..."

# Attendre que la base de données soit prête
echo "⏳ Attente de la base de données..."
sleep 10

# Vérifier si WordPress est déjà installé
if docker-compose exec -T vanalexcars-wp wp core is-installed --allow-root 2>/dev/null; then
    echo "✅ WordPress est déjà installé"
else
    echo "📦 Installation de WordPress..."
    
    # Installer WordPress
    docker-compose exec -T vanalexcars-wp wp core install \
        --url="http://localhost:8080" \
        --title="Vanalexcars" \
        --admin_user="admin" \
        --admin_password="admin" \
        --admin_email="admin@vanalexcars.com" \
        --allow-root
    
    echo "✅ WordPress installé avec succès"
fi

# Installer les plugins nécessaires
echo "🔌 Installation des plugins..."

# Plugin pour les Custom Post Types
docker-compose exec -T vanalexcars-wp wp plugin install custom-post-type-ui --activate --allow-root

# Plugin pour l'API REST
docker-compose exec -T vanalexcars-wp wp plugin install wp-rest-api-controller --activate --allow-root

# Plugin pour CORS
docker-compose exec -T vanalexcars-wp wp plugin install cors --activate --allow-root

echo "✅ Plugins installés"

# Créer les Custom Post Types
echo "📝 Création des Custom Post Types..."

# Véhicules
docker-compose exec -T vanalexcars-wp wp post-type create vehicles \
    --label="Véhicules" \
    --singular="Véhicule" \
    --public \
    --show-in-rest \
    --allow-root

# Témoignages
docker-compose exec -T vanalexcars-wp wp post-type create testimonials \
    --label="Témoignages" \
    --singular="Témoignage" \
    --public \
    --show-in-rest \
    --allow-root

# FAQ
docker-compose exec -T vanalexcars-wp wp post-type create faqs \
    --label="FAQ" \
    --singular="FAQ" \
    --public \
    --show-in-rest \
    --allow-root

# Services
docker-compose exec -T vanalexcars-wp wp post-type create services \
    --label="Services" \
    --singular="Service" \
    --public \
    --show-in-rest \
    --allow-root

# Form Submissions
docker-compose exec -T vanalexcars-wp wp post-type create form-submissions \
    --label="Soumissions de Formulaires" \
    --singular="Soumission de Formulaire" \
    --public \
    --show-in-rest \
    --allow-root

echo "✅ Custom Post Types créés"

# Configurer les permalinks
echo "🔗 Configuration des permalinks..."
docker-compose exec -T vanalexcars-wp wp rewrite structure '/%postname%/' --allow-root
docker-compose exec -T vanalexcars-wp wp rewrite flush --allow-root

echo "✅ Permalinks configurés"

# Tester l'API REST
echo "🧪 Test de l'API REST..."
if curl -s http://localhost:8080/wp-json/wp/v2/posts > /dev/null; then
    echo "✅ API REST fonctionnelle"
else
    echo "❌ Problème avec l'API REST"
fi

echo "🎉 Installation terminée !"
echo "🌐 WordPress: http://localhost:8080"
echo "🔧 Admin: http://localhost:8080/wp-admin (admin/admin)"
echo "📊 phpMyAdmin: http://localhost:8081"
echo "🔌 API REST: http://localhost:8080/wp-json/wp/v2/"
