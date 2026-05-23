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
          ${sidebarOpen ? "md:w-64" : "md:w-20"}
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-[--cs-border-soft]">
          <Link href="/dashboard" className="flex items-center gap-3">
            <span
              className="inline-flex items-center justify-center w-10 h-10 rounded-2xl text-white"
              style={{ background: "var(--cs-gradient-primary)" }}
            >
              <Leaf size={20} />
            </span>
            {sidebarOpen && (
              <h1 className="text-xl font-bold tracking-tight" style={{ color: "var(--cs-title)" }}>
                CampusZen
              </h1>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ label, href, Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={`
                  flex items-center gap-3 px-4 py-2.5 rounded-2xl
                  transition-all duration-200
                  ${
                    active
                      ? "bg-[--cs-bg-soft] text-[--cs-title] font-medium"
                      : "text-[--cs-text-primary] hover:bg-[--cs-bg-soft]"
                  }
                `}
              >
                <Icon
                  size={18}
                  className={active ? "text-[--cs-primary]" : "text-[--cs-text-secondary]"}
                />
                {sidebarOpen && <span className="text-sm">{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[--cs-border-soft]">
          {sidebarOpen && <ThemeToggle />}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar Mobile */}
        <header className="md:hidden bg-[--cs-bg-card] border-b border-[--cs-border-soft] p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center justify-center w-8 h-8 rounded-xl text-white"
              style={{ background: "var(--cs-gradient-primary)" }}
            >
              <Leaf size={16} />
            </span>
            <h1 className="text-lg font-bold" style={{ color: "var(--cs-title)" }}>
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
