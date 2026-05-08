'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardBody, CardHeader, Button, Modal, Badge, useToast } from '@/components/ui';
import { RefreshCw, CheckCircle, AlertCircle, Loader, Database } from 'lucide-react';

interface DiagnosticData {
  mode: 'seed' | 'live';
  supabase: {
    connected: boolean;
    message: string;
  };
  blob: {
    connected: boolean;
    message: string;
  };
  migrations: {
    applied: string[];
    pending: string[];
  };
  database: {
    users: number;
    subjects: number;
    tasks: number;
    expenses: number;
  };
}

export default function DbSetupPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [tab, setTab] = useState<'diagnostic' | 'bootstrap'>('diagnostic');
  const [diagnostic, setDiagnostic] = useState<DiagnosticData | null>(null);
  const [loading, setLoading] = useState(true);
  const [bootstrapping, setBootstrapping] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    fetchDiagnostic();
  }, []);

  const fetchDiagnostic = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/system/diagnose');
      if (res.ok) {
        const data = await res.json();
        setDiagnostic(data);
      } else {
        addToast('Error al obtener diagnóstico', 'error');
      }
    } catch (error) {
      console.error(error);
      addToast('Error de conexión', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBootstrap = async () => {
    try {
      setBootstrapping(true);
      const res = await fetch('/api/system/bootstrap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: process.env.NEXT_PUBLIC_ADMIN_SECRET || '' }),
      });

      if (res.ok) {
        const result = await res.json();
        addToast('Bootstrap completado exitosamente', 'success');
        setShowConfirm(false);
        // Recargar diagnóstico
        setTimeout(() => {
          fetchDiagnostic();
          router.refresh();
        }, 1000);
      } else {
        addToast('Error en bootstrap: ' + (await res.text()), 'error');
      }
    } catch (error) {
      console.error(error);
      addToast('Error al ejecutar bootstrap', 'error');
    } finally {
      setBootstrapping(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Configuración del Sistema
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Diagnóstico y administración de la base de datos
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setTab('diagnostic')}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            tab === 'diagnostic'
              ? 'border-green-600 text-green-600 dark:text-green-400'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
          }`}
        >
          Diagnóstico
        </button>
        <button
          onClick={() => setTab('bootstrap')}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            tab === 'bootstrap'
              ? 'border-green-600 text-green-600 dark:text-green-400'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
          }`}
        >
          Bootstrap & Migrations
        </button>
      </div>

      {/* Tab Content */}
      {loading && !diagnostic ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="animate-spin text-green-600" size={32} />
        </div>
      ) : diagnostic ? (
        <>
          {tab === 'diagnostic' && (
            <div className="space-y-6">
              {/* Mode Status */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Database size={20} />
                    Estado del Sistema
                  </h3>
                </CardHeader>
                <CardBody>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={diagnostic.mode === 'live' ? 'success' : 'warning'}
                    >
                      Modo: {diagnostic.mode === 'live' ? 'ACTIVO' : 'SEMILLA'}
                    </Badge>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {diagnostic.mode === 'live'
                        ? 'Sistema operativo con Supabase'
                        : 'Sistema en modo semilla. Ejecuta bootstrap para activar Supabase.'}
                    </p>
                  </div>
                </CardBody>
              </Card>

              {/* Supabase */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Supabase</h3>
                    {diagnostic.supabase.connected ? (
                      <CheckCircle size={20} className="text-green-600" />
                    ) : (
                      <AlertCircle size={20} className="text-red-600" />
                    )}
                  </div>
                </CardHeader>
                <CardBody>
                  <p className={diagnostic.supabase.connected ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}>
                    {diagnostic.supabase.message}
                  </p>
                </CardBody>
              </Card>

              {/* Blob */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Vercel Blob</h3>
                    {diagnostic.blob.connected ? (
                      <CheckCircle size={20} className="text-green-600" />
                    ) : (
                      <AlertCircle size={20} className="text-red-600" />
                    )}
                  </div>
                </CardHeader>
                <CardBody>
                  <p className={diagnostic.blob.connected ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}>
                    {diagnostic.blob.message}
                  </p>
                </CardBody>
              </Card>

              {/* Migrations */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Migrations</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-2">
                      Aplicadas ({diagnostic.migrations.applied.length})
                    </p>
                    {diagnostic.migrations.applied.length > 0 ? (
                      <ul className="space-y-1">
                        {diagnostic.migrations.applied.map((m) => (
                          <li key={m} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                            <CheckCircle size={14} className="text-green-600" />
                            {m}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">Ninguna</p>
                    )}
                  </div>
                  {diagnostic.migrations.pending.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300 mb-2">
                        Pendientes ({diagnostic.migrations.pending.length})
                      </p>
                      <ul className="space-y-1">
                        {diagnostic.migrations.pending.map((m) => (
                          <li key={m} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                            <AlertCircle size={14} className="text-yellow-600" />
                            {m}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardBody>
              </Card>

              {/* Database Counts */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Conteos en Base de Datos</h3>
                </CardHeader>
                <CardBody>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(diagnostic.database).map(([key, count]) => (
                      <div key={key} className="text-center">
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {count}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                          {key}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>

              {/* Re-diagnose */}
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={fetchDiagnostic}
                  isLoading={loading}
                >
                  <RefreshCw size={18} />
                  Re-diagnosticar
                </Button>
              </div>
            </div>
          )}

          {tab === 'bootstrap' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Ejecutar Bootstrap</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    El bootstrap ejecutará todas las migrations pendientes e inicializará el sistema.
                  </p>
                  {diagnostic.migrations.pending.length > 0 ? (
                    <>
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded p-4">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          Se ejecutarán <strong>{diagnostic.migrations.pending.length}</strong> migration(s):
                        </p>
                        <ul className="mt-2 space-y-1">
                          {diagnostic.migrations.pending.map((m) => (
                            <li key={m} className="text-sm text-blue-700 dark:text-blue-300">
                              • {m}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Button
                        variant="primary"
                        onClick={() => setShowConfirm(true)}
                        isLoading={bootstrapping}
                      >
                        Ejecutar Bootstrap
                      </Button>
                    </>
                  ) : (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded p-4">
                      <p className="text-sm text-green-800 dark:text-green-200 flex items-center gap-2">
                        <CheckCircle size={16} />
                        <strong>Sistema ya inicializado.</strong> Todas las migrations han sido aplicadas.
                      </p>
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>
          )}
        </>
      ) : null}

      {/* Confirm Modal */}
      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Confirmar Bootstrap"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowConfirm(false)}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={handleBootstrap}
              isLoading={bootstrapping}
            >
              Ejecutar Bootstrap
            </Button>
          </div>
        }
      >
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Estás a punto de ejecutar el bootstrap. Esta acción aplicará todas las migrations pendientes
          e inicializará el sistema para usar Supabase. ¿Deseas continuar?
        </p>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded p-4 text-sm text-yellow-800 dark:text-yellow-200">
          Esta operación no se puede deshacer.
        </div>
      </Modal>
    </div>
  );
}
