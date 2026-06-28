"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className="inline-flex h-7 w-12 shrink-0 cursor-default items-center rounded-full border-2 border-border bg-surface"
      />
    );
  }
  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className="relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-border bg-surface transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:border-border"
    >
      <span
        className={`absolute left-1 flex items-center justify-center transition-all duration-300 ${
          isDark ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0"
        }`}
      >
        <Moon className="h-3 w-3 text-sky" />
      </span>
      <span
        className={`absolute right-1 flex items-center justify-center transition-all duration-300 ${
          isDark ? "-rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
        }`}
      >
        <Sun className="h-3 w-3 text-amber" />
      </span>
      <span
        className={`pointer-events-none block h-5 w-5 rounded-full shadow-lg ring-0 transition-all duration-300 ${
          isDark
            ? "translate-x-5 bg-sky"
            : "translate-x-0 bg-white"
        }`}
      >
        <span
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
            isDark ? "opacity-100" : "opacity-0"
          }`}
        >
          <Moon className="h-2.5 w-2.5 text-white" />
        </span>
        <span
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
            isDark ? "opacity-0" : "opacity-100"
          }`}
        >
          <Sun className="h-2.5 w-2.5 text-amber" />
        </span>
      </span>
    </button>
  );
}
