"use client";

import Link from "next/link";

export default function SeedModeBanner() {
  return (
    <div className="bg-[--cs-alert] text-white p-4 rounded-lg mb-6 flex items-center justify-between">
      <div>
        <p className="font-semibold">⚠️ Sistema en modo seed</p>
        <p className="text-sm opacity-90">
          El bootstrap aún no ha sido ejecutado. Configura la base de datos para activar todas las funciones.
        </p>
      </div>
      <Link
        href="/admin/db-setup"
        className="px-4 py-2 bg-white text-[--cs-alert] font-semibold rounded-lg hover:opacity-90 whitespace-nowrap ml-4"
      >
        Configurar ahora
      </Link>
    </div>
  );
}
