# 🧪 Stratégie de Tests - Vanalexcars

## Vue d'ensemble

Cette stratégie de tests couvre tous les aspects de l'application Vanalexcars, de l'intégration avec WordPress aux tests end-to-end.

## 🎯 Objectifs

- **Fiabilité** : Assurer le bon fonctionnement de l'application
- **Maintenabilité** : Faciliter les modifications futures
- **Qualité** : Maintenir un code de haute qualité
- **Performance** : Détecter les régressions de performance

## 📋 Types de Tests

### 1. Tests Unitaires (Jest + React Testing Library)

**Objectif** : Tester les composants et services individuellement

**Couverture** :

- ✅ Services API (`formService`, `authService`)
- ✅ Composants React (`ContactForm`, `VehicleRequestForm`, etc.)
- ✅ Hooks personnalisés (`useAuth`, `useForm`)
- ✅ Context API (`AppContext`)
- ✅ Utilitaires (`errorHandler`, `validation`)

**Commandes** :

```bash
npm run test              # Exécuter tous les tests
npm run test:watch        # Mode watch
npm run test:coverage     # Avec couverture
npm run test:ci           # Mode CI
```

### 2. Tests d'Intégration

**Objectif** : Tester l'interaction entre les composants et l'API WordPress

**Couverture** :

- ✅ Appels API vers WordPress
- ✅ Gestion des états de chargement
- ✅ Gestion des erreurs
- ✅ Validation des données
- ✅ Authentification

**Exemples** :

```typescript
// Test d'intégration API
it('should fetch vehicles from WordPress API', async () => {
  const mockResponse = { success: true, data: mockVehicles };
  global.fetch.mockResolvedValueOnce({ json: () => mockResponse });

  const result = await vehicleService.getVehicles();
  expect(result).toEqual(mockVehicles);
});
```

### 3. Tests End-to-End (Cypress)

**Objectif** : Tester l'expérience utilisateur complète

**Couverture** :

- ✅ Parcours utilisateur complet
- ✅ Soumission de formulaires
- ✅ Navigation entre pages
- ✅ Gestion des erreurs utilisateur
- ✅ Responsive design

**Commandes** :

```bash
npm run cypress:open       # Interface graphique
npm run cypress:run        # Exécution en ligne de commande
npm run test:e2e          # Tests E2E complets
```

## 🏗️ Architecture des Tests

### Structure des Fichiers

```
__tests__/
├── components/           # Tests des composants React
│   ├── ContactForm.test.tsx
│   ├── VehicleRequestForm.test.tsx
│   └── ...
├── services/            # Tests des services API
│   ├── formService.test.ts
│   ├── authService.test.ts
│   └── ...
├── context/             # Tests du Context API
│   └── AppContext.test.tsx
├── hooks/               # Tests des hooks personnalisés
│   ├── useAuth.test.ts
│   └── useForm.test.ts
└── utils/               # Tests des utilitaires
    └── errorHandler.test.ts

__mocks__/               # Mocks pour les tests
├── wordpress-api.js
├── next-router.js
└── ...

cypress/
├── e2e/                 # Tests E2E
│   ├── contact-form.cy.js
│   ├── vehicle-request.cy.js
│   └── ...
├── fixtures/            # Données de test
└── support/             # Configuration Cypress
```

## 🔧 Configuration

### Jest Configuration

```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
```

### Cypress Configuration

```javascript
// cypress.config.js
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3001',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
  },
});
```

## 🎭 Mocks et Fixtures

### Mocks WordPress API

```javascript
// __mocks__/wordpress-api.js
export const mockWordPressAPI = {
  vehicles: {
    getVehicles: jest.fn(() =>
      Promise.resolve({
        success: true,
        data: mockVehicles,
      })
    ),
  },
  forms: {
    submitContact: jest.fn(() =>
      Promise.resolve({
        success: true,
        data: { id: 1, message: 'Success' },
      })
    ),
  },
};
```

### Fixtures Cypress

```javascript
// cypress/fixtures/vehicles.json
{
  "vehicles": [
    {
      "id": 1,
      "title": "Porsche 911 Carrera",
      "price": "85000",
      "year": "2023"
    }
  ]
}
```

## 📊 Métriques de Qualité

### Couverture de Code

- **Branches** : 70%
- **Functions** : 70%
- **Lines** : 70%
- **Statements** : 70%

### Tests Requis

- **Tests unitaires** : 100% des composants
- **Tests d'intégration** : 100% des services API
- **Tests E2E** : 100% des parcours utilisateur critiques

## 🚀 Intégration CI/CD

### Pipeline de Tests

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:ci
      - run: npm run test:e2e
```

### Pré-commit Hooks

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run test && npm run lint",
      "pre-push": "npm run test:all"
    }
  }
}
```

## 🎯 Bonnes Pratiques

### Tests Unitaires

1. **Un test = une fonctionnalité**
2. **Nommage descriptif** : `should submit contact form successfully`
3. **Arrange-Act-Assert** pattern
4. **Mocks appropriés** pour les dépendances externes

### Tests d'Intégration

1. **Tests des appels API réels** (avec mocks)
2. **Validation des données** entrantes/sortantes
3. **Gestion des erreurs** réseau
4. **Performance** des requêtes

### Tests E2E

1. **Parcours utilisateur réalistes**
2. **Données de test réalistes**
3. **Tests sur différents navigateurs**
4. **Tests responsive**

## 🔍 Debugging

### Tests Unitaires

```bash
# Mode debug
npm run test -- --verbose

# Tests spécifiques
npm run test -- ContactForm

# Coverage détaillé
npm run test:coverage
```

### Tests E2E

```bash
# Interface graphique
npm run cypress:open

# Mode headless avec vidéo
npm run cypress:run -- --record --key <key>
```

## 📈 Monitoring

### Métriques de Tests

- **Temps d'exécution** des tests
- **Taux de réussite** des tests
- **Couverture de code** par composant
- **Performance** des tests E2E

### Alertes

- **Échec de tests** en CI
- **Baisse de couverture** de code
- **Régression** de performance
- **Erreurs** de tests E2E

## 🎉 Résultats Attendus

Avec cette stratégie de tests, nous obtenons :

- ✅ **Fiabilité** : 99%+ de taux de réussite
- ✅ **Maintenabilité** : Tests faciles à maintenir
- ✅ **Qualité** : Code de haute qualité
- ✅ **Performance** : Détection des régressions
- ✅ **Confiance** : Déploiements sécurisés

## 🚀 Prochaines Étapes

1. **Implémentation** des tests unitaires
2. **Configuration** des tests d'intégration
3. **Développement** des tests E2E
4. **Intégration** CI/CD
5. **Monitoring** et alertes
