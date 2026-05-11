'use client';

import { useState } from 'react';

interface AddSubjectFormProps {
  onSubmit: (data: { name: string; color?: string }) => Promise<void>;
  onCancel: () => void;
}

export function AddSubjectForm({ onSubmit, onCancel }: AddSubjectFormProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3B82F6');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError(null);

    try {
      await onSubmit({ name: name.trim(), color });
      setName('');
      setColor('#3B82F6');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Nueva Materia</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de la materia *
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: Matemáticas, Física, Literatura..."
            required
          />
        </div>

        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
            Color
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              id="color"
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
            disabled={loading || !name.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creando...' : 'Crear Materia'}
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
  );
}