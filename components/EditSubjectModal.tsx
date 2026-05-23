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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[--cs-bg-card] border border-[--cs-border] rounded-2xl p-6 w-full max-w-md cs-shadow-elevated">
        <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--cs-title)" }}>
          Editar Materia
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="edit-name" className="block text-sm font-medium text-[--cs-text-primary] mb-1">
              Nombre de la materia *
            </label>
            <input
              type="text"
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-[--cs-border] rounded-xl text-[--cs-title] bg-[--cs-bg-card] focus:outline-none focus:ring-2 focus:ring-[--cs-primary] focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="edit-color" className="block text-sm font-medium text-[--cs-text-primary] mb-1">
              Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                id="edit-color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-12 h-8 border border-[--cs-border] rounded cursor-pointer"
              />
              <span className="text-sm text-[--cs-text-secondary]">{color}</span>
            </div>
          </div>

          {error && (
            <div className="text-[--cs-error] text-sm">{error}</div>
          )}

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={loading}
              className="cs-gradient text-white px-4 py-2 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-[--cs-border] text-[--cs-text-primary] rounded-xl hover:bg-[--cs-bg-soft] transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}