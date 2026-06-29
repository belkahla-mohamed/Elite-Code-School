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
      <span className="absolute left-1 flex items-center justify-center pointer-events-none">
        <Sun className={`h-3 w-3 transition-all duration-300 ${
          isDark ? "text-muted-foreground/40" : "text-amber"
        }`} />
      </span>
      <span className="absolute right-1 flex items-center justify-center pointer-events-none">
        <Moon className={`h-3 w-3 transition-all duration-300 ${
          isDark ? "text-sky" : "text-muted-foreground/40"
        }`} />
      </span>
      <span
        className={`pointer-events-none block h-5 w-5 rounded-full shadow-lg ring-0 transition-all duration-300 flex items-center justify-center ${
          isDark
            ? "translate-x-5 bg-sky"
            : "translate-x-0 bg-white"
        }`}
      >
        {isDark ? (
          <Moon className="h-2.5 w-2.5 text-white" />
        ) : (
          <Sun className="h-2.5 w-2.5 text-amber" />
        )}
      </span>
    </button>
  );
}
