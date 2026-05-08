'use client';

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavLink {
  label: string;
  href: string;
  icon: React.ReactNode;
  admin?: boolean;
}

interface AppLayoutProps {
  children: React.ReactNode;
  navLinks: NavLink[];
  userRole?: 'student' | 'admin';
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  navLinks,
  userRole = 'student',
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredLinks = navLinks.filter(
    (link) => !link.admin || userRole === 'admin'
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-col">
        <Sidebar links={filteredLinks} onNavigate={() => {}} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-green-600 dark:text-green-500">
            CampusZen
          </h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black/50 lg:hidden">
            <aside className="absolute inset-y-0 left-0 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
              <Sidebar
                links={filteredLinks}
                onNavigate={() => setSidebarOpen(false)}
              />
            </aside>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 md:p-6">{children}</div>
        </div>

        {/* Mobile Bottom Navigation */}
        <BottomNav links={filteredLinks} className="lg:hidden" />
      </main>
    </div>
  );
};

interface SidebarProps {
  links: NavLink[];
  onNavigate?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ links, onNavigate }) => {
  return (
    <nav className="flex-1 overflow-y-auto p-4 space-y-2">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          onClick={onNavigate}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400 transition"
        >
          <span className="flex-shrink-0">{link.icon}</span>
          <span className="text-sm font-medium">{link.label}</span>
        </a>
      ))}
    </nav>
  );
};

interface BottomNavProps {
  links: NavLink[];
  className?: string;
}

const BottomNav: React.FC<BottomNavProps> = ({ links, className = '' }) => {
  return (
    <nav
      className={`border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-around overflow-x-auto ${className}`}
    >
      {links.slice(0, 5).map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="flex flex-col items-center justify-center min-w-[60px] py-3 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition flex-1"
        >
          <span className="text-xl mb-1">{link.icon}</span>
          <span className="text-xs font-medium text-center leading-tight">
            {link.label}
          </span>
        </a>
      ))}
    </nav>
  );
};
