// components/tasks/TaskCard.tsx
// Tarjeta de tarea con pill de prioridad, acciones grandes con iconos y animaciones suaves.

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TaskWithSubject } from '@/lib/types';
import { Trash2, Edit2, CheckCircle2, Clock } from 'lucide-react';

interface TaskCardProps {
  task: TaskWithSubject;
  onComplete: (taskId: string) => Promise<void>;
  onEdit: (task: TaskWithSubject) => void;
  onDelete: (taskId: string) => Promise<void>;
  isCompleting?: boolean;
  isDeleting?: boolean;
}

// Mapeo de prioridad a colores del pill (suaves)
const priorityPillStyles: Record<TaskWithSubject['priority'], string> = {
  alta: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-200 dark:ring-rose-900',
  media: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:ring-amber-900',
  baja: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200 dark:ring-emerald-900',
};

const priorityDotStyles: Record<TaskWithSubject['priority'], string> = {
  alta: 'bg-rose-500',
  media: 'bg-amber-500',
  baja: 'bg-emerald-500',
};

const priorityLabels = {
  alta: 'Alta',
  media: 'Media',
  baja: 'Baja',
};

export function TaskCard({
  task,
  onComplete,
  onEdit,
  onDelete,
  isCompleting = false,
  isDeleting = false,
}: TaskCardProps) {
  const [isLocalCompleting, setIsLocalCompleting] = useState(false);
  const [isLocalDeleting, setIsLocalDeleting] = useState(false);

  const handleComplete = async () => {
    setIsLocalCompleting(true);
    try {
      await onComplete(task.id);
    } finally {
      setIsLocalCompleting(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      setIsLocalDeleting(true);
      try {
        await onDelete(task.id);
      } finally {
        setIsLocalDeleting(false);
      }
    }
  };

  const isCompleted = task.status === 'completada';
  const dueDate = new Date(task.due_date);
  const dueDateStr = dueDate.toLocaleDateString('es-CO', {
    month: 'short',
    day: 'numeric',
  });

  const baseRing = (task.isUrgent ?? false)
    ? 'ring-1 ring-amber-300/60 dark:ring-amber-500/40'
    : '';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3 }}
      className={`
        relative bg-[--cs-bg-card] rounded-2xl border border-[--cs-border]
        cs-shadow-soft hover:cs-shadow-card hover:-translate-y-0.5
        transition-all duration-300 overflow-hidden
        ${baseRing}
        ${isCompleting || isDeleting ? 'opacity-50' : ''}
      `}
    >
      <div className="p-5">
        {/* Encabezado: Título + Pill de prioridad */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <motion.h3
              animate={isCompleted ? { textDecoration: 'line-through' } : { textDecoration: 'none' }}
              transition={{ duration: 0.3 }}
              className={`text-base font-semibold leading-snug ${
                isCompleted ? 'text-[--cs-text-secondary]' : ''
              }`}
              style={!isCompleted ? { color: 'var(--cs-title)' } : undefined}
            >
              {task.title}
            </motion.h3>

            {task.description && (
              <p className="text-sm text-[--cs-text-secondary] line-clamp-2 mt-1.5">
                {task.description}
              </p>
            )}
          </div>

          {/* Pill redondeado de prioridad */}
          <span
            className={`
              inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap
              ${priorityPillStyles[task.priority]}
            `}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${priorityDotStyles[task.priority]}`} />
            {priorityLabels[task.priority]}
          </span>
        </div>

        {/* Metadata: Materia + Fecha */}
        <div className="flex items-center justify-between gap-2 text-xs text-[--cs-text-secondary] mb-4">
          <div className="flex items-center gap-2 min-w-0">
            {task.subject_name ? (
              <>
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0 ring-2"
                  style={{
                    backgroundColor: task.subject_color || '#7BAE7F',
                    boxShadow: `0 0 0 2px ${(task.subject_color || '#7BAE7F') + '22'}`,
                  }}
                />
                <span className="truncate font-medium text-[--cs-text-primary]">
                  {task.subject_name}
                </span>
              </>
            ) : (
              <span className="italic">Sin materia</span>
            )}
          </div>

          <span
            className={`shrink-0 inline-flex items-center gap-1 font-medium ${
              (task.isUrgent ?? false) ? 'text-amber-700 dark:text-amber-300' : ''
            }`}
          >
            <Clock size={12} />
            {dueDateStr}
          </span>
        </div>

        {/* Botones de acción más grandes con iconos */}
        <div className="flex items-center gap-2 pt-3 border-t border-[--cs-border-soft]">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleComplete}
            disabled={isCompleted || isLocalCompleting || isCompleting || isLocalDeleting}
            className={`
              flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-medium
              transition-all duration-200
              ${
                isCompleted
                  ? 'bg-[--cs-bg-soft] text-[--cs-text-secondary] cursor-not-allowed'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-200 dark:hover:bg-emerald-950/60'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
            title={isCompleted ? 'Tarea completada' : 'Marcar como completada'}
          >
            {isLocalCompleting || isCompleting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-4 h-4 rounded-full border-2 border-emerald-600 border-t-transparent"
              />
            ) : (
              <CheckCircle2 size={16} />
            )}
            <span>Completar</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onEdit(task)}
            disabled={isCompleted || isLocalDeleting}
            className={`
              flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-medium
              transition-all duration-200
              ${
                isCompleted
                  ? 'bg-[--cs-bg-soft] text-[--cs-text-secondary] cursor-not-allowed'
                  : 'bg-sky-50 text-sky-700 hover:bg-sky-100 dark:bg-sky-950/40 dark:text-sky-200 dark:hover:bg-sky-950/60'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
            title={isCompleted ? 'No se puede editar tarea completada' : 'Editar tarea'}
            aria-label="Editar"
          >
            <Edit2 size={16} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDelete}
            disabled={isLocalDeleting || isDeleting}
            className="
              flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-medium
              bg-rose-50 text-rose-700 hover:bg-rose-100
              dark:bg-rose-950/40 dark:text-rose-200 dark:hover:bg-rose-950/60
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
            "
            title="Eliminar tarea"
            aria-label="Eliminar"
          >
            {isLocalDeleting || isDeleting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-4 h-4 rounded-full border-2 border-rose-600 border-t-transparent"
              />
            ) : (
              <Trash2 size={16} />
            )}
          </motion.button>
        </div>

        {/* Indicador de urgencia */}
        {(task.isUrgent ?? false) && !isCompleted && (
          <motion.div
            animate={{ opacity: [0.55, 1, 0.55] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-3 right-3 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-amber-200 dark:ring-amber-500/30"
            title="Tarea urgente (menos de 48 horas)"
          />
        )}
      </div>
    </motion.div>
  );
}
