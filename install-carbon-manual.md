# Installation manuelle de Carbon Fields

## Méthode 1 : Via l'interface WordPress

1. **Accédez à** http://localhost:8080/wp-admin
2. **Allez dans** Plugins → Ajouter
3. **Cliquez sur** "Téléverser un plugin"
4. **Téléchargez** Carbon Fields depuis : https://github.com/htmlburger/carbon-fields/releases
5. **Téléversez** le fichier .zip
6. **Activez** le plugin

## Méthode 2 : Installation directe dans le container

```bash
# Télécharger Carbon Fields
docker exec vanalexcars-wp bash -c "
cd /var/www/html/wp-content/plugins
curl -L https://github.com/htmlburger/carbon-fields/archive/refs/heads/master.zip -o carbon-fields.zip
unzip carbon-fields.zip
mv carbon-fields-master carbon-fields
rm carbon-fields.zip
"

# Activer le plugin
docker exec vanalexcars-wp wp plugin activate carbon-fields
```

## Méthode 3 : Configuration PHP améliorée

Si les limites PHP persistent, ajoutez dans wp-config.php :

```php
// Augmentation des limites PHP
ini_set('upload_max_filesize', '64M');
ini_set('post_max_size', '64M');
ini_set('max_execution_time', 300);
ini_set('memory_limit', '256M');
```

## Vérification

Une fois installé, vous devriez voir :

- **Carbon Fields** dans la liste des plugins
- **Carbon Fields** dans le menu admin
- **API REST** accessible à /wp-json/wp/v2/
