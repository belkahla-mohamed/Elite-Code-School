"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Search, User, LogOut, Settings } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { NotificationBell } from "@/components/ui/notification-bell";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/inscriptions": "Inscriptions",
  "/dashboard/students": "Élèves",
  "/dashboard/programs": "Programmes",
  "/dashboard/projects": "Projets & Certifications",
  "/dashboard/gallery": "Galerie",
  "/dashboard/settings": "Paramètres",
  "/dashboard/activity": "Activité",
  "/dashboard/notifications": "Notifications",
  "/dashboard/admin-users": "Admin Users",
  "/admin/enrollments": "Inscriptions",
  "/admin/students": "Élèves",
  "/admin/curricula": "Programmes",
  "/dashboard/categories": "Catégories",
};

interface AdminHeaderProps {
  collapsed: boolean;
  onToggleSidebar: () => void;
  onOpenMobile: () => void;
}

export function AdminHeader({ collapsed, onToggleSidebar, onOpenMobile }: AdminHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const title = Object.entries(pageTitles).find(([key]) =>
    pathname === key || pathname.startsWith(key + "/")
  )?.[1] ?? "Dashboard";

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin-login";
  }

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

        <NotificationBell />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 border-l-2 border-border pl-4 cursor-pointer">
              <div className="flex size-10 items-center justify-center rounded-full bg-sky font-display text-sm font-black text-white">
                A
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-ink">Admin</p>
                <p className="text-xs text-ink-soft">Super Admin</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
              <Settings className="mr-2 size-4" /> Paramètres
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/dashboard")}>
              <User className="mr-2 size-4" /> Dashboard
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-coral">
              <LogOut className="mr-2 size-4" /> Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
