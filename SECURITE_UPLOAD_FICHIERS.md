# 🔒 Sécurité des Téléchargements - Vanalexcars

## ⚠️ **Risques de Sécurité**

### **Menaces Principales**

- **Malware** : Virus, trojans, ransomware
- **Scripts malveillants** : JavaScript, PHP, executables
- **Fichiers corrompus** : Exploits, buffer overflow
- **Taille excessive** : DDoS, saturation serveur
- **Types dangereux** : .exe, .bat, .cmd, .scr, .pif

---

## 🛡️ **Mesures de Sécurité Implémentées**

### **1. Validation des Types MIME**

```typescript
// Types autorisés uniquement
const allowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'application/pdf',
  'image/gif',
  'image/webp',
];

// Vérification stricte
if (!allowedMimeTypes.includes(file.type)) {
  throw new Error('Type de fichier non autorisé');
}
```

### **2. Validation des Extensions**

```typescript
// Extensions autorisées
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf', '.gif', '.webp'];

// Vérification de l'extension
const extension = path.extname(file.name).toLowerCase();
if (!allowedExtensions.includes(extension)) {
  throw new Error('Extension de fichier non autorisée');
}
```

### **3. Limitation de Taille**

```typescript
// Taille maximale par fichier (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

if (file.size > MAX_FILE_SIZE) {
  throw new Error('Fichier trop volumineux (max 5MB)');
}
```

### **4. Nombre de Fichiers Limité**

```typescript
// Maximum 2 fichiers par catégorie
const MAX_FILES_PER_CATEGORY = 2;

if (files.length > MAX_FILES_PER_CATEGORY) {
  throw new Error('Trop de fichiers (max 2 par catégorie)');
}
```

---

## 🔧 **Améliorations de Sécurité à Implémenter**

### **1. Scan Antivirus**

```typescript
// Intégration d'un scanner antivirus
const scanFile = async (file: File): Promise<boolean> => {
  // Utiliser ClamAV ou VirusTotal API
  const response = await fetch('/api/scan-virus', {
    method: 'POST',
    body: file,
  });

  const result = await response.json();
  return result.clean;
};
```

### **2. Validation du Contenu**

```typescript
// Vérification du contenu réel du fichier
const validateFileContent = (file: File): Promise<boolean> => {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => {
      const content = e.target?.result as ArrayBuffer;

      // Vérifier les magic numbers
      const magicNumbers = {
        'image/jpeg': [0xff, 0xd8, 0xff],
        'image/png': [0x89, 0x50, 0x4e, 0x47],
        'application/pdf': [0x25, 0x50, 0x44, 0x46],
      };

      const isValid = checkMagicNumbers(content, magicNumbers[file.type]);
      resolve(isValid);
    };
    reader.readAsArrayBuffer(file);
  });
};
```

### **3. Sanitisation des Noms**

```typescript
// Nettoyer les noms de fichiers
const sanitizeFileName = (fileName: string): string => {
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Caractères spéciaux
    .replace(/\.{2,}/g, '.') // Points multiples
    .replace(/^\.+|\.+$/g, '') // Points en début/fin
    .substring(0, 255); // Longueur maximale
};
```

### **4. Quarantaine des Fichiers**

```typescript
// Stockage temporaire en quarantaine
const quarantineFile = async (file: File): Promise<string> => {
  const quarantineId = generateSecureId();
  const quarantinePath = `/quarantine/${quarantineId}`;

  // Stocker en quarantaine
  await storeFile(file, quarantinePath);

  // Scanner après 24h
  setTimeout(
    () => {
      scanQuarantinedFile(quarantineId);
    },
    24 * 60 * 60 * 1000
  );

  return quarantineId;
};
```

---

## 🚨 **Protection Avancée**

### **1. Rate Limiting**

```typescript
// Limiter le nombre d'uploads par IP
const rateLimit = new Map();

const checkRateLimit = (ip: string): boolean => {
  const now = Date.now();
  const window = 60 * 60 * 1000; // 1 heure
  const maxUploads = 10; // Max 10 uploads/heure

  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, []);
  }

  const uploads = rateLimit.get(ip);
  const recentUploads = uploads.filter(time => now - time < window);

  if (recentUploads.length >= maxUploads) {
    return false; // Rate limit dépassé
  }

  recentUploads.push(now);
  rateLimit.set(ip, recentUploads);
  return true;
};
```

### **2. Honeypot**

```typescript
// Piège pour détecter les bots
const honeypotField = document.createElement('input');
honeypotField.type = 'text';
honeypotField.name = 'website';
honeypotField.style.display = 'none';

// Si le champ est rempli, c'est un bot
if (honeypotField.value) {
  throw new Error('Soumission suspecte détectée');
}
```

### **3. Validation CAPTCHA**

```typescript
// Intégration reCAPTCHA
const validateCaptcha = async (token: string): Promise<boolean> => {
  const response = await fetch('/api/verify-captcha', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });

  const result = await response.json();
  return result.success;
};
```

