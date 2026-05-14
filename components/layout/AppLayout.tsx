"use client";

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ui/ThemeToggle";

const baseNavItems = [
  { label: "Dashboard", href: "/dashboard", icon: "📊" },
  { label: "Tareas", href: "/tasks", icon: "✓" },
  { label: "Gastos", href: "/expenses", icon: "💰" },
  { label: "Perfil", href: "/profile", icon: "👤" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function fetchRole() {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (!res.ok) {
          setIsAdmin(false);
          return;
        }

        const data = await res.json();
        setIsAdmin(data.user?.role === 'admin');
      } catch {
        setIsAdmin(false);
      }
    }

    fetchRole();
  }, []);

  const navItems = isAdmin
    ? [...baseNavItems, { label: 'Admin', href: '/admin', icon: '🛠️' }]
    : baseNavItems;

  return (
    <div className="flex h-screen bg-[--cs-bg-primary]">
      {/* Sidebar Desktop */}
      <aside
        className={`
          hidden md:flex md:flex-col
          bg-[--cs-bg-card]
          border-r border-[--cs-border]
          transition-all duration-300
          ${sidebarOpen ? "md:w-64" : "md:w-20"}
        `}
      >
        {/* Logo */}
        <div className="p-4 border-b border-[--cs-border]">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="text-2xl">🧘</div>
            {sidebarOpen && (
              <h1 className="text-lg font-bold text-[--cs-primary]">
                CampusZen
              </h1>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[--cs-bg-primary] transition-colors"
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && (
                <span className="text-sm font-medium text-[--cs-text-primary]">
                  {item.label}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[--cs-border]">
          {sidebarOpen && <ThemeToggle />}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar Mobile */}
        <header className="md:hidden bg-[--cs-bg-card] border-b border-[--cs-border] p-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-[--cs-primary]">CampusZen</h1>
          <ThemeToggle />
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="pb-20 md:pb-0">{children}</div>
        </main>

        {/* Bottom Navigation Mobile */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[--cs-bg-card] border-t border-[--cs-border] flex justify-around">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center py-3 text-center hover:bg-[--cs-bg-primary] transition-colors"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs mt-1 text-[--cs-text-secondary]">
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
