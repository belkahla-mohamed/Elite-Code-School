import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle } from "lucide-react";
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

  const colorMap: Record<string, string> = {
    accent: "bg-amber text-ink", cyan: "bg-cyan text-white", amber: "bg-amber text-ink",
    green: "bg-lime text-white", rose: "bg-coral text-white", purple: "bg-violet text-white",
  };

  return (
    <div className="py-20">
      <div className="container-shell max-w-3xl">
        <Link href="/curricula" className="inline-flex items-center gap-2 text-sm font-bold text-ink-soft hover:text-sky transition mb-8">
          <ArrowLeft className="size-4" /> Tous les programmes
        </Link>

        <div className="flex items-center gap-4 mb-6">
          <span className="text-5xl">{program.icon}</span>
          <div>
            <h1 className="font-display text-4xl font-black text-ink">{program.title}</h1>
            <p className="text-base font-semibold text-ink-soft">{program.ageRange}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <span className="rounded-full bg-surface px-4 py-1.5 text-xs font-bold">{program.ageRange}</span>
          <span className={`rounded-full px-4 py-1.5 text-xs font-black uppercase ${colorMap[program.color] || "bg-surface"}`}>
            {program.level}
          </span>
          {program.priceMonthly && (
            <span className="rounded-full bg-surface px-4 py-1.5 text-xs font-bold">
              {program.priceMonthly} DH / mois
            </span>
          )}
        </div>

        <p className="text-base font-semibold leading-7 text-ink-soft mb-8">{program.description}</p>

        <h3 className="font-display text-xl font-black mb-4">Outils utilisés</h3>
        <div className="flex flex-wrap gap-2 mb-10">
          {program.tools.map((tool) => (
            <span key={tool} className="flex items-center gap-1.5 rounded-full bg-sky/10 px-4 py-2 text-sm font-bold text-sky">
              <CheckCircle className="size-4" /> {tool}
            </span>
          ))}
        </div>

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
