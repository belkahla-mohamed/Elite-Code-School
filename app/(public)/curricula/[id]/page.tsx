import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, CalendarBlank, CheckCircle, Clock, GraduationCap, Sparkle, Target, Users } from "@phosphor-icons/react/dist/ssr";
import { getPrograms } from "@/lib/store";
import { imgSrc } from "@/lib/image-url-server";
import { ProgramCard } from "@/components/ui/program-card";

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
  debutant: "#22c55e",
  intermediaire: "#f59e0b",
  avance: "#ef4444",
};

export default async function CurriculaDetailPage({ params }: Props) {
  const { id } = await params;
  const programs = await getPrograms();
  const program = programs.find((p) => p.id === id);

  if (!program) notFound();

  const levelLabel = levelLabels[program.level] || program.level;
  const levelColor = levelColors[program.level] || "#e41d23";
  const related = programs.filter((p) => p.id !== id).slice(0, 3);

  return (
    <div className="overflow-hidden bg-white dark:bg-body">
      {/* Hero — red band */}
      <section className="relative overflow-hidden bg-brand dark:bg-brand-dark">
        <div aria-hidden className="absolute -left-20 -top-20 size-64 rounded-full bg-white/10" />
        <div aria-hidden className="absolute -right-24 top-24 size-80 rounded-full bg-white/10" />
        <div aria-hidden className="absolute -bottom-28 left-[40%] size-72 rounded-full bg-amber/25" />
        <div aria-hidden className="absolute left-[6%] top-14 size-8 -rotate-12 rounded-lg bg-amber" />
        <div aria-hidden className="absolute bottom-16 right-[8%] size-4 rounded-full bg-lime" />

        <div className="container-shell relative py-16 sm:py-20">
          <Link href="/curricula" className="inline-flex items-center gap-2 text-sm font-bold text-white/70 transition duration-200 ease-out hover:text-white">
            <ArrowLeft className="size-4" /> Tous les programmes
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-white">
              Nos classes
            </span>
            <span
              className="inline-flex rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-white"
              style={{ backgroundColor: levelColor }}
            >
              {levelLabel}
            </span>
            <span className="inline-flex rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-white">
              {program.ageRange}
            </span>
            {program.category && (
              <span className="inline-flex rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-white">
                {program.category.name}
              </span>
            )}
          </div>

          <h1 className="mt-5 max-w-3xl font-display text-4xl font-semibold leading-[1.08] tracking-[-0.02em] text-white sm:text-5xl">
            {program.title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-white/80 sm:text-base sm:leading-8">
            {program.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/inscription?program=${program.id}`}
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold text-brand transition duration-200 ease-out hover:bg-cream"
            >
              S&apos;inscrire <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/curricula"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 bg-white/10 px-7 py-3 text-sm font-bold text-white transition duration-200 ease-out hover:border-white hover:bg-white/20"
            >
              Tous les programmes
            </Link>
          </div>
        </div>
      </section>

      {/* Photo + infos */}
      <section className="bg-white py-16 sm:py-24 dark:bg-body">
        <div className="container-shell grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="overflow-hidden rounded-brand border border-border dark:border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imgSrc(program.image, 1200)} alt={program.title} className="aspect-[4/3] w-full object-cover" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {program.duration && (
              <div className="rounded-brand border border-border bg-surface p-5 transition duration-300 ease-out hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-md dark:border-white/10 dark:bg-[#1e293b]">
                <span className="flex size-12 items-center justify-center rounded-brand-sm bg-brand/10">
                  <Clock className="size-6 text-brand" />
                </span>
                <p className="mt-4 text-xs font-bold uppercase tracking-wider text-ink-soft dark:text-slate-400">Durée</p>
                <p className="mt-1 font-display text-base font-semibold text-ink dark:text-white">{program.duration}</p>
              </div>
            )}
            {program.schedule && (
              <div className="rounded-brand border border-border bg-surface p-5 transition duration-300 ease-out hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-md dark:border-white/10 dark:bg-[#1e293b]">
                <span className="flex size-12 items-center justify-center rounded-brand-sm bg-amber/15">
                  <CalendarBlank className="size-6 text-amber" />
                </span>
                <p className="mt-4 text-xs font-bold uppercase tracking-wider text-ink-soft dark:text-slate-400">Horaires</p>
                <p className="mt-1 font-display text-base font-semibold text-ink dark:text-white">{program.schedule}</p>
              </div>
            )}
            {program.priceMonthly && (
              <div className="rounded-brand border border-border bg-surface p-5 transition duration-300 ease-out hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-md dark:border-white/10 dark:bg-[#1e293b]">
                <span className="flex size-12 items-center justify-center rounded-brand-sm bg-violet/15">
                  <Sparkle className="size-6 text-violet" />
                </span>
                <p className="mt-4 text-xs font-bold uppercase tracking-wider text-ink-soft dark:text-slate-400">Prix</p>
                <p className="mt-1 font-display text-base font-semibold text-ink dark:text-white">{program.priceMonthly} DH/mois</p>
              </div>
            )}
            <div className="rounded-brand border border-border bg-surface p-5 transition duration-300 ease-out hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-md dark:border-white/10 dark:bg-[#1e293b]">
              <span className="flex size-12 items-center justify-center rounded-brand-sm bg-lime/15">
                <Users className="size-6 text-lime" />
              </span>
              <p className="mt-4 text-xs font-bold uppercase tracking-wider text-ink-soft dark:text-slate-400">Groupe</p>
              <p className="mt-1 font-display text-base font-semibold text-ink dark:text-white">8 élèves max</p>
            </div>
          </div>
        </div>

        {/* Outils */}
        {program.tools.length > 0 && (
          <div className="container-shell mt-8">
            <div className="rounded-brand border border-border bg-surface p-6 dark:border-white/10 dark:bg-[#1e293b]">
              <div className="flex items-center gap-3">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-brand-sm bg-brand/10">
                  <GraduationCap className="size-6 text-brand" />
                </span>
                <h2 className="font-display text-lg font-semibold text-ink dark:text-white">Outils utilisés</h2>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {program.tools.map((tool) => (
                  <span key={tool} className="rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Objectifs + prérequis */}
        <div className="container-shell mt-8 grid gap-6 md:grid-cols-5">
          {program.objectives && (
            <div className={`rounded-brand border border-border bg-white p-6 sm:p-8 dark:border-white/10 dark:bg-[#1e293b] ${program.prerequisites ? "md:col-span-3" : "md:col-span-5"}`}>
              <div className="mb-5 flex items-center gap-3">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-brand-sm bg-brand/10">
                  <BookOpen className="size-6 text-brand" />
                </span>
                <div>
                  <h2 className="font-display text-xl font-semibold text-ink dark:text-white">Au programme</h2>
                  <p className="text-xs font-medium text-ink-soft dark:text-slate-400">Ce que votre enfant va apprendre</p>
                </div>
              </div>
              <div className="space-y-3">
                {program.objectives.split("\n").filter(Boolean).map((obj, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 size-5 shrink-0 text-brand" />
                    <p className="text-sm font-medium leading-6 text-ink-soft dark:text-slate-300">{obj.replace(/^[•\s-]+/, "")}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {program.prerequisites && (
            <div className={`rounded-brand border border-border bg-white p-6 sm:p-8 dark:border-white/10 dark:bg-[#1e293b] ${program.objectives ? "md:col-span-2" : "md:col-span-5"}`}>
              <div className="mb-4 flex items-center gap-3">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-brand-sm bg-amber/15">
                  <Target className="size-6 text-amber" />
                </span>
                <div>
                  <h2 className="font-display text-xl font-semibold text-ink dark:text-white">Prérequis</h2>
                  <p className="text-xs font-medium text-ink-soft dark:text-slate-400">Avant de commencer</p>
                </div>
              </div>
              <p className="text-sm font-medium leading-7 text-ink-soft dark:text-slate-300">{program.prerequisites}</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA — red band */}
      <section className="relative overflow-hidden bg-brand py-16 sm:py-20 dark:bg-brand-dark">
        <div aria-hidden className="absolute -left-16 top-12 size-40 rounded-full bg-white/10" />
        <div aria-hidden className="absolute bottom-8 right-[15%] size-24 rounded-full bg-amber/20" />
        <div aria-hidden className="absolute left-[8%] top-1/2 size-6 rotate-12 rounded-lg bg-cream/40" />
        <div aria-hidden className="absolute right-[6%] top-16 size-8 -rotate-12 rounded-lg bg-white/15" />

        <div className="container-shell relative text-center">
          <h2 className="mx-auto max-w-3xl font-display text-3xl font-semibold tracking-[-0.02em] text-white md:text-4xl">
            Prêt à inscrire votre enfant ?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-7 text-white/80 sm:text-base sm:leading-8">
            Rejoignez {program.title} — les places sont limitées à 8 élèves par groupe.
          </p>
          <div className="mt-8">
            <Link
              href={`/inscription?program=${program.id}`}
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold text-brand transition duration-200 ease-out hover:bg-cream"
            >
              S&apos;inscrire à ce programme <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-white py-16 sm:py-24 dark:bg-body">
          <div className="container-shell">
            <div className="mb-10 text-center sm:mb-14">
              <span className="tag">Continuer</span>
              <h2 className="mx-auto mt-4 max-w-3xl font-display text-3xl font-semibold tracking-[-0.02em] text-ink dark:text-white md:text-5xl">
                Autres programmes
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-7 text-ink-soft sm:mt-4 sm:text-base sm:leading-8 dark:text-slate-300">
                Découvrez nos autres formations adaptées à chaque âge.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((p) => (
                <ProgramCard key={p.id} program={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
