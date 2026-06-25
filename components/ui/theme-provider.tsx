"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

const ThemeCtx = createContext({ theme: "light" as Theme, toggle: () => {} });

export function useTheme() {
  return useContext(ThemeCtx);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("ecs-theme") as Theme | null;
    const prefers = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    setTheme(stored || prefers);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-dark", theme === "dark" ? "" : "");
    localStorage.setItem("ecs-theme", theme);
  }, [theme, mounted]);

  function toggle() {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }

  if (!mounted) return <>{children}</>;

  return (
    <ThemeCtx.Provider value={{ theme, toggle }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button onClick={toggle} className="flex size-9 items-center justify-center rounded-full bg-surface text-ink-soft hover:text-sky transition" title="Changer le thème">
      {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
