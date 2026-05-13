'use client';

import Link from 'next/link';

interface BudgetBarProps {
  totalAmount: number;
  budgetPercentage: number | null;
}

export default function BudgetBar({ totalAmount, budgetPercentage }: BudgetBarProps) {
  // Si no hay presupuesto configurado, mostrar mensaje alternativo
  if (budgetPercentage === null) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
            No tienes un presupuesto mensual configurado
          </p>
          <Link
            href="/profile"
            className="inline-flex items-center text-green-700 hover:text-green-800 dark:text-green-500 dark:hover:text-green-400 text-sm font-medium"
          >
            Configurar presupuesto →
          </Link>
        </div>
      </div>
    );
  }

  // Determinar el estado del color basado en el porcentaje
  const getBarColor = () => {
    if (budgetPercentage < 80) return 'bg-green-500'; // Verde hasta 79%
    if (budgetPercentage < 100) return 'bg-orange-500'; // Naranja 80-99%
    return 'bg-red-500'; // Rojo 100%+
  };

  const getTextColor = () => {
    if (budgetPercentage < 80) return 'text-green-700 dark:text-green-400';
    if (budgetPercentage < 100) return 'text-orange-700 dark:text-orange-400';
    return 'text-red-700 dark:text-red-400';
  };

  const getMessage = () => {
    if (budgetPercentage < 80) return 'Presupuesto bajo control';
    if (budgetPercentage < 100) return 'Cerca del límite';
    return 'Presupuesto excedido';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
          Presupuesto mensual
        </h3>
        <span className={`text-sm font-medium ${getTextColor()}`}>
          {budgetPercentage.toFixed(1)}%
        </span>
      </div>

      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
        <div
          className={`h-3 rounded-full transition-all duration-300 ${getBarColor()}`}
          style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
        />
      </div>

      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
        <span>${totalAmount.toLocaleString()}</span>
        <span className={getTextColor()}>
          {getMessage()}
        </span>
      </div>
    </div>
  );
}