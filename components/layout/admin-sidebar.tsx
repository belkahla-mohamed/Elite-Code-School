"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, GraduationCap, BookOpen, Shield, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/enrollments", label: "Inscriptions", icon: Users },
  { href: "/admin/students", label: "Élèves", icon: GraduationCap },
  { href: "/admin/programs", label: "Programmes", icon: BookOpen },
  { href: "/admin/teachers", label: "Administrateurs", icon: Shield },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-full w-64 flex-col border-r-2 border-[#E8EEF6] bg-white">
      <div className="flex items-center gap-2.5 px-6 pt-6 pb-8">
        <span className="flex size-9 items-center justify-center rounded-lg bg-sky font-display font-black text-sm text-white">
          EC
        </span>
        <span className="font-display font-black text-sm text-ink">Admin</span>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-brand-sm px-3 py-2.5 text-sm font-bold transition",
                isActive
                  ? "bg-sky/10 text-sky"
                  : "text-ink-soft hover:text-ink hover:bg-surface"
              )}
            >
              <link.icon className="size-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t-2 border-[#E8EEF6] p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="size-8 rounded-full bg-sky flex items-center justify-center font-display font-black text-sm text-white">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-ink truncate">Admin</p>
            <p className="text-xs text-ink-soft truncate">admin@elitecodeschool.ma</p>
          </div>
        </div>
        <a
          href="/api/auth/logout"
          className="flex items-center gap-2 rounded-brand-sm px-3 py-2 text-sm font-bold text-ink-soft hover:text-coral hover:bg-coral/5 transition"
        >
          <LogOut className="size-4" />
          Déconnexion
        </a>
      </div>
    </aside>
  );
}
