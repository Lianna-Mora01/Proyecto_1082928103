// lib/format.ts
// Formato de moneda explicito en pesos colombianos (COP).
// En Colombia no se usan centavos en el dia a dia, asi que truncamos a 0 decimales.

const copFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

const copNumberFormatter = new Intl.NumberFormat("es-CO", {
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

/**
 * Formatea un monto como pesos colombianos. Ej: 1500 -> "$ 1.500"
 */
export function formatCOP(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || Number.isNaN(Number(amount))) {
    return "$ 0";
  }
  return copFormatter.format(Number(amount));
}

/**
 * Formatea solo el numero con separadores colombianos (sin simbolo).
 * Util para tooltips compactos o ejes de graficas. Ej: 1500 -> "1.500"
 */
export function formatCOPNumber(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || Number.isNaN(Number(amount))) {
    return "0";
  }
  return copNumberFormatter.format(Number(amount));
}
