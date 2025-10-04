#!/bin/bash

# Installation du plugin headless pour Vanalexcars
# Configuration WordPress comme CMS headless pur

echo "🚀 Configuration WordPress Headless pour Vanalexcars..."

# Attendre que WordPress soit prêt
echo "⏳ Attente du démarrage de WordPress..."
sleep 10

# Créer le répertoire du plugin
echo "📁 Création du répertoire du plugin..."
docker exec vanalexcars-wp mkdir -p /var/www/html/wp-content/plugins/vanalexcars-headless

# Copier le plugin headless
echo "📦 Installation du plugin headless..."
docker cp wordpress-setup/vanalexcars-headless.php vanalexcars-wp:/var/www/html/wp-content/plugins/vanalexcars-headless/

# Copier le fichier .htaccess
echo "🔒 Configuration .htaccess..."
docker cp wordpress-setup/.htaccess-headless vanalexcars-wp:/var/www/html/.htaccess

# Activer le plugin
echo "🔌 Activation du plugin headless..."
docker exec vanalexcars-wp wp plugin activate vanalexcars-headless

# Configuration des permaliens (nécessaire pour l'API REST)
echo "🔗 Configuration des permaliens..."
docker exec vanalexcars-wp wp rewrite structure '/%postname%/'
docker exec vanalexcars-wp wp rewrite flush

# Désactiver les commentaires globalement
echo "💬 Désactivation des commentaires..."
docker exec vanalexcars-wp wp option update default_comment_status closed
docker exec vanalexcars-wp wp option update default_ping_status closed

# Optimiser la base de données
echo "🗄️ Optimisation de la base de données..."
docker exec vanalexcars-wp wp db optimize

# Vider le cache
echo "🧹 Nettoyage du cache..."
docker exec vanalexcars-wp wp cache flush

# Test de l'API REST
echo "🧪 Test de l'API REST..."
echo "Test de l'endpoint posts..."
curl -s "http://localhost:8080/index.php?rest_route=/wp/v2/posts" | head -3

echo "Test de l'endpoint véhicules..."
curl -s "http://localhost:8080/index.php?rest_route=/wp/v2/vehicles" | head -3

echo "✅ Configuration headless terminée !"
echo ""
echo "🌐 WordPress Headless: http://localhost:8080"
echo "🔧 API REST: http://localhost:8080/wp-json/wp/v2/"
echo "👤 Admin: http://localhost:8080/wp-admin"
echo "🎯 Frontend: http://localhost:3002"
echo ""
echo "📋 Endpoints disponibles:"
echo "  - Posts: /wp-json/wp/v2/posts"
echo "  - Pages: /wp-json/wp/v2/pages"
echo "  - Véhicules: /wp-json/wp/v2/vehicles"
echo "  - Témoignages: /wp-json/wp/v2/testimonials"
echo "  - FAQ: /wp-json/wp/v2/faqs"
echo "  - Services: /wp-json/wp/v2/services"
echo "  - Médias: /wp-json/wp/v2/media"
echo "  - Catégories: /wp-json/wp/v2/categories"
echo "  - Tags: /wp-json/wp/v2/tags"
echo ""
echo "🔒 Sécurité:"
echo "  - Toutes les pages publiques redirigent vers le frontend"
echo "  - Seuls l'admin et l'API REST sont accessibles"
echo "  - Assets inutiles désactivés"
echo "  - Commentaires désactivés"
