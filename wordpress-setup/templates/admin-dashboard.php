<?php
/**
 * Template pour le tableau de bord principal
 */
?>

<div class="wrap vanalexcars-admin">
    <h1 class="wp-heading-inline">
        <span class="dashicons dashicons-feedback"></span>
        Formulaires Vanalexcars
    </h1>
    
    <!-- Statistiques -->
    <div class="vanalexcars-stats">
        <div class="stat-card">
            <div class="stat-number"><?php echo $stats['contact']; ?></div>
            <div class="stat-label">Contact</div>
        </div>
        <div class="stat-card">
            <div class="stat-number"><?php echo $stats['vehicle_request']; ?></div>
            <div class="stat-label">Demandes véhicules</div>
        </div>
        <div class="stat-card">
            <div class="stat-number"><?php echo $stats['documents']; ?></div>
            <div class="stat-label">Documents</div>
        </div>
        <div class="stat-card">
            <div class="stat-number"><?php echo $stats['testimonial']; ?></div>
            <div class="stat-label">Témoignages</div>
        </div>
        <div class="stat-card">
            <div class="stat-number"><?php echo $stats['newsletter']; ?></div>
            <div class="stat-label">Newsletter</div>
        </div>
    </div>
    
    <!-- Filtres -->
    <div class="vanalexcars-filters">
        <select id="status-filter">
            <option value="">Tous les statuts</option>
            <option value="publish">Publié</option>
            <option value="draft">Brouillon</option>
            <option value="trash">Corbeille</option>
        </select>
        
        <select id="type-filter">
            <option value="">Tous les types</option>
            <option value="contact">Contact</option>
            <option value="vehicle_request">Demandes véhicules</option>
            <option value="documents">Documents</option>
            <option value="testimonial">Témoignages</option>
            <option value="newsletter">Newsletter</option>
        </select>
        
        <input type="date" id="date-filter" placeholder="Filtrer par date">
        <button id="apply-filters" class="button">Appliquer</button>
        <button id="reset-filters" class="button">Réinitialiser</button>
    </div>
    
    <!-- Tableau des soumissions -->
    <div class="vanalexcars-submissions">
        <table class="wp-list-table widefat fixed striped">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Date</th>
                    <th>Statut</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($submissions as $submission): ?>
                <tr data-id="<?php echo $submission['id']; ?>">
                    <td><?php echo $submission['id']; ?></td>
                    <td>
                        <span class="form-type-badge form-type-<?php echo $submission['type']; ?>">
                            <?php echo ucfirst($submission['type']); ?>
                        </span>
                    </td>
                    <td>
                        <strong><?php echo esc_html($submission['form_data']['name'] ?? 'N/A'); ?></strong>
                    </td>
                    <td><?php echo esc_html($submission['form_data']['email'] ?? 'N/A'); ?></td>
                    <td><?php echo date('d/m/Y H:i', strtotime($submission['date'])); ?></td>
                    <td>
                        <select class="status-select" data-post-id="<?php echo $submission['id']; ?>">
                            <option value="publish" <?php selected($submission['status'], 'publish'); ?>>Publié</option>
                            <option value="draft" <?php selected($submission['status'], 'draft'); ?>>Brouillon</option>
                            <option value="trash" <?php selected($submission['status'], 'trash'); ?>>Corbeille</option>
                        </select>
                    </td>
                    <td>
                        <button class="button view-submission" data-id="<?php echo $submission['id']; ?>">
                            Voir
                        </button>
                        <button class="button button-primary edit-submission" data-id="<?php echo $submission['id']; ?>">
                            Modifier
                        </button>
                        <button class="button button-link-delete delete-submission" data-id="<?php echo $submission['id']; ?>">
                            Supprimer
                        </button>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
    
    <!-- Pagination -->
    <div class="vanalexcars-pagination">
        <button class="button" id="prev-page" disabled>Précédent</button>
        <span id="page-info">Page 1 sur 1</span>
        <button class="button" id="next-page" disabled>Suivant</button>
    </div>
</div>

<!-- Modal pour voir les détails -->
<div id="submission-modal" class="vanalexcars-modal" style="display: none;">
    <div class="modal-content">
        <div class="modal-header">
            <h2>Détails de la soumission</h2>
            <span class="close">&times;</span>
        </div>
        <div class="modal-body">
            <div id="submission-details"></div>
        </div>
        <div class="modal-footer">
            <button class="button" id="close-modal">Fermer</button>
        </div>
    </div>
</div>

<style>
.vanalexcars-admin {
    max-width: 1200px;
}

.vanalexcars-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin: 20px 0;
}

.stat-card {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.stat-number {
    font-size: 2em;
    font-weight: bold;
    color: #0073aa;
    margin-bottom: 10px;
}

.stat-label {
    color: #666;
    font-size: 0.9em;
}

.vanalexcars-filters {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
    display: flex;
    gap: 15px;
    align-items: center;
    flex-wrap: wrap;
}

.vanalexcars-filters select,
.vanalexcars-filters input {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.form-type-badge {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8em;
    font-weight: bold;
    text-transform: uppercase;
}

.form-type-contact { background: #e3f2fd; color: #1976d2; }
.form-type-vehicle_request { background: #f3e5f5; color: #7b1fa2; }
.form-type-documents { background: #e8f5e8; color: #388e3c; }
.form-type-testimonial { background: #fff3e0; color: #f57c00; }
.form-type-newsletter { background: #fce4ec; color: #c2185b; }

.vanalexcars-submissions {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    margin: 20px 0;
    overflow-x: auto;
}

.vanalexcars-submissions table {
    width: 100%;
    border-collapse: collapse;
}

.vanalexcars-submissions th,
.vanalexcars-submissions td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #eee;
}

.vanalexcars-submissions th {
    background: #f9f9f9;
    font-weight: bold;
}

.status-select {
    padding: 4px 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.vanalexcars-pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
    margin: 20px 0;
}

.vanalexcars-modal {
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
}

.modal-content {
    background-color: #fff;
    margin: 5% auto;
    padding: 0;
    border-radius: 8px;
    width: 80%;
    max-width: 800px;
    max-height: 80vh;
    overflow-y: auto;
}

.modal-header {
    padding: 20px;
    border-bottom: 1px solid #ddd;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-body {
    padding: 20px;
}

.modal-footer {
    padding: 20px;
    border-top: 1px solid #ddd;
    text-align: right;
}

.close {
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
    color: #aaa;
}

.close:hover {
    color: #000;
}
</style>
