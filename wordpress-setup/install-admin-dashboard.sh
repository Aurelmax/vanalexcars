#!/bin/bash

# Script d'installation du tableau de bord d'administration Vanalexcars

echo "🚀 Installation du tableau de bord d'administration Vanalexcars..."

# Vérifier que Docker est en cours d'exécution
if ! docker ps | grep -q "vanalexcars-wp"; then
    echo "❌ WordPress n'est pas en cours d'exécution. Veuillez démarrer Docker d'abord."
    exit 1
fi

# Créer le dossier du plugin
echo "📁 Création du dossier du plugin..."
docker exec vanalexcars-wp mkdir -p /var/www/html/wp-content/plugins/vanalexcars-admin

# Copier les fichiers du plugin
echo "📄 Copie des fichiers du plugin..."
docker cp wordpress-setup/admin-forms-dashboard.php vanalexcars-wp:/var/www/html/wp-content/plugins/vanalexcars-admin/
docker cp wordpress-setup/admin-scripts.js vanalexcars-wp:/var/www/html/wp-content/plugins/vanalexcars-admin/
docker cp wordpress-setup/admin-styles.css vanalexcars-wp:/var/www/html/wp-content/plugins/vanalexcars-admin/

# Créer le dossier des templates
echo "📁 Création du dossier des templates..."
docker exec vanalexcars-wp mkdir -p /var/www/html/wp-content/plugins/vanalexcars-admin/templates

# Copier les templates
echo "📄 Copie des templates..."
docker cp wordpress-setup/templates/admin-dashboard.php vanalexcars-wp:/var/www/html/wp-content/plugins/vanalexcars-admin/templates/

# Créer le fichier principal du plugin
echo "📄 Création du fichier principal du plugin..."
docker exec vanalexcars-wp bash -c 'cat > /var/www/html/wp-content/plugins/vanalexcars-admin/vanalexcars-admin.php << EOF
<?php
/**
 * Plugin Name: Vanalexcars Admin Dashboard
 * Description: Tableau de bord d\'administration pour les formulaires Vanalexcars
 * Version: 1.0
 * Author: Vanalexcars
 */

// Empêcher l\'accès direct
if (!defined(\'ABSPATH\')) {
    exit;
}

// Inclure le fichier principal
require_once plugin_dir_path(__FILE__) . \'admin-forms-dashboard.php\';
EOF'

# Activer le plugin
echo "🔌 Activation du plugin..."
docker exec vanalexcars-wp wp plugin activate vanalexcars-admin --allow-root

# Vérifier l'activation
if docker exec vanalexcars-wp wp plugin is-active vanalexcars-admin --allow-root; then
    echo "✅ Plugin activé avec succès !"
else
    echo "❌ Erreur lors de l'activation du plugin"
    exit 1
fi

# Créer des données de test
echo "📊 Création de données de test..."
docker exec vanalexcars-wp wp post create --post_type=form-submissions --post_title="Test Contact - John Doe" --post_content="Message de test" --post_status=publish --meta_input='{"form_type":"contact","form_data":"{\"name\":\"John Doe\",\"email\":\"john@example.com\",\"message\":\"Message de test\"}","submission_date":"'$(date -Iseconds)'"}' --allow-root

docker exec vanalexcars-wp wp post create --post_type=form-submissions --post_title="Test Véhicule - Jane Smith" --post_content="Demande de véhicule" --post_status=publish --meta_input='{"form_type":"vehicle_request","form_data":"{\"name\":\"Jane Smith\",\"email\":\"jane@example.com\",\"brand\":\"Porsche\",\"model\":\"911\"}","submission_date":"'$(date -Iseconds)'"}' --allow-root

# Vérifier les permissions
echo "🔐 Vérification des permissions..."
docker exec vanalexcars-wp chown -R www-data:www-data /var/www/html/wp-content/plugins/vanalexcars-admin
docker exec vanalexcars-wp chmod -R 755 /var/www/html/wp-content/plugins/vanalexcars-admin

echo "🎉 Installation terminée !"
echo ""
echo "📋 Accès au tableau de bord :"
echo "   URL: http://localhost:8080/wp-admin/admin.php?page=vanalexcars-forms"
echo "   Utilisateur: admin"
echo "   Mot de passe: admin"
echo ""
echo "📊 Fonctionnalités disponibles :"
echo "   - Statistiques des formulaires"
echo "   - Gestion des soumissions"
echo "   - Filtres et recherche"
echo "   - Export des données"
echo "   - Gestion des statuts"
echo ""
echo "🔧 Prochaines étapes :"
echo "   1. Connecter les formulaires frontend au backend"
echo "   2. Tester l'envoi de données"
echo "   3. Personnaliser l'interface selon vos besoins"
