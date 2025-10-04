# 📋 Documentation - Formulaire de Collecte des Cartes Grises

## 🎯 **Vue d'ensemble**

Le formulaire de collecte des cartes grises permet aux clients de Vanalexcars de transmettre facilement leurs documents d'immatriculation pour les démarches administratives. Il s'agit d'un système complet avec upload de fichiers, validation et interface utilisateur intuitive.

---

## 🏗️ **Architecture du Système**

### **Composants Principaux**

```
📁 Formulaire Cartes Grises
├── 📄 pages/demande-upload.tsx          # Page principale
├── 📄 components/forms/RegistrationDocumentsForm.tsx  # Composant réutilisable
├── 📄 components/forms/TestRegistrationDocumentsForm.tsx  # Version de test
├── 📄 components/forms/FileUpload.tsx   # Composant d'upload
└── 📄 lib/services/formService.ts       # Service API
```

### **Flux de Données**

```
Utilisateur → Interface → Validation → Upload → API → Stockage → Confettis
```

---

## 🎨 **Interface Utilisateur**

### **Design System**

- **Couleur principale** : Jaune (`bg-yellow-50`, `border-yellow-200`)
- **Icône** : 📄 (Documents)
- **Layout** : Grille responsive (1 colonne mobile, 3 colonnes desktop)
- **Animation** : Confettis après soumission réussie

### **Structure Visuelle**

```
┌─────────────────────────────────────────────────────────┐
│ 📄 Documents d'immatriculation                          │
│ Collecte simplifiée pour vos démarches administratives  │
├─────────────────────────────────────────────────────────┤
│ 📋 Vous me transmettez :                               │
├─────────────────┬─────────────────┬─────────────────┐
│ 1️⃣ Pièce        │ 2️⃣ Justificatif │ 3️⃣ Mandat       │
│ d'identité      │ de domicile     │                 │
│ [Upload Zone]   │ [Upload Zone]   │ [Upload Zone]   │
└─────────────────┴─────────────────┴─────────────────┘
```

---

## 📄 **Types de Documents Collectés**

### **1. Pièce d'identité** 🔍

- **Obligatoire** : ✅ Oui
- **Types acceptés** : Carte d'identité, passeport, permis de conduire
- **Formats** : JPG, PNG, PDF
- **Taille max** : 5MB par fichier
- **Max fichiers** : 2
- **Nom automatique** : `piece-identite_YYYY-MM-DD.ext`

### **2. Justificatif de domicile** 🏠

- **Obligatoire** : ✅ Oui
- **Types acceptés** : Facture EDF, téléphone, assurance, etc.
- **Formats** : JPG, PNG, PDF
- **Taille max** : 5MB par fichier
- **Max fichiers** : 2
- **Nom automatique** : `justificatif-domicile_YYYY-MM-DD.ext`

### **3. Mandat** 📝

- **Obligatoire** : ✅ Oui
- **Description** : Document de mandat signé
- **Formats** : JPG, PNG, PDF
- **Taille max** : 5MB par fichier
- **Max fichiers** : 1
- **Nom automatique** : `mandat_YYYY-MM-DD.ext`

---

## 🔧 **Fonctionnalités Techniques**

### **Upload de Fichiers**

```typescript
interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  maxFiles?: number; // Nombre max de fichiers
  maxSize?: number; // Taille max en MB
  acceptedTypes?: string[]; // Types MIME acceptés
  label?: string; // Label du bouton
  description?: string; // Description du champ
  required?: boolean; // Champ obligatoire
  customFileName?: string; // Nom personnalisé
}
```

### **Validation Côté Client**

- ✅ **Types de fichiers** : Vérification MIME type
- ✅ **Taille** : Contrôle de la taille maximale
- ✅ **Nombre** : Limite du nombre de fichiers
- ✅ **Champs obligatoires** : Validation des champs requis
- ✅ **Renommage automatique** : Noms de fichiers standardisés

### **Renommage Intelligent**

```typescript
// Détection automatique du type de document
if (
  file.name.toLowerCase().includes('carte') ||
  file.name.toLowerCase().includes('identite')
) {
  baseName = 'piece-identite';
} else if (
  file.name.toLowerCase().includes('facture') ||
  file.name.toLowerCase().includes('edf')
) {
  baseName = 'justificatif-domicile';
} else if (file.name.toLowerCase().includes('mandat')) {
  baseName = 'mandat';
}
```

---

## 🚀 **API Endpoints**

### **Soumission du Formulaire**

```http
POST /api/forms/registration-documents
Content-Type: application/json

{
  "name": "string",
  "email": "string",
  "phone": "string",
  "request_type": "search" | "advice" | "quote",
  "urgency": "low" | "medium" | "high",
  "message": "string",
  "documents": {
    "identity": File[],
    "proof_of_address": File[],
    "mandate": File[]
  }
}
```

### **Réponse API**

```json
{
  "success": true,
  "data": {
    "id": 1759580142557,
    "title": "Documents d'immatriculation - 04/10/2025 14:15:42",
    "message": "Documents soumis avec succès"
  }
}
```

---

## 📱 **Responsive Design**

### **Breakpoints**

| Écran       | Largeur        | Colonnes | Layout            |
| ----------- | -------------- | -------- | ----------------- |
| **Mobile**  | < 768px        | 1        | Stack vertical    |
| **Tablet**  | 768px - 1024px | 2        | Grille 2 colonnes |
| **Desktop** | > 1024px       | 3        | Grille 3 colonnes |

### **Adaptations Mobile**

- Interface tactile optimisée
- Zones de drop agrandies
- Boutons d'action accessibles
- Navigation simplifiée

---

## 🎉 **Animations et UX**

