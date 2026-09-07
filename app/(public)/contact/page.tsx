import { Mail, Phone, MapPin } from "lucide-react";
import { QuickContactForm } from "@/components/QuickContactForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez Elite Code School à Marrakech — formulaire de contact, email, téléphone et adresse.",
};

export default function ContactPage() {
  return (
    <section className="relative overflow-hidden bg-brand py-16 sm:py-24 dark:bg-brand-dark">
      <div aria-hidden className="absolute -left-16 top-12 size-40 rounded-full bg-white/10" />
      <div aria-hidden className="absolute bottom-8 right-[15%] size-24 rounded-full bg-amber/20" />
      <div aria-hidden className="absolute left-[8%] top-1/2 size-6 rotate-12 rounded-lg bg-cream/40" />
      <div aria-hidden className="absolute right-[6%] top-16 size-8 -rotate-12 rounded-lg bg-white/15" />

      <div className="container-shell grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <span className="inline-flex rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-white">
            Contact
          </span>
          <h1 className="mt-4 font-display text-3xl font-semibold tracking-[-0.02em] text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
            Une question ?{" "}
            <span className="text-cream">Contactez-nous</span>
          </h1>
          <p className="mt-4 max-w-lg text-sm font-medium leading-7 text-white/80 sm:text-base sm:leading-8">
            Une question ? Notre équipe vous répond rapidement — sous 24h ouvrées.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 lg:gap-3">
            <a href="tel:+212600000000" suppressHydrationWarning className="flex items-center gap-4 rounded-brand border border-white/20 bg-white/10 p-4 transition duration-300 ease-out hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/15 hover:shadow-lg">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/15">
                <Phone className="size-5 text-white" />
              </span>
              <div>
                <strong className="block text-sm font-bold text-white">+212 600 000 000</strong>
                <small className="text-xs font-semibold text-white/60">Lun – Sam, 9h30 – 18h30</small>
              </div>
            </a>
            <a href="mailto:contact@elitecodeschool.ma" className="flex items-center gap-4 rounded-brand border border-white/20 bg-white/10 p-4 transition duration-300 ease-out hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/15 hover:shadow-lg">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/15">
                <Mail className="size-5 text-white" />
              </span>
              <div>
                <strong className="block text-sm font-bold text-white">contact@elitecodeschool.ma</strong>
                <small className="text-xs font-semibold text-white/60">Reponse sous 24h</small>
              </div>
            </a>
            <span className="flex items-center gap-4 rounded-brand border border-white/20 bg-white/10 p-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/15">
                <MapPin className="size-5 text-white" />
              </span>
              <div>
                <strong className="block text-sm font-bold text-white">Marrakech, Maroc</strong>
                <small className="text-xs font-semibold text-white/60">Adresse exacte sur demande</small>
              </div>
            </span>
          </div>
        </div>

        <div className="rounded-brand bg-white p-6 sm:p-8 dark:bg-surface">
          <QuickContactForm />
        </div>
      </div>
    </section>
  );
}
