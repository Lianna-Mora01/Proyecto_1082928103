"use client";

import AppLayout from "@/components/layout/AppLayout";
import { SubjectsManager } from "@/components/SubjectsManager";
import { BookOpen } from "lucide-react";

export default function SubjectsPage() {
  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <header className="mb-8 flex items-start gap-4">
          <span
            className="inline-flex items-center justify-center w-12 h-12 rounded-2xl text-white shrink-0"
            style={{ background: "var(--cs-gradient-primary)" }}
          >
            <BookOpen size={22} />
          </span>
          <div>
            <h1 className="text-3xl font-bold mb-1" style={{ color: "var(--cs-title)" }}>
              Materias
            </h1>
            <p className="text-sm text-[--cs-text-secondary]">
              Organiza tus asignaturas y dales un color para identificarlas en tus tareas.
            </p>
          </div>
        </header>

        <div className="bg-[--cs-bg-card] border border-[--cs-border] rounded-2xl p-6 cs-shadow-soft">
          <SubjectsManager />
        </div>
      </div>
    </AppLayout>
  );
}
