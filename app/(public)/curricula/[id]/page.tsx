import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle, Clock, CalendarDays, GraduationCap, BookOpen, Sparkles, Target } from "lucide-react";
import { getPrograms } from "@/lib/store";
import { imgSrc } from "@/lib/image-url-server";

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const programs = await getPrograms();
  const program = programs.find((p) => p.id === id);
  if (!program) return { title: "Programme introuvable" };
  return { title: program.title, description: program.description };
}

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

export default async function CurriculaDetailPage({ params }: Props) {
  const { id } = await params;
  const programs = await getPrograms();
  const program = programs.find((p) => p.id === id);

  if (!program) notFound();

  const levelLabel = levelLabels[program.level] || program.level;
  const levelColor = levelColors[program.level] || "bg-surface text-ink-soft";
  const related = programs.filter((p) => p.id !== id).slice(0, 3);

  return (
    <div className="py-20">
      <div className="container-shell max-w-4xl">
        {/* Back link */}
        <Link href="/curricula" className="inline-flex items-center gap-2 text-sm font-bold text-ink-soft hover:text-sky transition mb-8">
          <ArrowLeft className="size-4" /> Tous les programmes
        </Link>

        {/* Hero Image */}
        <div className="relative aspect-[21/9] overflow-hidden rounded-brand mb-10">
          <img src={imgSrc(program.image, 1200)} alt={program.title} className="size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="rounded-full px-3 py-1 text-xs font-bold text-ink-soft bg-body">
              {program.ageRange}
            </span>
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${levelColor}`}>
              {levelLabel}
            </span>
            {program.category && (
              <span className="rounded-full bg-sky/10 px-3 py-1 text-xs font-bold text-sky">
                {program.category.name}
              </span>
            )}
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-black tracking-[-0.03em] text-ink mb-3">
            {program.title}
          </h1>
          <p className="text-lg leading-7 text-ink-soft">
            {program.description}
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
          {program.duration && (
            <div className="rounded-brand-sm border-2 border-border bg-white dark:bg-surface p-4">
              <Clock className="size-5 text-sky mb-2" />
              <p className="text-xs font-bold text-ink-soft uppercase tracking-wider">Durée</p>
              <p className="text-sm font-bold text-ink mt-0.5">{program.duration}</p>
            </div>
          )}
          {program.schedule && (
            <div className="rounded-brand-sm border-2 border-border bg-white dark:bg-surface p-4">
              <CalendarDays className="size-5 text-sky mb-2" />
              <p className="text-xs font-bold text-ink-soft uppercase tracking-wider">Horaires</p>
              <p className="text-sm font-bold text-ink mt-0.5">{program.schedule}</p>
            </div>
          )}
          {program.priceMonthly && (
            <div className="rounded-brand-sm border-2 border-border bg-white dark:bg-surface p-4">
              <Sparkles className="size-5 text-amber mb-2" />
              <p className="text-xs font-bold text-ink-soft uppercase tracking-wider">Prix</p>
              <p className="text-sm font-bold text-lime mt-0.5">{program.priceMonthly} DH/mois</p>
            </div>
          )}
          {program.tools.length > 0 && (
            <div className="rounded-brand-sm border-2 border-border bg-white dark:bg-surface p-4 sm:col-span-2">
              <GraduationCap className="size-5 text-sky mb-2" />
              <p className="text-xs font-bold text-ink-soft uppercase tracking-wider">Outils</p>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {program.tools.map((tool) => (
                  <span key={tool} className="rounded-full bg-sky/10 px-2.5 py-0.5 text-xs font-bold text-sky">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Objectives */}
        {program.objectives && (
          <div className="mb-10 rounded-brand border-2 border-border bg-white dark:bg-surface p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-5">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sky/10">
                <BookOpen className="size-5 text-sky" />
              </span>
              <div>
                <h2 className="font-display text-xl font-black text-ink">Au programme</h2>
                <p className="text-xs text-ink-soft">Ce que votre enfant va apprendre</p>
              </div>
            </div>
            <div className="space-y-3">
              {program.objectives.split("\n").filter(Boolean).map((obj, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="size-5 text-sky shrink-0 mt-0.5" />
                  <p className="text-sm leading-6 text-ink-soft">{obj.replace(/^[•\s-]+/, "")}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Prerequisites */}
        {program.prerequisites && (
          <div className="mb-10 rounded-brand border-2 border-border bg-white dark:bg-surface p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber/10">
                <Target className="size-5 text-amber" />
              </span>
              <div>
                <h2 className="font-display text-xl font-black text-ink">Prérequis</h2>
                <p className="text-xs text-ink-soft">Ce qu&apos;il faut savoir avant de commencer</p>
              </div>
            </div>
            <p className="text-sm leading-7 text-ink-soft">{program.prerequisites}</p>
          </div>
        )}

        {/* CTA */}
        <div className="text-center mb-16">
          <p className="text-lg font-bold text-ink mb-4">
            Prêt à inscrire votre enfant ?
          </p>
          <Link
            href={`/inscription?program=${program.id}`}
            className="inline-flex items-center gap-2 rounded-full bg-sky px-8 py-3.5 text-sm font-black uppercase tracking-wide text-white hover:bg-sky-dark transition"
          >
            S&apos;inscrire à ce programme <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>

      {/* Related Programs */}
      {related.length > 0 && (
        <section className="container-shell border-t-2 border-border pt-12">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-black text-ink">
              Autres programmes
            </h2>
            <p className="mt-2 text-base text-ink-soft">
              Découvrez nos autres formations adaptées à chaque âge
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/curricula/${p.id}`}
                className="group rounded-brand border-2 border-border bg-white dark:bg-surface overflow-hidden transition-all duration-300 hover:border-sky hover:shadow-lg hover:-translate-y-1"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img src={imgSrc(p.image, 400)} alt={p.title} loading="lazy" className="size-full object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="rounded-full bg-body px-2.5 py-0.5 text-[10px] font-bold text-ink-soft">
                      {p.ageRange}
                    </span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${levelColors[p.level] || "bg-surface text-ink-soft"}`}>
                      {levelLabels[p.level] || p.level}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-black text-ink group-hover:text-sky transition-colors">
                    {p.title}
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-ink-soft line-clamp-2">
                    {p.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
