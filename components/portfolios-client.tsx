"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, CaretLeft, CaretRight, MagnifyingGlass, Users } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion"
import type { StudentPortfolio } from "@/lib/types"

const PAGE_SIZE = 6

const avatarColors = ["bg-brand", "bg-amber", "bg-violet", "bg-lime", "bg-mint", "bg-coral"]

export function PortfoliosClient({ portfolios, programs }: { portfolios: StudentPortfolio[]; programs: { id: string; title: string }[] }) {
  const [query, setQuery] = useState("")
  const [programTab, setProgramTab] = useState("all")
  const [page, setPage] = useState(1)

  const programTabs = useMemo(() => {
    return [
      { key: "all", label: "Tous" },
      ...programs
        .filter((pr) => portfolios.some((s) => s.programId === pr.id))
        .map((pr) => ({ key: pr.id, label: pr.title })),
    ]
  }, [portfolios, programs])

  const programTitle = (id: string) => programs.find((pr) => pr.id === id)?.title ?? ""

  const q = query.trim().toLowerCase()
  const filtered = useMemo(() => {
    return portfolios.filter((s) => {
      const matchTab = programTab === "all" || s.programId === programTab
      const matchQuery =
        !q ||
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
        s.levelLabel.toLowerCase().includes(q) ||
        programTitle(s.programId).toLowerCase().includes(q)
      return matchTab && matchQuery
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portfolios, programTab, q, programs])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  return (
    <section className="bg-white py-16 sm:py-20 dark:bg-body">
      <div className="container-shell">
        {/* MagnifyingGlass */}
        <div className="mx-auto mb-6 max-w-xl">
          <label className="relative block">
            <span className="sr-only">Rechercher un élève</span>
            <MagnifyingGlass className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-soft" />
            <input
              type="search"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1) }}
              placeholder="Rechercher un élève : prénom, nom, programme…"
              className="w-full rounded-full border border-border bg-white py-3 pl-11 pr-4 text-sm font-medium text-ink outline-none transition duration-200 ease-out placeholder:text-ink-soft/60 focus:border-brand focus:ring-2 focus:ring-brand/15 dark:border-white/10 dark:bg-[#1e293b] dark:text-white"
            />
          </label>
        </div>

        {/* Program filter tabs */}
        <div className="mb-6 flex flex-wrap items-center justify-center gap-2" suppressHydrationWarning>
          {programTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setProgramTab(tab.key); setPage(1) }}
              className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wide transition duration-200 ease-out ${
                programTab === tab.key
                  ? "bg-brand text-white"
                  : "border border-border bg-white text-ink-soft hover:border-brand/30 hover:text-ink dark:border-white/10 dark:bg-[#1e293b] dark:text-ink-soft"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="mb-6 text-center text-xs font-bold uppercase tracking-wide text-ink-soft">
          {filtered.length} élève{filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""}
          {q ? <> pour «&nbsp;{query}&nbsp;»</> : ""}
        </p>

        {portfolios.length === 0 ? (
          <div className="py-12 text-center">
            <Users className="mx-auto size-12 text-ink-soft/40" />
            <h3 className="mt-4 font-display text-xl font-semibold text-ink dark:text-white">Aucun portfolio public</h3>
            <p className="mt-2 text-sm font-medium text-ink-soft dark:text-slate-400">Les portfolios apparaîtront ici une fois rendus publics.</p>
          </div>
        ) : (
          <>
            <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {visible.map((student, i) => (
                  <motion.div
                    key={student.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, ease: "easeOut", delay: i * 0.05 }}
                    className="h-full"
                  >
                    <Link
                      href={`/portfolios/${student.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-brand border border-border bg-white p-6 transition duration-300 ease-out hover:-translate-y-0.5 hover:border-brand hover:shadow-md dark:border-white/10 dark:bg-[#1e293b]"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`flex size-14 shrink-0 items-center justify-center rounded-brand-sm font-display text-xl font-semibold text-white ${avatarColors[i % avatarColors.length]}`}>
                          {student.avatar}
                        </div>
                        <div className="min-w-0">
                          <h3 className="truncate font-display text-lg font-semibold text-ink transition duration-300 ease-out group-hover:text-brand dark:text-white">{student.firstName} {student.lastName}</h3>
                          <p className="text-xs font-bold text-ink-soft dark:text-slate-400">{student.levelLabel}</p>
                        </div>
                      </div>
                      <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-4 text-sm dark:border-white/10">
                        <span className="text-xs font-medium text-ink-soft dark:text-slate-400">{student.age} ans · {student.projects.length} projets · {student.hours}h</span>
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand transition duration-300 ease-out group-hover:gap-2.5">
                          Voir <ArrowRight className="size-3.5" />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Empty state */}
            {filtered.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-sm font-medium text-ink-soft dark:text-slate-400">
                  Aucun élève{q ? <> pour «&nbsp;{query}&nbsp;»</> : " dans ce programme"}.
                </p>
                {(q || programTab !== "all") && (
                  <button
                    onClick={() => { setQuery(""); setProgramTab("all"); setPage(1) }}
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
          </>
        )}
      </div>
    </section>
  )
}
