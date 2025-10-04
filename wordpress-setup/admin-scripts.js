jQuery(document).ready(function($) {
    
    // Gestion des filtres
    $('#apply-filters').on('click', function() {
        applyFilters();
    });
    
    $('#reset-filters').on('click', function() {
        resetFilters();
    });
    
    // Gestion du changement de statut
    $('.status-select').on('change', function() {
        const postId = $(this).data('post-id');
        const status = $(this).val();
        
        updateFormStatus(postId, status);
    });
    
    // Gestion de la vue des détails
    $('.view-submission').on('click', function() {
        const submissionId = $(this).data('id');
        viewSubmissionDetails(submissionId);
    });
    
    // Gestion de la suppression
    $('.delete-submission').on('click', function() {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette soumission ?')) {
            const submissionId = $(this).data('id');
            deleteSubmission(submissionId);
        }
    });
    
    // Gestion de la modal
    $('.close, #close-modal').on('click', function() {
        $('#submission-modal').hide();
    });
    
    // Fermer la modal en cliquant à l'extérieur
    $(window).on('click', function(event) {
        if (event.target.id === 'submission-modal') {
            $('#submission-modal').hide();
        }
    });
    
    /**
     * Appliquer les filtres
     */
    function applyFilters() {
        const status = $('#status-filter').val();
        const type = $('#type-filter').val();
        const date = $('#date-filter').val();
        
        // Filtrer les lignes du tableau
        $('tbody tr').each(function() {
            let show = true;
            
            if (status && !$(this).find('.status-select option:selected').val().includes(status)) {
                show = false;
            }
            
            if (type && !$(this).find('.form-type-badge').text().toLowerCase().includes(type)) {
                show = false;
            }
            
            if (date) {
                const rowDate = $(this).find('td:nth-child(5)').text();
                if (!rowDate.includes(date.split('-').reverse().join('/'))) {
                    show = false;
                }
            }
            
            $(this).toggle(show);
        });
    }
    
    /**
     * Réinitialiser les filtres
     */
    function resetFilters() {
        $('#status-filter, #type-filter, #date-filter').val('');
        $('tbody tr').show();
    }
    
    /**
     * Mettre à jour le statut d'une soumission
     */
    function updateFormStatus(postId, status) {
        $.ajax({
            url: vanalexcars_ajax.ajax_url,
            type: 'POST',
            data: {
                action: 'update_form_status',
                post_id: postId,
                status: status,
                nonce: vanalexcars_ajax.nonce
            },
            success: function(response) {
                if (response.success) {
                    showNotification('Statut mis à jour avec succès', 'success');
                } else {
                    showNotification('Erreur lors de la mise à jour', 'error');
                }
            },
            error: function() {
                showNotification('Erreur de connexion', 'error');
            }
        });
    }
    
    /**
     * Voir les détails d'une soumission
     */
    function viewSubmissionDetails(submissionId) {
        // Récupérer les données de la soumission depuis le tableau
        const row = $(`tr[data-id="${submissionId}"]`);
        const type = row.find('.form-type-badge').text();
        const name = row.find('td:nth-child(3) strong').text();
        const email = row.find('td:nth-child(4)').text();
        const date = row.find('td:nth-child(5)').text();
        
        // Construire le HTML des détails
        let detailsHtml = `
            <div class="submission-details">
                <h3>Informations générales</h3>
                <table class="details-table">
                    <tr><td><strong>ID:</strong></td><td>${submissionId}</td></tr>
                    <tr><td><strong>Type:</strong></td><td>${type}</td></tr>
                    <tr><td><strong>Nom:</strong></td><td>${name}</td></tr>
                    <tr><td><strong>Email:</strong></td><td>${email}</td></tr>
                    <tr><td><strong>Date:</strong></td><td>${date}</td></tr>
                </table>
                
                <h3>Données du formulaire</h3>
                <div class="form-data">
                    <p><em>Les données complètes seront chargées ici...</em></p>
                </div>
            </div>
        `;
        
        $('#submission-details').html(detailsHtml);
        $('#submission-modal').show();
    }
    
    /**
     * Supprimer une soumission
     */
    function deleteSubmission(submissionId) {
        $.ajax({
            url: vanalexcars_ajax.ajax_url,
            type: 'POST',
            data: {
                action: 'delete_form_submission',
                post_id: submissionId,
                nonce: vanalexcars_ajax.nonce
            },
            success: function(response) {
                if (response.success) {
                    $(`tr[data-id="${submissionId}"]`).fadeOut(300, function() {
                        $(this).remove();
                    });
                    showNotification('Soumission supprimée avec succès', 'success');
                } else {
                    showNotification('Erreur lors de la suppression', 'error');
                }
            },
            error: function() {
                showNotification('Erreur de connexion', 'error');
            }
        });
    }
    
    /**
     * Afficher une notification
     */
    function showNotification(message, type) {
        const notification = $(`
            <div class="notice notice-${type} is-dismissible">
                <p>${message}</p>
                <button type="button" class="notice-dismiss">
                    <span class="screen-reader-text">Ignorer cette notification.</span>
                </button>
            </div>
        `);
        
        $('.vanalexcars-admin').prepend(notification);
        
        // Auto-dismiss après 5 secondes
        setTimeout(function() {
            notification.fadeOut(300, function() {
                $(this).remove();
            });
        }, 5000);
    }
    
    /**
     * Gestion de la pagination
     */
    $('#prev-page, #next-page').on('click', function() {
        // Implémentation de la pagination
        console.log('Pagination clicked');
    });
    
    /**
     * Recherche en temps réel
     */
    $('#search-submissions').on('input', function() {
        const searchTerm = $(this).val().toLowerCase();
        
        $('tbody tr').each(function() {
            const rowText = $(this).text().toLowerCase();
            $(this).toggle(rowText.includes(searchTerm));
        });
    });
    
    /**
     * Tri des colonnes
     */
    $('th').on('click', function() {
        const column = $(this).index();
        const table = $(this).closest('table');
        const rows = table.find('tbody tr').toArray();
        
        rows.sort(function(a, b) {
            const aVal = $(a).find('td').eq(column).text();
            const bVal = $(b).find('td').eq(column).text();
            
            if (aVal < bVal) return -1;
            if (aVal > bVal) return 1;
            return 0;
        });
        
        $.each(rows, function(index, row) {
            table.find('tbody').append(row);
        });
    });
    
    /**
     * Export des données
     */
    $('#export-submissions').on('click', function() {
        const data = [];
        $('tbody tr').each(function() {
            const row = $(this);
            data.push({
                id: row.find('td:first').text(),
                type: row.find('.form-type-badge').text(),
                name: row.find('td:nth-child(3) strong').text(),
                email: row.find('td:nth-child(4)').text(),
                date: row.find('td:nth-child(5)').text(),
                status: row.find('.status-select option:selected').text()
            });
        });
        
        // Convertir en CSV et télécharger
        const csv = convertToCSV(data);
        downloadCSV(csv, 'submissions.csv');
    });
    
    /**
     * Convertir les données en CSV
     */
    function convertToCSV(data) {
        const headers = ['ID', 'Type', 'Nom', 'Email', 'Date', 'Statut'];
        const csvContent = [
            headers.join(','),
            ...data.map(row => [
                row.id,
                `"${row.type}"`,
                `"${row.name}"`,
                `"${row.email}"`,
                `"${row.date}"`,
                `"${row.status}"`
            ].join(','))
        ].join('\n');
        
        return csvContent;
    }
    
    /**
     * Télécharger le fichier CSV
     */
    function downloadCSV(csv, filename) {
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }
});
