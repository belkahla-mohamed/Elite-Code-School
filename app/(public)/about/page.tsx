import type { Metadata } from "next"
import { Target, Heart, Lightbulb, Users, Check } from "@phosphor-icons/react/dist/ssr";
import { PageHero, CtaBand } from "@/components/page-sections"
import { ScrollReveal } from "@/components/ui/scroll-reveal"

export const metadata: Metadata = {
  title: "À propos — Elite Code School",
  description: "Elite Code School — mission, vision et approche pédagogique pour l'éducation STEM à Marrakech.",
}

const pillars = [
  { icon: Target, tint: "bg-[#FDE9EA] text-brand", title: "Mission", text: "Rendre la tech accessible, ludique et formatrice pour chaque enfant, quel que soit son niveau." },
  { icon: Heart, tint: "bg-[#F1EAFE] text-violet", title: "Valeurs", text: "Créativité, persévérance, collaboration et pensée critique au cœur de chaque programme." },
  { icon: Lightbulb, tint: "bg-[#FFF3D6] text-amber", title: "Approche", text: "Projets concrets, robots, missions et défis — pas de cours magistraux, que du pratique." },
  { icon: Users, tint: "bg-[#E8F7FF] text-sky", title: "Encadrement", text: "Des coachs formés, un suivi parent clair et des classes à effectif réduit." },
];

const approachPoints = [
  "Parcours progressif : Scratch → robots → Python, web et IA",
  "Portfolio public pour chaque élève, contrôlé par les parents",
  "Heures de code, badges et certificats validés par l'école",
  "Groupes de 8 élèves max pour un vrai accompagnement",
];

export default function AboutPage() {
  return (
    <div>
      <PageHero
        badge="École de coding, robotique & IA — Marrakech"
        titleBefore="Former la prochaine génération de"
        titleHighlight="créateurs"
        subtitle="Elite Code School est une académie STEM basée à Marrakech, dédiée à l'apprentissage de la robotique, du code et de l'intelligence artificielle pour les 7–17 ans."
      />

      {/* Pillars */}
      <section className="bg-white py-16 sm:py-24 dark:bg-body">
        <div className="container-shell">
          <ScrollReveal>
            <div className="mb-10 text-center sm:mb-14">
              <span className="tag">À propos</span>
              <h2 className="mx-auto mt-4 max-w-3xl font-display text-3xl font-semibold tracking-[-0.02em] text-ink dark:text-ink md:text-5xl">
                Ce qui nous{" "}
                <span className="text-brand">distingue</span>
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-7 text-ink-soft sm:mt-4 sm:text-base sm:leading-8 dark:text-ink-soft">
                Quatre piliers qui guident chaque séance, chaque projet et chaque échange avec les familles.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:gap-6">
            {pillars.map((pillar, i) => (
              <ScrollReveal key={pillar.title} delay={i * 80}>
                <div className="flex h-full gap-4 rounded-brand border border-border bg-surface p-5 transition duration-300 ease-out hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-md dark:border-white/10 dark:bg-[#1e293b] sm:p-6">
                  <span className={`flex size-12 shrink-0 items-center justify-center rounded-brand-sm ${pillar.tint}`}>
                    <pillar.icon className="size-6" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display text-base font-semibold text-ink dark:text-ink">{pillar.title}</h3>
                    <p className="mt-1 text-xs font-medium leading-5 text-ink-soft dark:text-ink-soft sm:text-sm sm:leading-6">{pillar.text}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Red approach band */}
      <section className="relative overflow-hidden bg-brand py-16 sm:py-24 dark:bg-brand-dark">
        <div aria-hidden className="absolute -left-16 top-12 size-40 rounded-full bg-white/10" />
        <div aria-hidden className="absolute bottom-8 right-[15%] size-24 rounded-full bg-amber/20" />
        <div aria-hidden className="absolute left-[8%] top-1/2 size-6 rotate-12 rounded-lg bg-cream/40" />
        <div aria-hidden className="absolute right-[6%] top-16 size-8 -rotate-12 rounded-lg bg-white/15" />

        <div className="container-shell grid items-center gap-12 lg:grid-cols-2">
          <ScrollReveal>
            <span className="inline-flex items-center rounded-full bg-white/15 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-white">
              Notre approche
            </span>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-[-0.02em] text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
              Une école où l&apos;on apprend en{" "}
              <span className="text-cream">créant</span>
            </h2>
            <p className="mt-5 max-w-lg text-sm font-medium leading-7 text-white/80 sm:text-base sm:leading-8">
              Chez Elite Code School, la tech n&apos;est pas une matière théorique. Les enfants explorent la logique et la créativité numérique, les ados construisent de vrais projets — et chaque famille suit les progrès en temps réel.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={150}>
            <ul className="grid gap-4">
              {approachPoints.map((point) => (
                <li key={point} className="flex items-start gap-3 rounded-brand border border-white/20 bg-white/10 p-4 text-sm font-semibold text-white">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-white/20">
                    <Check className="size-3 text-white" />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>
      </section>

      <CtaBand />
    </div>
  )
}
