'use client';

import { useState, useEffect } from 'react';
import { Expense, ExpenseSummary } from '@/lib/types';
import ExpenseCard from '@/components/expenses/ExpenseCard';
import ExpenseForm from '@/components/expenses/ExpenseForm';
import ExpenseChart from '@/components/charts/ExpenseChart';
import BudgetBar from '@/components/expenses/BudgetBar';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/providers/ToastProvider';

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
    <div className="space-y-6">
      {/* Header con acciones */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gastos
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona tus gastos universitarios
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => setShowForm(true)}
            className="bg-green-700 hover:bg-green-800"
          >
            ➕ Nuevo gasto
          </Button>

          {/* Botones de exportación */}
          <Button
            onClick={handleDownloadPDF}
            disabled={exportingPDF}
            className={exportingPDF ? 'opacity-50 cursor-not-allowed' : ''}
          >
            {exportingPDF ? '⏳ Generando PDF...' : '📄 Exportar PDF'}
          </Button>
          <Button
            onClick={handleDownloadExcel}
            disabled={exportingExcel}
            className={exportingExcel ? 'opacity-50 cursor-not-allowed' : ''}
          >
            {exportingExcel ? '⏳ Generando Excel...' : '📊 Exportar Excel'}
          </Button>
        </div>
      </div>

      {/* BudgetBar y resumen del mes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {summary && <BudgetBar totalAmount={summary.totalAmount} budgetPercentage={summary.budgetPercentage} />}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Resumen del mes
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total gastado</span>
              <span className="font-medium text-gray-900 dark:text-white">
                ${summary?.totalAmount.toLocaleString() || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">💵 Efectivo</span>
              <span className="text-sm text-gray-900 dark:text-white">
                ${paymentSummary.efectivo.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">💳 Tarjeta</span>
              <span className="text-sm text-gray-900 dark:text-white">
                ${paymentSummary.tarjeta.toLocaleString()}
              </span>
            </div>
          </div>
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