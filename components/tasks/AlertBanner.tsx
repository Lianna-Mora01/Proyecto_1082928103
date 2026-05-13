// components/tasks/AlertBanner.tsx
// Banner naranja con tareas urgentes (< 48 horas de vencimiento)

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { TaskWithSubject } from '@/lib/types';

interface AlertBannerProps {
  urgentTasks: TaskWithSubject[];
  onViewTasks?: () => void;
}

export function AlertBanner({ urgentTasks, onViewTasks }: AlertBannerProps) {
  if (!urgentTasks || urgentTasks.length === 0) {
    return null;
  }

  const urgentCount = urgentTasks.length;
  const plural = urgentCount !== 1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0, y: -10 }}
        animate={{ opacity: 1, height: 'auto', y: 0 }}
        exit={{ opacity: 0, height: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="
          bg-linear-to-r from-orange-100 to-orange-200
          dark:from-orange-900 dark:to-orange-800
          border-l-4 border-orange-500 dark:border-orange-400
          rounded-lg shadow-sm
        "
      >
        <div className="p-4">
          {/* Encabezado del banner */}
          <div className="flex items-start gap-3">
            {/* Ícono de alerta con animación */}
            <motion.div
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="shrink-0 pt-1"
            >
              <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-300" />
            </motion.div>

            {/* Contenido del banner */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-orange-900 dark:text-orange-100 mb-1">
                {plural ? `${urgentCount} tareas urgentes` : '1 tarea urgente'}
              </h3>

              <p className="text-sm text-orange-800 dark:text-orange-200 mb-3">
                Menos de 48 horas de vencimiento. Revisa {plural ? 'las tareas' : 'la tarea'} pendiente{plural ? 's' : ''}.
              </p>

              {/* Lista de tareas urgentes */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="space-y-2 mb-3"
              >
                {urgentTasks.slice(0, 3).map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className="
                      flex items-start gap-2 p-2 rounded
                      bg-white/50 dark:bg-orange-950/50
                    "
                  >
                    {/* Punto de color según prioridad */}
                    <div
                      className={`
                        w-2 h-2 rounded-full mt-1.5
                        ${
                          task.priority === 'alta'
                            ? 'bg-red-500'
                            : task.priority === 'media'
                            ? 'bg-orange-500'
                            : 'bg-green-500'
                        }
                      `}
                    />

                    {/* Información de la tarea */}
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-orange-900 dark:text-orange-100 truncate">
                        {task.title}
                      </p>
                      <p className="text-xs text-orange-700 dark:text-orange-300">
                        {task.subject_name || 'Sin materia'} •{' '}
                        {new Date(task.due_date).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {/* Mostrar "más" si hay más de 3 tareas urgentes */}
                {urgentCount > 3 && (
                  <p className="text-xs text-orange-700 dark:text-orange-300 px-2">
                    +{urgentCount - 3} más {urgentCount - 3 === 1 ? 'tarea' : 'tareas'}...
                  </p>
                )}
              </motion.div>

              {/* Botón de acción */}
              {onViewTasks && (
                <motion.button
                  onClick={onViewTasks}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="
                    px-3 py-1.5 rounded text-xs font-medium
                    bg-orange-600 dark:bg-orange-500 text-white
                    hover:bg-orange-700 dark:hover:bg-orange-600
                    transition-colors duration-200
                  "
                >
                  Ver tareas urgentes →
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
