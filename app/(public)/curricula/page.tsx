import type { Metadata } from "next"
import { Sparkles, ArrowRight, Phone } from "lucide-react"
import Link from "next/link"
import { getPrograms } from "@/lib/store"
import { CurriculaClient } from "@/components/curricula-client"

export const metadata: Metadata = {
  title: "Programmes — Elite Code School",
  description: "Parcours complet de 7 à 17 ans : Scratch, robotique, web, Python et IA à Marrakech.",
}

function PageHeader() {
  return (
    <section className="relative overflow-hidden bg-brand dark:bg-brand-dark">
      {/* Decorative solid shapes — same language as home hero */}
      <div aria-hidden className="absolute -left-20 -top-20 size-64 rounded-full bg-white/10" />
      <div aria-hidden className="absolute -right-24 top-8 size-72 rounded-full bg-white/10" />
      <div aria-hidden className="absolute -bottom-24 left-[45%] size-64 rounded-full bg-amber/25" />
      <div aria-hidden className="absolute left-[8%] top-12 size-8 -rotate-12 rounded-lg bg-amber" />
      <div aria-hidden className="absolute bottom-24 right-[14%] size-4 rounded-full bg-lime" />

      <div className="container-shell relative py-16 text-center sm:py-20">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-1.5 text-xs font-bold text-white">
          <Sparkles className="size-3.5 text-amber" /> École de coding, robotique &amp; IA — Marrakech
        </span>
        <h1 className="mx-auto mt-5 max-w-3xl font-display text-3xl font-semibold leading-[1.1] tracking-[-0.02em] text-white sm:text-5xl">
          Choisis le parcours qui va{" "}
          <span className="relative inline-block text-cream">
            faire grandir
            <svg
              aria-hidden
              viewBox="0 0 120 12"
              preserveAspectRatio="none"
              className="absolute -bottom-2 left-0 h-3 w-full text-amber"
            >
              <path d="M3 9 Q 60 2 117 8" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" />
            </svg>
          </span>{" "}
          ton enfant
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-sm font-medium leading-7 text-white/90 sm:mt-7 sm:text-base sm:leading-8">
          De Scratch aux projets en intelligence artificielle : un parcours complet de 7 à 17 ans,
          où chacun avance à son rythme avec des projets réels et un suivi clair pour les parents.
        </p>
      </div>

      {/* Bottom wave divider */}
      <svg
        aria-hidden
        viewBox="0 0 1440 64"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 h-10 w-full text-white dark:text-body sm:h-14"
      >
        <path d="M0,40 C240,64 480,0 720,20 C960,40 1200,56 1440,28 L1440,64 L0,64 Z" fill="currentColor" />
      </svg>
    </section>
  )
}

function CtaBand() {
  return (
    <section className="relative overflow-hidden bg-brand dark:bg-brand-dark">
      <div aria-hidden className="absolute -left-24 -top-16 size-56 rounded-full bg-white/10" />
      <div aria-hidden className="absolute -bottom-20 right-[8%] size-64 rounded-full bg-white/10" />
      <div aria-hidden className="absolute right-[38%] top-8 size-6 rotate-12 rounded-lg bg-amber" />

      <div className="container-shell relative flex flex-col items-center gap-6 py-14 text-center sm:py-16">
        <h2 className="font-display text-3xl font-semibold tracking-[-0.02em] text-white sm:text-4xl">
          Prêt à commencer ?{" "}
          <span className="text-cream">Inscris-toi</span>
        </h2>
        <p className="max-w-xl text-sm font-medium leading-7 text-white/85 sm:text-base sm:leading-8">
          Une première séance d&apos;essai, un bilan de niveau offert et un plan de parcours
          adapté à l&apos;âge de ton enfant.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/inscription"
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold text-brand transition duration-200 ease-out hover:bg-cream"
          >
            Inscription maintenant <ArrowRight className="size-4" />
          </Link>
          <a
            href="tel:+212600000000"
            suppressHydrationWarning
            className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 bg-white/10 px-7 py-3 text-sm font-bold text-white transition duration-200 ease-out hover:border-white hover:bg-white/20"
          >
            <Phone className="size-4" /> +212 600 000 000
          </a>
        </div>
      </div>
    </section>
  )
}

export default async function CurriculaPage() {
  const programs = await getPrograms()

  return (
    <div>
      <PageHeader />
      <CurriculaClient programs={programs} />
      <CtaBand />
    </div>
  )
}
