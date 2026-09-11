"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import Image from "next/image";
import { SquaresFour, CalendarBlank, FolderOpen, Medal, Users, ClipboardText, ChatCircle, BellRinging, Shield, FileText, SignOut, CaretLeft } from "@phosphor-icons/react/dist/ssr";
import { Separator } from "@/components/ui/separator";

const parentLinks = [
  { type: "separator", label: "Vue d'ensemble" },
  { href: "/parent", label: "Dashboard", icon: SquaresFour },
  { href: "/parent/planning", label: "Planning", icon: CalendarBlank },
  { href: "/parent/report", label: "Rapport", icon: FileText },

  { type: "separator", label: "Scolarité" },
  { href: "/parent/portfolio", label: "Portfolio", icon: FolderOpen },
  { href: "/parent/certifications", label: "Certificats", icon: Medal },

  { type: "separator", label: "Communication" },
  { href: "/parent/messages", label: "Messages", icon: ChatCircle },
  { href: "/parent/requests", label: "Demandes", icon: ClipboardText },
  { href: "/parent/community", label: "Communauté", icon: Users },

  { type: "separator", label: "Système" },
  { href: "/parent/notifications", label: "Notifications", icon: BellRinging },
  { href: "/parent/privacy", label: "Confidentialité", icon: Shield },
];

interface ParentSidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onToggle: () => void;
}

export function ParentSidebar({ collapsed, mobileOpen, onCloseMobile, onToggle }: ParentSidebarProps) {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => setMounted(true), []);

  const studentName = user?.name ?? "Élève";

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        logout();
        window.location.href = "/login";
      } else {
        setLoggingOut(false);
      }
    } catch {
      setLoggingOut(false);
    }
  };

  const navContent = (
    <div className="flex h-full flex-col">
      {/* Brand Header */}
      <div className="flex h-16 shrink-0 items-center justify-between px-4">
        <Link href="/parent" className="flex items-center gap-3">
          <Image
            src={mounted && resolvedTheme === "dark" ? "/logos/logo-icon-dark.png" : "/logos/logo-icon.png"}
            alt="Elite Code School"
            width={32}
            height={32}
            className="size-8"
          />
          {!collapsed && (
            <span className="font-display text-lg font-black tracking-tight text-ink">Elite Code School</span>
          )}
        </Link>
        {!collapsed && (
          <button
            onClick={onToggle}
            className="hidden rounded-lg p-1.5 text-ink-soft hover:bg-surface hover:text-ink md:block"
            aria-label="Réduire la barre"
          >
            <CaretLeft className="size-5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {parentLinks.map((item, index) => {
            if (item.type === "separator") {
              if (collapsed) return <Separator key={index} className="my-4" />;
              return (
                <div key={index} className="mt-6 mb-2 px-3 text-xs font-bold uppercase tracking-wider text-ink-soft/60">
                  {item.label}
                </div>
              );
            }

            const isActive = pathname === item.href;
            const Icon = item.icon!;

            return (
              <Link
                key={item.href}
                href={item.href!}
                onClick={onCloseMobile}
                className={cn(
                  "group flex items-center gap-3 rounded-brand-sm px-3 py-2.5 text-sm font-semibold transition-all duration-200",
                  isActive
                    ? "bg-brand/10 text-brand"
                    : "text-ink-soft hover:bg-surface hover:text-ink"
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  weight={isActive ? "fill" : "regular"}
                  className={cn("size-5 shrink-0 transition-colors duration-200", isActive ? "text-brand" : "text-ink-soft group-hover:text-ink")}
                />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </div>

      {/* User Footer */}
      <div className="border-t-2 border-border/50 p-4">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-brand-sm bg-brand/10 text-brand">
            <span className="text-sm font-bold uppercase">{studentName.charAt(0)}</span>
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-ink">{studentName}</p>
              <p className="truncate text-xs font-medium text-ink-soft">Espace Parent</p>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className={cn(
            "flex w-full items-center gap-3 rounded-brand-sm px-3 py-2.5 text-sm font-bold text-coral transition-all duration-200 hover:bg-coral/10",
            collapsed && "justify-center px-0"
          )}
          title={collapsed ? "Déconnexion" : undefined}
        >
          <SignOut className="size-5 shrink-0" weight="bold" />
          {!collapsed && <span>{loggingOut ? "Déconnexion..." : "Se déconnecter"}</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink/80 backdrop-blur-sm md:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r-2 border-border/50 bg-white dark:bg-surface transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          collapsed ? "w-20" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {navContent}
      </aside>
    </>
  );
}
