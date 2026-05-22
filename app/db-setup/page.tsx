"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import Card from "@/components/ui/Card";
import DiagnosticPanel from "@/components/admin/DiagnosticPanel";
import BootstrapPanel from "@/components/admin/BootstrapPanel";

export default function DbSetupPage() {
  const [activeTab, setActiveTab] = useState<"diagnostic" | "bootstrap">(
    "diagnostic"
  );

  return (
    <div className="min-h-screen bg-[--cs-bg-primary]">
      <header className="bg-[--cs-bg-secondary] border-b border-[--cs-border] p-4">
        <h1 className="text-xl font-bold text-[--cs-text-primary]">CampusZen - Setup</h1>
      </header>
      <main className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[--cs-text-primary] mb-2">
          Configuración del Sistema
        </h1>
        <p className="text-[--cs-text-secondary] mb-8">
          Diagnóstico y bootstrap de la base de datos CampusZen
        </p>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-[--cs-border]">
          <button
            onClick={() => setActiveTab("diagnostic")}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === "diagnostic"
                ? "border-[--cs-primary] text-[--cs-primary]"
                : "border-transparent text-[--cs-text-secondary] hover:text-[--cs-text-primary]"
            }`}
          >
            Diagnóstico
          </button>
          <button
            onClick={() => setActiveTab("bootstrap")}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === "bootstrap"
                ? "border-[--cs-primary] text-[--cs-primary]"
                : "border-transparent text-[--cs-text-secondary] hover:text-[--cs-text-primary]"
            }`}
          >
            Bootstrap & Migrations
          </button>
        </div>

        {/* Tab Content */}
        <div className="max-w-2xl">
          {activeTab === "diagnostic" && (
            <div>
              <Card>
                <DiagnosticPanel />
              </Card>
            </div>
          )}
          {activeTab === "bootstrap" && (
            <div>
              <Card>
                <BootstrapPanel />
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
