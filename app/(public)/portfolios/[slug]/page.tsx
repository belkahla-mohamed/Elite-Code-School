import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Lock, Cake, MapPin, CalendarCheck, Medal, ShareNetwork, Clock, FolderOpen } from "@phosphor-icons/react/dist/ssr";
import { getPortfolioBySlug } from "@/lib/store";
import { PortfolioTabs } from "@/components/PortfolioTabs";
import { ShareMenu } from "@/components/ui/share-menu";

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

const avatarColors = ["bg-brand", "bg-amber", "bg-violet", "bg-lime", "bg-mint", "bg-coral"];

const stats = (completedCount: number, hours: number, certs: number) => [
  { icon: FolderOpen, tint: "bg-brand/10", iconColor: "text-brand", value: String(completedCount), label: "Projets terminés" },
  { icon: Clock, tint: "bg-amber/15", iconColor: "text-amber", value: `${hours}h`, label: "Heures de code" },
  { icon: Medal, tint: "bg-violet/15", iconColor: "text-violet", value: String(certs), label: "Certificats" },
];

export default async function PortfolioDetailPage({ params }: Props) {
  const { slug } = await params;
  const portfolio = await getPortfolioBySlug(slug);

  if (!portfolio) notFound();

  if (!portfolio.isPublic) {
    return (
      <div className="bg-white py-16 sm:py-24 dark:bg-body">
        <div className="container-shell max-w-md text-center">
          <div className="rounded-brand border border-border bg-white p-8 dark:border-white/10 dark:bg-[#1e293b]">
            <span className="mx-auto flex size-14 items-center justify-center rounded-brand-sm bg-brand/10">
              <Lock className="size-7 text-brand" />
            </span>
            <h1 className="mt-4 font-display text-2xl font-semibold text-ink dark:text-white">Portfolio privé</h1>
            <p className="mt-2 text-sm font-medium text-ink-soft dark:text-slate-400">Ce portfolio n&apos;est pas accessible publiquement.</p>
            <Link href="/portfolios" className="btn-primary mt-6 w-full">
              <ArrowLeft className="size-4" /> Retour aux portfolios
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const completedCount = portfolio.projects.filter((p) => p.status === "completed").length;

  return (
    <div className="overflow-hidden bg-white dark:bg-body">
      {/* Hero — red band */}
      <section className="relative overflow-hidden bg-brand dark:bg-brand-dark">
        <div aria-hidden className="absolute -left-20 -top-20 size-64 rounded-full bg-white/10" />
        <div aria-hidden className="absolute -right-24 top-24 size-80 rounded-full bg-white/10" />
        <div aria-hidden className="absolute -bottom-28 left-[40%] size-72 rounded-full bg-amber/25" />
        <div aria-hidden className="absolute left-[6%] top-14 size-8 -rotate-12 rounded-lg bg-amber" />
        <div aria-hidden className="absolute bottom-16 right-[8%] size-4 rounded-full bg-lime" />

        <div className="container-shell relative pb-24 pt-12 sm:pb-28 sm:pt-16">
          <Link href="/portfolios" className="inline-flex items-center gap-2 text-sm font-bold text-white/70 transition duration-200 ease-out hover:text-white">
            <ArrowLeft className="size-4" /> Tous les portfolios
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-5 sm:gap-6">
            <div className={`flex size-20 shrink-0 items-center justify-center rounded-brand font-display text-3xl font-semibold text-white ring-4 ring-white/30 md:size-24 md:text-4xl ${avatarColors[portfolio.id.length % avatarColors.length]}`}>
              {portfolio.avatar}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-3xl font-semibold tracking-[-0.02em] text-white sm:text-4xl">
                {portfolio.firstName} {portfolio.lastName}
              </h1>
              <p className="mt-1 text-sm font-bold text-white/80">{portfolio.levelLabel}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold text-white">
                  <Cake className="size-4" /> {portfolio.age} ans
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold text-white">
                  <Medal className="size-4" /> {portfolio.certifications.length} certificat(s)
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold text-white">
                  <MapPin className="size-4" /> Marrakech
                </span>
                <span className="hidden items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold text-white sm:inline-flex">
                  <CalendarCheck className="size-4" /> {portfolio.joinDateLabel}
                </span>
              </div>
            </div>
            <ShareMenu
              title={`Portfolio de ${portfolio.firstName} ${portfolio.lastName}`}
              text={`Découvre le portfolio de ${portfolio.firstName} ${portfolio.lastName} sur Elite Code School`}
              triggerClassName="inline-flex items-center gap-2 rounded-full border-2 border-white/40 bg-white/10 px-5 py-2.5 text-xs font-bold text-white transition duration-200 ease-out hover:border-white hover:bg-white/20"
              label={<><ShareNetwork className="size-4" /> Partager</>}
            />
          </div>
        </div>
      </section>

      {/* Stats overlapping the hero bottom edge */}
      <div className="container-shell relative z-10 -mt-8 sm:-mt-10">
        <div className="grid gap-4 sm:grid-cols-3">
            {stats(completedCount, portfolio.hours, portfolio.certifications.length).map((stat) => (
              <div key={stat.label} className="flex items-center gap-4 rounded-brand border border-border bg-surface p-5 dark:border-white/10 dark:bg-[#1e293b]">
                <span className={`flex size-11 shrink-0 items-center justify-center rounded-brand-sm ${stat.tint}`}>
                  <stat.icon className={`size-5 ${stat.iconColor}`} />
                </span>
                <div className="min-w-0">
                  <p className="font-display text-2xl font-semibold text-ink dark:text-white">{stat.value}</p>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-ink-soft dark:text-slate-400">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
      </div>

      {/* Tabs */}
      <section className="bg-white pb-16 pt-10 dark:bg-body sm:pb-24 sm:pt-12">
        <div className="container-shell">
          <PortfolioTabs student={portfolio} />
        </div>
      </section>
    </div>
  );
}
