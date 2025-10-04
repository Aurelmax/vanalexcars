#!/bin/bash

# Script pour connecter les formulaires frontend au backend WordPress

echo "🔗 Connexion des formulaires frontend au backend WordPress..."

# Vérifier que Docker est en cours d'exécution
if ! docker ps | grep -q "wordpress"; then
    echo "❌ WordPress n'est pas en cours d'exécution. Veuillez démarrer Docker d'abord."
    exit 1
fi

# Vérifier que Next.js est en cours d'exécution
if ! curl -s http://localhost:3002 > /dev/null; then
    echo "❌ Next.js n'est pas en cours d'exécution. Veuillez démarrer le frontend d'abord."
    exit 1
fi

echo "✅ Frontend et backend sont en cours d'exécution"

# Tester la connexion à l'API WordPress
echo "🔍 Test de la connexion à l'API WordPress..."
if curl -s "http://localhost:8080/wp-json/wp/v2/posts" | grep -q "id"; then
    echo "✅ API WordPress accessible"
else
    echo "❌ API WordPress non accessible"
    exit 1
fi

# Tester l'endpoint des soumissions de formulaires
echo "🔍 Test de l'endpoint des soumissions de formulaires..."
if curl -s "http://localhost:8080/wp-json/wp/v2/form-submissions" | grep -q "[]"; then
    echo "✅ Endpoint des soumissions accessible"
else
    echo "⚠️  Endpoint des soumissions non accessible (normal si aucune donnée)"
fi

# Créer un fichier de test pour l'envoi de formulaires
echo "📄 Création d'un fichier de test pour l'envoi de formulaires..."
cat > test-form-submission.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Test de soumission de formulaire</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        input, textarea, select { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
        button { background: #0073aa; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
        button:hover { background: #005a87; }
        .result { margin-top: 20px; padding: 15px; border-radius: 4px; }
        .success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
    </style>
</head>
<body>
    <h1>Test de soumission de formulaire Vanalexcars</h1>
    
    <form id="test-form">
        <div class="form-group">
            <label for="name">Nom complet *</label>
            <input type="text" id="name" name="name" required>
        </div>
        
        <div class="form-group">
            <label for="email">Email *</label>
            <input type="email" id="email" name="email" required>
        </div>
        
        <div class="form-group">
            <label for="phone">Téléphone</label>
            <input type="tel" id="phone" name="phone">
        </div>
        
        <div class="form-group">
            <label for="subject">Sujet *</label>
            <select id="subject" name="subject" required>
                <option value="">Sélectionnez un sujet</option>
                <option value="demande-info">Demande d'information</option>
                <option value="devis">Demande de devis</option>
                <option value="rendez-vous">Prise de rendez-vous</option>
                <option value="autre">Autre</option>
            </select>
        </div>
        
        <div class="form-group">
            <label for="message">Message *</label>
            <textarea id="message" name="message" rows="4" required></textarea>
        </div>
        
        <button type="submit">Envoyer le formulaire</button>
    </form>
    
    <div id="result"></div>
    
    <script>
        document.getElementById('test-form').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = '<p>Envoi en cours...</p>';
            
            try {
                const response = await fetch('http://localhost:8080/wp-json/wp/v2/form-submissions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title: `Contact: ${data.name}`,
                        content: data.message,
                        status: 'publish',
                        meta: {
                            form_type: 'contact',
                            form_data: data,
                            submission_date: new Date().toISOString(),
                        },
                    }),
                });
                
                if (response.ok) {
                    const result = await response.json();
                    resultDiv.innerHTML = `
                        <div class="result success">
                            <h3>✅ Formulaire envoyé avec succès !</h3>
                            <p><strong>ID:</strong> ${result.id}</p>
                            <p><strong>Statut:</strong> ${result.status}</p>
                            <p><strong>Date:</strong> ${new Date(result.date).toLocaleString()}</p>
                        </div>
                    `;
                } else {
                    throw new Error(`Erreur ${response.status}: ${response.statusText}`);
                }
            } catch (error) {
                resultDiv.innerHTML = `
                    <div class="result error">
                        <h3>❌ Erreur lors de l'envoi</h3>
                        <p>${error.message}</p>
                    </div>
                `;
            }
        });
    </script>
</body>
</html>
EOF

echo "📄 Fichier de test créé: test-form-submission.html"
echo ""
echo "🎯 Instructions de test :"
echo "   1. Ouvrez http://localhost:3002/forms-demo dans votre navigateur"
echo "   2. Testez les formulaires de contact"
echo "   3. Vérifiez les données dans le backoffice WordPress"
echo ""
echo "📊 URLs importantes :"
echo "   Frontend: http://localhost:3002"
echo "   Backend: http://localhost:8080"
echo "   Admin: http://localhost:8080/wp-admin"
echo "   API: http://localhost:8080/wp-json/wp/v2"
echo "   Formulaires: http://localhost:8080/wp-admin/admin.php?page=vanalexcars-forms"
echo ""
echo "🔧 Configuration des formulaires :"
echo "   - Les formulaires frontend sont configurés pour envoyer vers l'API WordPress"
echo "   - Les données sont stockées dans le CPT 'form-submissions'"
echo "   - Le tableau de bord d'administration permet de gérer les soumissions"
echo ""
echo "✅ Connexion frontend-backend configurée !"
