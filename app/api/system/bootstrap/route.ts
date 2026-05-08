// app/api/system/bootstrap/route.ts
// POST /api/system/bootstrap - Ejecuta migrations y carga seed

import { NextRequest, NextResponse } from 'next/server';
import { withRole } from '@/lib/withAuth';
import { applyMigrations } from '@/lib/pgMigrate';
import { setSystemModeOverride } from '@/lib/dataService';

export async function POST(req: NextRequest) {
  return withRole('admin')(async () => {
    try {
      // Validar variable de entorno
      if (!process.env.DATABASE_URL) {
        return NextResponse.json(
          { error: 'DATABASE_URL no configurado' },
          { status: 500 }
        );
      }

      // Aplicar migrations
      const result = await applyMigrations(process.env.DATABASE_URL);

      if (!result.success) {
        return NextResponse.json(
          { error: 'Error al aplicar migrations', details: result },
          { status: 500 }
        );
      }

      // Cambiar modo del sistema a live
      setSystemModeOverride('live');

      return NextResponse.json({
        success: true,
        message: 'Bootstrap completado exitosamente',
        appliedCount: result.appliedCount,
        migrations: result.migrations,
      });
    } catch (error) {
      console.error('Bootstrap error:', error);
      return NextResponse.json(
        {
          error: 'Error al ejecutar bootstrap',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 }
      );
    }
  })(req);
}
