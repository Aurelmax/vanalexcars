# 🔧 Plan de Correction de la Qualité du Code

## 📊 **État Actuel**

- **307 problèmes** (290 erreurs, 17 warnings)
- **Pages de test supprimées** ✅
- **Composants de test supprimés** ✅

## 🎯 **Priorités de Correction**

### **1. Erreurs Critiques (Parsing)**

- `hooks/useAuth.ts` - Erreur de parsing ligne 82
- `scripts/fix-linting.js` - Erreur de parsing ligne 3

### **2. Types `any` (50+ occurrences)**

- Remplacer par des types spécifiques
- Utiliser `unknown` en dernier recours

### **3. Caractères non échappés (200+ erreurs)**

- `'` → `&apos;`
- `"` → `&quot;`

### **4. Liens HTML**

- `<a href="/path">` → `<Link href="/path">`

### **5. Images**

- `<img>` → `<Image>` (Next.js)

### **6. Exports anonymes**

- `export default {` → `const defaultExport = { ... }; export default defaultExport;`

## 🛠️ **Stratégie de Correction**

### **Phase 1: Erreurs Critiques**

1. Corriger les erreurs de parsing
2. Corriger les erreurs de syntaxe

### **Phase 2: Types TypeScript**

1. Remplacer tous les `any` par des types spécifiques
2. Créer des interfaces manquantes

### **Phase 3: JSX/React**

1. Échapper les caractères spéciaux
2. Remplacer les liens HTML par Link
3. Remplacer les images par Image

### **Phase 4: Exports et Imports**

1. Corriger les exports anonymes
2. Vérifier la cohérence des imports

### **Phase 5: Optimisations**

1. Supprimer les variables inutilisées
2. Optimiser les performances
3. Nettoyer le code mort

## 📋 **Checklist de Progression**

### **✅ Terminé**

- [x] Suppression des pages de test
- [x] Suppression des composants de test
- [x] Audit initial du linting

### **🔄 En Cours**

- [ ] Correction des erreurs de parsing
- [ ] Correction des types `any`
- [ ] Échappement des caractères

### **📅 À Faire**

- [ ] Correction des liens HTML
- [ ] Correction des images
- [ ] Correction des exports
- [ ] Optimisations finales

## 🎯 **Objectif**

- **0 erreur** de linting
- **0 warning** critique
- **Code de production** propre
- **Performance** optimisée
