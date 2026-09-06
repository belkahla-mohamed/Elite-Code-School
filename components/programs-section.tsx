"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Clock, CalendarDays, Users } from "lucide-react"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import type { Program } from "@/lib/types"

const programAccents: Record<string, string> = {
  accent: "#e41d23",
  cyan: "#06b6d4",
  amber: "#f59e0b",
  green: "#e41d23",
  rose: "#f43f5e",
  purple: "#a855f7",
}

const programLevels: Record<string, string> = {
  debutant: "Débutant",
  intermediaire: "Intermédiaire",
  avance: "Avancé",
}

const tabs = [
  { key: "all", label: "Tous" },
  { key: "debutant", label: "Débutant" },
  { key: "intermediaire", label: "Intermédiaire" },
  { key: "avance", label: "Avancé" },
] as const

type TabKey = (typeof tabs)[number]["key"]

export function ProgramsSection({ programs }: { programs: Program[] }) {
  const [active, setActive] = useState<TabKey>("all")

  const filtered = active === "all"
    ? programs
    : programs.filter((p) => p.level === active)

  const visible = filtered.slice(0, 6)

  return (
    <section className="bg-white py-16 sm:py-24 dark:bg-body">
      <div className="container-shell">
        {/* Header */}
        <div className="mb-10 text-center sm:mb-14">
          <span className="tag">Nos classes</span>
          <h2 className="mx-auto mt-4 max-w-3xl font-display text-3xl font-semibold tracking-[-0.02em] text-ink dark:text-ink md:text-5xl">
            Nos programmes populaires
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-7 text-ink-soft sm:mt-4 sm:text-base sm:leading-8 dark:text-ink-soft">
            Un parcours complet de 7 à 17 ans : chacun avance à son rythme, d&apos;un premier jeu Scratch jusqu&apos;à l&apos;intelligence artificielle.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wide transition ${
                active === tab.key
                  ? "bg-brand text-white"
                  : "border border-border bg-white text-ink-soft hover:border-brand/30 hover:text-ink dark:border-border dark:bg-surface dark:text-ink-soft"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Cards grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((program, index) => {
            const accent = programAccents[program.color] ?? "#e41d23"
            return (
              <ScrollReveal key={program.id} delay={(index % 3) * 90} className="h-full">
                <article className="group flex h-full flex-col overflow-hidden rounded-brand border border-border bg-white transition hover:border-brand dark:border-border dark:bg-surface">
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={program.image} alt={program.title} loading="lazy" className="size-full object-cover transition duration-500 group-hover:scale-105" />
                    <span className="absolute left-3 top-3 rounded-full bg-brand px-3 py-1 text-xs font-bold text-white shadow-sm">
                      {program.priceMonthly} DH/mois
                    </span>
                    <span className="absolute right-3 top-3 rounded-full border border-white/40 bg-white/90 px-3 py-1 text-xs font-bold text-ink backdrop-blur-sm">
                      {program.ageRange}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-5">
                    <span
                      className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white"
                      style={{ backgroundColor: accent }}
                    >
                      {programLevels[program.level]}
                    </span>

                    <h3 className="font-display text-lg font-semibold text-ink dark:text-ink">{program.title}</h3>
                    <p className="mt-1.5 line-clamp-2 text-sm font-medium leading-6 text-ink-soft dark:text-ink-soft">{program.description}</p>

                    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border pt-4 text-xs font-bold text-ink-soft dark:border-border dark:text-ink-soft">
                      <span className="inline-flex items-center gap-1.5"><Clock className="size-3.5 text-brand" /> {program.schedule}</span>
                      <span className="inline-flex items-center gap-1.5"><CalendarDays className="size-3.5 text-brand" /> {program.duration}</span>
                      <span className="inline-flex items-center gap-1.5"><Users className="size-3.5 text-brand" /> 8 élèves max</span>
                    </div>

                    <div className="mt-auto pt-4">
                      <Link href="/curricula" className="inline-flex items-center gap-1.5 text-xs font-bold text-brand transition group-hover:gap-2.5">
                        Voir le détail <ArrowRight className="size-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            )
          })}
        </div>

        {/* Empty state */}
        {visible.length === 0 && (
          <p className="py-12 text-center text-sm font-medium text-ink-soft dark:text-ink-soft">
            Aucun programme pour ce niveau.
          </p>
        )}

        {/* Show more button */}
        <div className="mt-10 text-center">
          <Link
            href="/curricula"
            className="inline-flex items-center gap-2 rounded-full border-2 border-brand bg-white px-7 py-3 text-sm font-bold text-brand transition hover:bg-brand hover:text-white"
          >
            Voir tous les programmes <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
