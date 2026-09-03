import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-ink">
      <div className="container-shell py-10 sm:py-16">
        <div className="grid gap-8 sm:gap-10 sm:grid-cols-3">
          <div>
            <div className="mb-4 flex items-center gap-2.5">
              <Image
                src="/logos/logo-icon.png"
                alt="Elite Code School"
                width={36}
                height={36}
                className="size-9"
              />
              <span className="font-display text-lg font-black text-white">Elite Code School</span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-white/70">
              Robotique, programmation et IA pour les jeunes de 7 à 17 ans à Marrakech.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-mono text-sm uppercase tracking-wider text-white/50">Liens rapides</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-sm text-white/70 transition hover:text-white">Accueil</Link>
              <Link href="/curricula" className="text-sm text-white/70 transition hover:text-white">Programmes</Link>
              <Link href="/portfolios" className="text-sm text-white/70 transition hover:text-white">Portfolios</Link>
              <Link href="/about" className="text-sm text-white/70 transition hover:text-white">À propos</Link>
              <Link href="/contact" className="text-sm text-white/70 transition hover:text-white">Contact</Link>
              <Link href="/login" className="text-sm text-white/70 transition hover:text-white">Connexion</Link>
            </nav>
          </div>

          <div>
            <h4 className="mb-4 font-mono text-sm uppercase tracking-wider text-white/50">Contact</h4>
            <div className="flex flex-col gap-3">
              <a href="mailto:contact@elitecodeschool.ma" className="flex items-center gap-2 text-sm text-white/70 transition hover:text-white">
                <Mail className="size-4" /> contact@elitecodeschool.ma
              </a>
              <a href="tel:+212600000000" suppressHydrationWarning className="flex items-center gap-2 text-sm text-white/70 transition hover:text-white">
                <Phone className="size-4" /> +212 600 000 000
              </a>
              <span className="flex items-center gap-2 text-sm text-white/70">
                <MapPin className="size-4" /> Marrakech, Maroc
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t-2 border-white/15 pt-6 sm:mt-12 sm:flex-row">
          <p className="text-xs text-white/50">
            &copy; {new Date().getFullYear()} Elite Code School. Tous droits réservés.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-xs text-white/50 transition hover:text-white">Politique de confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
