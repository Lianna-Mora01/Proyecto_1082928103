// components/tasks/TaskCard.tsx
// Tarjeta de tarea con borde por prioridad, animaciones y opciones de edición/completado

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TaskWithSubject } from '@/lib/types';
import { Trash2, Edit2, CheckCircle2 } from 'lucide-react';

interface TaskCardProps {
  task: TaskWithSubject;
  onComplete: (taskId: string) => Promise<void>;
  onEdit: (task: TaskWithSubject) => void;
  onDelete: (taskId: string) => Promise<void>;
  isCompleting?: boolean;
  isDeleting?: boolean;
}

// Mapeo de prioridad a color de borde izquierdo
const priorityColors = {
  alta: 'border-l-4 border-l-red-500',      // Rojo para alta
  media: 'border-l-4 border-l-orange-400',  // Naranja para media
  baja: 'border-l-4 border-l-green-500',    // Verde para baja
};

// Mapeo de prioridad a badge color
const priorityBadgeColors = {
  alta: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  media: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  baja: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
};

const priorityLabels = {
  alta: 'Alta',
  media: 'Media',
  baja: 'Baja',
};

// Calcula si la tarea está próxima a vencer
const getUrgencyClass = (isUrgent: boolean) => {
  return isUrgent ? 'ring-1 ring-orange-300 dark:ring-orange-600' : '';
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
  const dueDateStr = dueDate.toLocaleDateString('es-ES', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{
        opacity: 0,
        y: -10,
        transition: { duration: 0.2 },
      }}
      transition={{ duration: 0.3 }}
      className={`
        relative bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:shadow-md
        transition-shadow duration-200 overflow-hidden
        ${priorityColors[task.priority]}
        ${getUrgencyClass(task.isUrgent ?? false)}
        ${isCompleting || isDeleting ? 'opacity-50' : ''}
      `}
    >
      <div className="p-4">
        {/* Encabezado: Título + Badge de prioridad */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            {/* Título con animación de tachado */}
            <motion.h3
              animate={
                isCompleted ? { textDecoration: 'line-through' } : { textDecoration: 'none' }
              }
              transition={{ duration: 0.3 }}
              className={`text-sm font-semibold truncate ${
                isCompleted
                  ? 'text-gray-400 dark:text-gray-600'
                  : 'text-gray-800 dark:text-gray-100'
              }`}
            >
              {task.title}
            </motion.h3>

            {/* Descripción si existe */}
            {task.description && (
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                {task.description}
              </p>
            )}
          </div>

          {/* Badge de prioridad */}
          <span
            className={`
              inline-block px-2 py-1 rounded text-xs font-medium whitespace-nowrap
              ${priorityBadgeColors[task.priority]}
            `}
          >
            {priorityLabels[task.priority]}
          </span>
        </div>

        {/* Metadata: Materia + Fecha */}
        <div className="flex items-center justify-between gap-2 text-xs text-gray-600 dark:text-gray-400 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            {/* Dot de color de la materia */}
            {task.subject_name && (
              <>
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: task.subject_color || '#40916C' }}
                />
                <span className="truncate">{task.subject_name}</span>
              </>
            )}
            {!task.subject_name && <span className="italic">Sin materia</span>}
          </div>

          {/* Fecha de vencimiento */}
          <span
            className={`shrink-0 font-medium ${
              (task.isUrgent ?? false) ? 'text-orange-600 dark:text-orange-400 font-semibold' : ''
            }`}
          >
            {dueDateStr}
          </span>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          {/* Botón Completar */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleComplete}
            disabled={isCompleted || isLocalCompleting || isCompleting || isLocalDeleting}
            className={`
              flex items-center gap-1 px-2 py-1 rounded text-xs font-medium
              transition-colors duration-200
              ${
                isCompleted
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
            title={isCompleted ? 'Tarea completada' : 'Marcar como completada'}
          >
            {isLocalCompleting || isCompleting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-3 h-3 rounded-full border-2 border-green-700 dark:border-green-200 border-t-transparent"
              />
            ) : (
              <CheckCircle2 size={14} />
            )}
            <span className="hidden sm:inline">Completar</span>
          </motion.button>

          {/* Botón Editar */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEdit(task)}
            disabled={isCompleted || isLocalDeleting}
            className={`
              flex items-center gap-1 px-2 py-1 rounded text-xs font-medium
              transition-colors duration-200
              ${
                isCompleted
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
            title={isCompleted ? 'No se puede editar tarea completada' : 'Editar tarea'}
          >
            <Edit2 size={14} />
            <span className="hidden sm:inline">Editar</span>
          </motion.button>

          {/* Botón Eliminar */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDelete}
            disabled={isLocalDeleting || isDeleting}
            className="
              flex items-center gap-1 px-2 py-1 rounded text-xs font-medium
              bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200
              hover:bg-red-200 dark:hover:bg-red-800
              transition-colors duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
            "
            title="Eliminar tarea"
          >
            {isLocalDeleting || isDeleting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-3 h-3 rounded-full border-2 border-red-700 dark:border-red-200 border-t-transparent"
              />
            ) : (
              <Trash2 size={14} />
            )}
            <span className="hidden sm:inline">Eliminar</span>
          </motion.button>
        </div>

        {/* Indicador de urgencia (opcional) */}
        {(task.isUrgent ?? false) && !isCompleted && (
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full"
            title="Tarea urgente (menos de 48 horas)"
          />
        )}
      </div>
    </motion.div>
  );
}
