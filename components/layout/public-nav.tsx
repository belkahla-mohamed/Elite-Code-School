"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, LayoutDashboard, LogOut, GraduationCap } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/lib/auth-context";
import Image from "next/image";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/curricula", label: "Programmes" },
  { href: "/portfolios", label: "Portfolios" },
  { href: "/about", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

export default function PublicNav() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();
  const profileRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  // Close menu on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Close profile dropdown on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "??";

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
        {isAuthenticated ? (
          <div className="relative ml-2" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-sm font-bold text-ink shadow-sm transition-all hover:border-ink-soft/30 hover:shadow-md active:scale-[0.97]"
            >
              <span className="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-sky to-cyan text-[11px] font-black text-white shadow-sm">
                {initials}
              </span>
              <span className="max-w-28 truncate">{user?.name}</span>
              <ChevronDown className={`size-3.5 text-ink-soft/60 transition duration-200 ${profileOpen ? "rotate-180" : ""}`} />
            </button>
            {profileOpen && (
              <>
                {/* Desktop dropdown */}
                <div className="absolute right-0 top-full mt-2 hidden w-56 md:block">
                  <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-xl shadow-black/5 ring-1 ring-black/5 dark:ring-white/10">
                    {/* Header section */}
                    <div className="bg-gradient-to-br from-sky/5 to-cyan/5 px-4 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky to-cyan text-sm font-black text-white shadow-md">
                          {initials}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-ink">{user?.name}</p>
                          <p className="text-xs font-medium text-ink-soft">
                            {isAdmin ? "Administrateur" : "Parent"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-1.5">
                      {isAdmin ? (
                        <Link
                          href="/dashboard"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold text-ink transition hover:bg-sky/5 hover:text-sky"
                        >
                          <span className="flex size-7 items-center justify-center rounded-lg bg-sky/10 text-sky">
                            <LayoutDashboard className="size-3.5" />
                          </span>
                          Tableau de bord
                        </Link>
                      ) : (
                        <Link
                          href="/parent"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold text-ink transition hover:bg-sky/5 hover:text-sky"
                        >
                          <span className="flex size-7 items-center justify-center rounded-lg bg-sky/10 text-sky">
                            <GraduationCap className="size-3.5" />
                          </span>
                          Portfolio
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-border/50" />
                    <div className="p-1.5">
                      <button
                        onClick={() => { setProfileOpen(false); logout(); }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold text-coral transition hover:bg-coral/5"
                      >
                        <span className="flex size-7 items-center justify-center rounded-lg bg-coral/10 text-coral">
                          <LogOut className="size-3.5" />
                        </span>
                        Déconnexion
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="ml-2 rounded-full bg-sky px-5 py-2 text-sm font-black uppercase tracking-wide text-white hover:bg-sky-dark transition"
          >
            Connexion
          </Link>
        )}
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
                <Image
                  src="/logos/logo-icon.png"
                  alt="Elite Code School"
                  width={32}
                  height={32}
                  className="size-8"
                />
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
              {isAuthenticated && (
                <div className="mb-4 overflow-hidden rounded-2xl bg-gradient-to-br from-sky/5 to-cyan/5 border border-border/50 px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky to-cyan text-sm font-black text-white shadow-md">
                      {initials}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-ink">{user?.name}</p>
                      <p className="text-xs font-medium text-ink-soft">
                        {isAdmin ? "Administrateur" : "Parent"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
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

            {/* CTA / Profile actions */}
            <div className="border-t-2 border-border px-4 py-6">
              {isAuthenticated ? (
                <div className="space-y-2">
                  {isAdmin ? (
                    <Link
                      href="/dashboard"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-center gap-2 rounded-full border-2 border-border bg-surface px-5 py-3 text-sm font-bold text-ink transition hover:bg-body w-full"
                    >
                      <LayoutDashboard className="size-4" />
                      Tableau de bord
                    </Link>
                  ) : (
                    <Link
                      href="/parent"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-center gap-2 rounded-full border-2 border-border bg-surface px-5 py-3 text-sm font-bold text-ink transition hover:bg-body w-full"
                    >
                      <GraduationCap className="size-4" />
                      Portfolio
                    </Link>
                  )}
                  <button
                    onClick={() => { setOpen(false); logout(); }}
                    className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-coral/30 bg-coral/10 px-5 py-3 text-sm font-bold text-coral transition hover:bg-coral/20"
                  >
                    <LogOut className="size-4" />
                    Déconnexion
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="btn-primary w-full justify-center"
                >
                  Connexion
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
