<?php
/**
 * Plugin Name: Vanalexcars Forms Manager
 * Description: Gestionnaire complet des formulaires Vanalexcars - Tableau de bord, soumissions, statistiques
 * Version: 1.0
 * Author: Vanalexcars
 */

// Empêcher l'accès direct
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Plugin principal Vanalexcars Forms Manager
 */
class Vanalexcars_Forms_Manager {

    public function __construct() {
        add_action('admin_menu', [$this, 'add_admin_menu']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_assets']);
        add_action('wp_ajax_vanalexcars_update_submission_status', [$this, 'update_submission_status']);
        add_action('wp_ajax_vanalexcars_export_submissions', [$this, 'export_submissions']);
        
        // Inclure les meta boxes personnalisées
        require_once plugin_dir_path(__FILE__) . 'form-submissions-meta-boxes.php';
    }

    public function add_admin_menu() {
        add_menu_page(
            __('Vanalexcars Formulaires', 'vanalexcars'),
            __('Formulaires', 'vanalexcars'),
            'manage_options',
            'vanalexcars-forms',
            [$this, 'render_dashboard_page'],
            'dashicons-feedback',
            25
        );

        add_submenu_page(
            'vanalexcars-forms',
            __('Tableau de Bord', 'vanalexcars'),
            __('Tableau de Bord', 'vanalexcars'),
            'manage_options',
            'vanalexcars-forms',
            [$this, 'render_dashboard_page']
        );

        add_submenu_page(
            'vanalexcars-forms',
            __('Soumissions Contact', 'vanalexcars'),
            __('Contact', 'vanalexcars'),
            'manage_options',
            'vanalexcars-contact',
            [$this, 'render_contact_submissions_page']
        );

        add_submenu_page(
            'vanalexcars-forms',
            __('Soumissions Véhicules', 'vanalexcars'),
            __('Véhicules', 'vanalexcars'),
            'manage_options',
            'vanalexcars-vehicles',
            [$this, 'render_vehicles_submissions_page']
        );

        add_submenu_page(
            'vanalexcars-forms',
            __('Soumissions Documents', 'vanalexcars'),
            __('Documents', 'vanalexcars'),
            'manage_options',
            'vanalexcars-documents',
            [$this, 'render_documents_submissions_page']
        );

        add_submenu_page(
            'vanalexcars-forms',
            __('Soumissions Témoignages', 'vanalexcars'),
            __('Témoignages', 'vanalexcars'),
            'manage_options',
            'vanalexcars-testimonials',
            [$this, 'render_testimonials_submissions_page']
        );

        add_submenu_page(
            'vanalexcars-forms',
            __('Soumissions Newsletter', 'vanalexcars'),
            __('Newsletter', 'vanalexcars'),
            'manage_options',
            'vanalexcars-newsletter',
            [$this, 'render_newsletter_submissions_page']
        );
    }

    public function enqueue_admin_assets($hook) {
        // Enqueue styles
        wp_enqueue_style('vanalexcars-admin-styles', plugin_dir_url(__FILE__) . 'admin-styles.css', [], '1.0.0');

        // Enqueue scripts
        wp_enqueue_script('vanalexcars-admin-scripts', plugin_dir_url(__FILE__) . 'admin-scripts.js', ['jquery'], '1.0.0', true);

        // Localize script for AJAX
        wp_localize_script('vanalexcars-admin-scripts', 'vanalexcars_ajax_object', [
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce'    => wp_create_nonce('vanalexcars_forms_nonce'),
        ]);
    }

    public function render_dashboard_page() {
        include plugin_dir_path(__FILE__) . 'templates/admin-dashboard.php';
    }

    public function render_contact_submissions_page() {
        $this->render_submissions_list('contact', __('Soumissions de Contact', 'vanalexcars'));
    }

    public function render_vehicles_submissions_page() {
        $this->render_submissions_list('vehicle_request', __('Soumissions de Demande de Véhicule', 'vanalexcars'));
    }

    public function render_documents_submissions_page() {
        $this->render_submissions_list('registration_documents', __('Soumissions de Documents d\'Immatriculation', 'vanalexcars'));
    }

    public function render_testimonials_submissions_page() {
        $this->render_submissions_list('testimonial', __('Soumissions de Témoignages', 'vanalexcars'));
    }

    public function render_newsletter_submissions_page() {
        $this->render_submissions_list('newsletter', __('Soumissions de Newsletter', 'vanalexcars'));
    }

    private function render_submissions_list($form_type, $title) {
        ?>
        <div class="wrap">
            <h1><?php echo esc_html($title); ?></h1>
            <div id="vanalexcars-forms-app" data-form-type="<?php echo esc_attr($form_type); ?>">
                <!-- React app will render here -->
                <div class="loading-indicator">Chargement des soumissions...</div>
            </div>
        </div>
        <?php
    }

    public function update_submission_status() {
        check_ajax_referer('vanalexcars_forms_nonce', 'nonce');

        $submission_id = isset($_POST['submission_id']) ? intval($_POST['submission_id']) : 0;
        $new_status = isset($_POST['new_status']) ? sanitize_text_field($_POST['new_status']) : '';

        if ($submission_id && $new_status) {
            update_post_meta($submission_id, 'form_status', $new_status);
            wp_send_json_success(['message' => __('Statut mis à jour avec succès.', 'vanalexcars')]);
        } else {
            wp_send_json_error(['message' => __('Données invalides.', 'vanalexcars')]);
        }
    }

    public function export_submissions() {
        check_ajax_referer('vanalexcars_forms_nonce', 'nonce');

        $form_type = isset($_GET['form_type']) ? sanitize_text_field($_GET['form_type']) : '';

        if (empty($form_type)) {
            wp_die(__('Type de formulaire non spécifié pour l\'exportation.', 'vanalexcars'));
        }

        $args = [
            'post_type'  => 'form-submissions',
            'posts_per_page' => -1,
            'meta_query' => [
                [
                    'key'   => 'form_type',
                    'value' => $form_type,
                    'compare' => '=',
                ],
            ],
        ];

        $submissions = get_posts($args);

        if (empty($submissions)) {
            wp_die(__('Aucune soumission trouvée pour l\'exportation.', 'vanalexcars'));
        }

        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename=vanalexcars-submissions-' . $form_type . '-' . date('Y-m-d') . '.csv');

        $output = fopen('php://output', 'w');

        // CSV Header
        $header = ['ID', 'Date', 'Type de Formulaire', 'Statut'];
        $first_submission_meta = get_post_meta($submissions[0]->ID, 'form_data', true);
        if (is_array($first_submission_meta)) {
            foreach ($first_submission_meta as $key => $value) {
                $header[] = ucfirst(str_replace('_', ' ', $key));
            }
        }
        fputcsv($output, $header);

        foreach ($submissions as $submission) {
            $meta = get_post_meta($submission->ID);
            $form_data = isset($meta['form_data'][0]) ? maybe_unserialize($meta['form_data'][0]) : [];
            $form_status = isset($meta['form_status'][0]) ? $meta['form_status'][0] : 'N/A';

            $row = [
                $submission->ID,
                $submission->post_date,
                $form_type,
                $form_status,
            ];

            if (is_array($form_data)) {
                foreach ($first_submission_meta as $key => $value) {
                    $row[] = isset($form_data[$key]) ? $form_data[$key] : '';
                }
            }
            fputcsv($output, $row);
        }

        fclose($output);
        exit;
    }
}

// Initialiser le plugin
new Vanalexcars_Forms_Manager();
