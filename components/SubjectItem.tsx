'use client';

import { Subject } from '@/lib/types';
import { Edit2, Archive } from 'lucide-react';

interface SubjectItemProps {
  subject: Subject;
  onEdit: (subject: Subject) => void;
  onDeactivate: (id: string) => void;
}

export function SubjectItem({ subject, onEdit, onDeactivate }: SubjectItemProps) {
  const color = subject.color || '#7BAE7F';

  return (
    <div
      className="group relative overflow-hidden rounded-3xl border border-[--cs-border] bg-[--cs-bg-card] p-6 cs-shadow-soft hover:cs-shadow-lg hover:-translate-y-1 transition-all duration-300"
      style={{
        backgroundImage: `linear-gradient(135deg, ${color}26 0%, ${color}0A 60%, transparent 100%)`,
      }}
    >
      {/* Decorativo: circulo difuso del color */}
      <div
        aria-hidden
        className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-25 blur-2xl pointer-events-none"
        style={{ background: color }}
      />

      <div className="relative">
        {/* Color chip + nombre */}
        <div className="flex items-start gap-3 mb-4">
          <span
            className="inline-flex items-center justify-center w-12 h-12 rounded-2xl shrink-0 text-white text-xl font-bold"
            style={{
              background: `linear-gradient(135deg, ${color}, ${color}CC)`,
              boxShadow: `0 8px 16px ${color}40`,
            }}
            aria-hidden
          >
            {subject.name.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <h3
              className="text-xl font-bold leading-snug truncate"
              style={{ color: 'var(--cs-title)' }}
            >
              {subject.name}
            </h3>
            <p className="text-xs text-[--cs-text-secondary] mt-1">
              Creada el {new Date(subject.created_at).toLocaleDateString('es-CO')}
            </p>
          </div>
        </div>

        {/* Acciones esteticas */}
        <div className="flex items-center gap-2 pt-4 border-t border-[--cs-border-soft]">
          <button
            onClick={() => onEdit(subject)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-sky-50 text-sky-700 hover:bg-sky-100 dark:bg-sky-950/40 dark:text-sky-200 dark:hover:bg-sky-950/60 transition-all duration-200"
          >
            <Edit2 size={15} />
            Editar
          </button>
          <button
            onClick={() => onDeactivate(subject.id)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-[--cs-bg-soft] text-[--cs-text-primary] hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/40 dark:hover:text-rose-200 transition-all duration-200"
          >
            <Archive size={15} />
            Desactivar
          </button>
        </div>
      </div>
    </div>
  );
}
