#!/bin/bash

# Installation Carbon Fields via WP-CLI
# Solution pour contourner les limites PHP

echo "🔧 Installation Carbon Fields pour Vanalexcars..."

# Attendre que WordPress soit prêt
echo "⏳ Attente du démarrage de WordPress..."
sleep 10

# Installer WP-CLI si pas déjà installé
echo "📦 Installation de WP-CLI..."
docker exec vanalexcars-wp bash -c "
if ! command -v wp &> /dev/null; then
    curl -O https://raw.githubusercontent.com/wp-cli/wp-cli/gh-pages/phar/wp-cli.phar
    chmod +x wp-cli.phar
    mv wp-cli.phar /usr/local/bin/wp
fi
"

# Télécharger Carbon Fields directement
echo "📥 Téléchargement de Carbon Fields..."
docker exec vanalexcars-wp bash -c "
cd /var/www/html/wp-content/plugins
wget https://github.com/htmlburger/carbon-fields/archive/refs/heads/master.zip -O carbon-fields.zip
unzip carbon-fields.zip
mv carbon-fields-master carbon-fields
rm carbon-fields.zip
"

# Activer Carbon Fields
echo "🔌 Activation de Carbon Fields..."
docker exec vanalexcars-wp wp plugin activate carbon-fields

# Installer les autres plugins nécessaires
echo "📦 Installation des autres plugins..."
docker exec vanalexcars-wp wp plugin install custom-post-type-ui --activate
docker exec vanalexcars-wp wp plugin install wp-rest-api-controller --activate

# Vérifier l'installation
echo "✅ Vérification de l'installation..."
docker exec vanalexcars-wp wp plugin list

echo "🎉 Installation terminée !"
echo "🌐 WordPress: http://localhost:8080"
echo "🔧 Carbon Fields est maintenant disponible dans l'admin WordPress"
