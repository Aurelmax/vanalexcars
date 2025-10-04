<?php
/**
 * Plugin Name: Vanalexcars Admin Dashboard
 * Description: Tableau de bord d'administration pour les formulaires Vanalexcars
 * Version: 1.0
 * Author: Vanalexcars
 */

// Empêcher l'accès direct
if (!defined('ABSPATH')) {
    exit;
}

// Inclure le fichier principal
require_once plugin_dir_path(__FILE__) . 'admin-forms-dashboard.php';
