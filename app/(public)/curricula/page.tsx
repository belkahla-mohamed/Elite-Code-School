"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, Clock, CalendarDays, Users, Phone, Sparkles } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { Skeleton } from "@/components/ui/skeleton"

interface Program {
  id: string; title: string; ageRange: string; level: string; description: string;
  tools: string[]; priceMonthly?: number; color: string; image: string;
  duration?: string; schedule?: string;
}

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

export default function CurriculaPage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [active, setActive] = useState<TabKey>("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/public/curricula")
      .then((r) => r.json())
      .then((data) => {
        setPrograms(Array.isArray(data) ? data : [])
        setLoading(false)
      })
  }, [])

  const filtered = active === "all"
    ? programs
    : programs.filter((p) => p.level === active)

  if (loading) {
    return (
      <div>
        <PageHeader />
        <section className="container-shell py-16 sm:py-20">
          <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
            {tabs.map((tab) => (
              <Skeleton key={tab.key} className="h-9 w-28 rounded-full" />
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-brand border border-border bg-white dark:border-white/10 dark:bg-[#1e293b]">
                <Skeleton className="h-52 w-full rounded-none" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    )
  }

  return (
    <div>
      <PageHeader />

      <section className="bg-white py-16 sm:py-20 dark:bg-body">
        <div className="container-shell">
          <ScrollReveal>
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
          </ScrollReveal>

          <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((program, index) => {
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
                            {program.duration && <span className="inline-flex items-center gap-1.5"><CalendarDays className="size-3.5 text-brand" /> {program.duration}</span>}
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

          {filtered.length === 0 && (
            <p className="py-12 text-center text-sm font-medium text-ink-soft dark:text-slate-400">
              Aucun programme pour ce niveau.
            </p>
          )}
        </div>
      </section>

      <CtaBand />
    </div>
  )
}
