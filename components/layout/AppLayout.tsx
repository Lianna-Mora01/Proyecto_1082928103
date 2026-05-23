"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  BookOpen,
  Wallet,
  User,
  Shield,
  Leaf,
} from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";

const baseNavItems = [
  { label: "Dashboard", href: "/dashboard", Icon: LayoutDashboard },
  { label: "Materias", href: "/subjects", Icon: BookOpen },
  { label: "Tareas", href: "/tasks", Icon: CheckSquare },
  { label: "Gastos", href: "/expenses", Icon: Wallet },
  { label: "Perfil", href: "/profile", Icon: User },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    async function fetchRole() {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (!res.ok) {
          setIsAdmin(false);
          return;
        }
        const data = await res.json();
        setIsAdmin(data.user?.role === "admin");
      } catch {
        setIsAdmin(false);
      }
    }
    fetchRole();
  }, []);

  const navItems = isAdmin
    ? [...baseNavItems, { label: "Admin", href: "/admin", Icon: Shield }]
    : baseNavItems;

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname?.startsWith(href));

  return (
    <div className="flex h-screen" style={{ background: "var(--cs-gradient-soft)" }}>
      {/* Sidebar Desktop */}
      <aside
        className={`
          hidden md:flex md:flex-col
          bg-[--cs-bg-card]
          border-r border-[--cs-border]
          transition-all duration-300
          ${sidebarOpen ? "md:w-72" : "md:w-20"}
        `}
      >
        {/* Logo grande */}
        <div className="px-6 pt-7 pb-6 border-b border-[--cs-border-soft]">
          <Link href="/dashboard" className="flex items-center gap-3">
            <span
              className="inline-flex items-center justify-center w-12 h-12 rounded-2xl text-white shrink-0"
              style={{
                background: "var(--cs-gradient-primary)",
                boxShadow: "0 8px 20px var(--cs-shadow-md)",
              }}
            >
              <Leaf size={24} />
            </span>
            {sidebarOpen && (
              <div className="flex flex-col">
                <span
                  className="text-2xl font-bold tracking-tight leading-none"
                  style={{ color: "var(--cs-title)" }}
                >
                  CampusZen
                </span>
                <span className="text-[11px] text-[--cs-text-secondary] mt-1 tracking-wide uppercase">
                  Tu calma estudiantil
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {navItems.map(({ label, href, Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={`
                  relative flex items-center gap-3 px-4 py-3 rounded-2xl
                  transition-all duration-200 group
                  ${
                    active
                      ? "bg-[--cs-bg-soft] font-semibold"
                      : "text-[--cs-text-primary] hover:bg-[--cs-bg-soft] hover:translate-x-0.5"
                  }
                `}
                style={active ? { color: "var(--cs-title)" } : undefined}
              >
                {/* Barra lateral verde oscuro cuando activo */}
                {active && (
                  <span
                    aria-hidden
                    className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full"
                    style={{ background: "var(--cs-primary-darker)" }}
                  />
                )}
                <Icon
                  size={20}
                  className={
                    active
                      ? "text-[--cs-primary-darker]"
                      : "text-[--cs-text-secondary] group-hover:text-[--cs-primary]"
                  }
                />
                {sidebarOpen && <span className="text-sm">{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-[--cs-border-soft]">
          {sidebarOpen && <ThemeToggle />}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar Mobile */}
        <header className="md:hidden bg-[--cs-bg-card] border-b border-[--cs-border-soft] p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-white"
              style={{ background: "var(--cs-gradient-primary)" }}
            >
              <Leaf size={18} />
            </span>
            <h1 className="text-lg font-bold tracking-tight" style={{ color: "var(--cs-title)" }}>
              CampusZen
            </h1>
          </div>
          <ThemeToggle />
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="pb-20 md:pb-0">{children}</div>
        </main>

        {/* Bottom Navigation Mobile */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[--cs-bg-card] border-t border-[--cs-border-soft] flex justify-around">
          {navItems.map(({ label, href, Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={`
                  flex-1 flex flex-col items-center justify-center py-3 text-center
                  transition-colors
                  ${active ? "text-[--cs-primary]" : "text-[--cs-text-secondary] hover:bg-[--cs-bg-soft]"}
                `}
              >
                <Icon size={20} />
                <span className="text-[10px] mt-1 font-medium">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
