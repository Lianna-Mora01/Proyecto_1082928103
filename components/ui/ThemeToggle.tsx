"use client";

import React from "react";
import { useThemeSafe } from "@/components/providers/ThemeProvider";

export default function ThemeToggle() {
  const { theme, setTheme } = useThemeSafe();

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="w-full p-2 rounded-lg bg-[--cs-bg-primary] hover:opacity-80 transition-opacity flex items-center justify-center gap-2"
      aria-label="Cambiar tema"
    >
      <span className="text-lg">
        {theme === "light" ? "🌙" : "☀️"}
      </span>
      <span className="text-sm font-medium text-[--cs-text-primary]">
        {theme === "light" ? "Oscuro" : "Claro"}
      </span>
    </button>
  );
}
