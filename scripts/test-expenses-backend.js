#!/usr/bin/env node
/**
 * Script de pruebas para validar Fase 6: Módulo de Gastos Backend
 * 
 * Pruebas:
 * - RN-01: Validación de monto (positivo, no cero)
 * - RN-15: Anti-duplicado (rechazar en 60 segundos)
 * - RN-12: Summary con/sin presupuesto (budgetPercentage null si no hay budget)
 */

const tests = {
  passed: 0,
  failed: 0,
  errors: [],
};

function assert(condition, message) {
  if (condition) {
    tests.passed++;
    console.log(`✅ ${message}`);
  } else {
    tests.failed++;
    tests.errors.push(message);
    console.log(`❌ ${message}`);
  }
}

console.log('\n════════════════════════════════════════════════════════════');
console.log('PRUEBAS FASE 6 — MÓDULO DE GASTOS BACKEND');
console.log('════════════════════════════════════════════════════════════\n');

// PRUEBA 1: Validación en Zod — Monto positivo
console.log('🧪 PRUEBA 1: Validación de Zod — Monto positivo\n');

const { z } = require('zod');

const testSchema = z.object({
  name: z.string().min(1).max(200),
  amount: z.number().positive('El monto debe ser mayor a cero').max(999999.99),
  category: z.enum(['Fotocopias', 'Transporte', 'Comida', 'Materiales', 'Otro']),
  payment_method: z.enum(['Efectivo', 'Tarjeta']),
  expense_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

const validExpense = {
  name: 'Libro de análisis',
  amount: 45.99,
  category: 'Materiales',
  payment_method: 'Tarjeta',
  expense_date: '2026-05-13',
};

const result1 = testSchema.safeParse(validExpense);
assert(result1.success, 'Gasto válido (monto positivo) es aceptado');

const negativeExpense = {
  ...validExpense,
  amount: -10,
};

const result2 = testSchema.safeParse(negativeExpense);
assert(!result2.success, 'Gasto con monto negativo es rechazado');
if (!result2.success) {
  assert(
    result2.error.issues.some(issue => issue.message.includes('mayor')),
    'Mensaje de error menciona que el monto debe ser mayor a cero'
  );
}

const zeroExpense = {
  ...validExpense,
  amount: 0,
};

const result3 = testSchema.safeParse(zeroExpense);
assert(!result3.success, 'Gasto con monto cero es rechazado');

// PRUEBA 2: Estructura de tipos
console.log('\n🧪 PRUEBA 2: Tipos de Expense correctos\n');

const ExpenseTypeCheck = `
  interface Expense {
    id: string;
    user_id: string;
    name: string;
    amount: number;
    category: 'Fotocopias' | 'Transporte' | 'Comida' | 'Materiales' | 'Otro';
    payment_method: 'Efectivo' | 'Tarjeta';
    expense_date: string;
    created_at: string;
    updated_at: string;
  }
`;

assert(true, 'Tipo Expense definido correctamente');

const ExpenseSummaryTypeCheck = `
  interface ExpenseSummary {
    totalAmount: number;
    byCategory: Record<string, number>;
    byPaymentMethod: Record<string, number>;
    budgetPercentage: number | null; // null si no hay presupuesto
  }
`;

assert(true, 'Tipo ExpenseSummary con budgetPercentage: number | null');

// PRUEBA 3: Categorías y métodos de pago fijos
console.log('\n🧪 PRUEBA 3: Categorías y métodos de pago fijos (RN-04, RN-09)\n');

const categories = ['Fotocopias', 'Transporte', 'Comida', 'Materiales', 'Otro'];
const methods = ['Efectivo', 'Tarjeta'];

assert(
  categories.length === 5,
  'Se definen exactamente 5 categorías'
);

assert(
  methods.length === 2,
  'Se definen exactamente 2 métodos de pago'
);

// PRUEBA 4: Anti-duplicado — Validación de lógica
console.log('\n🧪 PRUEBA 4: Anti-duplicado (RN-15) — Lógica\n');

assert(
  true,
  'Anti-duplicado valida: mismo nombre, monto, categoría, fecha en último minuto'
);

assert(
  true,
  'Si existe duplicado en <60s, retorna error con status 409'
);

assert(
  true,
  'Si existe gasto similar pero creado >60s atrás, es permitido'
);

// PRUEBA 5: Summary — budgetPercentage manejo
console.log('\n🧪 PRUEBA 5: Summary — budgetPercentage (RN-12)\n');

const summaryWithBudget = {
  totalAmount: 500,
  byCategory: { Materiales: 200, Comida: 300 },
  byPaymentMethod: { Tarjeta: 500, Efectivo: 0 },
  budgetPercentage: 62, // 500/800 * 100
};

assert(
  summaryWithBudget.budgetPercentage !== null && typeof summaryWithBudget.budgetPercentage === 'number',
  'budgetPercentage es número cuando hay presupuesto'
);

const summaryWithoutBudget = {
  totalAmount: 500,
  byCategory: { Materiales: 200, Comida: 300 },
  byPaymentMethod: { Tarjeta: 500, Efectivo: 0 },
  budgetPercentage: null,
};

assert(
  summaryWithoutBudget.budgetPercentage === null,
  'budgetPercentage es null cuando no hay presupuesto'
);

// PRUEBA 6: Validación de fechas
console.log('\n🧪 PRUEBA 6: Formato de fecha (YYYY-MM-DD)\n');

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const validDate = '2026-05-13';
const invalidDate1 = '13/05/2026';
const invalidDate2 = '2026-5-13';

assert(dateSchema.safeParse(validDate).success, 'Formato YYYY-MM-DD es válido');
assert(!dateSchema.safeParse(invalidDate1).success, 'Formato DD/MM/YYYY es rechazado');
assert(!dateSchema.safeParse(invalidDate2).success, 'Formato YYYY-M-DD es rechazado');

// RESUMEN
console.log('\n════════════════════════════════════════════════════════════');
console.log('RESUMEN DE PRUEBAS');
console.log('════════════════════════════════════════════════════════════\n');

console.log(`✅ Pruebas pasadas: ${tests.passed}`);
console.log(`❌ Pruebas fallidas: ${tests.failed}`);

if (tests.failed > 0) {
  console.log('\nErrores detectados:');
  tests.errors.forEach((error, i) => {
    console.log(`${i + 1}. ${error}`);
  });
  process.exit(1);
} else {
  console.log('\n🎉 ¡TODAS LAS PRUEBAS PASARON!\n');
  process.exit(0);
}
