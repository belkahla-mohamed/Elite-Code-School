"use client";

import { useState } from "react";
import { useParentStudent } from "@/hooks/useParentStudent";
import { Breadcrumb } from "@/components/layout/parent-nav";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User, Download, Loader2, FileText, BarChart3, Clock,
  FolderOpen, Award, Eye, Calendar, BookOpen
} from "lucide-react";
import Link from "next/link";
import { generateStudentReport, downloadBlob } from "@/lib/pdf-generator";
import { showToast } from "@/components/ui/toast";

export default function ParentReportPage() {
  const { student, loading, error } = useParentStudent();
  const [pdfLoading, setPdfLoading] = useState(false);

  async function handleDownloadPdf() {
    if (!student) return;
    setPdfLoading(true);
    try {
      const blob = await generateStudentReport(student);
      downloadBlob(
        blob,
        `Elite_Code_${student.firstName}_${student.lastName}_${new Date().getFullYear()}.pdf`
      );
      showToast("PDF téléchargé avec succès", "success");
    } catch {
      showToast("Erreur lors de la génération du PDF", "error");
    } finally {
      setPdfLoading(false);
    }
  }

  if (loading) {
    return (
      <div>
        <Skeleton className="mb-6 h-4 w-40" />
        <div className="rounded-brand border-2 border-border bg-white dark:bg-surface p-8">
          <Skeleton className="mb-6 h-8 w-48" />
          <div className="grid gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-brand-sm" />
            ))}
          </div>
          <Skeleton className="mt-6 h-24 w-full rounded-brand-sm" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Breadcrumb items={[{ label: "Espace parent", href: "/parent" }, { label: "Rapport" }]} />
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

  const totalProjects = student.projects.length;
  const completedProjects = student.projects.filter((p) => p.status === "completed").length;
  const inProgressProjects = student.projects.filter((p) => p.status !== "completed").length;

  return (
    <div>
      <Breadcrumb items={[
        { label: "Espace parent", href: "/parent" },
        { label: `${student.firstName} ${student.lastName}`, href: "/parent" },
        { label: "Rapport" }
      ]} />

      <div className="space-y-6">
        {/* Header */}
        <div className="rounded-brand border-2 border-border bg-white dark:bg-surface p-6 md:p-8">
          <div className="flex items-center gap-4">
            <div
              className="flex size-14 items-center justify-center rounded-2xl font-display text-lg font-bold text-white"
              style={{ background: student.avatarGradient }}
            >
              {student.avatar}
            </div>
            <div>
              <h1 className="font-display text-2xl font-extrabold text-ink">
                Rapport de {student.firstName}
              </h1>
              <p className="text-sm text-ink-soft">{student.levelLabel}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard
            icon={<FolderOpen className="size-5" />}
            label="Projets"
            value={String(totalProjects)}
            sub={`${completedProjects} terminés`}
            color="from-sky to-cyan"
          />
          <StatCard
            icon={<Award className="size-5" />}
            label="Certifications"
            value={String(student.certifications.length)}
            sub="obtenues"
            color="from-amber to-orange"
          />
          <StatCard
            icon={<Clock className="size-5" />}
            label="Heures de code"
            value={`${student.hours}h`}
            sub="cumulées"
            color="from-lime to-emerald"
          />
          <StatCard
            icon={<BarChart3 className="size-5" />}
            label="Avancement"
            value={`${totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0}%`}
            sub="projets complétés"
            color="from-violet to-purple"
          />
        </div>

        {/* Progress bars */}
        <div className="rounded-brand border-2 border-border bg-white dark:bg-surface p-6 md:p-8">
          <h2 className="font-display text-lg font-bold text-ink mb-6">Détail des compétences</h2>
          <div className="space-y-5">
            <ProgressBar
              label="Projets complétés"
              value={totalProjects > 0 ? completedProjects : 0}
              max={Math.max(totalProjects, 1)}
              color="from-lime to-emerald"
            />
            <ProgressBar
              label="Projets en cours"
              value={inProgressProjects}
              max={Math.max(totalProjects, 1)}
              color="from-sky to-cyan"
            />
            <ProgressBar
              label="Heures de code"
              value={Math.min(student.hours, 40)}
              max={40}
              suffix="h / 40h"
              color="from-amber to-orange"
            />
            <ProgressBar
              label="Certifications"
              value={student.certifications.length}
              max={8}
              color="from-violet to-purple"
            />
          </div>
        </div>

        {/* Download Section */}
        <div className="rounded-brand border-2 border-sky/20 bg-gradient-to-br from-sky/5 to-cyan/5 p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-sky/10 text-sky">
                <FileText className="size-6" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-ink">Bilan PDF complet</h2>
                <p className="mt-1 text-sm text-ink-soft leading-relaxed">
                  Téléchargez un rapport détaillé au format PDF incluant tous les projets,
                  certifications et la progression de {student.firstName}.
                </p>
                <div className="mt-3 flex flex-wrap gap-4 text-xs text-ink-soft">
                  <span className="flex items-center gap-1">
                    <BookOpen className="size-3" />{totalProjects} projet{totalProjects > 1 ? "s" : ""}
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="size-3" />{student.certifications.length} certification{student.certifications.length > 1 ? "s" : ""}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3" />{student.joinDateLabel}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleDownloadPdf}
              disabled={pdfLoading}
              className="btn-primary shrink-0 px-6 py-3 disabled:opacity-60"
            >
              {pdfLoading ? (
                <>
                  <Loader2 className="mr-2 inline size-5 animate-spin" />
                  Génération...
                </>
              ) : (
                <>
                  <Download className="mr-2 inline size-5" />
                  Télécharger PDF
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div className="rounded-brand border-2 border-border bg-white dark:bg-surface p-4 md:p-5">
      <div className={`inline-flex size-9 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-white mb-3`}>
        {icon}
      </div>
      <div className="font-display text-2xl font-extrabold text-ink">{value}</div>
      <div className="text-xs text-ink-soft">{label}</div>
      <div className="mt-0.5 text-[10px] text-ink-soft/60">{sub}</div>
    </div>
  );
}

function ProgressBar({
  label,
  value,
  max,
  color,
  suffix,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  suffix?: string;
}) {
  const percent = Math.min(100, Math.round((value / max) * 100));
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-sm">
        <span className="font-semibold text-ink">{label}</span>
        <span className="text-ink-soft">{suffix ?? `${percent}%`}</span>
      </div>
      <div className="h-2.5 rounded-full bg-surface">
        <div
          className={`h-2.5 rounded-full bg-gradient-to-r ${color} transition-all duration-700`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
