"use client";

import { useTheme } from "next-themes";
import { List, Moon, Sun } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import Image from "next/image";

interface ParentHeaderProps {
  collapsed: boolean;
  onToggleSidebar: () => void;
  onOpenMobile: () => void;
}

export function ParentHeader({ collapsed, onToggleSidebar, onOpenMobile }: ParentHeaderProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b-2 border-border/50 bg-white px-4 dark:bg-surface sm:px-6">
      <button
        onClick={onOpenMobile}
        className="rounded-lg p-2 text-ink-soft hover:bg-surface hover:text-ink md:hidden"
        aria-label="Ouvrir le menu"
      >
        <List className="size-6" />
      </button>

      <button
        onClick={onToggleSidebar}
        className="hidden rounded-lg p-2 text-ink-soft hover:bg-surface hover:text-ink md:block"
        aria-label="Basculer la barre latérale"
      >
        <List className="size-5" />
      </button>

      <div className="flex flex-1 items-center justify-between">
        <div className="flex items-center gap-3 md:hidden">
          <Image
            src={mounted && resolvedTheme === "dark" ? "/logos/logo-icon-dark.png" : "/logos/logo-icon.png"}
            alt="Elite Code School"
            width={32}
            height={32}
            className="size-8"
          />
        </div>
        <div className="hidden md:block" />

        <div className="flex items-center gap-2">
          {mounted && (
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="rounded-full p-2 text-ink-soft transition-colors hover:bg-surface hover:text-ink"
              aria-label="Basculer le thème"
            >
              {resolvedTheme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
