'use client';

import { useState, useEffect } from 'react';
import { Subject } from '@/lib/types';
import { AddSubjectForm } from './AddSubjectForm';
import { EditSubjectModal } from './EditSubjectModal';
import { SubjectItem } from './SubjectItem';

export function SubjectsManager() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  // Cargar materias
  const loadSubjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/subjects');
      if (!response.ok) {
        throw new Error('Error al cargar materias');
      }
      const data = await response.json();
      setSubjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  // Agregar materia
  const handleAddSubject = async (data: { name: string; color?: string }) => {
    try {
      const response = await fetch('/api/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear materia');
      }

      await loadSubjects(); // Recargar lista
      setShowAddForm(false);
    } catch (err) {
      throw err; // Re-throw para que el form lo maneje
    }
  };

  // Actualizar materia
  const handleUpdateSubject = async (id: string, data: { name?: string; color?: string }) => {
    try {
      const response = await fetch(`/api/subjects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar materia');
      }

      await loadSubjects(); // Recargar lista
      setEditingSubject(null);
    } catch (err) {
      throw err; // Re-throw para que el modal lo maneje
    }
  };

  // Desactivar materia
  const handleDeactivateSubject = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres desactivar esta materia? Se eliminará permanentemente.')) {
      return;
    }

    try {
      const response = await fetch(`/api/subjects/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al desactivar materia');
      }

      await loadSubjects(); // Recargar lista
    } catch (err) {
      alert('Error al desactivar materia: ' + (err instanceof Error ? err.message : 'Error desconocido'));
    }
  };

  if (loading) {
    return <div className="text-center py-8">Cargando materias...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadSubjects}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Lista de materias */}
      <div className="space-y-4 mb-6">
        {subjects.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No tienes materias registradas aún.
          </div>
        ) : (
          subjects.map((subject) => (
            <SubjectItem
              key={subject.id}
              subject={subject}
              onEdit={setEditingSubject}
              onDeactivate={handleDeactivateSubject}
            />
          ))
        )}
      </div>

      {/* Botón para agregar materia */}
      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors"
        >
          + Agregar Materia
        </button>
      )}

      {/* Formulario para agregar materia */}
      {showAddForm && (
        <AddSubjectForm
          onSubmit={handleAddSubject}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Modal para editar materia */}
      {editingSubject && (
        <EditSubjectModal
          subject={editingSubject}
          onSubmit={(data) => handleUpdateSubject(editingSubject.id, data)}
          onCancel={() => setEditingSubject(null)}
        />
      )}
    </div>
  );
}