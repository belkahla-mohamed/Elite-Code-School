"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FolderOpen, Shield, Award, FileText } from "lucide-react";

const parentLinks = [
  { href: "/parent", label: "Dashboard", icon: LayoutDashboard },
  { href: "/parent/portfolio", label: "Portfolio", icon: FolderOpen },
  { href: "/parent/privacy", label: "Confidentialité", icon: Shield },
  { href: "/parent/certifications", label: "Certificats", icon: Award },
  { href: "/parent/report", label: "Rapport", icon: FileText },
];

export function ParentNav() {
  const pathname = usePathname();

  return (
    <nav className="border-b-2 border-border/50 bg-white dark:bg-surface shadow-sm">
      <div className="container-shell flex h-14 items-center gap-0.5 overflow-x-auto">
        {parentLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-bold transition",
                isActive
                  ? "bg-sky/10 text-sky"
                  : "text-ink-soft hover:text-ink hover:bg-surface"
              )}
            >
              <Icon className="size-4" />
              {link.label}
              {isActive && (
                <span className="absolute -bottom-[9px] left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-sky" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-ink-soft mb-6">
      {items.map((item, i) => (
        <span key={item.label} className="flex items-center gap-2">
          {i > 0 && <span className="text-border">/</span>}
          {item.href ? (
            <Link href={item.href} className="hover:text-sky transition font-medium">{item.label}</Link>
          ) : (
            <span className="text-ink font-bold">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
