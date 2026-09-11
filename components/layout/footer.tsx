"use client";

import Link from "next/link";
import Image from "next/image";
import { EnvelopeSimple, Phone, MapPin, FacebookLogo, InstagramLogo, YoutubeLogo } from "@phosphor-icons/react";

export function Footer() {
  return (
    <footer className="bg-surface dark:bg-body">
      <div className="container-shell py-10 sm:py-16">
        <div className="grid gap-8 sm:gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-2.5">
              <Image
                src="/logos/logo-icon.png"
                alt="Elite Code School"
                width={36}
                height={36}
                className="size-9"
              />
              <span className="font-display text-lg font-black text-ink">Elite Code School</span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-ink-soft">
              Robotique, programmation et IA pour les jeunes de 7 a 17 ans a Marrakech.
            </p>
            <div className="mt-4 flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="FacebookLogo" className="flex size-9 items-center justify-center rounded-full bg-border text-ink-soft transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-brand hover:text-white">
                <FacebookLogo className="size-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="InstagramLogo" className="flex size-9 items-center justify-center rounded-full bg-border text-ink-soft transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-brand hover:text-white">
                <InstagramLogo className="size-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube" className="flex size-9 items-center justify-center rounded-full bg-border text-ink-soft transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-brand hover:text-white">
                <YoutubeLogo className="size-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-ink-soft">Liens rapides</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-sm text-ink-soft transition hover:text-brand">Accueil</Link>
              <Link href="/curricula" className="text-sm text-ink-soft transition hover:text-brand">Programmes</Link>
              <Link href="/portfolios" className="text-sm text-ink-soft transition hover:text-brand">Portfolios</Link>
              <Link href="/about" className="text-sm text-ink-soft transition hover:text-brand">A propos</Link>
              <Link href="/contact" className="text-sm text-ink-soft transition hover:text-brand">Contact</Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-ink-soft">Contact</h4>
            <div className="flex flex-col gap-3">
              <a href="mailto:contact@elitecodeschool.ma" className="flex items-center gap-2 text-sm text-ink-soft transition hover:text-brand">
                <EnvelopeSimple className="size-4" /> contact@elitecodeschool.ma
              </a>
              <a href="tel:+212600000000" suppressHydrationWarning className="flex items-center gap-2 text-sm text-ink-soft transition hover:text-brand">
                <Phone className="size-4" /> +212 600 000 000
              </a>
              <span className="flex items-center gap-2 text-sm text-ink-soft">
                <MapPin className="size-4" /> Marrakech, Maroc
              </span>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-ink-soft">Horaires</h4>
            <div className="flex flex-col gap-2 text-sm text-ink-soft">
              <span>Lun – Ven : 9h30 – 18h30</span>
              <span>Samedi : 9h30 – 13h00</span>
              <span>Dimanche : Ferme</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:mt-12 sm:flex-row">
          <p className="text-xs text-ink-soft">
            &copy; {new Date().getFullYear()} Elite Code School. Tous droits reserves.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-xs text-ink-soft transition hover:text-brand">Politique de confidentialite</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
