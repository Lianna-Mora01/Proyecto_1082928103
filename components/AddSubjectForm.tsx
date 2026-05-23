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
    <div className="border border-[--cs-border] rounded-2xl p-5 bg-[--cs-bg-soft]">
      <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--cs-title)" }}>
        Nueva Materia
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-[--cs-text-primary] mb-1">
            Nombre de la materia *
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-[--cs-border] rounded-xl text-[--cs-title] bg-[--cs-bg-card] focus:outline-none focus:ring-2 focus:ring-[--cs-primary] focus:border-transparent"
            placeholder="Ej: Matemáticas, Física, Literatura..."
            required
          />
        </div>

        <div>
          <label htmlFor="color" className="block text-sm font-medium text-[--cs-text-primary] mb-1">
            Color
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              id="color"
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
            disabled={loading || !name.trim()}
            className="cs-gradient text-white px-4 py-2 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creando...' : 'Crear Materia'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-[--cs-border] text-[--cs-text-primary] rounded-xl hover:bg-[--cs-bg-card] transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}