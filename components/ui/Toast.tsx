"use client";

import { useToast } from "@/components/providers/ToastProvider";
import React from "react";

const typeStyles = {
  success: "bg-(--cs-success) text-white",
  error: "bg-(--cs-error) text-white",
  info: "bg-(--cs-primary) text-white",
  warning: "bg-(--cs-alert) text-white",
};

export default function Toast() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            p-4 rounded-lg shadow-lg
            animate-in fade-in slide-in-from-bottom-4 duration-300
            ${typeStyles[toast.type]}
          `}
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-lg leading-none hover:opacity-70"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
