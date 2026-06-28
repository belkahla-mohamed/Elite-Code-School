import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t-2 border-border bg-surface">
      <div className="container-shell py-10 sm:py-16">
        <div className="grid gap-8 sm:gap-10 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="flex size-9 items-center justify-center rounded-lg bg-sky font-display font-black text-sm text-white">
                EC
              </span>
              <span className="font-display font-black text-lg text-ink">Elite Code School</span>
            </div>
            <p className="text-sm text-ink-soft leading-relaxed max-w-xs">
              Robotique, programmation et IA pour les jeunes de 7 à 17 ans à Marrakech.
            </p>
          </div>

          <div>
            <h4 className="font-display font-black text-sm text-ink mb-4">Liens rapides</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-sm text-ink-soft hover:text-sky transition">Accueil</Link>
              <Link href="/curricula" className="text-sm text-ink-soft hover:text-sky transition">Programmes</Link>
              <Link href="/portfolios" className="text-sm text-ink-soft hover:text-sky transition">Portfolios</Link>
              <Link href="/about" className="text-sm text-ink-soft hover:text-sky transition">À propos</Link>
              <Link href="/contact" className="text-sm text-ink-soft hover:text-sky transition">Contact</Link>
              <Link href="/login" className="text-sm text-ink-soft hover:text-sky transition">Connexion</Link>
            </nav>
          </div>

          <div>
            <h4 className="font-display font-black text-sm text-ink mb-4">Contact</h4>
            <div className="flex flex-col gap-3">
              <a href="mailto:contact@elitecodeschool.ma" className="flex items-center gap-2 text-sm text-ink-soft hover:text-sky transition">
                <Mail className="size-4" /> contact@elitecodeschool.ma
              </a>
              <a href="tel:+212600000000" suppressHydrationWarning className="flex items-center gap-2 text-sm text-ink-soft hover:text-sky transition">
                <Phone className="size-4" /> +212 600 000 000
              </a>
              <span className="flex items-center gap-2 text-sm text-ink-soft">
                <MapPin className="size-4" /> Marrakech, Maroc
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 pt-6 border-t-2 border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-ink-soft">
            &copy; {new Date().getFullYear()} Elite Code School. Tous droits réservés.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-xs text-ink-soft hover:text-sky transition">Politique de confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
