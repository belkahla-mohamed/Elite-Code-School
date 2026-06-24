"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const parentLinks = [
  { href: "/parent", label: "Dashboard" },
  { href: "/parent/portfolio", label: "Portfolio" },
  { href: "/parent/privacy", label: "Confidentialité" },
  { href: "/parent/certifications", label: "Certificats" },
  { href: "/parent/report", label: "Rapport" },
];

export function ParentNav() {
  const pathname = usePathname();

  return (
    <nav className="border-b-2 border-[#E8EEF6] bg-white">
      <div className="container-shell flex h-14 items-center gap-1 overflow-x-auto">
        {parentLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-bold transition",
                isActive
                  ? "bg-sky/10 text-sky"
                  : "text-ink-soft hover:text-ink hover:bg-surface"
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-ink-soft mb-4">
      {items.map((item, i) => (
        <span key={item.label} className="flex items-center gap-2">
          {i > 0 && <span className="text-[#E8EEF6]">/</span>}
          {item.href ? (
            <Link href={item.href} className="hover:text-sky transition">{item.label}</Link>
          ) : (
            <span className="text-ink font-semibold">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
