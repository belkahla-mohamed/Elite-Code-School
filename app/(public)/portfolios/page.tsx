import type { Metadata } from "next"
import { getPublicPortfolios, getPrograms } from "@/lib/store"
import { PageHero, CtaBand } from "@/components/page-sections"
import { PortfoliosClient } from "@/components/portfolios-client"

export const metadata: Metadata = {
  title: "Portfolios — Elite Code School",
  description: "Découvrez les portfolios des élèves d'Elite Code School — projets, certificats et galerie.",
}

export const dynamic = "force-dynamic";

export default async function PortfoliosPage() {
  const portfolios = await getPublicPortfolios()
  const programs = await getPrograms()

  return (
    <div>
      <PageHero
        badge="Portfolios — coding, robotique & IA"
        titleBefore="Ils apprennent, ils créent, ils"
        titleHighlight="partagent"
        subtitle="Découvrez les portfolios publics de nos élèves : projets réalisés, certificats obtenus et galeries — de Scratch jusqu'à l'intelligence artificielle."
      />
      <PortfoliosClient portfolios={portfolios} programs={programs} />
      <CtaBand />
    </div>
  )
}
