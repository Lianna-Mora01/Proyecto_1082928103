import { Suspense } from 'react';
import { SubjectsManager } from '@/components/SubjectsManager';

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mi Perfil</h1>

        {/* Sección de Materias */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Mis Materias</h2>
          <Suspense fallback={<div>Cargando materias...</div>}>
            <SubjectsManager />
          </Suspense>
        </div>

        {/* Otras secciones del perfil pueden ir aquí */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Configuración</h2>
          <p className="text-gray-600">Próximamente: configuración de perfil, preferencias, etc.</p>
        </div>
      </div>
    </div>
  );
}