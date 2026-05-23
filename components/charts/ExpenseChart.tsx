'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCOP, formatCOPNumber } from '@/lib/format';
import { BarChart3 } from 'lucide-react';

interface ExpenseChartProps {
  data: Record<string, number>;
}

export default function ExpenseChart({ data }: ExpenseChartProps) {
  const chartData = Object.entries(data).map(([category, amount]) => ({
    category,
    amount,
  }));

  if (chartData.length === 0) {
    return (
      <div className="rounded-3xl border border-[--cs-border] bg-[--cs-bg-card] p-6 cs-shadow-soft">
        <div className="flex items-center gap-3 mb-1">
          <span
            className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-white"
            style={{ background: 'var(--cs-gradient-primary)' }}
          >
            <BarChart3 size={18} />
          </span>
          <div>
            <h3 className="text-base font-semibold" style={{ color: 'var(--cs-title)' }}>
              Gastos por categoría
            </h3>
            <p className="text-xs text-[--cs-text-secondary]">Distribución mensual</p>
          </div>
        </div>
        <div className="text-center text-[--cs-text-secondary] py-10">
          <p className="text-sm">No hay gastos registrados este mes</p>
          <p className="text-xs mt-1 opacity-75">
            Cuando agregues gastos, aparecerán aquí agrupados por categoría.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-[--cs-border] bg-[--cs-bg-card] p-6 cs-shadow-soft hover:cs-shadow-card transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-5">
        <span
          className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-white shrink-0"
          style={{ background: 'var(--cs-gradient-primary)' }}
        >
          <BarChart3 size={18} />
        </span>
        <div>
          <h3 className="text-base font-semibold leading-tight" style={{ color: 'var(--cs-title)' }}>
            Gastos por categoría
          </h3>
          <p className="text-xs text-[--cs-text-secondary] mt-0.5">
            Distribución mensual en pesos colombianos
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <BarChart
          data={chartData}
          margin={{ top: 8, right: 16, left: 0, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--cs-border-soft)" />
          <XAxis
            dataKey="category"
            tick={{ fontSize: 11, fill: 'var(--cs-text-secondary)' }}
            axisLine={{ stroke: 'var(--cs-border)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'var(--cs-text-secondary)' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => formatCOPNumber(value)}
          />
          <Tooltip
            cursor={{ fill: 'rgba(123, 174, 127, 0.08)' }}
            formatter={(value: any) =>
              value !== undefined && value !== null
                ? [formatCOP(Number(value)), 'Monto']
                : ['—', 'Monto']
            }
            labelStyle={{ color: 'var(--cs-title)', fontWeight: 600 }}
            contentStyle={{
              backgroundColor: 'var(--cs-bg-card)',
              border: '1px solid var(--cs-border)',
              borderRadius: '12px',
              boxShadow: '0 10px 30px var(--cs-shadow-md)',
              padding: '8px 12px',
            }}
          />
          <Bar dataKey="amount" fill="url(#cs-bar-gradient)" radius={[10, 10, 0, 0]} />
          <defs>
            <linearGradient id="cs-bar-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7BAE7F" />
              <stop offset="100%" stopColor="#A8D5A2" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
