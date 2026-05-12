// app/tasks/page.tsx
// Página completa de gestión de tareas con filtros, creación y edición

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Filter } from 'lucide-react';
import { TaskWithSubject, Subject } from '@/lib/types';
import { TaskCard } from '@/components/tasks/TaskCard';
import { TaskForm } from '@/components/tasks/TaskForm';
import { AlertBanner } from '@/components/tasks/AlertBanner';
import { useRouter } from 'next/navigation';

export default function TasksPage() {
  const router = useRouter();

  // Estado de tareas y filtros
  const [tasks, setTasks] = useState<TaskWithSubject[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pendiente' | 'completada'>('pendiente');
  const [filterSubject, setFilterSubject] = useState<string>('all');

  // Estado de modal y carga
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskWithSubject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar tareas y materias al montar
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Cargar tareas
        const tasksRes = await fetch('/api/tasks');
        if (!tasksRes.ok) throw new Error('Error al cargar tareas');
        const { tasks: loadedTasks } = await tasksRes.json();

        // Cargar materias
        const subjectsRes = await fetch('/api/subjects');
        if (!subjectsRes.ok) throw new Error('Error al cargar materias');
        const { subjects: loadedSubjects } = await subjectsRes.json();

        setTasks(loadedTasks);
        setSubjects(loadedSubjects);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Filtrar tareas
  const filteredTasks = tasks.filter((task) => {
    const statusMatch = filterStatus === 'all' || task.status === filterStatus;
    const subjectMatch = filterSubject === 'all' || task.subject_id === filterSubject;
    return statusMatch && subjectMatch;
  });

  // Separar tareas pendientes y completadas
  const pendingTasks = filteredTasks.filter((t) => t.status === 'pendiente');
  const completedTasks = filteredTasks.filter((t) => t.status === 'completada');

  // Obtener tareas urgentes (para banner)
  const urgentTasks = tasks.filter((t) => t.status === 'pendiente' && t.isUrgent);

  // Manejar creación/edición de tarea
  const handleSaveTask = async (formData: {
    subject_id: string | null;
    title: string;
    description: string | null;
    due_date: string;
    priority: 'alta' | 'media' | 'baja';
  }) => {
    try {
      setIsSaving(true);
      setError(null);

      if (editingTask) {
        // Actualizar tarea existente
        const res = await fetch(`/api/tasks/${editingTask.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Error al actualizar tarea');
        }

        const { task: updatedTask } = await res.json();
        setTasks((prev) =>
          prev.map((t) => (t.id === editingTask.id ? updatedTask : t))
        );
      } else {
        // Crear nueva tarea
        const res = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Error al crear tarea');
        }

        const { task: newTask } = await res.json();
        setTasks((prev) => [newTask, ...prev]);
      }

      setIsModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsSaving(false);
    }
  };

  // Manejar completar tarea
  const handleCompleteTask = async (taskId: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}/complete`, {
        method: 'POST',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al completar tarea');
      }

      const { task: completedTask } = await res.json();

      // Actualizar estado con animación
      await new Promise((resolve) => setTimeout(resolve, 300)); // Esperar a que termine la animación
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? completedTask : t))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  // Manejar eliminar tarea
  const handleDeleteTask = async (taskId: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al eliminar tarea');
      }

      // Remover de la lista
      await new Promise((resolve) => setTimeout(resolve, 300)); // Esperar a que termine la animación
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-6 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Banner de alerta si hay tareas urgentes */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <AlertBanner urgentTasks={urgentTasks} onViewTasks={() => setFilterStatus('pendiente')} />
        </motion.div>

        {/* Encabezado */}
        <div className="flex items-center justify-between mb-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Mis Tareas</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {pendingTasks.length} pendiente{pendingTasks.length !== 1 ? 's' : ''}
            </p>
          </motion.div>

          <motion.button
            onClick={() => {
              setEditingTask(null);
              setIsModalOpen(true);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="
              flex items-center gap-2 px-4 py-3 rounded-lg
              bg-blue-500 dark:bg-blue-600 text-white font-medium
              hover:bg-blue-600 dark:hover:bg-blue-700
              shadow-md hover:shadow-lg transition-all duration-200
            "
          >
            <Plus size={20} />
            Nueva Tarea
          </motion.button>
        </div>

        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Filter size={18} className="text-gray-500 dark:text-gray-400" />

            {/* Filtro por estado */}
            <div className="flex gap-2">
              {(['all', 'pendiente', 'completada'] as const).map((status) => (
                <motion.button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    px-3 py-1.5 rounded text-sm font-medium transition-colors duration-200
                    ${
                      filterStatus === status
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'
                    }
                  `}
                >
                  {status === 'all' ? 'Todas' : status === 'pendiente' ? 'Pendientes' : 'Completadas'}
                </motion.button>
              ))}
            </div>

            {/* Filtro por materia */}
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="
                px-3 py-1.5 rounded text-sm border border-gray-300 dark:border-gray-600
                bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100
                focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
              "
            >
              <option value="all">Todas las materias</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Mensaje de error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="
                bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800
                rounded-lg p-4 mb-6 text-red-700 dark:text-red-200
              "
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lista de tareas */}
        <div className="space-y-8">
          {/* Tareas pendientes */}
          {filterStatus !== 'completada' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Pendientes
              </h2>
              {pendingTasks.length > 0 ? (
                <motion.div
                  layout
                  className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
                >
                  <AnimatePresence mode="popLayout">
                    {pendingTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onComplete={handleCompleteTask}
                        onEdit={(t) => {
                          setEditingTask(t);
                          setIsModalOpen(true);
                        }}
                        onDelete={handleDeleteTask}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="
                    text-center py-12 text-gray-500 dark:text-gray-400
                    bg-gray-100 dark:bg-slate-800 rounded-lg
                  "
                >
                  <p className="text-lg">¡Sin tareas pendientes!</p>
                  <p className="text-sm mt-1">Crea una nueva para empezar</p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Tareas completadas */}
          {filterStatus !== 'pendiente' && completedTasks.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Completadas ({completedTasks.length})
              </h2>
              <motion.div layout className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 opacity-75">
                <AnimatePresence mode="popLayout">
                  {completedTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onComplete={handleCompleteTask}
                      onEdit={(t) => {
                        setEditingTask(t);
                        setIsModalOpen(true);
                      }}
                      onDelete={handleDeleteTask}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Modal de creación/edición */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
            onClick={() => {
              setIsModalOpen(false);
              setEditingTask(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="
                bg-white dark:bg-slate-800 rounded-lg shadow-xl
                w-full max-w-md max-h-[90vh] overflow-y-auto
              "
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  {editingTask ? 'Editar Tarea' : 'Nueva Tarea'}
                </h2>

                <TaskForm
                  subjects={subjects}
                  initialData={editingTask}
                  isLoading={isSaving}
                  onSubmit={handleSaveTask}
                  onCancel={() => {
                    setIsModalOpen(false);
                    setEditingTask(null);
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
