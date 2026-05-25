'use client';

import { Expense } from '@/lib/types';
import { formatCOP } from '@/lib/format';
import { Edit2, Trash2, Calendar } from 'lucide-react';

interface ExpenseCardProps {
  expense: Expense;
  onEdit?: (expense: Expense) => void;
  onDelete?: (id: string) => void;
}

type CategoryConfig = {
  emoji: string;
  accent: string;
  iconBg: string;
  pill: string;
};

const categoryConfig: Record<string, CategoryConfig> = {
  Fotocopias: {
    emoji: '📄',
    accent: '#818CF8',
    iconBg: 'bg-indigo-100 dark:bg-indigo-950/50',
    pill: 'bg-indigo-50 text-indigo-700 ring-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-200 dark:ring-indigo-900',
  },
  Transporte: {
    emoji: '🚌',
    accent: '#38BDF8',
    iconBg: 'bg-sky-100 dark:bg-sky-950/50',
    pill: 'bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-950/40 dark:text-sky-200 dark:ring-sky-900',
  },
  Comida: {
    emoji: '🍕',
    accent: '#FB923C',
    iconBg: 'bg-amber-100 dark:bg-amber-950/50',
    pill: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:ring-amber-900',
  },
  Materiales: {
    emoji: '📚',
    accent: '#A78BFA',
    iconBg: 'bg-violet-100 dark:bg-violet-950/50',
    pill: 'bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-950/40 dark:text-violet-200 dark:ring-violet-900',
  },
  Otro: {
    emoji: '✨',
    accent: '#94A3B8',
    iconBg: 'bg-slate-100 dark:bg-slate-800',
    pill: 'bg-slate-50 text-slate-700 ring-slate-200 dark:bg-slate-900/60 dark:text-slate-200 dark:ring-slate-700',
  },
};

export default function ExpenseCard({ expense, onEdit, onDelete }: ExpenseCardProps) {
  const cfg = categoryConfig[expense.category] || categoryConfig.Otro;
  const dateStr = new Date(expense.expense_date).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
  });

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[--cs-border] bg-[--cs-bg-card] cs-shadow-soft hover:cs-shadow-card hover:-translate-y-1 transition-all duration-300">
      {/* Linea de acento superior segun categoria */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-1"
        style={{ background: cfg.accent }}
      />

      {/* Acciones: visibles solo en hover/focus */}
      {(onEdit || onDelete) && (
        <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200">
          {onEdit && (
            <button
              onClick={() => onEdit(expense)}
              className="p-2 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 dark:bg-sky-950/40 dark:text-sky-200 dark:hover:bg-sky-950/60 transition-colors shadow-sm"
              title="Editar gasto"
              aria-label="Editar gasto"
            >
              <Edit2 size={14} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(expense.id)}
              className="p-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-200 dark:hover:bg-rose-950/60 transition-colors shadow-sm"
              title="Eliminar gasto"
              aria-label="Eliminar gasto"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      )}

      <div className="p-6 pt-7">
        {/* Header: icono grande circular + nombre + pill */}
        <div className="flex items-start gap-4 mb-5">
          <div
            className={`flex items-center justify-center w-14 h-14 rounded-2xl shrink-0 text-2xl ${cfg.iconBg}`}
            aria-hidden
          >
            {cfg.emoji}
          </div>

          <div className="min-w-0 flex-1 pr-16">
            <h4
              className="text-base font-semibold leading-snug truncate"
              style={{ color: 'var(--cs-title)' }}
              title={expense.name}
            >
              {expense.name}
            </h4>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 mt-2 rounded-full text-xs font-medium ring-1 ${cfg.pill}`}
            >
              {expense.category}
            </span>
          </div>
        </div>

        {/* Monto grande y bold en verde oscuro */}
        <p
          className="text-2xl font-bold tracking-tight mb-3"
          style={{ color: 'var(--cs-primary-darker)' }}
        >
          {formatCOP(expense.amount)}
        </p>

        {/* Footer: metodo de pago + fecha */}
        <div className="flex items-center gap-3 text-xs text-[--cs-text-secondary]">
          <span className="inline-flex items-center gap-1">
            <span aria-hidden>
              {expense.payment_method === 'Efectivo'
                ? '💵'
                : expense.payment_method === 'Tarjeta'
                ? '💳'
                : '🏦'}
            </span>
            <span>{expense.payment_method}</span>
          </span>
          <span aria-hidden>•</span>
          <span className="inline-flex items-center gap-1">
            <Calendar size={12} />
            {dateStr}
          </span>
        </div>
      </div>
    </div>
  );
}
