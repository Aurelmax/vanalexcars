#!/bin/bash

# Script d'installation WordPress pour Vanalexcars
# Headless CMS Setup

echo "🚀 Installation WordPress pour Vanalexcars..."

# Vérifier les prérequis
if ! command -v php &> /dev/null; then
    echo "❌ PHP n'est pas installé. Installation..."
    sudo apt update
    sudo apt install -y php php-mysql php-curl php-gd php-mbstring php-xml php-zip
fi

if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL n'est pas installé. Installation..."
    sudo apt install -y mysql-server
fi

if ! command -v apache2 &> /dev/null; then
    echo "❌ Apache n'est pas installé. Installation..."
    sudo apt install -y apache2
fi

# Créer le répertoire WordPress
mkdir -p ~/vanalexcars-wp
cd ~/vanalexcars-wp

# Télécharger WordPress
echo "📥 Téléchargement de WordPress..."
wget https://wordpress.org/latest.tar.gz
tar xzf latest.tar.gz
mv wordpress/* .
rm -rf wordpress latest.tar.gz

# Configuration de la base de données
echo "🗄️ Configuration de la base de données..."
sudo mysql -e "CREATE DATABASE vanalexcars;"
sudo mysql -e "CREATE USER 'vanalexcars'@'localhost' IDENTIFIED BY 'vanalexcars_password';"
sudo mysql -e "GRANT ALL PRIVILEGES ON vanalexcars.* TO 'vanalexcars'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"

# Configuration Apache
echo "🌐 Configuration Apache..."
sudo cp /etc/apache2/sites-available/000-default.conf /etc/apache2/sites-available/vanalexcars.conf
sudo sed -i 's|/var/www/html|/home/'$USER'/vanalexcars-wp|g' /etc/apache2/sites-available/vanalexcars.conf
sudo sed -i 's|*:80|*:8080|g' /etc/apache2/sites-available/vanalexcars.conf
sudo a2ensite vanalexcars.conf
sudo a2enmod rewrite
sudo systemctl restart apache2

# Permissions
sudo chown -R www-data:www-data ~/vanalexcars-wp
sudo chmod -R 755 ~/vanalexcars-wp

echo "✅ Installation terminée !"
echo "🌐 Accédez à http://localhost:8080 pour configurer WordPress"
echo "📊 phpMyAdmin: http://localhost:8081"
echo "🔧 Base de données: vanalexcars"
echo "👤 Utilisateur: vanalexcars"
echo "🔑 Mot de passe: vanalexcars_password"
