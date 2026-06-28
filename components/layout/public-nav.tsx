"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/curricula", label: "Programmes" },
  { href: "/portfolios", label: "Portfolios" },
  { href: "/about", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

export default function PublicNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* ── Desktop Nav ─────────────────────────────── */}
      <nav className="hidden md:flex items-center gap-1">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`rounded-full px-4 py-2 text-sm font-bold transition hover:text-ink hover:bg-body ${
              pathname === href ? "text-sky font-black" : "text-ink-soft"
            }`}
          >
            {label}
          </Link>
        ))}
        <ThemeToggle />
        <Link
          href="/login"
          className="ml-2 rounded-full bg-sky px-5 py-2 text-sm font-black uppercase tracking-wide text-white hover:bg-sky-dark transition"
        >
          Connexion
        </Link>
      </nav>

      {/* ── Mobile: ThemeToggle + Burger ────────────── */}
      <div className="flex items-center gap-2 md:hidden">
        <ThemeToggle />
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          className="flex size-10 items-center justify-center rounded-full border-2 border-border bg-surface text-ink transition hover:bg-body"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* ── Mobile Drawer ────────────────────────────── */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex flex-col md:hidden"
          aria-modal="true"
          role="dialog"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Drawer panel */}
          <div className="absolute right-0 top-0 flex h-full w-[75vw] max-w-xs flex-col bg-white shadow-2xl dark:bg-surface">
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-border px-6 py-4">
              <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
                <span className="flex size-8 items-center justify-center rounded-lg bg-sky font-display font-black text-xs text-white">
                  EC
                </span>
                <span className="font-display font-black text-base text-ink">Elite Code School</span>
              </Link>
              <button
                onClick={() => setOpen(false)}
                className="flex size-9 items-center justify-center rounded-full border-2 border-border text-ink-soft hover:text-ink transition"
                aria-label="Fermer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Links */}
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-6">
              {links.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center rounded-2xl px-4 py-3.5 text-base font-bold transition hover:bg-body ${
                    pathname === href
                      ? "bg-sky/10 text-sky"
                      : "text-ink"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* CTA */}
            <div className="border-t-2 border-border px-4 py-6">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="btn-primary w-full justify-center"
              >
                Connexion
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
