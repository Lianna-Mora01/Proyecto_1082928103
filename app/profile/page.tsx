'use client';

import { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { SubjectsManager } from '@/components/SubjectsManager';
import { useThemeSafe } from '@/components/providers/ThemeProvider';
import { useToast } from '@/components/providers/ToastProvider';
import { apiFetch } from '@/lib/api';
import { SafeUser } from '@/lib/types';

export default function ProfilePage() {
  const { theme, setTheme } = useThemeSafe();
  const { addToast } = useToast();
  const [user, setUser] = useState<SafeUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [budget, setBudget] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await apiFetch<{ user: SafeUser }>('/api/auth/me');
        setUser(data.user);
        setName(data.user.name);
        setBudget(data.user.budget_monthly?.toString() ?? '');
        setNotificationsEnabled(data.user.notifications_enabled);
        setTheme(data.user.theme);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al cargar el perfil';
        setError(message);
        addToast(message, 'error');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [addToast, setTheme]);

  const handleSaveProfile = async () => {
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const payload = {
        name,
        theme,
        budget_monthly: budget.trim() === '' ? null : Number(budget),
        notifications_enabled: notificationsEnabled,
      };

      const data = await apiFetch<{ user: SafeUser }>('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      setUser(data.user);
      setSuccessMessage('Perfil actualizado correctamente');
      addToast('Perfil actualizado correctamente', 'success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al guardar el perfil';
      setError(message);
      addToast(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleThemeToggle = async () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);

    try {
      await apiFetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: nextTheme }),
      });
      setSuccessMessage(`Tema cambiado a ${nextTheme}`);
      addToast(`Tema cambiado a ${nextTheme}`, 'success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cambiar el tema';
      setError(message);
      addToast(message, 'error');
    }
  };

  const handleChangePassword = async () => {
    setPasswordLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await apiFetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccessMessage('Contraseña actualizada correctamente');
      addToast('Contraseña actualizada correctamente', 'success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cambiar la contraseña';
      setError(message);
      addToast(message, 'error');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-gray-600 dark:text-gray-300">Cargando perfil...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto space-y-8">
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-[--cs-text-primary]">Mi Perfil</h1>
            <p className="text-sm text-[--cs-text-secondary]">Ajusta tu perfil, presupuesto, preferencias y seguridad.</p>
          </div>

          {error && (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
              {successMessage}
            </div>
          )}
        </div>

        <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
          <section className="space-y-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-[--cs-text-primary]">Información personal</h2>
              <p className="text-sm text-[--cs-text-secondary]">Actualiza tu nombre y revisa los datos de tu cuenta.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-[--cs-text-secondary]">
                <span>Nombre</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </label>
              <label className="space-y-2 text-sm text-[--cs-text-secondary]">
                <span>Email</span>
                <input
                  value={user?.email ?? ''}
                  disabled
                  className="w-full rounded-3xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-[--cs-text-secondary]">
                <span>Rol</span>
                <input
                  value={user?.role === 'admin' ? 'Administrador' : 'Estudiante'}
                  disabled
                  className="w-full rounded-3xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500"
                />
              </label>
              <label className="space-y-2 text-sm text-[--cs-text-secondary]">
                <span>Cuenta creada</span>
                <input
                  value={user?.created_at ? new Date(user.created_at).toLocaleDateString('es-CO') : ''}
                  disabled
                  className="w-full rounded-3xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500"
                />
              </label>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={saving}
                className="inline-flex items-center justify-center rounded-3xl bg-[--cs-primary] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-90 disabled:opacity-60"
              >
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </button>
              <p className="text-sm text-[--cs-text-secondary]">Tus preferencias se guardan cuando presionas Guardar.</p>
            </div>
          </section>

          <section className="space-y-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-[--cs-text-primary]">Preferencias</h2>
              <p className="text-sm text-[--cs-text-secondary]">Controla el presupuesto mensual, notificaciones y el tema.</p>
            </div>

            <label className="space-y-2 text-sm text-[--cs-text-secondary]">
              <span>Presupuesto mensual</span>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-500">$</span>
                <input
                  type="number"
                  min="0"
                  value={budget}
                  onChange={(event) => setBudget(event.target.value)}
                  placeholder="Ej. 250000"
                  className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 pl-10 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </label>

            <label className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[--cs-text-secondary]">
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(event) => setNotificationsEnabled(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600"
              />
              <div>
                <p className="font-medium text-[--cs-text-primary]">Notificaciones activas</p>
                <p>Recibe alertas cuando una tarea esté próxima a vencer.</p>
              </div>
            </label>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-[--cs-text-primary]">Tema de la aplicación</p>
                  <p className="text-sm text-[--cs-text-secondary]">Activa el modo claro u oscuro según tu preferencia.</p>
                </div>
                <button
                  type="button"
                  onClick={handleThemeToggle}
                  className="rounded-3xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  {theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
                </button>
              </div>
            </div>
          </section>
        </div>

        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="space-y-2 mb-6">
            <h2 className="text-xl font-semibold text-[--cs-text-primary]">Seguridad</h2>
            <p className="text-sm text-[--cs-text-secondary]">Cambia tu contraseña de forma segura y rápida.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="space-y-2 text-sm text-[--cs-text-secondary] sm:col-span-3">
              <span>Contraseña actual</span>
              <input
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </label>
            <label className="space-y-2 text-sm text-[--cs-text-secondary]">
              <span>Nueva contraseña</span>
              <input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </label>
            <label className="space-y-2 text-sm text-[--cs-text-secondary]">
              <span>Confirmar nueva contraseña</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </label>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={handleChangePassword}
              disabled={passwordLoading}
              className="inline-flex items-center justify-center rounded-3xl bg-[--cs-primary] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-90 disabled:opacity-60"
            >
              {passwordLoading ? 'Actualizando contraseña...' : 'Cambiar contraseña'}
            </button>
            <p className="text-sm text-[--cs-text-secondary]">No compartas tu contraseña con nadie.</p>
          </div>
        </section>

        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="space-y-2 mb-6">
            <h2 className="text-xl font-semibold text-[--cs-text-primary]">Mis materias</h2>
            <p className="text-sm text-[--cs-text-secondary]">Añade, edita y organiza las materias que estás cursando.</p>
          </div>

          <SubjectsManager />
        </section>
      </div>
    </AppLayout>
  );
}
