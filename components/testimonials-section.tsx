import Image from "next/image"

const testimonials = [
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

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((item) => (
            <blockquote key={item.author} className="rounded-brand border border-white/15 bg-white/10 p-6">
              <svg aria-hidden="true" className="mb-3 size-8 text-white/25" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
              </svg>
              <p className="text-sm font-medium leading-7 text-white">
                &ldquo;{item.quote}&rdquo;
              </p>
              <footer className="mt-4 border-t border-white/15 pt-4">
                <strong className="block text-sm font-bold text-white">{item.author}</strong>
                <span className="text-xs font-semibold text-white/60">{item.context}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}
