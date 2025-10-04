# 📋 Documentation des URLs et Endpoints - Vanalexcars

## 🌐 **URLs Publiques (Frontend)**

### **Pages Principales**

| URL         | Description                       | Type     | Priorité |
| ----------- | --------------------------------- | -------- | -------- |
| `/`         | Page d'accueil                    | Publique | 1.0      |
| `/services` | Services proposés                 | Publique | 0.9      |
| `/contact`  | Formulaire de contact             | Publique | 0.7      |
| `/demande`  | Formulaire de demande de véhicule | Publique | 0.8      |

### **Pages Véhicules**

| URL              | Description          | Type     | Priorité |
| ---------------- | -------------------- | -------- | -------- |
| `/vehicule/[id]` | Détail d'un véhicule | Publique | 0.9      |

### **Pages Légales**

| URL                          | Description                   | Type     | Priorité |
| ---------------------------- | ----------------------------- | -------- | -------- |
| `/mentions-legales`          | Mentions légales              | Publique | 0.3      |
| `/cgv`                       | Conditions générales de vente | Publique | 0.3      |
| `/politique-confidentialite` | Politique de confidentialité  | Publique | 0.3      |
| `/conditions-utilisation`    | Conditions d'utilisation      | Publique | 0.3      |

### **Pages de Test/Développement**

| URL                 | Description                   | Type          | Accès  |
| ------------------- | ----------------------------- | ------------- | ------ |
| `/test-formulaires` | Test de tous les formulaires  | Développement | Public |
| `/forms-demo`       | Démonstration des formulaires | Développement | Public |
| `/file-upload-test` | Test d'upload de fichiers     | Développement | Public |
| `/auth-test`        | Test d'authentification       | Développement | Public |
| `/demande-upload`   | Upload de documents           | Développement | Public |

### **Pages d'Administration**

| URL                  | Description              | Type  | Accès |
| -------------------- | ------------------------ | ----- | ----- |
| `/admin-login`       | Connexion administrateur | Privé | Admin |
| `/admin-formulaires` | Gestion des formulaires  | Privé | Admin |

### **Fichiers Spéciaux**

| URL            | Description | Type    |
| -------------- | ----------- | ------- |
| `/sitemap.xml` | Sitemap XML | Système |

---

## 🔌 **Endpoints API (Backend)**

### **API Next.js (Proxy)**

| Endpoint                 | Méthode | Description                   | Paramètres                          |
| ------------------------ | ------- | ----------------------------- | ----------------------------------- |
| `/api/forms/contact`     | POST    | Soumission formulaire contact | `name`, `email`, `phone`, `message` |
| `/api/forms/submissions` | GET     | Récupération des soumissions  | `form_type` (optionnel)             |
| `/api/auth/login`        | POST    | Authentification              | `username`, `password`              |

### **API WordPress (Backend)**

| Endpoint                                               | Méthode  | Description                   | Authentification |
| ------------------------------------------------------ | -------- | ----------------------------- | ---------------- |
| `http://localhost:8080/wp-json/wp/v2/posts`            | GET/POST | Articles WordPress            | Optionnelle      |
| `http://localhost:8080/wp-json/wp/v2/pages`            | GET/POST | Pages WordPress               | Optionnelle      |
| `http://localhost:8080/wp-json/wp/v2/media`            | GET/POST | Médias WordPress              | Optionnelle      |
| `http://localhost:8080/wp-json/wp/v2/vehicles`         | GET/POST | Véhicules (CPT)               | Optionnelle      |
| `http://localhost:8080/wp-json/wp/v2/testimonials`     | GET/POST | Témoignages (CPT)             | Optionnelle      |
| `http://localhost:8080/wp-json/wp/v2/faqs`             | GET/POST | FAQ (CPT)                     | Optionnelle      |
| `http://localhost:8080/wp-json/wp/v2/services`         | GET/POST | Services (CPT)                | Optionnelle      |
| `http://localhost:8080/wp-json/wp/v2/form-submissions` | GET/POST | Soumissions formulaires (CPT) | Optionnelle      |
| `http://localhost:8080/wp-json/jwt-auth/v1/token`      | POST     | Authentification JWT          | Requise          |

