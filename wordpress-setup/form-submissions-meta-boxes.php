<?php
/**
 * Meta boxes personnalisées pour les soumissions de formulaires
 */

// Enregistrer les meta boxes pour les soumissions de formulaires
add_action('add_meta_boxes', 'vanalexcars_add_form_submission_meta_boxes');
function vanalexcars_add_form_submission_meta_boxes() {
    add_meta_box(
        'form_submission_details',
        __('Détails de la Soumission', 'vanalexcars'),
        'vanalexcars_render_form_submission_details_meta_box',
        'form-submissions',
        'normal',
        'high'
    );
    
    add_meta_box(
        'form_submission_data',
        __('Données du Formulaire', 'vanalexcars'),
        'vanalexcars_render_form_submission_data_meta_box',
        'form-submissions',
        'normal',
        'high'
    );
}

// Rendu de la meta box des détails
function vanalexcars_render_form_submission_details_meta_box($post) {
    wp_nonce_field('vanalexcars_save_form_submission_meta', 'vanalexcars_form_submission_nonce');
    
    $form_type = get_post_meta($post->ID, 'form_type', true);
    $form_status = get_post_meta($post->ID, 'form_status', true);
    $submission_date = get_post_meta($post->ID, 'submission_date', true);
    $ip_address = get_post_meta($post->ID, 'ip_address', true);
    $user_agent = get_post_meta($post->ID, 'user_agent', true);
    
    ?>
    <table class="form-table">
        <tr>
            <th scope="row"><label for="form_type">Type de formulaire</label></th>
            <td>
                <select name="form_type" id="form_type" style="width: 100%;">
                    <option value="contact" <?php selected($form_type, 'contact'); ?>>Contact</option>
                    <option value="vehicle_request" <?php selected($form_type, 'vehicle_request'); ?>>Demande de véhicule</option>
                    <option value="registration_documents" <?php selected($form_type, 'registration_documents'); ?>>Documents d'immatriculation</option>
                    <option value="testimonial" <?php selected($form_type, 'testimonial'); ?>>Témoignage</option>
                    <option value="newsletter" <?php selected($form_type, 'newsletter'); ?>>Newsletter</option>
                </select>
            </td>
        </tr>
        <tr>
            <th scope="row"><label for="form_status">Statut</label></th>
            <td>
                <select name="form_status" id="form_status" style="width: 100%;">
                    <option value="pending" <?php selected($form_status, 'pending'); ?>>En attente</option>
                    <option value="read" <?php selected($form_status, 'read'); ?>>Lu</option>
                    <option value="replied" <?php selected($form_status, 'replied'); ?>>Répondu</option>
                    <option value="archived" <?php selected($form_status, 'archived'); ?>>Archivé</option>
                </select>
            </td>
        </tr>
        <tr>
            <th scope="row"><label for="submission_date">Date de soumission</label></th>
            <td>
                <input type="datetime-local" name="submission_date" id="submission_date" 
                       value="<?php echo esc_attr($submission_date); ?>" style="width: 100%;" />
            </td>
        </tr>
        <tr>
            <th scope="row">Adresse IP</th>
            <td><code><?php echo esc_html($ip_address); ?></code></td>
        </tr>
        <tr>
            <th scope="row">User Agent</th>
            <td><code><?php echo esc_html($user_agent); ?></code></td>
        </tr>
    </table>
    <?php
}

// Rendu de la meta box des données du formulaire
function vanalexcars_render_form_submission_data_meta_box($post) {
    $form_data = get_post_meta($post->ID, 'form_data', true);
    
    if (empty($form_data)) {
        echo '<p>Aucune donnée de formulaire disponible.</p>';
        return;
    }
    
    if (is_string($form_data)) {
        $form_data = maybe_unserialize($form_data);
    }
    
    ?>
    <div style="background: #f9f9f9; padding: 15px; border-radius: 5px;">
        <h4>Données du formulaire :</h4>
        <table class="widefat" style="margin-top: 10px;">
            <thead>
                <tr>
                    <th style="width: 30%;">Champ</th>
                    <th>Valeur</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($form_data as $key => $value): ?>
                <tr>
                    <td><strong><?php echo esc_html(ucfirst(str_replace('_', ' ', $key))); ?></strong></td>
                    <td>
                        <?php 
                        if (is_array($value)) {
                            echo '<pre>' . esc_html(print_r($value, true)) . '</pre>';
                        } else {
                            echo esc_html($value);
                        }
                        ?>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
    <?php
}

