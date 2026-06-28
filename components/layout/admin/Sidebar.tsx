"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ClipboardList,
  GraduationCap,
  BookOpen,
  Award,
  Image,
  Settings,
  LogOut,
  ChevronLeft,
} from "lucide-react";

const sidebarLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/inscriptions", label: "Inscriptions", icon: ClipboardList },
  { href: "/dashboard/students", label: "Élèves", icon: GraduationCap },
  { href: "/dashboard/programs", label: "Programmes", icon: BookOpen },
  { href: "/dashboard/projects", label: "Projets", icon: Award },
  { href: "/dashboard/gallery", label: "Galerie", icon: Image },
  { href: "/dashboard/settings", label: "Paramètres", icon: Settings },
];

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onToggle: () => void;
}

export function Sidebar({ collapsed, mobileOpen, onCloseMobile, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={onCloseMobile}
        />
      )}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex flex-col border-r-2 border-border bg-surface transition-all duration-300",
          "md:z-30",
          collapsed ? "w-20" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className={cn("flex items-center gap-3 px-6 pt-6 pb-8", collapsed && "justify-center px-0")}>
          <span className="flex size-10 shrink-0 items-center justify-center rounded-brand-sm bg-sky font-display font-black text-sm text-white">
            EC
          </span>
          <span className={cn("font-display font-black text-base text-ink truncate", collapsed && "hidden")}>
            Admin
          </span>
          <button
            onClick={onToggle}
            className={cn(
              "ml-auto hidden size-8 items-center justify-center rounded-full text-ink-soft hover:bg-surface hover:text-ink transition md:flex",
              collapsed && "ml-0"
            )}
            title={collapsed ? "Étendre" : "Réduire"}
          >
            <ChevronLeft className={cn("size-4 transition", collapsed && "rotate-180")} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {sidebarLinks.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(link.href + "/");

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onCloseMobile}
                className={cn(
                  "flex items-center gap-3 rounded-brand-sm px-4 py-3 text-sm font-bold transition",
                  collapsed && "justify-center px-3",
                  isActive
                    ? "bg-sky text-white"
                    : "text-ink-soft hover:bg-[#F0F5FF] dark:hover:bg-slate-700 hover:text-ink"
                )}
                title={collapsed ? link.label : undefined}
              >
                <link.icon className={cn("size-5 shrink-0", isActive ? "text-white" : "text-ink-soft")} />
                <span className={cn("truncate", collapsed && "hidden")}>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={cn("border-t-2 border-border p-5", collapsed && "px-3 py-5")}>
          <div className={cn("mb-3 flex items-center gap-3", collapsed && "justify-center")}>
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sky font-display text-sm font-black text-white">
              A
            </div>
            <div className={cn("min-w-0 flex-1", collapsed && "hidden")}>
              <p className="truncate text-sm font-bold text-ink">Administrateur</p>
              <p className="truncate text-xs text-ink-soft">admin@elitecode.ma</p>
            </div>
          </div>
          <Link
            href="/api/auth/logout"
            className={cn(
              "flex items-center gap-2 rounded-brand-sm px-3 py-2 text-sm font-bold text-ink-soft transition hover:bg-coral/5 hover:text-coral",
              collapsed && "justify-center px-3"
            )}
            title={collapsed ? "Déconnexion" : undefined}
          >
            <LogOut className="size-4 shrink-0" />
            <span className={cn(collapsed && "hidden")}>Déconnexion</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