---

## 🔐 **Configuration Serveur**

### **1. Headers de Sécurité**

```typescript
// Headers HTTP sécurisés
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Content-Security-Policy': "default-src 'self'",
  'Strict-Transport-Security': 'max-age=31536000',
};
```

### **2. Configuration Nginx**

```nginx
# Limitation de taille
client_max_body_size 10M;

# Types de fichiers autorisés
location ~* \.(jpg|jpeg|png|pdf|gif|webp)$ {
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
}

# Blocage des exécutables
location ~* \.(exe|bat|cmd|scr|pif|com)$ {
    deny all;
}
```

### **3. Configuration PHP**

```php
// Désactiver l'exécution de code
ini_set('allow_url_fopen', 0);
ini_set('allow_url_include', 0);

// Limitation de taille
ini_set('upload_max_filesize', '5M');
ini_set('post_max_size', '10M');
ini_set('max_execution_time', 30);
```

---

## 📊 **Monitoring et Alertes**

### **1. Logs de Sécurité**

```typescript
// Logger les tentatives suspectes
const logSecurityEvent = (event: string, details: any) => {
  console.log(`🚨 SECURITY: ${event}`, {
    timestamp: new Date().toISOString(),
    ip: getClientIP(),
    userAgent: navigator.userAgent,
    details,
  });

  // Envoyer une alerte
  sendSecurityAlert(event, details);
};
```

### **2. Détection d'Anomalies**

```typescript
// Détecter les patterns suspects
const detectAnomalies = (files: File[]): boolean => {
  // Trop de fichiers similaires
  const similarNames = files.filter(
    f => f.name.includes('copy') || f.name.includes('(1)')
  );

  // Taille suspecte (trop petite ou trop grande)
  const suspiciousSizes = files.filter(
    f => f.size < 1024 || f.size > 4 * 1024 * 1024
  );

  return similarNames.length > 2 || suspiciousSizes.length > 0;
};
```

---

## 🛠️ **Implémentation Pratique**

### **1. Middleware de Sécurité**

```typescript
// Middleware pour valider les uploads
export const securityMiddleware = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  // Vérifier le rate limiting
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Trop de requêtes' });
  }

  // Vérifier le CAPTCHA
  const captchaToken = req.headers['x-captcha-token'];
  if (!(await validateCaptcha(captchaToken))) {
    return res.status(400).json({ error: 'CAPTCHA invalide' });
  }

  // Continuer avec la validation des fichiers
  next();
};
```

### **2. Validation Renforcée**

```typescript
// Validation complète des fichiers
const validateUpload = async (files: File[]): Promise<boolean> => {
  for (const file of files) {
    // 1. Type MIME
    if (!allowedMimeTypes.includes(file.type)) {
      throw new Error('Type de fichier non autorisé');
    }

    // 2. Extension
    const extension = path.extname(file.name).toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      throw new Error('Extension non autorisée');
    }

    // 3. Taille
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('Fichier trop volumineux');
    }

    // 4. Contenu
    if (!(await validateFileContent(file))) {
      throw new Error('Contenu de fichier suspect');
    }

    // 5. Scan antivirus
    if (!(await scanFile(file))) {
      throw new Error('Fichier infecté détecté');
    }
  }

  return true;
};
```

---

## 📋 **Checklist de Sécurité**

### **✅ Mesures Actuelles**

- [x] Validation des types MIME
- [x] Limitation de taille (5MB)
- [x] Limitation du nombre de fichiers
- [x] Renommage automatique
- [x] Validation côté client

### **🔄 À Implémenter**

- [ ] Scan antivirus
- [ ] Validation du contenu
- [ ] Rate limiting
- [ ] CAPTCHA
- [ ] Honeypot
- [ ] Quarantaine
- [ ] Logs de sécurité
- [ ] Monitoring

### **🚨 Priorité Haute**

1. **Scan antivirus** : Protection contre malware
2. **Rate limiting** : Protection contre spam
3. **Validation contenu** : Détection de fichiers corrompus
4. **CAPTCHA** : Protection contre bots

---

## 💡 **Recommandations**

### **1. Outils Recommandés**

- **ClamAV** : Scanner antivirus open source
- **VirusTotal API** : Scan en ligne
- **reCAPTCHA** : Protection contre bots
- **Cloudflare** : Protection DDoS

### **2. Bonnes Pratiques**

- **Isolation** : Stocker les fichiers dans un répertoire isolé
- **Permissions** : Limiter les permissions d'accès
- **Backup** : Sauvegardes régulières
- **Monitoring** : Surveillance 24/7

### **3. Formation**

- **Équipe** : Formation sur les risques
- **Procédures** : Procédures d'incident
- **Tests** : Tests de pénétration réguliers

---

_Documentation générée le : ${new Date().toLocaleString('fr-FR')}_
_Version : 1.0_
_Dernière mise à jour : ${new Date().toISOString()}_
