// Configuration API centralisée

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  cache: {
    enabled: boolean;
    ttl: number;
  };
  auth: {
    enabled: boolean;
    provider: 'local' | 'oauth' | 'jwt';
    tokenKey: string;
  };
  monitoring: {
    enabled: boolean;
    sentryDsn?: string;
  };
}

// Configuration par défaut
const defaultConfig: ApiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000'),
  retries: 3,
  cache: {
    enabled: process.env.NEXT_PUBLIC_CACHE_ENABLED === 'true',
    ttl: parseInt(process.env.NEXT_PUBLIC_CACHE_TTL || '300000'), // 5 minutes
  },
  auth: {
    enabled: process.env.NEXT_PUBLIC_AUTH_ENABLED === 'true',
    provider:
      (process.env.NEXT_PUBLIC_AUTH_PROVIDER as 'local' | 'oauth' | 'jwt') ||
      'local',
    tokenKey: 'auth_token',
  },
  monitoring: {
    enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
    sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  },
};

// Configuration WordPress
export const wordpressConfig = {
  baseUrl: process.env.NEXT_PUBLIC_WORDPRESS_URL || 'http://localhost:8080',
  apiUrl:
    process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
    'http://localhost:8080/wp-json/wp/v2',
  enabled: true,
};

// Configuration de l'application
export const appConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'Vanalexcars',
  version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  environment: process.env.NEXT_PUBLIC_APP_ENV || 'development',
  analytics: {
    enabled: !!process.env.NEXT_PUBLIC_ANALYTICS_ID,
    id: process.env.NEXT_PUBLIC_ANALYTICS_ID,
  },
};

// Configuration email
export const emailConfig = {
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: parseInt(process.env.SMTP_PORT || '587'),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || 'noreply@vanalexcars.com',
  },
  enabled: !!(
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  ),
};

// Configuration de stockage
export const storageConfig = {
  upload: {
    maxSize: parseInt(process.env.UPLOAD_MAX_SIZE || '10485760'), // 10MB
    allowedTypes: (
      process.env.UPLOAD_ALLOWED_TYPES || 'image/jpeg,image/png,application/pdf'
    ).split(','),
  },
  database: {
    url: process.env.DATABASE_URL || '',
    enabled: !!process.env.DATABASE_URL,
  },
};

// Configuration de sécurité
export const securityConfig = {
  jwt: {
    secret: process.env.JWT_SECRET || 'your-jwt-secret-here',
    expiresIn: '24h',
  },
  encryption: {
    key: process.env.ENCRYPTION_KEY || 'your-encryption-key-here',
  },
  cors: {
    origin:
      process.env.NODE_ENV === 'production'
        ? ['https://vanalexcars.com', 'https://www.vanalexcars.com']
        : ['http://localhost:3000', 'http://localhost:3006'],
    credentials: true,
  },
};

// Fonction pour valider la configuration
export function validateConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validation API
  if (!defaultConfig.baseUrl) {
    errors.push('NEXT_PUBLIC_API_URL is required');
  }

  // Validation email (si activé)
  if (emailConfig.enabled) {
    if (!emailConfig.smtp.host) {
      errors.push('SMTP_HOST is required for email functionality');
    }
    if (!emailConfig.smtp.user) {
      errors.push('SMTP_USER is required for email functionality');
    }
    if (!emailConfig.smtp.pass) {
      errors.push('SMTP_PASS is required for email functionality');
    }
  }

  // Validation WordPress (si activé)
  if (wordpressConfig.enabled) {
    if (!wordpressConfig.baseUrl) {
      errors.push(
        'NEXT_PUBLIC_WORDPRESS_URL is required for WordPress integration'
      );
    }
    if (!wordpressConfig.apiUrl) {
      errors.push(
        'NEXT_PUBLIC_WORDPRESS_API_URL is required for WordPress integration'
      );
    }
  }

  // Validation sécurité
  if (defaultConfig.auth.enabled) {
    if (securityConfig.jwt.secret === 'your-jwt-secret-here') {
      errors.push('JWT_SECRET must be set to a secure value');
    }
    if (securityConfig.encryption.key === 'your-encryption-key-here') {
      errors.push('ENCRYPTION_KEY must be set to a secure value');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Fonction pour obtenir la configuration complète
export function getConfig(): ApiConfig {
  return defaultConfig;
}

// Fonction pour obtenir la configuration d'un environnement spécifique
export function getConfigForEnvironment(
  env: 'development' | 'staging' | 'production'
): ApiConfig {
  const baseConfig = { ...defaultConfig };

  switch (env) {
    case 'development':
      return {
        ...baseConfig,
        timeout: 30000, // Plus de temps en dev
        retries: 1, // Moins de retry en dev
        cache: {
          enabled: false, // Pas de cache en dev
          ttl: 0,
        },
      };

    case 'staging':
      return {
        ...baseConfig,
        timeout: 15000,
        retries: 2,
        cache: {
          enabled: true,
          ttl: 300000, // 5 minutes
        },
      };

    case 'production':
      return {
        ...baseConfig,
        timeout: 10000,
        retries: 3,
        cache: {
          enabled: true,
          ttl: 600000, // 10 minutes
        },
      };

    default:
      return baseConfig;
  }
}

export default defaultConfig;