### **Confettis de Célébration**

- **Déclenchement** : Après soumission réussie
- **Particules** : 50 confettis colorés
- **Animation** : Gravité réaliste, rotation
- **Durée** : 3 secondes
- **Z-index** : 9999 (au-dessus de tout)

### **États du Formulaire**

| État          | Description          | Couleur | Icône |
| ------------- | -------------------- | ------- | ----- |
| **Idle**      | Formulaire vide      | Gris    | 📄    |
| **Uploading** | Upload en cours      | Bleu    | ⏳    |
| **Success**   | Soumission réussie   | Vert    | ✅    |
| **Error**     | Erreur de soumission | Rouge   | ❌    |

---

## 🔐 **Sécurité et Validation**

### **Validation Côté Client**

```typescript
const validate = (values: RegistrationDocumentsFormData) => {
  const errors: Record<string, string> = {};

  // Champs obligatoires
  if (!values.name) errors.name = 'Le nom est requis';
  if (!values.email) errors.email = "L'email est requis";

  // Validation email
  if (values.email && !/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = 'Email invalide';
  }

  // Documents obligatoires
  if (!values.documents.identity.length) {
    errors.identity = "Pièce d'identité requise";
  }

  return errors;
};
```

### **Sécurité des Fichiers**

- ✅ **Types MIME** : Vérification stricte
- ✅ **Taille** : Limitation à 5MB par fichier
- ✅ **Extension** : Validation des extensions
- ✅ **Renommage** : Noms sécurisés sans caractères spéciaux

---

## 📊 **Gestion des Erreurs**

### **Types d'Erreurs**

| Code             | Description                  | Solution               |
| ---------------- | ---------------------------- | ---------------------- |
| `FILE_TOO_LARGE` | Fichier trop volumineux      | Réduire la taille      |
| `INVALID_TYPE`   | Type de fichier non supporté | Utiliser JPG/PNG/PDF   |
| `TOO_MANY_FILES` | Trop de fichiers             | Supprimer des fichiers |
| `REQUIRED_FIELD` | Champ obligatoire manquant   | Remplir le champ       |
| `NETWORK_ERROR`  | Erreur de connexion          | Réessayer plus tard    |

### **Messages d'Erreur Utilisateur**

```typescript
const errorMessages = {
  FILE_TOO_LARGE: 'Le fichier est trop volumineux (max 5MB)',
  INVALID_TYPE: 'Type de fichier non supporté (JPG, PNG, PDF uniquement)',
  TOO_MANY_FILES: 'Trop de fichiers (max 2 par catégorie)',
  REQUIRED_FIELD: 'Ce champ est obligatoire',
  NETWORK_ERROR: 'Erreur de connexion, veuillez réessayer',
};
```

---

## 🧪 **Tests et Développement**

### **URLs de Test**

| URL                 | Description          | Usage         |
| ------------------- | -------------------- | ------------- |
| `/demande-upload`   | Formulaire principal | Production    |
| `/test-formulaires` | Version de test      | Développement |
| `/demande`          | Section documents    | Intégration   |

### **Données de Test**

```typescript
const testData = {
  name: 'Jean Dupont',
  email: 'jean.dupont@example.com',
  phone: '0123456789',
  request_type: 'search',
  urgency: 'medium',
  message: 'Demande de carte grise pour véhicule importé',
};
```

---

## 📈 **Métriques et Analytics**

### **Événements Trackés**

- `form_started` : Début de remplissage
- `file_uploaded` : Fichier téléchargé
- `form_submitted` : Soumission du formulaire
- `form_success` : Soumission réussie
- `form_error` : Erreur de soumission

### **KPIs**

- **Taux de completion** : % de formulaires complétés
- **Temps de remplissage** : Durée moyenne
- **Taux d'erreur** : % d'échecs de soumission
- **Satisfaction** : Feedback utilisateur

---

## 🔄 **Workflow Complet**

### **1. Initialisation**

```
Utilisateur accède à /demande-upload
↓
Chargement du formulaire
↓
Interface prête
```

### **2. Remplissage**

```
Saisie des informations personnelles
↓
Upload des documents (drag & drop)
↓
Validation en temps réel
↓
Résumé des fichiers
```

### **3. Soumission**

```
Clic sur "Envoyer"
↓
Validation finale
↓
Upload vers le serveur
↓
Confirmation + Confettis
```

### **4. Traitement**

```
Réception par l'API
↓
Stockage des fichiers
↓
Notification admin
↓
Suivi de la demande
```

---

## 🛠️ **Maintenance et Support**

### **Logs de Debug**

```typescript
console.log('📄 RegistrationDocuments: Début du formulaire');
console.log('📁 FileUpload: Fichier ajouté', file.name);
console.log('✅ Validation: Formulaire valide');
console.log('🚀 API: Soumission réussie', response);
```

### **Monitoring**

- **Uptime** : Disponibilité du formulaire
- **Performance** : Temps de réponse
- **Erreurs** : Logs d'erreurs automatiques
- **Usage** : Statistiques d'utilisation

---

## 📚 **Ressources et Liens**

### **Documentation Technique**

- [Next.js File Upload](https://nextjs.org/docs/api-routes/introduction)
- [React File Upload](https://react.dev/reference/react-dom/components/input#input)
- [Tailwind CSS](https://tailwindcss.com/docs)

### **Outils de Développement**

- **IDE** : VS Code avec extensions React/TypeScript
- **Debug** : React DevTools, Network tab
- **Testing** : Jest, React Testing Library

---

_Documentation générée le : ${new Date().toLocaleString('fr-FR')}_
_Version : 1.0_
_Dernière mise à jour : ${new Date().toISOString()}_
