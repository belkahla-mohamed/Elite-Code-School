"use client";

import { usePathname } from "next/navigation";
import { Menu, Search, Bell } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/inscriptions": "Inscriptions",
  "/dashboard/students": "Élèves",
  "/dashboard/programs": "Programmes",
  "/dashboard/projects": "Projets & Certifications",
  "/dashboard/gallery": "Galerie",
  "/dashboard/settings": "Paramètres",
};

interface AdminHeaderProps {
  collapsed: boolean;
  onToggleSidebar: () => void;
  onOpenMobile: () => void;
}

export function AdminHeader({ collapsed, onToggleSidebar, onOpenMobile }: AdminHeaderProps) {
  const pathname = usePathname();
  const title = Object.entries(pageTitles).find(([key]) =>
    pathname === key || pathname.startsWith(key + "/")
  )?.[1] ?? "Dashboard";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b-2 border-border bg-surface px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="flex size-9 items-center justify-center rounded-full text-ink-soft hover:bg-surface hover:text-ink transition md:hidden"
          title="Menu"
        >
          <Menu className="size-5" />
        </button>
        {collapsed && (
          <button
            onClick={onToggleSidebar}
            className="hidden size-9 items-center justify-center rounded-full text-ink-soft hover:bg-surface hover:text-ink transition md:flex"
            title="Menu"
          >
            <Menu className="size-5" />
          </button>
        )}
        <h1 className="font-display text-xl font-black text-ink">{title}</h1>
      </div>

      <div className="hidden items-center gap-4 md:flex">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-56 rounded-full border-2 border-border bg-body py-2 pl-10 pr-4 text-sm text-ink outline-none transition focus:border-sky"
          />
        </div>

        <ThemeToggle />

        <button className="relative flex size-10 items-center justify-center rounded-full border-2 border-border bg-surface text-ink-soft transition hover:border-sky hover:text-sky">
          <Bell className="size-4" />
          <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-coral text-[10px] font-black text-white">
            3
          </span>
        </button>

        <div className="flex items-center gap-3 border-l-2 border-border pl-4">
          <div className="flex size-10 items-center justify-center rounded-full bg-sky font-display text-sm font-black text-white">
            A
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-ink">Admin</p>
            <p className="text-xs text-ink-soft">Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
