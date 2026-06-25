"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const ctx = useTheme();
  return (
    <button onClick={ctx.toggle} className="flex size-9 items-center justify-center rounded-full bg-surface text-ink-soft hover:text-sky transition" title="Changer le thème">
      {ctx.theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