---

## 📊 **Types de Formulaires**

### **Formulaires Frontend**

| Type                     | Endpoint                            | Description                    |
| ------------------------ | ----------------------------------- | ------------------------------ |
| `contact`                | `/api/forms/contact`                | Formulaire de contact général  |
| `vehicle_request`        | `/api/forms/vehicle-request`        | Demande de véhicule spécifique |
| `registration_documents` | `/api/forms/registration-documents` | Documents d'immatriculation    |
| `testimonial`            | `/api/forms/testimonial`            | Témoignage client              |
| `newsletter`             | `/api/forms/newsletter`             | Inscription newsletter         |

### **Statuts des Soumissions**

| Statut     | Description | Couleur |
| ---------- | ----------- | ------- |
| `pending`  | En attente  | Jaune   |
| `read`     | Lu          | Vert    |
| `archived` | Archivé     | Gris    |

---

## 🔐 **Système d'Authentification**

### **Flux d'Authentification**

1. **Connexion** : `POST /api/auth/login`
2. **Token JWT** : Stocké en localStorage
3. **Headers** : `Authorization: Bearer <token>`
4. **Expiration** : Gérée automatiquement

### **Pages Protégées**

- `/admin-formulaires` : Gestion des soumissions
- `/admin-login` : Interface de connexion

---

## 🎨 **Fonctionnalités Spéciales**

### **Confettis**

- **Déclenchement** : Après soumission réussie
- **Pages** : Tous les formulaires
- **Animation** : 50 particules, 3 secondes
- **Z-index** : 9999 (au-dessus de tout)

### **Upload de Fichiers**

- **Types acceptés** : PDF, JPG, PNG, DOC, DOCX
- **Taille max** : 10MB par fichier
- **Max fichiers** : 3 par catégorie
- **Validation** : Côté client et serveur

### **Responsive Design**

- **Mobile** : < 768px
- **Tablet** : 768px - 1024px
- **Desktop** : > 1024px

---

## 🚀 **Environnements**

### **Développement**

- **Frontend** : http://localhost:3000
- **WordPress** : http://localhost:8080
- **phpMyAdmin** : http://localhost:8081

### **Production**

- **Frontend** : https://vanalexcars.fr
- **WordPress** : https://vanalexcars.fr/wp-admin
- **API** : https://vanalexcars.fr/api/

---

## 📝 **Notes Techniques**

### **Technologies**

- **Frontend** : Next.js 15.5.4, React, TypeScript, Tailwind CSS
- **Backend** : WordPress (Headless CMS), MySQL
- **API** : REST API, JWT Authentication
- **Docker** : Multi-container (WordPress, MySQL, phpMyAdmin)

### **Sécurité**

- **CORS** : Configuré pour localhost
- **JWT** : Authentification sécurisée
- **Validation** : Côté client et serveur
- **Sanitization** : Données nettoyées avant stockage

### **Performance**

- **Caching** : Next.js ISR
- **Images** : Optimisation automatique
- **Bundle** : Code splitting
- **SEO** : Sitemap XML, meta tags

---

## 🔧 **Maintenance**

### **Logs**

- **Frontend** : Console du navigateur
- **Backend** : Logs WordPress
- **API** : Logs Next.js

### **Backup**

- **Base de données** : MySQL dump
- **Fichiers** : WordPress uploads
- **Code** : Git repository

### **Monitoring**

- **Uptime** : Vérification des endpoints
- **Performance** : Temps de réponse API
- **Erreurs** : Logs d'erreurs automatiques

---

_Documentation générée le : ${new Date().toLocaleString('fr-FR')}_
_Version du site : 1.0_
_Dernière mise à jour : ${new Date().toISOString()}_
