#!/usr/bin/env node

/**
 * Post-Setup Validation Script
 * Ejecuta después de completar SETUP_SUPABASE.md y .env.local
 * 
 * Valida:
 * - Variables de entorno
 * - TypeScript compilation
 * - Next.js build success
 * - Base de datos connectivity (optional)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectRoot = path.join(__dirname, '..');

console.log('\n🚀 VALIDACIÓN POST-SETUP\n');
console.log('='.repeat(60));

let hasErrors = false;

// 1. Verificar .env.local
console.log('\n📝 1. Verificando .env.local...');
const envLocalPath = path.join(projectRoot, '.env.local');
if (!fs.existsSync(envLocalPath)) {
  console.log('❌ .env.local no encontrado');
  console.log('   → Ejecuta: npm run setup-supabase');
  hasErrors = true;
} else {
  console.log('✅ .env.local existe');
}

// 2. Verificar node_modules
console.log('\n📦 2. Verificando node_modules...');
const nodeModulesPath = path.join(projectRoot, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('❌ node_modules no encontrado');
  console.log('   → Ejecuta: npm install');
  hasErrors = true;
} else {
  console.log('✅ node_modules instalado');
}

// 3. TypeScript Check
console.log('\n🔍 3. Validando TypeScript...');
try {
  execSync('npm run type-check', { 
    cwd: projectRoot,
    stdio: 'pipe'
  });
  console.log('✅ TypeScript: ZERO ERRORS');
} catch (error) {
  console.log('❌ TypeScript tiene errores');
  console.log('   Ejecuta: npm run type-check');
  hasErrors = true;
}

// 4. ESLint
console.log('\n✨ 4. Verificando ESLint...');
try {
  execSync('npm run lint --silent', {
    cwd: projectRoot,
    stdio: 'pipe'
  });
  console.log('✅ ESLint: Pasó validación');
} catch (error) {
  console.log('⚠️  ESLint encontró issues (no crítico)');
  console.log('   Ejecuta: npm run lint');
}

// 5. Next.js Build
console.log('\n🔨 5. Compilando Next.js...');
try {
  execSync('npm run build', {
    cwd: projectRoot,
    stdio: 'pipe'
  });
  console.log('✅ Build exitoso');
} catch (error) {
  console.log('❌ Build falló');
  console.log('   Ejecuta: npm run build');
  hasErrors = true;
}

console.log('\n' + '='.repeat(60));

if (hasErrors) {
  console.log('\n❌ VALIDACIÓN FALLIDA');
  console.log('\nFijan errores y ejecuta nuevamente:');
  console.log('  npm run post-setup\n');
  process.exit(1);
} else {
  console.log('\n✅ VALIDACIÓN EXITOSA');
  console.log('\n🎉 Setup completado correctamente!');
  console.log('\nPróximos pasos:');
  console.log('  npm run dev              (iniciar servidor)');
  console.log('  http://localhost:3000    (abrir en navegador)');
  console.log('  /admin/db-setup          (setup base de datos)\n');
  process.exit(0);
}
