import type { Metadata } from "next"
import { PageHero } from "@/components/page-sections"
import { ScrollReveal } from "@/components/ui/scroll-reveal"

export const metadata: Metadata = {
  title: "Politique de confidentialité — Elite Code School",
  description: "Comment Elite Code School collecte, utilise et protège les données des familles et des élèves.",
}

const sections = [
  {
    title: "Données collectées",
    text: "Lors d'une inscription, nous collectons le prénom et le nom de l'élève, son âge, le programme choisi, ainsi que le nom, le téléphone et l'adresse e-mail du parent ou tuteur. Les comptes parents sont créés automatiquement lors de l'acceptation de l'inscription.",
  },
  {
    title: "Utilisation des données",
    text: "Ces données servent uniquement à gérer les inscriptions, la scolarité, le suivi pédagogique et la communication avec les familles (e-mails de confirmation, accès au portail parent, certificats et portfolios publics).",
  },
  {
    title: "Portfolios publics",
    text: "Les portfolios des élèves (prénom, initiales, programme et projets) sont visibles publiquement. Les adresses e-mail, numéros de téléphone et codes d'accès ne le sont jamais. Un parent peut demander la mise en privée du portfolio à tout moment.",
  },
  {
    title: "Partage",
    text: "Nous ne vendons ni ne louons vos données. Elles ne sont partagées avec aucun tiers, à l'exception des services techniques indispensables (hébergement et envoi d'e-mails), soumis à la même confidentialité.",
  },
  {
    title: "Sécurité",
    text: "Les accès sont protégés par authentification et mots de passe chiffrés. Les codes d'accès parents sont conservés sous forme hachée et ne sont transmis qu'une seule fois à leur destinataire.",
  },
  {
    title: "Vos droits",
    text: "Conformément à la loi 09-08 (Maroc), vous pouvez demander l'accès, la rectification ou la suppression de vos données en écrivant à l'école. La suppression du compte parent entraîne la suppression des données associées, sauf obligation légale de conservation.",
  },
]

export default function PrivacyPage() {
  return (
    <div>
      <PageHero
        badge="Légal"
        titleBefore="Politique de"
        titleHighlight="confidentialité"
        subtitle="Vos données et celles de vos enfants nous sont confiées : voici exactement ce que nous en faisons."
      />

      <section className="bg-white py-16 sm:py-24 dark:bg-body">
        <div className="container-shell max-w-3xl">
          <div className="space-y-6">
            {sections.map((s, i) => (
              <ScrollReveal key={s.title} delay={i * 60}>
                <div className="rounded-brand border border-border bg-surface p-5 sm:p-6 dark:border-white/10 dark:bg-[#1e293b]">
                  <h2 className="font-display text-lg font-semibold text-ink dark:text-ink">{s.title}</h2>
                  <p className="mt-2 text-sm font-medium leading-7 text-ink-soft dark:text-ink-soft">{s.text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={120}>
            <div className="mt-8 rounded-brand border-2 border-brand/30 bg-brand/5 p-5 text-sm font-medium leading-7 text-ink dark:text-ink sm:p-6">
              Contact pour toute question : <strong>contact@elitecodeschool.com</strong> — Elite Code School, Marrakech.
              Dernière mise à jour : septembre 2026.
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
