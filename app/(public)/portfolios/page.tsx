import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import { getPublicPortfolios } from "@/lib/store";

export const metadata: Metadata = {
  title: "Portfolios",
  description: "Découvrez les portfolios des élèves d'Elite Code School — projets, certificats et galerie.",
};

export default async function PortfoliosPage() {
  const portfolios = await getPublicPortfolios();

  const avatars = ["bg-sky", "bg-pink", "bg-amber", "bg-violet", "bg-lime", "bg-mint"];

  return (
    <div className="py-20">
      <section className="container-shell text-center mb-16">
        <span className="tag">Portfolios</span>
        <h1 className="font-display text-5xl font-black tracking-[-0.04em] text-ink mt-4">
          Nos élèves
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg font-semibold leading-8 text-ink-soft">
          Chaque élève construit son portfolio: projets, certificats et galerie.
        </p>
      </section>

      {portfolios.length === 0 ? (
        <div className="container-shell text-center py-16">
          <Users className="mx-auto size-12 text-ink-soft/40" />
          <h3 className="mt-4 font-display text-xl font-black text-ink">Aucun portfolio public</h3>
          <p className="text-sm text-ink-soft mt-2">Les portfolios apparaîtront ici une fois rendus publics.</p>
        </div>
      ) : (
        <section className="container-shell grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {portfolios.map((student, i) => (
            <Link
              key={student.id}
              href={`/portfolio/${student.slug}`}
              className="rounded-brand border-2 border-[#E8EEF6] bg-white p-6 transition hover:border-sky hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-4">
                <div className={`flex size-14 items-center justify-center rounded-2xl font-display text-xl font-black text-white ${avatars[i % avatars.length]}`}>
                  {student.avatar}
                </div>
                <div>
                  <h3 className="font-display text-lg font-black">{student.firstName} {student.lastName}</h3>
                  <p className="text-xs font-bold text-ink-soft">{student.levelLabel}</p>
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between text-sm">
                <span className="text-ink-soft font-semibold">{student.projects.length} projets · {student.hours}h</span>
                <span className="flex items-center gap-1 font-black text-sky">
                  Voir <ArrowRight className="size-4" />
                </span>
              </div>
            </Link>
          ))}
        </section>
      )}
    </div>
  );
}
