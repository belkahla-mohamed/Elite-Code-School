import type { Metadata } from "next"
import { Mail, Phone, MapPin, Clock, CalendarCheck } from "lucide-react"
import { QuickContactForm } from "@/components/QuickContactForm"
import { PageHero, CtaBand } from "@/components/page-sections"
import { ScrollReveal } from "@/components/ui/scroll-reveal"

export const metadata: Metadata = {
  title: "Contact — Elite Code School",
  description: "Contactez Elite Code School à Marrakech — formulaire de contact, email, téléphone et adresse.",
}

const contactCards = [
  { icon: Phone, tint: "bg-[#E8F7FF] text-sky", href: "tel:+212600000000", title: "+212 600 000 000", text: "Lun – Sam, 9h30 – 18h30" },
  { icon: Mail, tint: "bg-[#FDE9EA] text-brand", href: "mailto:contact@elitecodeschool.ma", title: "contact@elitecodeschool.ma", text: "Réponse sous 24h ouvrées" },
  { icon: MapPin, tint: "bg-[#FFF3D6] text-amber", href: null, title: "Marrakech, Maroc", text: "Adresse exacte sur demande" },
  { icon: Clock, tint: "bg-[#F1EAFE] text-violet", href: null, title: "Horaires d'ouverture", text: "Lundi – Samedi : 9h30 – 18h30" },
]

export default function ContactPage() {
  return (
    <div>
      <PageHero
        badge="Contact — coding, robotique & IA"
        titleBefore="Une question ?"
        titleHighlight="Contactez-nous"
        subtitle="Notre équipe vous répond sous 24h ouvrées — ou passez nous voir à Marrakech pour découvrir l'école en vrai."
      />

      <section className="bg-white py-16 sm:py-24 dark:bg-body">
        <div className="container-shell grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — info cards */}
          <ScrollReveal>
            <span className="tag">Coordonnées</span>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-[-0.02em] text-ink dark:text-ink sm:text-4xl">
              Passons à{" "}
              <span className="text-brand">l&apos;action</span>
            </h2>
            <p className="mt-4 max-w-lg text-sm font-medium leading-7 text-ink-soft sm:text-base sm:leading-8 dark:text-ink-soft">
              Choisissez le moyen qui vous convient : téléphone, email ou formulaire — on vous répond vite.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {contactCards.map((card) => {
                const inner = (
                  <>
                    <span className={`flex size-12 shrink-0 items-center justify-center rounded-brand-sm ${card.tint}`}>
                      <card.icon className="size-6" />
                    </span>
                    <div className="min-w-0">
                      <strong className="block break-all font-display text-sm font-semibold text-ink dark:text-ink">{card.title}</strong>
                      <small className="mt-1 block text-xs font-medium leading-5 text-ink-soft dark:text-ink-soft">{card.text}</small>
                    </div>
                  </>
                )
                const cls = "flex gap-4 rounded-brand border border-border bg-surface p-5 transition duration-300 ease-out hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-md dark:border-white/10 dark:bg-[#1e293b]"
                return card.href ? (
                  <a key={card.title} href={card.href} suppressHydrationWarning className={cls}>
                    {inner}
                  </a>
                ) : (
                  <div key={card.title} className={cls}>
                    {inner}
                  </div>
                )
              })}
            </div>

            <div className="mt-6 flex items-center gap-3 rounded-brand border border-brand/20 bg-[#FDE9EA]/50 p-4 dark:border-brand/30 dark:bg-brand/10">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand/10">
                <CalendarCheck className="size-5 text-brand" />
              </span>
              <p className="text-xs font-semibold leading-5 text-ink dark:text-ink">
                Envie d&apos;essayer ? La première séance de découverte est{" "}
                <span className="font-bold text-brand">gratuite</span> — mentionnez-le dans le message.
              </p>
            </div>
          </ScrollReveal>

          {/* Right — form */}
          <ScrollReveal delay={150}>
            <div className="rounded-brand border border-border bg-white p-6 shadow-sm transition duration-300 ease-out hover:shadow-md dark:border-white/10 dark:bg-[#1e293b] sm:p-8">
              <QuickContactForm />
            </div>
          </ScrollReveal>
        </div>
      </section>

      <CtaBand />
    </div>
  )
}
