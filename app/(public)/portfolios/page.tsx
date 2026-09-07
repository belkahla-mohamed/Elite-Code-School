import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import { getPublicPortfolios } from "@/lib/store";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolios",
  description: "Découvrez les portfolios des élèves d'Elite Code School — projets, certificats et galerie.",
};

export default async function PortfoliosPage() {
  const portfolios = await getPublicPortfolios();

  const avatars = ["bg-brand", "bg-amber", "bg-violet", "bg-lime", "bg-mint", "bg-coral"];

  return (
    <div className="bg-white py-16 sm:py-24 dark:bg-body">
      <div className="container-shell">
        <div className="mb-10 text-center sm:mb-14">
          <span className="tag">Portfolios</span>
          <h1 className="mx-auto mt-4 max-w-3xl font-display text-3xl font-semibold tracking-[-0.02em] text-ink dark:text-white md:text-5xl">
            Nos élèves
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-7 text-ink-soft sm:mt-4 sm:text-base sm:leading-8 dark:text-slate-300">
            Chaque élève construit son portfolio : projets, certificats et galerie.
          </p>
        </div>

        {portfolios.length === 0 ? (
          <div className="py-12 text-center">
            <Users className="mx-auto size-12 text-ink-soft/40" />
            <h3 className="mt-4 font-display text-xl font-semibold text-ink dark:text-white">Aucun portfolio public</h3>
            <p className="mt-2 text-sm font-medium text-ink-soft dark:text-slate-400">Les portfolios apparaîtront ici une fois rendus publics.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {portfolios.map((student, i) => (
              <Link
                key={student.id}
                href={`/portfolios/${student.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-brand border border-border bg-white p-6 transition duration-300 ease-out hover:-translate-y-0.5 hover:border-brand hover:shadow-md dark:border-white/10 dark:bg-[#1e293b]"
              >
                <div className="flex items-center gap-4">
                  <div className={`flex size-14 shrink-0 items-center justify-center rounded-brand-sm font-display text-xl font-semibold text-white ${avatars[i % avatars.length]}`}>
                    {student.avatar}
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate font-display text-lg font-semibold text-ink transition duration-300 ease-out group-hover:text-brand dark:text-white">{student.firstName} {student.lastName}</h3>
                    <p className="text-xs font-bold text-ink-soft dark:text-slate-400">{student.levelLabel}</p>
                  </div>
                </div>
                <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-4 text-sm dark:border-white/10">
                  <span className="text-xs font-medium text-ink-soft dark:text-slate-400">{student.projects.length} projets · {student.hours}h</span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand transition duration-300 ease-out group-hover:gap-2.5">
                    Voir <ArrowRight className="size-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
