"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, CaretLeft, CaretRight, Clock, CalendarBlank, MagnifyingGlass, Users } from "@phosphor-icons/react";
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

const PAGE_SIZE = 4

export function CurriculaClient({ programs }: { programs: Program[] }) {
  const [active, setActive] = useState<TabKey>("all")
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)

  const byLevel = active === "all"
    ? programs
    : programs.filter((p) => p.level === active)

  const q = query.trim().toLowerCase()
  const filtered = q
    ? byLevel.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tools.some((t) => t.toLowerCase().includes(q))
      )
    : byLevel

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  return (
    <section className="bg-white py-16 sm:py-20 dark:bg-body">
      <div className="container-shell">
        {/* MagnifyingGlass */}
        <div className="mx-auto mb-6 max-w-xl">
          <label className="relative block">
            <span className="sr-only">Rechercher un programme</span>
            <MagnifyingGlass className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-soft" />
            <input
              type="search"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1) }}
              placeholder="Rechercher : Scratch, robot, Python, IA…"
              className="w-full rounded-full border border-border bg-white py-3 pl-11 pr-4 text-sm font-medium text-ink outline-none transition duration-200 ease-out placeholder:text-ink-soft/60 focus:border-brand focus:ring-2 focus:ring-brand/15 dark:border-white/10 dark:bg-[#1e293b] dark:text-white"
            />
          </label>
        </div>

        {/* Level filter tabs */}
        <div className="mb-6 flex flex-wrap items-center justify-center gap-2" suppressHydrationWarning>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActive(tab.key); setPage(1) }}
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

        {/* Results count */}
        <p className="mb-6 text-center text-xs font-bold uppercase tracking-wide text-ink-soft">
          {filtered.length} programme{filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""}
          {q ? <> pour «&nbsp;{query}&nbsp;»</> : ""}
        </p>

        <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((program, index) => {
              const level = programLevels[program.level] ?? programLevels.debutant
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
                  <Link
                    href={`/curricula/${program.id}`}
                    className="group flex h-full flex-col overflow-hidden rounded-brand border border-border bg-white transition duration-300 ease-out hover:-translate-y-0.5 hover:border-brand hover:shadow-md dark:border-white/10 dark:bg-[#1e293b]"
                  >
                    <div className="relative h-52 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={program.image} alt={program.title} loading="lazy" className="size-full object-cover transition duration-700 ease-out group-hover:scale-105" />
                      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
                        {program.priceMonthly && (
                          <span className="rounded-full bg-brand px-3 py-1 text-xs font-bold text-white shadow-sm">
                            {program.priceMonthly} DH/mois
                          </span>
                        )}
                        <span className="rounded-full bg-ink/70 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm ml-auto">
                          {program.ageRange}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <span
                        className="mb-3 inline-flex w-fit items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white"
                        style={{ backgroundColor: level.color }}
                      >
                        {level.label}
                      </span>

                      <h3 className="font-display text-lg font-semibold text-ink dark:text-white">{program.title}</h3>
                      <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-ink-soft dark:text-slate-300">{program.description}</p>

                      <div className="mt-auto">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border pt-4 text-xs font-medium text-ink-soft dark:border-white/10 dark:text-slate-400">
                          {program.schedule && <span className="inline-flex items-center gap-1.5"><Clock className="size-3.5 text-brand" /> {program.schedule}</span>}
                          {program.duration && <span className="inline-flex items-center gap-1.5"><CalendarBlank className="size-3.5 text-brand" /> {program.duration}</span>}
                          <span className="inline-flex items-center gap-1.5"><Users className="size-3.5 text-brand" /> 8 élèves max</span>
                        </div>
                        <div className="mt-4">
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand transition duration-300 ease-out group-hover:gap-2.5">
                            Voir le détail <ArrowRight className="size-3.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm font-medium text-ink-soft dark:text-slate-400">
              Aucun programme{q ? <> pour «&nbsp;{query}&nbsp;»</> : " pour ce niveau"}.
            </p>
            {(q || active !== "all") && (
              <button
                onClick={() => { setQuery(""); setActive("all"); setPage(1) }}
                className="mt-4 inline-flex items-center gap-2 rounded-full border-2 border-brand bg-white px-5 py-2 text-xs font-bold text-brand transition duration-200 ease-out hover:bg-brand hover:text-white dark:bg-transparent"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2" suppressHydrationWarning>
            <button
              onClick={() => setPage(Math.max(1, safePage - 1))}
              disabled={safePage === 1}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-4 py-2.5 text-xs font-bold text-ink-soft transition duration-200 ease-out hover:border-brand/30 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-[#1e293b]"
            >
              <CaretLeft className="size-4" /> <span className="hidden sm:inline">Précédent</span>
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                aria-label={`Page ${i + 1}`}
                aria-current={safePage === i + 1 ? "page" : undefined}
                className={`flex size-10 items-center justify-center rounded-full text-sm font-bold transition duration-200 ease-out ${
                  safePage === i + 1
                    ? "bg-brand text-white"
                    : "border border-border bg-white text-ink-soft hover:border-brand/30 hover:text-ink dark:border-white/10 dark:bg-[#1e293b]"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(Math.min(totalPages, safePage + 1))}
              disabled={safePage === totalPages}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-4 py-2.5 text-xs font-bold text-ink-soft transition duration-200 ease-out hover:border-brand/30 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-[#1e293b]"
            >
              <span className="hidden sm:inline">Suivant</span> <CaretRight className="size-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
