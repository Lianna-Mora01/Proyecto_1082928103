// lib/exportService.ts
// Servicio para generación de reportes PDF y Excel desde el servidor

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Expense, ExpenseSummary } from './types';

interface ExportOptions {
  userId: string;
  userName: string;
  expenses: Expense[];
  summary: ExpenseSummary;
  month: string; // YYYY-MM
}

type RGBColor = [number, number, number];

/**
 * Genera un buffer PDF con los gastos del mes
 * Incluye: encabezado, tabla de gastos, totales por categoría y medio de pago
 */
export function generatePDFBuffer(options: ExportOptions): Buffer {
  const { userName, expenses, summary, month } = options;

  // Formato de fecha
  const date = new Date(`${month}-01`);
  const monthName = date.toLocaleString('es-ES', { month: 'long', year: 'numeric' });

  // Crear documento PDF (A4, mm, pt)
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Colors
  const primary: RGBColor = [52, 152, 219]; // Azul
  const success: RGBColor = [46, 204, 113]; // Verde
  const alert: RGBColor = [230, 126, 34]; // Naranja
  const text: RGBColor = [44, 62, 80]; // Gris oscuro
  const lightGray: RGBColor = [236, 240, 241]; // Gris claro

  // Encabezado
  pdf.setFillColor(primary[0], primary[1], primary[2]);
  pdf.rect(0, 0, pageWidth, 35, 'F');

  // Título
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(20);
  pdf.text('CampusZen', 15, 15);
  pdf.setFontSize(10);
  pdf.text('Reporte de Gastos', 15, 23);

  // Información del usuario
  pdf.setTextColor(text[0], text[1], text[2]);
  pdf.setFontSize(10);
  pdf.text(`Estudiante: ${userName}`, 15, 40);
  pdf.text(`Período: ${monthName}`, 15, 47);
  pdf.text(`Generado: ${new Date().toLocaleString('es-ES')}`, 15, 54);

  // Tabla de gastos
  const tableData = expenses.map((exp) => [
    new Date(exp.expense_date).toLocaleDateString('es-ES'),
    exp.name,
    exp.category,
    exp.payment_method,
    `$${exp.amount.toFixed(2)}`,
  ]);

  autoTable(pdf, {
    head: [['Fecha', 'Descripción', 'Categoría', 'Medio de pago', 'Monto']],
    body: tableData,
    startY: 60,
    theme: 'grid',
    headStyles: {
      fillColor: primary as any,
      textColor: [255, 255, 255] as any,
      fontSize: 10,
      fontStyle: 'bold',
      halign: 'center',
    },
    bodyStyles: {
      fontSize: 9,
      textColor: text as any,
    },
    alternateRowStyles: {
      fillColor: lightGray as any,
    },
    margin: { left: 15, right: 15 },
    didDrawPage: (data) => {
      // Footer
      const pageCount = pdf.internal.pages.length - 1;
      const pageSize = pdf.internal.pageSize;
      const pageHeight = pageSize.getHeight();
      const pageWidth = pageSize.getWidth();

      pdf.setTextColor(150);
      pdf.setFontSize(8);
      pdf.text(
        `Página ${data.pageNumber} de ${pageCount}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    },
  });

  // Sección de resúmenes
  let currentY = (pdf as any).lastAutoTable.finalY + 15;

  pdf.setFontSize(12);
  pdf.setTextColor(primary[0], primary[1], primary[2]);
  pdf.text('Resumen de Gastos', 15, currentY);
  currentY += 10;

  // Total general
  pdf.setTextColor(text[0], text[1], text[2]);
  pdf.setFontSize(10);
  pdf.text(`Total del período: $${summary.totalAmount.toFixed(2)}`, 15, currentY);
  currentY += 8;

  // Totales por categoría
  pdf.setFontSize(10);
  pdf.setTextColor(primary[0], primary[1], primary[2]);
  pdf.text('Desglose por categoría:', 15, currentY);
  currentY += 7;

  Object.entries(summary.byCategory).forEach(([category, amount]) => {
    const percentage = ((amount / summary.totalAmount) * 100).toFixed(1);
    pdf.setTextColor(text[0], text[1], text[2]);
    pdf.setFontSize(9);
    pdf.text(`${category}: $${amount.toFixed(2)} (${percentage}%)`, 20, currentY);
    currentY += 6;
  });

  currentY += 5;

  // Totales por medio de pago
  pdf.setFontSize(10);
  pdf.setTextColor(primary[0], primary[1], primary[2]);
  pdf.text('Desglose por medio de pago:', 15, currentY);
  currentY += 7;

  Object.entries(summary.byPaymentMethod).forEach(([method, amount]) => {
    const percentage = ((amount / summary.totalAmount) * 100).toFixed(1);
    pdf.setTextColor(text[0], text[1], text[2]);
    pdf.setFontSize(9);
    pdf.text(`${method}: $${amount.toFixed(2)} (${percentage}%)`, 20, currentY);
    currentY += 6;
  });

  // Información de presupuesto si existe
  if (summary.budgetPercentage !== null) {
    currentY += 8;
    const budgetColor: RGBColor =
      summary.budgetPercentage >= 100
        ? [231, 76, 60]
        : summary.budgetPercentage >= 80
          ? alert
          : success;

    pdf.setTextColor(budgetColor[0], budgetColor[1], budgetColor[2]);
    pdf.setFontSize(10);
    pdf.text(
      `Uso del presupuesto: ${summary.budgetPercentage.toFixed(1)}%`,
      15,
      currentY
    );
  }

  // Convertir a buffer
  return Buffer.from(pdf.output('arraybuffer'));
}

/**
 * Genera un buffer Excel con los gastos del mes
 * Incluye: hoja de gastos con tabla, hoja de resumen
 */
export function generateExcelBuffer(options: ExportOptions): Buffer {
  const { userName, expenses, summary, month } = options;

  const date = new Date(`${month}-01`);
  const monthName = date.toLocaleString('es-ES', { month: 'long', year: 'numeric' });

  // Workbook y hojas
  const workbook = XLSX.utils.book_new();

  // Hoja 1: Gastos
  const expenseData = [
    ['CAMPUSZEN - REPORTE DE GASTOS'],
    [],
    ['Estudiante:', userName],
    ['Período:', monthName],
    ['Generado:', new Date().toLocaleString('es-ES')],
    [],
    ['Fecha', 'Descripción', 'Categoría', 'Medio de pago', 'Monto'],
    ...expenses.map((exp) => [
      new Date(exp.expense_date).toLocaleDateString('es-ES'),
      exp.name,
      exp.category,
      exp.payment_method,
      exp.amount,
    ]),
  ];

  const expenseSheet = XLSX.utils.aoa_to_sheet(expenseData);
  expenseSheet['!cols'] = [
    { wch: 12 }, // Fecha
    { wch: 25 }, // Descripción
    { wch: 15 }, // Categoría
    { wch: 15 }, // Medio de pago
    { wch: 12 }, // Monto
  ];

  // Estilos para la hoja de gastos (tabla de gastos)
  const headerRowIndex = 6;
  const headerCells = ['A7', 'B7', 'C7', 'D7', 'E7'];
  headerCells.forEach((cell) => {
    if (expenseSheet[cell]) {
      expenseSheet[cell].s = {
        fill: { fgColor: { rgb: 'FF3498DB' } },
        font: { bold: true, color: { rgb: 'FFFFFFFF' } },
      };
    }
  });

  XLSX.utils.book_append_sheet(workbook, expenseSheet, 'Gastos');

  // Hoja 2: Resumen
  const summaryData = [
    ['RESUMEN DEL PERÍODO'],
    [],
    ['Total de gastos:', summary.totalAmount],
    [],
    ['DESGLOSE POR CATEGORÍA'],
    ['Categoría', 'Monto', 'Porcentaje'],
    ...Object.entries(summary.byCategory).map(([category, amount]) => [
      category,
      amount,
      summary.totalAmount > 0 ? amount / summary.totalAmount : 0,
    ]),
    [],
    ['DESGLOSE POR MEDIO DE PAGO'],
    ['Medio de pago', 'Monto', 'Porcentaje'],
    ...Object.entries(summary.byPaymentMethod).map(([method, amount]) => [
      method,
      amount,
      summary.totalAmount > 0 ? amount / summary.totalAmount : 0,
    ]),
  ];

  // Agregar información de presupuesto si existe
  if (summary.budgetPercentage !== null) {
    summaryData.push([], ['Uso del presupuesto:', `${summary.budgetPercentage.toFixed(1)}%`]);
  }

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  summarySheet['!cols'] = [
    { wch: 20 },
    { wch: 15 },
    { wch: 15 },
  ];

  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumen');

  // Generar buffer
  const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
  return buffer as Buffer;
}
