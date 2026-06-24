import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Lock } from "lucide-react";
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

  const avatars: Record<string, string> = {
    Y: "bg-sky", M: "bg-pink", A: "bg-amber", K: "bg-violet",
  };

  return (
    <div className="py-12">
      <div className="container-shell max-w-4xl">
        <Link href="/portfolios" className="inline-flex items-center gap-2 text-sm font-bold text-ink-soft hover:text-sky transition mb-8">
          <ArrowLeft className="size-4" /> Tous les portfolios
        </Link>

        <div className="flex items-center gap-6 mb-10">
          <div className={`flex size-20 items-center justify-center rounded-3xl font-display text-3xl font-black text-white ${avatars[portfolio.avatar] || "bg-sky"}`}>
            {portfolio.avatar}
          </div>
          <div>
            <h1 className="font-display text-3xl font-black text-ink">
              {portfolio.firstName} {portfolio.lastName}
            </h1>
            <p className="text-base font-semibold text-ink-soft">{portfolio.levelLabel}</p>
            <p className="text-sm text-ink-soft">{portfolio.age} ans · {portfolio.hours}h de code</p>
          </div>
        </div>

        <PortfolioTabs student={portfolio} />
      </div>
    </div>
  );
}
