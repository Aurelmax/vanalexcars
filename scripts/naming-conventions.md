# Règles de Nommage - Vanalexcars

## 📋 Vue d'ensemble

Ce document définit les conventions de nommage pour le projet Vanalexcars, garantissant la cohérence et la lisibilité du code.

## 🎯 Principes généraux

- **Cohérence** : Utiliser les mêmes conventions dans tout le projet
- **Lisibilité** : Les noms doivent être explicites et compréhensibles
- **Concision** : Éviter les noms trop longs sans sacrifier la clarté
- **Anglais** : Utiliser l'anglais pour le code, français pour les commentaires utilisateur

## 📁 Structure des dossiers

```
src/
├── components/          # Composants React réutilisables
├── pages/              # Pages Next.js
├── types/               # Définitions TypeScript
├── utils/               # Fonctions utilitaires
├── hooks/               # Hooks React personnalisés
├── services/            # Services API et logique métier
├── constants/           # Constantes de l'application
├── styles/              # Styles globaux et thèmes
└── __tests__/           # Tests unitaires et d'intégration
```

## 🏷️ Conventions de nommage

### 1. Fichiers et dossiers

#### Dossiers

- **camelCase** : `userProfile`, `apiClient`
- **kebab-case** : `user-profile`, `api-client` (pour les dossiers publics)

#### Fichiers

- **PascalCase** pour les composants : `UserProfile.tsx`, `ApiClient.ts`
- **camelCase** pour les utilitaires : `formatDate.ts`, `validateEmail.ts`
- **kebab-case** pour les pages : `user-profile.tsx`, `contact-us.tsx`

### 2. Variables et fonctions

#### Variables

```typescript
// ✅ Bon
const userName = 'john_doe';
const isUserLoggedIn = true;
const MAX_RETRY_ATTEMPTS = 3;

// ❌ Mauvais
const user_name = 'john_doe';
const IsUserLoggedIn = true;
const maxRetryAttempts = 3; // Pas assez descriptif
```

#### Fonctions

```typescript
// ✅ Bon
const getUserProfile = (userId: string) => {
  /* ... */
};
const validateEmailAddress = (email: string) => {
  /* ... */
};
const formatCurrency = (amount: number) => {
  /* ... */
};

// ❌ Mauvais
const getUser = (id: string) => {
  /* ... */
}; // Trop vague
const validateEmail = (email: string) => {
  /* ... */
}; // Pas assez descriptif
const formatMoney = (amount: number) => {
  /* ... */
}; // Incohérent
```

### 3. Types et interfaces

#### Types

```typescript
// ✅ Bon
type UserRole = 'admin' | 'user' | 'guest';
type ApiResponse<T> = {
  data: T;
  status: number;
  message: string;
};

// ❌ Mauvais
type userRole = 'admin' | 'user' | 'guest'; // Pas de PascalCase
type ApiResponse<T> = {
  data: T;
  status: number;
  message: string;
}; // Pas de préfixe descriptif
```

#### Interfaces

```typescript
// ✅ Bon
interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
}

interface ApiClientConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
}

// ❌ Mauvais
interface userProfile {
  /* ... */
} // Pas de PascalCase
interface ApiConfig {
  /* ... */
} // Trop vague
```

### 4. Composants React

#### Composants

```typescript
// ✅ Bon
const UserProfileCard = ({ user }: UserProfileCardProps) => {
  /* ... */
};
const ApiErrorMessage = ({ error }: ApiErrorMessageProps) => {
  /* ... */
};
const LoadingSpinner = ({ size }: LoadingSpinnerProps) => {
  /* ... */
};

// ❌ Mauvais
const UserCard = ({ user }: UserCardProps) => {
  /* ... */
}; // Trop vague
const ErrorMessage = ({ error }: ErrorMessageProps) => {
  /* ... */
}; // Pas assez spécifique
const Spinner = ({ size }: SpinnerProps) => {
  /* ... */
}; // Pas assez descriptif
```

#### Props

```typescript
// ✅ Bon
interface UserProfileCardProps {
  user: User;
  showActions: boolean;
  onEdit: (userId: string) => void;
  onDelete: (userId: string) => void;
  className?: string;
}

// ❌ Mauvais
interface UserProfileCardProps {
  user: User;
  showActions: boolean;
  onEdit: (id: string) => void; // Pas assez descriptif
  onDelete: (id: string) => void; // Pas assez descriptif
  className?: string;
}
```

### 5. Hooks personnalisés

```typescript
// ✅ Bon
const useUserProfile = (userId: string) => {
  /* ... */
};
const useApiClient = (config: ApiClientConfig) => {
  /* ... */
};
const useLocalStorage = <T>(key: string, defaultValue: T) => {
  /* ... */
};

// ❌ Mauvais
const useUser = (id: string) => {
  /* ... */
}; // Trop vague
const useApi = (config: ApiClientConfig) => {
  /* ... */
}; // Pas assez descriptif
const useStorage = <T>(key: string, defaultValue: T) => {
  /* ... */
}; // Pas assez spécifique
```

### 6. Services et API

#### Services

