import Link from "next/link";
import { ArrowRight, Clock, GraduationCap } from "lucide-react";
import { getPrograms } from "@/lib/store";
import { imgSrc } from "@/lib/image-url-server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Programmes",
  description: "Découvrez tous nos programmes de robotique, coding et IA pour enfants de 7 à 17 ans à Marrakech.",
};

const levelLabels: Record<string, string> = {
  debutant: "Débutant",
  intermediaire: "Intermédiaire",
  avance: "Avancé",
};

const levelColors: Record<string, string> = {
  debutant: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  intermediaire: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  avance: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
};

export default async function CurriculaPage() {
  const programs = await getPrograms();

  return (
    <div className="py-20">
      <section className="container-shell text-center mb-16">
        <h1 className="font-display text-5xl font-black tracking-[-0.04em] text-ink">
          Nos programmes
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-ink-soft">
          Du Scratch à l&apos;Intelligence Artificielle, chaque programme est conçu pour un âge et un niveau spécifique.
          Offrez à votre enfant les clés du numérique.
        </p>
      </section>

      <section className="container-shell grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {programs.map((program) => {
          const levelLabel = levelLabels[program.level] || program.level;
          const levelColor = levelColors[program.level] || "bg-surface text-ink-soft";
          return (
            <Link
              key={program.id}
              href={`/curricula/${program.id}`}
              className="group rounded-brand border-2 border-border bg-white dark:bg-surface overflow-hidden transition-all duration-300 hover:border-sky hover:shadow-lg hover:-translate-y-1"
            >
              <div className="aspect-[16/9] overflow-hidden">
                <img src={imgSrc(program.image, 600)} alt={program.title} loading="lazy" className="size-full object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="p-6">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="rounded-full px-3 py-1 text-xs font-bold text-ink-soft bg-body">
                    {program.ageRange}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${levelColor}`}>
                    {levelLabel}
                  </span>
                </div>

                <h3 className="font-display text-2xl font-black text-ink group-hover:text-sky transition-colors">
                  {program.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-ink-soft line-clamp-2">
                  {program.description}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-bold text-ink-soft">
                  {program.duration && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="size-3.5" /> {program.duration}
                    </span>
                  )}
                  {program.priceMonthly && (
                    <span className="flex items-center gap-1.5 text-lime font-black">
                      <GraduationCap className="size-3.5" /> {program.priceMonthly} DH/mois
                    </span>
                  )}
                </div>

                <div className="mt-5 flex items-center gap-1.5 text-sm font-bold text-sky group-hover:gap-2 transition-all">
                  Découvrir <ArrowRight className="size-4" />
                </div>
              </div>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
