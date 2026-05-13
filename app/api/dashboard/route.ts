import { withAuth } from "@/lib/withAuth";
import { getSystemMode, getTasks, getExpenses, getMonthlySummary, getUserById } from "@/lib/dataService";
import { NextResponse, NextRequest } from "next/server";

async function handler(req: NextRequest) {
  try {
    const user = (req as any).user;
    const userId = user?.userId;

    if (!userId) {
      return NextResponse.json(
        { error: "Usuario no identificado" },
        { status: 401 }
      );
    }

    const mode = await getSystemMode();

    // En modo seed, retornar estructura vacía
    if (mode === "seed") {
      return NextResponse.json({
        mode: "seed",
        user: { id: userId },
        tasks: [],
        expenses: [],
        urgentTasks: [],
        monthlySummary: null,
        expenseSummary: null,
      });
    }

    // En modo live, retornar datos reales
    const [tasks, expenses, userData] = await Promise.all([
      getTasks(userId),
      getExpenses(userId),
      getUserById(userId),
    ]);

    // Calcular tareas urgentes (menos de 48 horas)
    const now = new Date();
    const urgentTasks = tasks.filter(task => {
      if (task.status !== 'pendiente') return false;
      const dueDate = new Date(task.due_date);
      const hoursUntilDue = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);
      return hoursUntilDue <= 48;
    });

    // Obtener resumen de gastos del mes actual
    const currentMonth = new Date();
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;
    const expenseSummary = await getMonthlySummary(userId, year, month);

    // Calcular estadísticas semanales
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const weeklyStats = {
      tasksCompleted: tasks.filter(task =>
        task.status === 'completada' &&
        new Date(task.completed_at || '') >= oneWeekAgo
      ).length,
      expensesRecorded: expenses.filter(expense =>
        new Date(expense.created_at) >= oneWeekAgo
      ).length,
      tasksCreated: tasks.filter(task =>
        new Date(task.created_at) >= oneWeekAgo
      ).length,
    };

    return NextResponse.json(
      {
        mode: "live",
        user: { id: userId },
        tasks,
        expenses,
        urgentTasks,
        monthlySummary: {
          totalExpenses: expenseSummary.totalAmount,
          budgetMonthly: userData?.budget_monthly || null,
          budgetPercentage: expenseSummary.budgetPercentage,
          expensesByCategory: expenseSummary.byCategory,
          expensesByPaymentMethod: expenseSummary.byPaymentMethod,
        },
        expenseSummary,
        weeklyStats,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          "Pragma": "no-cache",
        },
      }
    );
  } catch (error) {
    console.error("Error en /api/dashboard:", error);
    return NextResponse.json(
      { error: "Error al cargar el dashboard" },
      { status: 500 }
    );
  }
}

export const GET = withAuth(handler);
