"use client";

import { useParentStudent } from "@/hooks/useParentStudent";
import { PortfolioTabs } from "@/components/PortfolioTabs";
import { Breadcrumb } from "@/components/layout/parent-nav";
import { LoadingPage } from "@/components/ui/loading-spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { User, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function ParentPortfolioPage() {
  const { student, loading, error } = useParentStudent();

  if (loading) {
    return (
      <div>
        <Skeleton className="mb-6 h-4 w-40" />
        <div className="rounded-brand border-2 border-border bg-white dark:bg-surface p-8">
          <Skeleton className="mb-6 h-8 w-56" />
          <div className="grid gap-5 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-brand" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Breadcrumb items={[{ label: "Espace parent", href: "/parent" }, { label: "Portfolio" }]} />
        <div className="mx-auto max-w-md rounded-brand border-2 border-border bg-white dark:bg-surface p-8 text-center">
          <User className="mx-auto size-12 text-ink-soft/40" />
          <h2 className="mt-4 font-display text-xl font-bold text-ink">{error}</h2>
          <p className="mt-2 text-sm text-ink-soft">Veuillez vous reconnecter.</p>
          <Link href="/login" className="btn-primary mt-6 inline-flex">Se connecter</Link>
        </div>
      </div>
    );
  }

  if (!student) return null;

  return (
    <div>
      <Breadcrumb items={[
        { label: "Espace parent", href: "/parent" },
        { label: `${student.firstName} ${student.lastName}`, href: "/parent" },
        { label: "Portfolio" }
      ]} />

      <div className="rounded-brand border-2 border-border bg-white dark:bg-surface p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div
              className="flex size-14 items-center justify-center rounded-2xl font-display text-lg font-bold text-white"
              style={{ background: student.avatarGradient }}
            >
              {student.avatar}
            </div>
            <div>
              <h1 className="font-display text-2xl font-extrabold text-ink">
                Portfolio de {student.firstName}
              </h1>
              <p className="text-sm text-ink-soft">{student.levelLabel}</p>
            </div>
          </div>
          <Link
            href={`/portfolios/${student.slug}`}
            className="btn-outline px-4 py-2 text-sm"
          >
            <ExternalLink className="mr-1 inline size-4" />
            Voir la vue publique
          </Link>
        </div>

        <PortfolioTabs student={student} />
      </div>
    </div>
  );
}
