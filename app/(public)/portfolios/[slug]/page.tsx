import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Lock, CakeSlice, MapPin, CalendarCheck, Award, Share2, Sparkles } from "lucide-react";
import { getPortfolioBySlug } from "@/lib/store";
import { PortfolioTabs } from "@/components/PortfolioTabs";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const portfolio = await getPortfolioBySlug(slug);
  if (!portfolio) return { title: "Portfolio introuvable" };
  return {
    title: `${portfolio.firstName} ${portfolio.lastName} — Portfolio`,
    description: `Portfolio de ${portfolio.firstName} ${portfolio.lastName} — projets, certificats et galerie.`,
  };
}

const avatarColors = ["bg-sky", "bg-pink", "bg-amber", "bg-violet", "bg-lime", "bg-mint"];

export default async function PortfolioDetailPage({ params }: Props) {
  const { slug } = await params;
  const portfolio = await getPortfolioBySlug(slug);

  if (!portfolio) notFound();

  if (!portfolio.isPublic) {
    return (
      <div className="py-20 text-center">
        <Lock className="mx-auto size-12 text-ink-soft/40" />
        <h1 className="mt-4 font-display text-2xl font-black text-ink">Portfolio privé</h1>
        <p className="mt-2 text-sm text-ink-soft">Ce portfolio n&apos;est pas accessible publiquement.</p>
        <Link href="/portfolios" className="mt-6 inline-flex items-center gap-2 rounded-full bg-sky px-6 py-3 text-sm font-black uppercase tracking-wide text-white hover:bg-sky-dark transition">
          <ArrowLeft className="size-4" /> Retour aux portfolios
        </Link>
      </div>
    );
  }

  const completedCount = portfolio.projects.filter((p) => p.status === "completed").length;

  return (
    <div className="py-12">
      <div className="container-shell max-w-4xl">
        <Link href="/portfolios" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-ink-soft transition hover:text-sky">
          <ArrowLeft className="size-4" /> Tous les portfolios
        </Link>

        {/* Hero card */}
        <div className="relative mb-8 overflow-hidden rounded-brand border-2 border-border bg-white p-6 md:p-8 dark:bg-surface">
          <div className="relative flex flex-wrap items-center gap-6">
            <div className={`flex size-24 items-center justify-center rounded-brand font-display text-4xl font-black text-white ${avatarColors[portfolio.id.length % avatarColors.length]}`}>
              {portfolio.avatar}
            </div>
            <div className="min-w-0 flex-1">
              <span className="tag mb-2">
                <Sparkles className="size-3.5" /> Portfolio
              </span>
              <h1 className="font-display text-3xl font-black tracking-[-0.03em] text-ink md:text-4xl">
                {portfolio.firstName} {portfolio.lastName}
              </h1>
              <p className="mt-1 text-base font-bold text-ink-soft">{portfolio.levelLabel}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="flex items-center gap-1.5 rounded-full border-2 border-border bg-surface px-3 py-1.5 text-xs font-black uppercase tracking-wide text-ink">
                  <CakeSlice className="size-4 text-sky" /> {portfolio.age} ans
                </span>
                <span className="flex items-center gap-1.5 rounded-full border-2 border-border bg-surface px-3 py-1.5 text-xs font-black uppercase tracking-wide text-ink">
                  <Award className="size-4 text-amber" /> {portfolio.certifications.length} certificat(s)
                </span>
                <span className="flex items-center gap-1.5 rounded-full border-2 border-border bg-surface px-3 py-1.5 text-xs font-black uppercase tracking-wide text-ink">
                  <MapPin className="size-4 text-coral" /> Marrakech
                </span>
                <span className="hidden items-center gap-1.5 rounded-full border-2 border-border bg-surface px-3 py-1.5 text-xs font-black uppercase tracking-wide text-ink sm:flex">
                  <CalendarCheck className="size-4 text-mint" /> {portfolio.joinDateLabel}
                </span>
              </div>
            </div>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Découvre le portfolio de ${portfolio.firstName} ${portfolio.lastName} sur Elite Code School`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline px-5 py-2.5 text-xs"
            >
              <Share2 className="size-4" /> Partager
            </a>
          </div>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <span className="inline-flex h-8 w-1.5 rounded-full bg-sky" />
          <h2 className="font-display text-xl font-black text-ink">
            {completedCount} projets · {portfolio.hours}h de code au compteur
          </h2>
        </div>
        <PortfolioTabs student={portfolio} />
      </div>
    </div>
  );
}