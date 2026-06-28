import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPrograms } from "@/lib/store";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Programmes",
  description: "Découvrez tous nos programmes de robotique, coding et IA pour enfants de 7 à 17 ans à Marrakech.",
};

export default async function CurriculaPage() {
  const programs = await getPrograms();

  return (
    <div className="py-20">
      <section className="container-shell text-center mb-16">
        <span className="tag">Programmes</span>
        <h1 className="font-display text-5xl font-black tracking-[-0.04em] text-ink mt-4">
          Nos formations
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg font-semibold leading-8 text-ink-soft">
          Du Scratch à l&apos;IA, chaque programme est conçu pour un âge et un niveau spécifique.
        </p>
      </section>

      <section className="container-shell grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {programs.map((program, i) => {
          const colors = ["border-amber", "border-sky", "border-lime", "border-violet", "border-pink", "border-mint"];
          return (
            <Link
              key={program.id}
              href={`/curricula/${program.id}`}
              className={`rounded-brand border-2 bg-white dark:bg-surface p-8 transition hover:-translate-y-0.5 ${colors[i % colors.length]}`}
            >
              <span className="text-4xl">{program.icon}</span>
              <h3 className="mt-4 font-display text-2xl font-black text-ink">{program.title}</h3>
              <p className="mt-3 text-sm font-semibold leading-6 text-ink-soft">{program.description}</p>
              <div className="mt-6 flex items-center justify-between">
                <span className="rounded-full bg-body px-4 py-1.5 text-xs font-bold text-ink-soft">
                  {program.ageRange}
                </span>
                <span className="flex items-center gap-1 font-black text-sm text-sky">
                  Détails <ArrowRight className="size-4" />
                </span>
              </div>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
