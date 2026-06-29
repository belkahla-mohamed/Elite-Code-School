"use client";

import { useState, useEffect, useCallback } from "react";
import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";

export type ViewMode = "cards" | "table";

export function useViewMode(storageKey = "admin-view-mode"): [ViewMode, (mode: ViewMode) => void] {
  const [mode, setMode] = useState<ViewMode>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(storageKey);
      if (stored === "cards" || stored === "table") return stored;
    }
    return "cards";
  });

  const updateMode = useCallback(
    (newMode: ViewMode) => {
      setMode(newMode);
      localStorage.setItem(storageKey, newMode);
    },
    [storageKey]
  );

  return [mode, updateMode];
}

export function ViewToggle({ mode, onChange }: { mode: ViewMode; onChange: (mode: ViewMode) => void }) {
  return (
    <div className="flex items-center gap-1 rounded-full border-2 border-border bg-surface p-0.5">
      <button
        onClick={() => onChange("cards")}
        className={cn(
          "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition",
          mode === "cards"
            ? "bg-white dark:bg-slate-700 text-ink shadow-sm"
            : "text-ink-soft hover:text-ink"
        )}
        title="Affichage cartes"
      >
        <LayoutGrid className="size-3.5" />
        <span className="hidden sm:inline">Cartes</span>
      </button>
      <button
        onClick={() => onChange("table")}
        className={cn(
          "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition",
          mode === "table"
            ? "bg-white dark:bg-slate-700 text-ink shadow-sm"
            : "text-ink-soft hover:text-ink"
        )}
        title="Affichage tableau"
      >
        <List className="size-3.5" />
        <span className="hidden sm:inline">Tableau</span>
      </button>
    </div>
  );
}
