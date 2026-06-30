import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle, Clock, CalendarDays, GraduationCap, BookOpen } from "lucide-react";
import { getPrograms } from "@/lib/store";

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const programs = await getPrograms();
  const program = programs.find((p) => p.id === id);
  if (!program) return { title: "Programme introuvable" };
  return { title: program.title, description: program.description };
}

export default async function CurriculaDetailPage({ params }: Props) {
  const { id } = await params;
  const programs = await getPrograms();
  const program = programs.find((p) => p.id === id);

  if (!program) notFound();

  const levelLabel = program.level === "debutant" ? "Débutant" : program.level === "intermediaire" ? "Intermédiaire" : "Avancé";

  return (
    <div className="py-20">
      <div className="container-shell max-w-4xl">
        <Link href="/curricula" className="inline-flex items-center gap-2 text-sm font-bold text-ink-soft hover:text-sky transition mb-8">
          <ArrowLeft className="size-4" /> Tous les programmes
        </Link>

        <div className="aspect-[2.5/1] overflow-hidden rounded-brand mb-8">
          <img src={program.image} alt={program.title} className="size-full object-cover" />
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div>
            <h1 className="font-display text-4xl font-black text-ink">{program.title}</h1>
            <p className="text-base font-semibold text-ink-soft">{program.ageRange} · {levelLabel}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <span className="rounded-full bg-surface px-4 py-1.5 text-xs font-bold">{program.ageRange}</span>
          <span className="rounded-full bg-surface px-4 py-1.5 text-xs font-bold">{levelLabel}</span>
          {program.duration && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-4 py-1.5 text-xs font-bold">
              <Clock className="size-3.5" /> {program.duration}
            </span>
          )}
          {program.schedule && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-4 py-1.5 text-xs font-bold">
              <CalendarDays className="size-3.5" /> {program.schedule}
            </span>
          )}
          {program.priceMonthly && (
            <span className="rounded-full bg-lime/15 text-lime px-4 py-1.5 text-xs font-bold">
              {program.priceMonthly} DH / mois
            </span>
          )}
        </div>

        <p className="text-base font-semibold leading-7 text-ink-soft mb-10">{program.description}</p>

        {program.objectives && (
          <div className="mb-10 rounded-brand border-2 border-border bg-white dark:bg-surface p-6">
            <h3 className="flex items-center gap-2 font-display text-xl font-black text-ink mb-4">
              <BookOpen className="size-5 text-sky" /> Au programme
            </h3>
            <p className="whitespace-pre-line text-sm leading-7 text-ink-soft">{program.objectives}</p>
          </div>
        )}

        <div className="mb-10">
          <h3 className="flex items-center gap-2 font-display text-xl font-black text-ink mb-4">
            <GraduationCap className="size-5 text-sky" /> Outils utilisés
          </h3>
          <div className="flex flex-wrap gap-2">
            {program.tools.map((tool) => (
              <span key={tool} className="flex items-center gap-1.5 rounded-full bg-sky/10 px-4 py-2 text-sm font-bold text-sky">
                <CheckCircle className="size-4" /> {tool}
              </span>
            ))}
          </div>
        </div>

        {program.prerequisites && (
          <div className="mb-10">
            <h3 className="font-display text-xl font-black text-ink mb-3">Prérequis</h3>
            <p className="text-sm leading-7 text-ink-soft">{program.prerequisites}</p>
          </div>
        )}

        <Link
          href={`/inscription?program=${program.id}`}
          className="inline-flex items-center gap-2 rounded-full bg-sky px-8 py-3 text-sm font-black uppercase tracking-wide text-white hover:bg-sky-dark transition"
        >
          S&apos;inscrire à ce programme
        </Link>
      </div>
    </div>
  );
}
