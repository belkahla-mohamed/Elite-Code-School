"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  LayoutDashboard,
  ClipboardList,
  BookOpen,
  Award,
  Image as ImageIcon,
  Settings,
  LogOut,
  ChevronLeft,
  Shield,
  Activity,
  Users,
  Library,
  BarChart3,
  Bell,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

const sidebarLinks = [
  { type: "separator", label: "Tableau de bord" },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { type: "separator", label: "Gestion" },
  { href: "/admin/enrollments", label: "Inscriptions", icon: ClipboardList },
  { href: "/admin/students", label: "Élèves", icon: Users },
  { href: "/admin/curricula", label: "Programmes", icon: Library },
  { href: "/dashboard/projects", label: "Projets", icon: Award },
  { href: "/dashboard/gallery", label: "Galerie", icon: ImageIcon },
  { type: "separator", label: "Système" },
  { href: "/dashboard/admin-users", label: "Administrateurs", icon: Shield },
  { href: "/dashboard/activity", label: "Activité", icon: Activity },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/analytics", label: "Analytiques", icon: BarChart3 },
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
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const logoSrc = mounted && resolvedTheme === "dark"
    ? "/logos/logo-light.png"
    : "/logos/logo-dark.png";

  const collapsedLogoSrc = "/logos/logo-icon.png";

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={onCloseMobile} />
      )}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen flex-col border-r-2 border-border bg-surface",
          "md:z-30",
          collapsed ? "w-20" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo Area - Fixed at top */}
        <div className={cn(
          "flex items-center gap-3 shrink-0",
          collapsed ? "justify-center px-0 pt-5 pb-4" : "px-5 pt-5 pb-4"
        )}>
          <div className={cn(
            "relative flex items-center shrink-0",
            collapsed ? "size-9" : "h-9 w-auto"
          )}>
            <Image
              src={collapsed ? collapsedLogoSrc : logoSrc}
              alt="Elite Code School"
              width={collapsed ? 36 : 140}
              height={36}
              className={cn(
                "object-contain",
                collapsed ? "size-9" : "h-9 w-auto"
              )}
              priority
            />
          </div>
          <button
            onClick={onToggle}
            className={cn(
              "ml-auto hidden size-7 items-center justify-center rounded-lg text-ink-soft hover:bg-surface hover:text-ink transition md:flex shrink-0",
              collapsed && "ml-0"
            )}
            title={collapsed ? "Étendre" : "Réduire"}
          >
            <ChevronLeft className={cn("size-4 transition", collapsed && "rotate-180")} />
          </button>
        </div>

        {/* Navigation - Scrollable middle section */}
        <nav className="flex-1 overflow-y-auto px-3 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-ink-soft/10">
          <div className="space-y-0.5 pb-2">
            {sidebarLinks.map((link: any, idx: number) => {
              if (link.type === "separator") {
                return (
                  <div
                    key={`sep-${idx}`}
                    className={cn(
                      "flex items-center py-2 first:pt-0",
                      collapsed ? "justify-center" : "px-4"
                    )}
                  >
                    {collapsed ? (
                      <div className="h-px w-8 bg-ink-soft/20" />
                    ) : (
                      <span className="text-[10px] font-black uppercase tracking-widest text-ink-soft/40">
                        {link.label}
                      </span>
                    )}
                  </div>
                );
              }

              const isActive =
                link.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname === link.href || pathname.startsWith(link.href + "/");

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onCloseMobile}
                  className={cn(
                    "flex items-center gap-3 rounded-brand-sm px-4 py-2.5 text-sm font-bold transition",
                    collapsed && "justify-center px-3",
                    isActive
                      ? "bg-sky/10 text-sky"
                      : "text-ink-soft hover:bg-[#F0F5FF] dark:hover:bg-slate-700 hover:text-ink"
                  )}
                  title={collapsed ? link.label : undefined}
                >
                  <link.icon className="size-5 shrink-0" />
                  {!collapsed && <span className="truncate">{link.label}</span>}
                </Link>
              );
            })}
          </div>
        </nav>

        <Separator className="mx-3" />
        {/* Bottom Area - Fixed at bottom */}
        <div className={cn("shrink-0", collapsed ? "px-3 py-4" : "px-5 py-4")}>
          <div className={cn("mb-2 flex items-center gap-3", collapsed && "justify-center")}>
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky to-cyan font-display text-xs font-black text-white">
              A
            </div>
            <div className={cn("min-w-0 flex-1", collapsed && "hidden")}>
              <p className="truncate text-sm font-bold text-ink">Administrateur</p>
              <p className="truncate text-xs text-ink-soft">admin@elitecode.ma</p>
            </div>
          </div>
          <button
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              router.push("/admin-login");
            }}
            className={cn(
              "flex w-full items-center gap-2 rounded-brand-sm px-3 py-2 text-sm font-bold text-ink-soft transition hover:bg-coral/5 hover:text-coral cursor-pointer",
              collapsed && "justify-center px-3"
            )}
            title={collapsed ? "Déconnexion" : undefined}
          >
            <LogOut className="size-4 shrink-0" />
            <span className={cn(collapsed && "hidden")}>Déconnexion</span>
          </button>
        </div>
      </aside>
    </>
  );
}
