'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui';

interface SeedModeBannerProps {
  className?: string;
}

export const SeedModeBanner: React.FC<SeedModeBannerProps> = ({
  className = '',
}) => {
  return (
    <div
      className={`bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 md:p-5 mb-6 ${className}`}
    >
      <div className="flex items-start gap-4">
        <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-yellow-900 dark:text-yellow-200 text-sm md:text-base mb-1">
            Sistema en modo Semilla
          </h3>
          <p className="text-xs md:text-sm text-yellow-800 dark:text-yellow-300 mb-3">
            El sistema está en modo semilla. Para activar Supabase y habilitar todas las funciones,
            por favor ejecuta el bootstrap desde la página de administración.
          </p>
          <a href="/admin/db-setup" className="inline-block">
            <Button size="sm" variant="primary">
              Ir a Configuración del Sistema
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};
