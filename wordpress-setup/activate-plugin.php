<?php
// Script pour activer le plugin form-submission-endpoint
require_once('/var/www/html/wp-config.php');

// Activer le plugin
$plugin_file = 'form-submission-endpoint/form-submission-endpoint.php';
$active_plugins = get_option('active_plugins', array());

if (!in_array($plugin_file, $active_plugins)) {
    $active_plugins[] = $plugin_file;
    update_option('active_plugins', $active_plugins);
    echo "Plugin activé avec succès\n";
} else {
    echo "Plugin déjà activé\n";
}
?>
