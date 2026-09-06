"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const items = [
  {
    quote: "Mon fils compte les jours avant son cours. Il a commence par des jeux Scratch, aujourd'hui il programme son propre robot.",
    author: "Nadia",
    context: "maman d'Adam, 9 ans",
    image: "/images/hero-family.jpg",
  },
  {
    quote: "Le portail parent change tout : je vois les heures de code, les projets et les certificats sans jamais avoir a reclamer un compte-rendu.",
    author: "Youssef",
    context: "papa de Lina, 12 ans",
    image: "/images/hero-mentoring.jpg",
  },
  {
    quote: "En un an, ma fille est passee de Scratch a un vrai site web qu'elle a presente devant toute la classe. Le portfolio est superbe.",
    author: "Khadija",
    context: "maman de Sara, 14 ans",
    image: "/images/teacher-board.jpg",
  },
]

export function TestimonialsSection() {
  const [idx, setIdx] = useState(0)
  const item = items[idx]

  return (
    <section className="relative overflow-hidden bg-brand py-16 sm:py-24 dark:bg-brand-dark">
      <div aria-hidden className="absolute -left-16 top-12 size-40 rounded-full bg-white/10" />
      <div aria-hidden className="absolute bottom-8 right-[15%] size-24 rounded-full bg-amber/20" />
      <div aria-hidden className="absolute left-[8%] top-1/2 size-6 rotate-12 rounded-lg bg-cream/40" />
      <div aria-hidden className="absolute right-[6%] top-16 size-8 -rotate-12 rounded-lg bg-white/15" />

      <div className="container-shell">
        <div className="mb-10 text-center sm:mb-14">
          <span className="inline-flex rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-white">
            Temoignages
          </span>
          <h2 className="mx-auto mt-4 max-w-3xl font-display text-3xl font-semibold tracking-[-0.02em] text-white md:text-5xl">
            Ce que disent les parents
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-7 text-white/80 sm:mt-4 sm:text-base sm:leading-8">
            La confiance des familles est notre meilleure preuve de qualite.
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl items-center gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="relative hidden lg:block">
            <div className="overflow-hidden rounded-brand border-4 border-white/25">
              <img
                src={item.image}
                alt={item.author}
                className="aspect-[3/4] w-full object-cover"
              />
            </div>
            <div aria-hidden className="absolute -bottom-4 -right-4 size-20 rounded-full bg-amber/20" />
          </div>

          <div>
            <svg aria-hidden="true" className="mb-4 size-12 text-white/25" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
            </svg>
            <p className="text-base font-medium leading-8 text-white sm:text-lg sm:leading-9">
              &ldquo;{item.quote}&rdquo;
            </p>
            <div className="mt-6 flex items-center gap-4">
              <div className="h-px w-10 bg-white/40" />
              <div>
                <strong className="block text-sm font-bold uppercase tracking-wide text-white">
                  {item.author}
                </strong>
                <span className="text-xs font-semibold text-white/70">{item.context}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            onClick={() => setIdx(idx === 0 ? items.length - 1 : idx - 1)}
            aria-label="Precedent"
            className="flex size-10 items-center justify-center rounded-full border-2 border-white/30 text-white transition hover:border-white hover:bg-white/10"
          >
            <ChevronLeft className="size-5" />
          </button>
          <div className="flex gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Temoignage ${i + 1}`}
                className={`size-2.5 rounded-full transition ${i === idx ? "bg-white" : "bg-white/30 hover:bg-white/50"}`}
              />
            ))}
          </div>
          <button
            onClick={() => setIdx(idx === items.length - 1 ? 0 : idx + 1)}
            aria-label="Suivant"
            className="flex size-10 items-center justify-center rounded-full border-2 border-white/30 text-white transition hover:border-white hover:bg-white/10"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>
    </section>
  )
}
