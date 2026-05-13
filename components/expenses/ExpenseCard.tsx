'use client';

import { Expense } from '@/lib/types';

interface ExpenseCardProps {
  expense: Expense;
  onEdit?: (expense: Expense) => void;
  onDelete?: (id: string) => void;
}

export default function ExpenseCard({ expense, onEdit, onDelete }: ExpenseCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Fotocopias': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'Transporte': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'Comida': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'Materiales': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'Otro': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    };
    return colors[category] || colors['Otro'];
  };

  const getPaymentMethodIcon = (method: string) => {
    return method === 'Efectivo' ? '💵' : '💳';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-medium text-gray-900 dark:text-white">
              {expense.name}
            </h4>
            <span className="text-lg">
              {getPaymentMethodIcon(expense.payment_method)}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(expense.category)}`}>
              {expense.category}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(expense.expense_date)}
            </span>
          </div>

          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            ${expense.amount.toLocaleString()}
          </div>
        </div>

        {(onEdit || onDelete) && (
          <div className="flex gap-2 ml-4">
            {onEdit && (
              <button
                onClick={() => onEdit(expense)}
                className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                title="Editar gasto"
              >
                ✏️
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(expense.id)}
                className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                title="Eliminar gasto"
              >
                🗑️
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}