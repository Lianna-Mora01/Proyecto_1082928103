#!/usr/bin/env node

/**
 * Verificador de Setup de Supabase
 * Usa: node scripts/verify-supabase-setup.js
 */

const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const envLocalPath = path.join(projectRoot, '.env.local');

console.log('🔍 VERIFICADOR DE SETUP SUPABASE\n');
console.log('=' .repeat(50));

// 1. Verificar si .env.local existe
console.log('\n1️⃣  Verificando archivo .env.local...');
if (fs.existsSync(envLocalPath)) {
  console.log('   ✅ Archivo encontrado');
} else {
  console.log('   ❌ Archivo NO encontrado en:', envLocalPath);
  console.log('   → Crea el archivo: SETUP_SUPABASE.md');
  process.exit(1);
}

// 2. Leer contenido
console.log('\n2️⃣  Verificando variables requeridas...\n');

const envContent = fs.readFileSync(envLocalPath, 'utf-8');

const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
];

const optionalVars = [
  'JWT_SECRET',
  'ADMIN_BOOTSTRAP_SECRET',
  'BLOB_READ_WRITE_TOKEN',
];

let hasErrors = false;

// Verificar variables requeridas
console.log('📌 VARIABLES REQUERIDAS:');
requiredVars.forEach((varName) => {
  const regex = new RegExp(`^${varName}=(.+)$`, 'm');
  const match = envContent.match(regex);

  if (match && match[1] && match[1].trim()) {
    const value = match[1];
    const display = value.length > 20 ? value.substring(0, 20) + '...' : value;
    console.log(`   ✅ ${varName} = ${display}`);
  } else {
    console.log(`   ❌ ${varName} = [VACÍO O NO ENCONTRADO]`);
    hasErrors = true;
  }
});

// Verificar variables opcionales
console.log('\n📌 VARIABLES OPCIONALES:');
optionalVars.forEach((varName) => {
  const regex = new RegExp(`^${varName}=(.+)$`, 'm');
  const match = envContent.match(regex);

  if (match && match[1] && match[1].trim()) {
    console.log(`   ✅ ${varName} configurado`);
  } else {
    console.log(`   ⚠️  ${varName} no configurado (opcional)`);
  }
});

console.log('\n' + '='.repeat(50));

if (hasErrors) {
  console.log('\n❌ SETUP INCOMPLETO');
  console.log('Falta configurar variables requeridas.');
  console.log('\nPasos:');
  console.log('1. Lee: SETUP_SUPABASE.md');
  console.log('2. Obtén credenciales de Supabase dashboard');
  console.log('3. Edita .env.local con los valores');
  console.log('4. Ejecuta este script nuevamente\n');
  process.exit(1);
} else {
  console.log('\n✅ SETUP COMPLETADO');
  console.log('Todas las variables requeridas están configuradas.');
  console.log('\nPróximos pasos:');
  console.log('1. npm run dev          (iniciar servidor)');
  console.log('2. Accede a http://localhost:3000');
  console.log('3. Ve a /admin/db-setup para bootstrap');
  console.log('4. Crea un usuario estudiante para probar\n');
  process.exit(0);
}
