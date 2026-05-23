// components/tasks/TaskForm.tsx
// Formulario reutilizable para crear y editar tareas
// Validación cliente con mismos criterios que Zod servidor

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Subject } from '@/lib/types';
import { createTaskSchema, updateTaskSchema } from '@/lib/schemas';
import { ZodError } from 'zod';

interface TaskFormProps {
  subjects: Subject[];
  initialData?: {
    id: string;
    subject_id: string | null;
    title: string;
    description: string | null;
    due_date: string;
    priority: 'alta' | 'media' | 'baja';
  } | null;
  isLoading?: boolean;
  onSubmit: (data: {
    subject_id: string | null;
    title: string;
    description: string | null;
    due_date: string;
    priority: 'alta' | 'media' | 'baja';
  }) => Promise<void>;
  onCancel: () => void;
}

interface FormErrors {
  [key: string]: string;
}

export function TaskForm({
  subjects,
  initialData,
  isLoading = false,
  onSubmit,
  onCancel,
}: TaskFormProps) {
  const isEditing = !!initialData;

  // El <input type="date"> exige YYYY-MM-DD. Si initialData trae ISO, lo convertimos.
  const toDateInputValue = (value: string | null | undefined): string => {
    if (!value) return '';
    try {
      return new Date(value).toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  // Estado del formulario
  const [formData, setFormData] = useState({
    subject_id: initialData?.subject_id || null,
    title: initialData?.title || '',
    description: initialData?.description || '',
    due_date: toDateInputValue(initialData?.due_date),
    priority: initialData?.priority || 'media',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Calcular fecha mínima (hoy)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const minDate = today.toISOString().split('T')[0];

  // Validar campo individual
  const validateField = (name: string, value: unknown) => {
    const fieldErrors: { [key: string]: string } = { ...errors };

    if (name === 'title') {
      const title = value as string;
      if (!title || title.trim().length === 0) {
        fieldErrors['title'] = 'El título es requerido';
      } else if (title.length > 200) {
        fieldErrors['title'] = 'El título no puede exceder 200 caracteres';
      } else {
        delete fieldErrors['title'];
      }
    }

    if (name === 'description') {
      const description = value as string;
      if (description && description.length > 5000) {
        fieldErrors['description'] = 'La descripción no puede exceder 5000 caracteres';
      } else {
        delete fieldErrors['description'];
      }
    }

    if (name === 'due_date') {
      const dateStr = value as string;
      if (!dateStr) {
        fieldErrors['due_date'] = 'La fecha límite es requerida';
      } else {
        try {
          const date = new Date(dateStr);
          const now = new Date();
          now.setHours(0, 0, 0, 0);

          // RN-03: Fecha no puede ser pasada
          if (date < now) {
            fieldErrors['due_date'] = 'La fecha límite no puede ser anterior a la fecha actual';
          } else {
            delete fieldErrors['due_date'];
          }
        } catch {
          fieldErrors['due_date'] = 'Fecha inválida';
        }
      }
    }

    if (name === 'priority') {
      const priority = value as string;
      if (!['alta', 'media', 'baja'].includes(priority)) {
        fieldErrors['priority'] = 'Prioridad inválida';
      } else {
        delete fieldErrors['priority'];
      }
    }

    setErrors(fieldErrors);
    return Object.keys(fieldErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Actualizar estado
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'subject_id' ? (value === 'null' ? null : value) : value,
    }));

    // Validar si el campo ha sido tocado
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setTouched({ title: true, description: true, due_date: true, priority: true });

    // Validar todos los campos
    const allFieldsValid =
      validateField('title', formData.title) &&
      validateField('description', formData.description) &&
      validateField('due_date', formData.due_date) &&
      validateField('priority', formData.priority);

    if (!allFieldsValid) {
      return;
    }

    // El schema exige ISO 8601 datetime; el <input type="date"> devuelve YYYY-MM-DD.
    // Convertimos a fin del día local para que .refine(date > now) pase también si eligen "hoy".
    const dueDateIso = formData.due_date
      ? new Date(formData.due_date + 'T23:59:59').toISOString()
      : '';

    // Validar con schema completo
    try {
      const schema = isEditing ? updateTaskSchema : createTaskSchema;
      schema.parse({
        subject_id: formData.subject_id,
        title: formData.title,
        description: formData.description || null,
        due_date: dueDateIso,
        priority: formData.priority,
      });

      await onSubmit({
        subject_id: formData.subject_id,
        title: formData.title,
        description: formData.description || null,
        due_date: dueDateIso,
        priority: formData.priority as 'alta' | 'media' | 'baja',
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: FormErrors = {};
        error.issues.forEach((issue) => {
          const path = issue.path.join('.') || '_form';
          newErrors[path] = issue.message;
        });
        setErrors(newErrors);
      }
    }
  };

  // Pre-llenar la fecha si no existe
  useEffect(() => {
    if (!formData.due_date && !isEditing) {
      setFormData((prev) => ({
        ...prev,
        due_date: minDate,
      }));
    }
  }, []);

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Banner de error general (cuando hay errores y se intentó enviar) */}
      {submitAttempted && hasErrors && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 p-3 text-sm text-red-700 dark:text-red-200"
          role="alert"
        >
          Revisa los campos marcados antes de guardar.
        </motion.div>
      )}
      {/* Campo: Materia */}
      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Materia <span className="text-gray-400">(opcional)</span>
        </label>
        <select
          name="subject_id"
          value={formData.subject_id || 'null'}
          onChange={handleChange}
          onBlur={handleBlur}
          className="
            w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
            bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100
            focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
            transition-colors duration-200
          "
        >
          <option value="null">Sin materia</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </select>
      </motion.div>

      {/* Campo: Título */}
      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Título *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Ej: Estudiar Capítulo 5"
          maxLength={200}
          className={`
            w-full px-3 py-2 rounded-lg border
            bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100
            placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none focus:ring-2 transition-colors duration-200
            ${
              touched['title'] && errors['title']
                ? 'border-red-400 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-400'
                : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400'
            }
          `}
        />
        {touched['title'] && errors['title'] && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-red-500 dark:text-red-400 mt-1">
            {errors['title']}
          </motion.p>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {formData.title.length}/200 caracteres
        </p>
      </motion.div>

      {/* Campo: Descripción */}
      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Descripción <span className="text-gray-400">(opcional)</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Detalles sobre la tarea..."
          maxLength={5000}
          rows={3}
          className={`
            w-full px-3 py-2 rounded-lg border
            bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100
            placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none focus:ring-2 transition-colors duration-200
            resize-none
            ${
              touched['description'] && errors['description']
                ? 'border-red-400 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-400'
                : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400'
            }
          `}
        />
        {touched['description'] && errors['description'] && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-red-500 dark:text-red-400 mt-1">
            {errors['description']}
          </motion.p>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {formData.description.length}/5000 caracteres
        </p>
      </motion.div>

      {/* Campo: Fecha Límite */}
      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Fecha Límite *
        </label>
        <input
          type="date"
          name="due_date"
          value={formData.due_date}
          onChange={handleChange}
          onBlur={handleBlur}
          min={minDate}
          className={`
            w-full px-3 py-2 rounded-lg border
            bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100
            focus:outline-none focus:ring-2 transition-colors duration-200
            ${
              touched['due_date'] && errors['due_date']
                ? 'border-red-400 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-400'
                : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400'
            }
          `}
        />
        {touched['due_date'] && errors['due_date'] && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-red-500 dark:text-red-400 mt-1">
            {errors['due_date']}
          </motion.p>
        )}
      </motion.div>

      {/* Campo: Prioridad */}
      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Prioridad
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['baja', 'media', 'alta'] as const).map((priority) => (
            <motion.button
              key={priority}
              type="button"
              onClick={() => {
                setFormData((prev) => ({ ...prev, priority }));
                setTouched((prev) => ({ ...prev, priority: true }));
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                px-3 py-2 rounded-lg border-2 font-medium text-sm transition-colors duration-200
                ${
                  formData.priority === priority
                    ? {
                        baja: 'border-green-500 bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-200',
                        media: 'border-orange-500 bg-orange-50 dark:bg-orange-900 text-orange-700 dark:text-orange-200',
                        alta: 'border-red-500 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200',
                      }[priority]
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
                }
              `}
            >
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Botones de acción */}
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700"
      >
        <motion.button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="
            flex-1 px-4 py-2 rounded-lg font-medium text-sm
            border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300
            hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          Cancelar
        </motion.button>

        <motion.button
          type="submit"
          disabled={isLoading || hasErrors}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            flex-1 px-4 py-2 rounded-lg font-medium text-sm text-white
            transition-colors duration-200
            ${
              hasErrors
                ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                : 'bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {isLoading ? (
            <motion.div className="flex items-center justify-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              />
              <span>{isEditing ? 'Actualizando...' : 'Creando...'}</span>
            </motion.div>
          ) : (
            isEditing ? 'Actualizar' : 'Crear Tarea'
          )}
        </motion.button>
      </motion.div>
    </form>
  );
}
