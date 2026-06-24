"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

interface NavLink {
  href: string;
  label: string;
}

export function HeaderClient({ navLinks }: { navLinks: NavLink[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="md:hidden rounded-full p-2 text-ink-soft hover:text-ink hover:bg-surface transition"
        aria-label="Menu"
      >
        <Menu className="size-6" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 bg-white border-l-2 border-[#E8EEF6] p-6 shadow-lg">
            <div className="flex items-center justify-between mb-8">
              <span className="font-display font-black text-lg text-ink">Menu</span>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full p-1 text-ink-soft hover:text-ink transition"
                aria-label="Fermer"
              >
                <X className="size-6" />
              </button>
            </div>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-brand-sm px-4 py-3 text-base font-bold text-ink-soft hover:text-ink hover:bg-surface transition"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="mt-4 rounded-full bg-sky px-5 py-3 text-center text-sm font-black uppercase tracking-wide text-white hover:bg-sky-dark transition"
              >
                Connexion
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
