'use client';

import Link from 'next/link';
import { Target } from 'lucide-react';
import { formatCOP } from '@/lib/format';

interface BudgetBarProps {
  totalAmount: number;
  budgetPercentage: number | null;
}

export default function BudgetBar({ totalAmount, budgetPercentage }: BudgetBarProps) {
  // Sin presupuesto configurado
  if (budgetPercentage === null) {
    return (
      <div className="rounded-3xl border border-[--cs-border] bg-[--cs-bg-card] p-7 cs-shadow-card">
        <div className="flex items-center gap-3 mb-3">
          <span
            className="inline-flex items-center justify-center w-11 h-11 rounded-2xl text-white shrink-0"
            style={{ background: 'var(--cs-gradient-primary)' }}
          >
            <Target size={20} />
          </span>
          <div>
            <h3 className="text-base font-semibold leading-tight" style={{ color: 'var(--cs-title)' }}>
              Presupuesto mensual
            </h3>
            <p className="text-xs text-[--cs-text-secondary] mt-0.5">Sin configurar</p>
          </div>
        </div>
        <p className="text-sm text-[--cs-text-secondary] mb-4">
          Define un límite mensual para seguir mejor tus gastos.
        </p>
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[--cs-bg-soft] text-[--cs-primary-darker] text-sm font-medium hover:bg-[--cs-secondary] hover:text-white transition-all duration-200"
        >
          Configurar presupuesto →
        </Link>
      </div>
    );
  }

  // Estado del presupuesto
  const status: 'ok' | 'warning' | 'over' =
    budgetPercentage < 80 ? 'ok' : budgetPercentage < 100 ? 'warning' : 'over';

  const barGradient =
    status === 'ok'
      ? 'linear-gradient(90deg, #5D9763 0%, #7BAE7F 50%, #A8D5A2 100%)'
      : status === 'warning'
      ? 'linear-gradient(90deg, #C97B1E 0%, #F4A261 50%, #FBC97D 100%)'
      : 'linear-gradient(90deg, #B91C1C 0%, #E63946 50%, #FF6B6B 100%)';

  const subtitle =
    status === 'ok' ? 'Presupuesto bajo control' : status === 'warning' ? 'Cerca del límite' : 'Presupuesto excedido';

  const percentColor =
    status === 'ok' ? 'var(--cs-primary-darker)' : status === 'warning' ? '#B45309' : '#B91C1C';

  const glow =
    status === 'ok'
      ? '0 0 16px rgba(123, 174, 127, 0.45)'
      : status === 'warning'
      ? '0 0 16px rgba(244, 162, 97, 0.45)'
      : '0 0 16px rgba(230, 57, 70, 0.45)';

  return (
    <div className="rounded-3xl border border-[--cs-border] bg-[--cs-bg-card] p-7 cs-shadow-card">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <span
            className="inline-flex items-center justify-center w-11 h-11 rounded-2xl text-white shrink-0"
            style={{ background: 'var(--cs-gradient-primary)' }}
          >
            <Target size={20} />
          </span>
          <div>
            <h3 className="text-base font-semibold leading-tight" style={{ color: 'var(--cs-title)' }}>
              Presupuesto mensual
            </h3>
            <p className="text-xs text-[--cs-text-secondary] mt-0.5">{subtitle}</p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <p
            className="text-4xl font-bold tracking-tight leading-none"
            style={{ color: percentColor }}
          >
            {budgetPercentage.toFixed(0)}%
          </p>
          <p className="text-xs text-[--cs-text-secondary] mt-1.5">usado</p>
        </div>
      </div>

      {/* Barra de progreso gruesa, redondeada y con gradiente */}
      <div className="relative w-full bg-[--cs-bg-soft] rounded-full h-4 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${Math.min(budgetPercentage, 100)}%`,
            background: barGradient,
            boxShadow: glow,
          }}
        />
      </div>

      <div className="flex items-center justify-between mt-5 text-sm">
        <span className="text-[--cs-text-secondary]">Total gastado este mes</span>
        <span className="font-bold tracking-tight" style={{ color: 'var(--cs-primary-darker)' }}>
          {formatCOP(totalAmount)}
        </span>
      </div>
    </div>
  );
}