```typescript
// ✅ Bon
class UserService {
  async getUserProfile(userId: string): Promise<UserProfile> {
    /* ... */
  }
  async updateUserProfile(
    userId: string,
    data: Partial<UserProfile>
  ): Promise<UserProfile> {
    /* ... */
  }
  async deleteUser(userId: string): Promise<void> {
    /* ... */
  }
}

class ApiClient {
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    /* ... */
  }
  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    /* ... */
  }
  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    /* ... */
  }
}

// ❌ Mauvais
class User {
  /* ... */
} // Trop vague, conflit avec le type User
class Api {
  /* ... */
} // Pas assez descriptif
```

#### Endpoints API

```typescript
// ✅ Bon
const API_ENDPOINTS = {
  USERS: '/api/users',
  USER_PROFILE: '/api/users/profile',
  USER_PREFERENCES: '/api/users/preferences',
  AUTH_LOGIN: '/api/auth/login',
  AUTH_LOGOUT: '/api/auth/logout',
  AUTH_REFRESH: '/api/auth/refresh',
} as const;

// ❌ Mauvais
const API_ENDPOINTS = {
  users: '/api/users', // Pas de UPPER_CASE
  userProfile: '/api/users/profile', // Pas de UPPER_CASE
  auth: '/api/auth', // Trop vague
} as const;
```

### 7. Constantes

```typescript
// ✅ Bon
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const DEFAULT_PAGE_SIZE = 20;
const API_TIMEOUT = 30000; // 30 seconds
const SUPPORTED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'] as const;

// ❌ Mauvais
const maxFileSize = 5 * 1024 * 1024; // Pas de UPPER_CASE
const defaultPageSize = 20; // Pas de UPPER_CASE
const apiTimeout = 30000; // Pas de UPPER_CASE
```

### 8. Événements et callbacks

```typescript
// ✅ Bon
const handleUserLogin = (user: User) => {
  /* ... */
};
const handleFormSubmit = (data: FormData) => {
  /* ... */
};
const handleApiError = (error: ApiError) => {
  /* ... */
};

// ❌ Mauvais
const onUserLogin = (user: User) => {
  /* ... */
}; // Pas de préfixe handle
const onSubmit = (data: FormData) => {
  /* ... */
}; // Pas assez descriptif
const onError = (error: ApiError) => {
  /* ... */
}; // Pas assez descriptif
```

## 🔧 Règles spécifiques au projet

### 1. WordPress Headless

#### Types WordPress

```typescript
// ✅ Bon
interface WordPressPost {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  modified: string;
  slug: string;
  status: 'publish' | 'draft' | 'private';
  author: number;
  featured_media: number;
  categories: number[];
  tags: number[];
}

// ❌ Mauvais
interface Post {
  /* ... */
} // Pas de préfixe WordPress
interface WPPost {
  /* ... */
} // Abréviation non standard
```

#### Services WordPress

```typescript
// ✅ Bon
class WordPressApiClient {
  async getPosts(params: WordPressQueryParams): Promise<WordPressPost[]> {
    /* ... */
  }
  async getPost(id: number): Promise<WordPressPost> {
    /* ... */
  }
  async createPost(post: CreatePostRequest): Promise<WordPressPost> {
    /* ... */
  }
}

// ❌ Mauvais
class WPApiClient {
  /* ... */
} // Abréviation non standard
class WordPressClient {
  /* ... */
} // Pas assez spécifique
```

### 2. Vanalexcars spécifique

#### Types métier

```typescript
// ✅ Bon
interface VanalexcarsForfait {
  id: number;
  title: string;
  slug: string;
  content: string;
  meta: {
    prix: string;
    description_courte: string;
    services_inclus: string[];
    is_popular: boolean;
    is_vip: boolean;
  };
}

interface VanalexcarsVehicule {
  id: number;
  title: string;
  slug: string;
  meta: {
    marque: string;
    modele: string;
    annee: number;
    prix: number;
    kilometrage: number;
    carburant: 'essence' | 'diesel' | 'hybride' | 'electrique';
  };
}

// ❌ Mauvais
interface Forfait {
  /* ... */
} // Pas de préfixe Vanalexcars
interface Vehicule {
  /* ... */
} // Pas de préfixe Vanalexcars
```

## 📝 Exemples pratiques

### Composant complet

```typescript
// ✅ Bon
interface UserProfileCardProps {
  user: User;
  showActions: boolean;
  onEdit: (userId: string) => void;
  onDelete: (userId: string) => void;
  className?: string;
}

const UserProfileCard = ({
  user,
  showActions,
  onEdit,
  onDelete,
  className
}: UserProfileCardProps) => {
  const handleEditClick = () => onEdit(user.id);
  const handleDeleteClick = () => onDelete(user.id);

  return (
    <div className={className}>
      {/* ... */}
    </div>
  );
};

// ❌ Mauvais
interface UserCardProps {
  user: User;
  showActions: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  className?: string;
}

const UserCard = ({ user, showActions, onEdit, onDelete, className }) => {
  const handleEdit = () => onEdit(user.id);
  const handleDelete = () => onDelete(user.id);

  return (
    <div className={className}>
      {/* ... */}
    </div>
  );
};
```

## 🚀 Mise en pratique

1. **Utiliser les outils de validation** : ESLint, Prettier, TypeScript
2. **Réviser le code** : Vérifier la cohérence des noms
3. **Documenter les exceptions** : Justifier les écarts aux règles
4. **Former l'équipe** : Partager ces conventions avec tous les développeurs

## 📚 Ressources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Naming Conventions](https://reactjs.org/docs/thinking-in-react.html)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Configuration](https://prettier.io/docs/en/configuration.html)
