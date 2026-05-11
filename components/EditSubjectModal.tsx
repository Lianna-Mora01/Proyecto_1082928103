'use client';

import { useState, useEffect } from 'react';
import { Subject } from '@/lib/types';

interface EditSubjectModalProps {
  subject: Subject;
  onSubmit: (data: { name?: string; color?: string }) => Promise<void>;
  onCancel: () => void;
}

export function EditSubjectModal({ subject, onSubmit, onCancel }: EditSubjectModalProps) {
  const [name, setName] = useState(subject.name);
  const [color, setColor] = useState(subject.color);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data: { name?: string; color?: string } = {};
    if (name !== subject.name) data.name = name;
    if (color !== subject.color) data.color = color;

    if (Object.keys(data).length === 0) {
      onCancel(); // No changes
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onSubmit(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // Reset form when subject changes
  useEffect(() => {
    setName(subject.name);
    setColor(subject.color);
    setError(null);
  }, [subject]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Editar Materia</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la materia *
            </label>
            <input
              type="text"
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="edit-color" className="block text-sm font-medium text-gray-700 mb-1">
              Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                id="edit-color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <span className="text-sm text-gray-600">{color}</span>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}