"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/providers/ToastProvider";
import Modal from "@/components/ui/Modal";

export default function BootstrapPanel() {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { addToast } = useToast();

  const handleBootstrap = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/system/bootstrap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: process.env.NEXT_PUBLIC_ADMIN_BOOTSTRAP_SECRET || "",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al ejecutar bootstrap");
      }

      const result = await response.json();
      addToast("Bootstrap completado exitosamente", "success");
      setShowConfirm(false);

      // Recargar página después de 2s
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      addToast(
        error instanceof Error ? error.message : "Error desconocido",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[--cs-alert] text-white p-4 rounded-lg">
        <p className="font-semibold mb-2">⚠️ Acción crítica</p>
        <p className="text-sm">
          El bootstrap ejecutará todas las migrations pendientes y cargará los datos iniciales. Esta acción es irreversible.
        </p>
      </div>

      <Button
        onClick={() => setShowConfirm(true)}
        variant="primary"
        className="w-full"
      >
        Ejecutar Bootstrap
      </Button>

      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Confirmar Bootstrap"
      >
        <p className="text-[--cs-text-primary] mb-6">
          ¿Estás seguro de que deseas ejecutar el bootstrap? Esto aplicará todas las migrations y cargará los datos iniciales.
        </p>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={() => setShowConfirm(false)}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleBootstrap}
            isLoading={loading}
            className="flex-1"
          >
            Confirmar
          </Button>
        </div>
      </Modal>
    </div>
  );
}
