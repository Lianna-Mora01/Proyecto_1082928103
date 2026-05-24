'use client';

import { useState, useEffect } from 'react';
import { Expense, ExpenseSummary } from '@/lib/types';
import ExpenseCard from '@/components/expenses/ExpenseCard';
import ExpenseForm from '@/components/expenses/ExpenseForm';
import ExpenseChart from '@/components/charts/ExpenseChart';
import BudgetBar from '@/components/expenses/BudgetBar';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/components/providers/ToastProvider';
import { formatCOP } from '@/lib/format';
import {
  Plus,
  FileText,
  FileSpreadsheet,
  Loader2,
  Calendar,
  Wallet,
  Banknote,
  CreditCard,
} from 'lucide-react';

const actionButtonClass =
  "inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[--cs-bg-card] border border-[--cs-primary]/40 text-[--cs-primary-darker] font-medium text-sm cs-shadow-soft hover:bg-[--cs-bg-soft] hover:border-[--cs-primary] hover:cs-shadow-card transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

interface ExpenseFormData {
  name: string;
  amount: string;
  category: string;
  payment_method: string;
  expense_date: string;
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<ExpenseSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);
  const { addToast } = useToast();

  // Cargar gastos y resumen
  const loadData = async () => {
    try {
      setLoading(true);

      // Cargar gastos
      const expensesRes = await fetch('/api/expenses', {
        credentials: 'include',
      });
      if (expensesRes.ok) {
        const loadedExpensesResponse = await expensesRes.json();
        const loadedExpenses = loadedExpensesResponse?.expenses ?? loadedExpensesResponse ?? [];
        setExpenses(Array.isArray(loadedExpenses) ? loadedExpenses : []);
      }

      // Cargar resumen del mes actual
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1; // getMonth() es 0-indexed

      const summaryRes = await fetch(`/api/expenses/summary?year=${year}&month=${month}`, {
        credentials: 'include',
      });
      if (summaryRes.ok) {
        const loadedSummary = await summaryRes.json();
        setSummary(loadedSummary);
      }
    } catch (error) {
      console.error('Error loading expenses:', error);
      addToast('Error al cargar los gastos', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Crear gasto
  const handleCreateExpense = async (data: ExpenseFormData) => {
    setFormLoading(true);
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: data.name,
          amount: parseFloat(data.amount),
          category: data.category,
          payment_method: data.payment_method,
          expense_date: data.expense_date,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Error al crear gasto');
      }

      const { expense } = await res.json();
      setExpenses(prev => [expense, ...prev]);
      setShowForm(false);
      addToast('Gasto creado exitosamente', 'success');

      // Recargar resumen
      await loadData();
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Error desconocido', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  // Editar gasto
  const handleEditExpense = async (data: ExpenseFormData) => {
    if (!editingExpense) return;

    setFormLoading(true);
    try {
      const res = await fetch(`/api/expenses/${editingExpense.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: data.name,
          amount: parseFloat(data.amount),
          category: data.category,
          payment_method: data.payment_method,
          expense_date: data.expense_date,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Error al editar gasto');
      }

      const { expense } = await res.json();
      setExpenses(prev => prev.map(e => e.id === expense.id ? expense : e));
      setEditingExpense(null);
      addToast('Gasto actualizado exitosamente', 'success');

      // Recargar resumen
      await loadData();
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Error desconocido', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  // Eliminar gasto
  const handleDeleteExpense = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este gasto?')) return;

    try {
      const res = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Error al eliminar gasto');
      }

      setExpenses(prev => prev.filter(e => e.id !== id));
      addToast('Gasto eliminado exitosamente', 'success');

      // Recargar resumen
      await loadData();
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Error desconocido', 'error');
    }
  };

  // Descargar PDF
  const handleDownloadPDF = async () => {
    setExportingPDF(true);
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const monthStr = `${year}-${month}`;

      const res = await fetch(`/api/export/pdf?month=${monthStr}`, {
        credentials: 'include',
      });

      if (!res.ok) {
        const error = await res.json();
        addToast(error.error || 'No hay gastos para este período', 'error');
        return;
      }

      // Crear blob y descargar
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `campuszen-gastos-${monthStr}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      addToast('PDF descargado exitosamente', 'success');
    } catch (error) {
      addToast('Error al descargar PDF', 'error');
      console.error('Error:', error);
    } finally {
      setExportingPDF(false);
    }
  };

  // Descargar Excel
  const handleDownloadExcel = async () => {
    setExportingExcel(true);
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const monthStr = `${year}-${month}`;

      const res = await fetch(`/api/export/xlsx?month=${monthStr}`, {
        credentials: 'include',
      });

      if (!res.ok) {
        const error = await res.json();
        addToast(error.error || 'No hay gastos para este período', 'error');
        return;
      }

      // Crear blob y descargar
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `campuszen-gastos-${monthStr}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      addToast('Excel descargado exitosamente', 'success');
    } catch (error) {
      addToast('Error al descargar Excel', 'error');
      console.error('Error:', error);
    } finally {
      setExportingExcel(false);
    }
  };

  // Calcular resumen efectivo vs tarjeta
  const paymentSummary = summary ? {
    efectivo: summary.byPaymentMethod['Efectivo'] || 0,
    tarjeta: summary.byPaymentMethod['Tarjeta'] || 0,
  } : { efectivo: 0, tarjeta: 0 };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500 dark:text-gray-400">Cargando gastos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      {/* Header con acciones */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "var(--cs-title)" }}>
            Gastos
          </h1>
          <p className="text-sm text-[--cs-text-secondary]">
            Gestiona tus gastos universitarios
          </p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <button onClick={() => setShowForm(true)} className={actionButtonClass}>
            <Plus size={16} />
            Nuevo gasto
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={exportingPDF}
            className={actionButtonClass}
          >
            {exportingPDF ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
            {exportingPDF ? 'Generando PDF...' : 'Exportar PDF'}
          </button>
          <button
            onClick={handleDownloadExcel}
            disabled={exportingExcel}
            className={actionButtonClass}
          >
            {exportingExcel ? <Loader2 size={16} className="animate-spin" /> : <FileSpreadsheet size={16} />}
            {exportingExcel ? 'Generando Excel...' : 'Exportar Excel'}
          </button>
        </div>
      </div>

      {/* BudgetBar y resumen del mes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {summary && <BudgetBar totalAmount={summary.totalAmount} budgetPercentage={summary.budgetPercentage} />}
        </div>

        <div className="rounded-3xl border border-[--cs-border] bg-[--cs-bg-card] p-6 cs-shadow-card">
          <div className="flex items-center gap-3 mb-5">
            <span
              className="inline-flex items-center justify-center w-10 h-10 rounded-2xl text-white shrink-0"
              style={{ background: 'var(--cs-gradient-primary)' }}
            >
              <Calendar size={18} />
            </span>
            <div>
              <h3 className="text-base font-semibold leading-tight" style={{ color: 'var(--cs-title)' }}>
                Resumen del mes
              </h3>
              <p className="text-xs text-[--cs-text-secondary] mt-0.5">
                Total y método de pago
              </p>
            </div>
          </div>

          <ul className="divide-y divide-[--cs-border-soft]">
            <li className="flex items-center justify-between py-3">
              <span className="inline-flex items-center gap-3 text-sm text-[--cs-text-primary]">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[--cs-bg-soft] text-[--cs-primary-darker]">
                  <Wallet size={15} />
                </span>
                Total gastado
              </span>
              <span className="font-bold tracking-tight" style={{ color: 'var(--cs-primary-darker)' }}>
                {formatCOP(summary?.totalAmount)}
              </span>
            </li>
            <li className="flex items-center justify-between py-3">
              <span className="inline-flex items-center gap-3 text-sm text-[--cs-text-primary]">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200">
                  <Banknote size={15} />
                </span>
                Efectivo
              </span>
              <span className="font-bold tracking-tight" style={{ color: 'var(--cs-primary-darker)' }}>
                {formatCOP(paymentSummary.efectivo)}
              </span>
            </li>
            <li className="flex items-center justify-between py-3">
              <span className="inline-flex items-center gap-3 text-sm text-[--cs-text-primary]">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-200">
                  <CreditCard size={15} />
                </span>
                Tarjeta
              </span>
              <span className="font-bold tracking-tight" style={{ color: 'var(--cs-primary-darker)' }}>
                {formatCOP(paymentSummary.tarjeta)}
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Gráfica */}
      {summary && <ExpenseChart data={summary.byCategory} />}

      {/* Lista de gastos */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Gastos registrados
          </h2>
        </div>

        <div className="p-4">
          {expenses.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>No tienes gastos registrados aún.</p>
              <p className="text-sm mt-1">¡Crea tu primer gasto para comenzar!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {expenses.map((expense) => (
                <ExpenseCard
                  key={expense.id}
                  expense={expense}
                  onEdit={setEditingExpense}
                  onDelete={handleDeleteExpense}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal para crear/editar gasto */}
      <Modal
        isOpen={showForm || !!editingExpense}
        onClose={() => {
          setShowForm(false);
          setEditingExpense(null);
        }}
        title={editingExpense ? 'Editar gasto' : 'Nuevo gasto'}
      >
        <ExpenseForm
          initialData={editingExpense ? {
            name: editingExpense.name,
            amount: editingExpense.amount.toString(),
            category: editingExpense.category,
            payment_method: editingExpense.payment_method,
            expense_date: editingExpense.expense_date,
          } : undefined}
          onSubmit={editingExpense ? handleEditExpense : handleCreateExpense}
          onCancel={() => {
            setShowForm(false);
            setEditingExpense(null);
          }}
          isLoading={formLoading}
          submitLabel={editingExpense ? 'Actualizar gasto' : 'Crear gasto'}
        />
      </Modal>
    </div>
  );
}