// Sauvegarder les meta data
add_action('save_post', 'vanalexcars_save_form_submission_meta');
function vanalexcars_save_form_submission_meta($post_id) {
    // Vérifier le nonce
    if (!isset($_POST['vanalexcars_form_submission_nonce']) || 
        !wp_verify_nonce($_POST['vanalexcars_form_submission_nonce'], 'vanalexcars_save_form_submission_meta')) {
        return $post_id;
    }
    
    // Vérifier les permissions
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return $post_id;
    }
    
    if (!current_user_can('edit_post', $post_id)) {
        return $post_id;
    }
    
    // Sauvegarder les champs
    if (isset($_POST['form_type'])) {
        update_post_meta($post_id, 'form_type', sanitize_text_field($_POST['form_type']));
    }
    
    if (isset($_POST['form_status'])) {
        update_post_meta($post_id, 'form_status', sanitize_text_field($_POST['form_status']));
    }
    
    if (isset($_POST['submission_date'])) {
        update_post_meta($post_id, 'submission_date', sanitize_text_field($_POST['submission_date']));
    }
}

// Ajouter des colonnes personnalisées dans la liste des soumissions
add_filter('manage_form-submissions_posts_columns', 'vanalexcars_add_form_submission_columns');
function vanalexcars_add_form_submission_columns($columns) {
    $new_columns = array();
    $new_columns['cb'] = $columns['cb'];
    $new_columns['title'] = $columns['title'];
    $new_columns['form_type'] = __('Type de formulaire', 'vanalexcars');
    $new_columns['form_status'] = __('Statut', 'vanalexcars');
    $new_columns['submission_date'] = __('Date de soumission', 'vanalexcars');
    $new_columns['date'] = $columns['date'];
    
    return $new_columns;
}

// Remplir les colonnes personnalisées
add_action('manage_form-submissions_posts_custom_column', 'vanalexcars_fill_form_submission_columns', 10, 2);
function vanalexcars_fill_form_submission_columns($column, $post_id) {
    switch ($column) {
        case 'form_type':
            $form_type = get_post_meta($post_id, 'form_type', true);
            $form_types = array(
                'contact' => 'Contact',
                'vehicle_request' => 'Demande véhicule',
                'registration_documents' => 'Documents',
                'testimonial' => 'Témoignage',
                'newsletter' => 'Newsletter'
            );
            echo isset($form_types[$form_type]) ? $form_types[$form_type] : ucfirst($form_type);
            break;
            
        case 'form_status':
            $form_status = get_post_meta($post_id, 'form_status', true);
            $status_colors = array(
                'pending' => '#ff6b35',
                'read' => '#4ecdc4',
                'replied' => '#45b7d1',
                'archived' => '#96ceb4'
            );
            $status_labels = array(
                'pending' => 'En attente',
                'read' => 'Lu',
                'replied' => 'Répondu',
                'archived' => 'Archivé'
            );
            $color = isset($status_colors[$form_status]) ? $status_colors[$form_status] : '#666';
            $label = isset($status_labels[$form_status]) ? $status_labels[$form_status] : ucfirst($form_status);
            echo '<span style="color: ' . $color . '; font-weight: bold;">' . $label . '</span>';
            break;
            
        case 'submission_date':
            $submission_date = get_post_meta($post_id, 'submission_date', true);
            if ($submission_date) {
                echo date('d/m/Y H:i', strtotime($submission_date));
            } else {
                echo get_the_date('d/m/Y H:i', $post_id);
            }
            break;
    }
}

// Rendre les colonnes triables
add_filter('manage_edit-form-submissions_sortable_columns', 'vanalexcars_make_form_submission_columns_sortable');
function vanalexcars_make_form_submission_columns_sortable($columns) {
    $columns['form_type'] = 'form_type';
    $columns['form_status'] = 'form_status';
    $columns['submission_date'] = 'submission_date';
    return $columns;
}
