import type { Metadata } from "next"
import { getPrograms } from "@/lib/store"
import { PageHero, CtaBand } from "@/components/page-sections"
import { CurriculaClient } from "@/components/curricula-client"

export const metadata: Metadata = {
  title: "Programmes — Elite Code School",
  description: "Parcours complet de 7 à 17 ans : Scratch, robotique, web, Python et IA à Marrakech.",
}

export default async function CurriculaPage() {
  const programs = await getPrograms()

  return (
    <div>
      <PageHero
        badge="École de coding, robotique & IA — Marrakech"
        titleBefore="Choisis le parcours qui va"
        titleHighlight="faire grandir"
        titleAfter="ton enfant"
        subtitle="De Scratch aux projets en intelligence artificielle : un parcours complet de 7 à 17 ans, où chacun avance à son rythme avec des projets réels et un suivi clair pour les parents."
      />
      <CurriculaClient programs={programs} />
      <CtaBand />
    </div>
  )
}
