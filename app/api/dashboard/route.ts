import { withAuth } from "@/lib/withAuth";
import { getSystemMode } from "@/lib/dataService";
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
      });
    }

    // En modo live, retornar datos consolidados (placeholders por ahora)
    return NextResponse.json(
      {
        mode: "live",
        user: { id: userId },
        tasks: [],
        expenses: [],
        urgentTasks: [],
        monthlySummary: {
          totalExpenses: 0,
          budgetMonthly: null,
          budgetPercentage: null,
          expensesByCategory: {},
          expensesByPaymentMethod: {
            "Efectivo": 0,
            "Tarjeta": 0,
          },
        },
        weeklyStats: {
          tasksCompleted: 0,
          expensesRecorded: 0,
          tasksCreated: 0,
        },
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
