"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Clock, CalendarBlank, Users } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion"
import type { Program } from "@/lib/types"

const programLevels: Record<string, { label: string; color: string }> = {
  debutant: { label: "Débutant", color: "#22c55e" },
  intermediaire: { label: "Intermédiaire", color: "#f59e0b" },
  avance: { label: "Avancé", color: "#ef4444" },
}

const tabs = [
  { key: "all", label: "Tous", color: "#e41d23" },
  { key: "debutant", label: "Débutant", color: "#22c55e" },
  { key: "intermediaire", label: "Intermédiaire", color: "#f59e0b" },
  { key: "avance", label: "Avancé", color: "#ef4444" },
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
        <div className="mb-8 flex flex-wrap items-center justify-center gap-2" suppressHydrationWarning>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wide transition duration-200 ease-out ${
                active === tab.key
                  ? "text-white"
                  : "border border-border bg-white text-ink-soft hover:border-brand/30 hover:text-ink dark:border-white/10 dark:bg-[#1e293b] dark:text-ink-soft"
              }`}
              style={active === tab.key ? { backgroundColor: tab.color } : undefined}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Cards grid */}
        <motion.div
          layout
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {visible.map((program, index) => {
              return (
                <motion.div
                  key={program.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, ease: "easeOut", delay: index * 0.05 }}
                  className="h-full"
                >
                  <article className="group flex h-full flex-col overflow-hidden rounded-brand border border-border bg-white transition duration-300 ease-out hover:-translate-y-0.5 hover:border-brand hover:shadow-md dark:border-white/10 dark:bg-[#1e293b]">
                    {/* Image */}
                    <div className="relative h-52 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={program.image} alt={program.title} loading="lazy" className="size-full object-cover transition duration-700 ease-out group-hover:scale-105" />
                      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
                        <span className="rounded-full bg-brand px-3 py-1 text-xs font-bold text-white shadow-sm">
                          {program.priceMonthly} DH/mois
                        </span>
                        <span className="rounded-full bg-ink/70 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                          {program.ageRange}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-5">
                      <span
                        className="mb-3 inline-flex w-fit items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white"
                        style={{ backgroundColor: programLevels[program.level].color }}
                      >
                        {programLevels[program.level].label}
                      </span>

                      <h3 className="font-display text-lg font-semibold text-ink dark:text-white">{program.title}</h3>
                      <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-ink-soft dark:text-slate-300">{program.description}</p>

                      <div className="mt-auto">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border pt-4 text-xs font-medium text-ink-soft dark:border-white/10 dark:text-slate-400">
                          <span className="inline-flex items-center gap-1.5"><Clock className="size-3.5 text-brand" /> {program.schedule}</span>
                          <span className="inline-flex items-center gap-1.5"><CalendarBlank className="size-3.5 text-brand" /> {program.duration}</span>
                          <span className="inline-flex items-center gap-1.5"><Users className="size-3.5 text-brand" /> 8 élèves max</span>
                        </div>

                        <div className="mt-4">
                          <Link href="/curricula" className="inline-flex items-center gap-1.5 text-xs font-bold text-brand transition duration-300 ease-out group-hover:gap-2.5">
                            Voir le détail <ArrowRight className="size-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>

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
            className="inline-flex items-center gap-2 rounded-full border-2 border-brand bg-white px-7 py-3 text-sm font-bold text-brand transition duration-200 ease-out hover:bg-brand hover:text-white"
          >
            Voir tous les programmes <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
