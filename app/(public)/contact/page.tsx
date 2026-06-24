import type { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";
import { QuickContactForm } from "@/components/QuickContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez Elite Code School à Marrakech — formulaire de contact, email, téléphone et adresse.",
};

export default function ContactPage() {
  return (
    <div className="py-20">
      <section className="container-shell text-center mb-16">
        <span className="tag">Contact</span>
        <h1 className="font-display text-5xl font-black tracking-[-0.04em] text-ink mt-4">
          Contactez-nous
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg font-semibold leading-8 text-ink-soft">
          Une question? Notre équipe vous répond rapidement.
        </p>
      </section>

      <section className="container-shell grid gap-12 lg:grid-cols-[.6fr_1fr]">
        <div className="space-y-8">
          {[
            { icon: Mail, label: "Email", value: "contact@elitecodeschool.ma", href: "mailto:contact@elitecodeschool.ma" },
            { icon: Phone, label: "Téléphone", value: "+212 600 000 000", href: "tel:+212600000000" },
            { icon: MapPin, label: "Adresse", value: "Marrakech, Maroc", href: null },
          ].map(({ icon: Icon, label, value, href }) => (
            <div key={label} className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-sky/10 text-sky">
                <Icon className="size-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-ink-soft uppercase tracking-wide">{label}</p>
                {href ? (
                  <a href={href} className="font-bold text-ink hover:text-sky transition">{value}</a>
                ) : (
                  <p className="font-bold text-ink">{value}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-brand border-2 border-[#E8EEF6] bg-white p-8">
          <h3 className="font-display text-xl font-black mb-6">Envoyer un message</h3>
          <QuickContactForm />
        </div>
      </section>
    </div>
  );
}
