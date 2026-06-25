import Link from "next/link";
import { HeaderClient } from "./header-client";
import { ThemeToggle } from "@/components/ui/theme-provider";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/curricula", label: "Programmes" },
  { href: "/portfolios", label: "Portfolios" },
  { href: "/about", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-[#E8EEF6] bg-white/95 backdrop-blur-sm">
      <div className="container-shell flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <span className="flex size-9 items-center justify-center rounded-lg bg-sky font-display font-black text-sm text-white">
            EC
          </span>
          <span className="font-display font-black text-lg text-ink hidden sm:inline">
            Elite Code School
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-bold text-ink-soft hover:text-ink hover:bg-surface transition"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="ml-3 rounded-full bg-sky px-5 py-2 text-sm font-black uppercase tracking-wide text-white hover:bg-sky-dark transition"
          >
            Connexion
          </Link>
        </nav>
        </div>

        <HeaderClient navLinks={navLinks} />
      </div>
    </header>
  );
}
