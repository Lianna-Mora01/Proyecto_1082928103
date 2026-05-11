'use client';

import { Subject } from '@/lib/types';

interface SubjectItemProps {
  subject: Subject;
  onEdit: (subject: Subject) => void;
  onDeactivate: (id: string) => void;
}

export function SubjectItem({ subject, onEdit, onDeactivate }: SubjectItemProps) {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
      <div className="flex items-center space-x-3">
        <div
          className="w-4 h-4 rounded-full flex-shrink-0"
          style={{ backgroundColor: subject.color }}
        />
        <div>
          <h3 className="font-medium text-gray-900">{subject.name}</h3>
          <p className="text-sm text-gray-500">
            Creada el {new Date(subject.created_at).toLocaleDateString('es-ES')}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => onEdit(subject)}
          className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
        >
          Editar
        </button>
        <button
          onClick={() => onDeactivate(subject.id)}
          className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
        >
          Desactivar
        </button>
      </div>
    </div>
  );
}