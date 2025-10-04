#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Couleurs pour la console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const logSection = title => {
  log(`\n${'='.repeat(50)}`, 'cyan');
  log(`  ${title}`, 'bright');
  log(`${'='.repeat(50)}`, 'cyan');
};

const runCommand = (command, description) => {
  try {
    log(`\n🔍 ${description}...`, 'blue');
    execSync(command, { stdio: 'inherit' });
    log(`✅ ${description} terminé avec succès`, 'green');
    return true;
  } catch (error) {
    log(`❌ ${description} a échoué`, 'red');
    return false;
  }
};

const checkFileExists = filePath => {
  return fs.existsSync(path.join(process.cwd(), filePath));
};

const main = () => {
  log('🚀 Démarrage du circuit de validation de qualité', 'bright');

  const results = {
    typescript: false,
    eslint: false,
    prettier: false,
    build: false,
    tests: false,
  };

  // Vérification des fichiers de configuration
  logSection('Vérification des fichiers de configuration');

  const configFiles = [
    'tsconfig.json',
    '.eslintrc.js',
    '.prettierrc',
    'package.json',
  ];

  configFiles.forEach(file => {
    if (checkFileExists(file)) {
      log(`✅ ${file} trouvé`, 'green');
    } else {
      log(`❌ ${file} manquant`, 'red');
    }
  });

  // Vérification TypeScript
  logSection('Vérification TypeScript');
  results.typescript = runCommand(
    'npx tsc --noEmit',
    'Vérification des types TypeScript'
  );

  // Vérification ESLint
  logSection('Vérification ESLint');
  results.eslint = runCommand(
    'npx eslint .',
    'Vérification du code avec ESLint'
  );

  // Vérification Prettier
  logSection('Vérification Prettier');
  results.prettier = runCommand(
    'npx prettier --check .',
    'Vérification du formatage avec Prettier'
  );

  // Vérification de la build
  logSection('Vérification de la build');
  results.build = runCommand('npm run build', 'Build de production');

  // Vérification des tests (si disponibles)
  if (
    checkFileExists('jest.config.js') ||
    checkFileExists('vitest.config.ts')
  ) {
    logSection('Vérification des tests');
    results.tests = runCommand('npm test', 'Exécution des tests');
  } else {
    log('⚠️  Aucun fichier de configuration de test trouvé', 'yellow');
    results.tests = true; // Pas d'erreur si pas de tests
  }

  // Résumé
  logSection('Résumé des vérifications');

  const totalChecks = Object.keys(results).length;
  const passedChecks = Object.values(results).filter(Boolean).length;

  log(
    `\n📊 Résultats: ${passedChecks}/${totalChecks} vérifications réussies`,
    'bright'
  );

  Object.entries(results).forEach(([check, passed]) => {
    const status = passed ? '✅' : '❌';
    const color = passed ? 'green' : 'red';
    log(`${status} ${check}: ${passed ? 'PASSÉ' : 'ÉCHOUÉ'}`, color);
  });

  if (passedChecks === totalChecks) {
    log('\n🎉 Toutes les vérifications sont passées avec succès !', 'green');
    process.exit(0);
  } else {
    log(
      '\n⚠️  Certaines vérifications ont échoué. Veuillez corriger les erreurs.',
      'yellow'
    );
    process.exit(1);
  }
};

// Gestion des erreurs
process.on('uncaughtException', error => {
  log(`\n💥 Erreur inattendue: ${error.message}`, 'red');
  process.exit(1);
});

process.on('unhandledRejection', reason => {
  log(`\n💥 Promesse rejetée: ${reason}`, 'red');
  process.exit(1);
});

main();
