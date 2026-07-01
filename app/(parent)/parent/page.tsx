"use client";

import { useState, useEffect } from "react";
import { useParentStudent } from "@/hooks/useParentStudent";
import { Breadcrumb } from "@/components/layout/parent-nav";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User, FolderOpen, Award, Clock, Eye, Lock, Bell, BellOff,
  Download, Loader2, ExternalLink, ChevronRight, BookOpen,
  Shield, FileText
} from "lucide-react";
import Link from "next/link";
import { generateStudentReport, downloadBlob } from "@/lib/pdf-generator";
import { showToast } from "@/components/ui/toast";

function useNotifications() {
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === "undefined") return true;
    const stored = localStorage.getItem("ecs_parent_notifications");
    return stored !== null ? stored === "true" : true;
  });
  useEffect(() => { localStorage.setItem("ecs_parent_notifications", String(enabled)); }, [enabled]);
  return [enabled, setEnabled] as const;
}

export default function ParentDashboardPage() {
  const { student, loading, error, togglePrivacy } = useParentStudent();
  const [pdfLoading, setPdfLoading] = useState(false);
  const [notifications, setNotifications] = useNotifications();

  async function handleDownloadPdf() {
    if (!student) return;
    setPdfLoading(true);
    try {
      const blob = await generateStudentReport(student);
      downloadBlob(
        blob,
        `Elite_Code_${student.firstName}_${student.lastName}_${new Date().getFullYear()}.pdf`
      );
      showToast("PDF téléchargé", "success");
    } catch {
      showToast("Erreur PDF", "error");
    } finally {
      setPdfLoading(false);
    }
  }

  if (loading) {
    return (
      <div>
        <Skeleton className="mb-6 h-4 w-40" />
        <div className="rounded-brand border-2 border-border bg-white dark:bg-surface p-6 md:p-8">
          <div className="flex items-center gap-4 mb-8">
            <Skeleton className="size-16 rounded-2xl" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-brand-sm" />
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
        <Breadcrumb items={[{ label: "Espace parent" }]} />
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

  const quickLinks = [
    {
      href: "/parent/portfolio",
      label: "Portfolio",
      desc: "Projets, compétences et galerie",
      icon: BookOpen,
      color: "from-sky to-cyan",
    },
    {
      href: "/parent/certifications",
      label: "Certificats",
      desc: `${student.certifications.length} certification${student.certifications.length > 1 ? "s" : ""}`,
      icon: Award,
      color: "from-amber to-orange",
    },
    {
      href: "/parent/privacy",
      label: "Confidentialité",
      desc: student.isPublic ? "Portfolio public" : "Portfolio privé",
      icon: student.isPublic ? Eye : Lock,
      color: student.isPublic ? "from-lime to-emerald" : "from-rose to-pink",
    },
    {
      href: "/parent/report",
      label: "Rapport",
      desc: "Bilan PDF et statistiques",
      icon: FileText,
      color: "from-violet to-purple",
    },
  ];

  return (
    <div>
      <Breadcrumb items={[{ label: "Espace parent" }]} />

      <div className="space-y-6">
        {/* Profile Card */}
        <div className="rounded-brand border-2 border-border bg-white dark:bg-surface p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="flex items-center gap-4">
              <div
                className="flex size-16 items-center justify-center rounded-2xl font-display text-xl font-bold text-white shadow-md"
                style={{ background: student.avatarGradient }}
              >
                {student.avatar}
              </div>
              <div>
                <span className="tag">Espace parent</span>
                <h1 className="mt-2 font-display text-3xl font-extrabold text-ink">
                  {student.firstName} {student.lastName}
                </h1>
                <p className="text-ink-soft">{student.levelLabel}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={togglePrivacy}
                className={`px-4 py-2 rounded-brand text-sm font-bold transition ${
                  student.isPublic
                    ? "btn-outline border-2 border-border"
                    : "btn-primary"
                }`}
              >
                {student.isPublic ? (
                  <><Eye className="mr-1.5 inline size-4" />Rendre privé</>
                ) : (
                  <><Lock className="mr-1.5 inline size-4" />Rendre public</>
                )}
              </button>
              <Link
                href={`/portfolios/${student.slug}`}
                className="btn-outline px-4 py-2 text-sm"
              >
                <ExternalLink className="mr-1.5 inline size-4" />
                Voir portfolio
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-brand border-2 border-border bg-white dark:bg-surface p-4 md:p-5">
            <div className="inline-flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky to-cyan text-white mb-3">
              <FolderOpen className="size-5" />
            </div>
            <div className="font-display text-2xl font-extrabold text-ink">{totalProjects}</div>
            <div className="text-xs text-ink-soft">Projets</div>
            <div className="mt-0.5 text-[10px] text-ink-soft/60">{completedProjects} terminés</div>
          </div>
          <div className="rounded-brand border-2 border-border bg-white dark:bg-surface p-4 md:p-5">
            <div className="inline-flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber to-orange text-white mb-3">
              <Award className="size-5" />
            </div>
            <div className="font-display text-2xl font-extrabold text-ink">{student.certifications.length}</div>
            <div className="text-xs text-ink-soft">Certifications</div>
            <div className="mt-0.5 text-[10px] text-ink-soft/60">obtenues</div>
          </div>
          <div className="rounded-brand border-2 border-border bg-white dark:bg-surface p-4 md:p-5">
            <div className="inline-flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-lime to-emerald text-white mb-3">
              <Clock className="size-5" />
            </div>
            <div className="font-display text-2xl font-extrabold text-ink">{student.hours}h</div>
            <div className="text-xs text-ink-soft">Heures de code</div>
            <div className="mt-0.5 text-[10px] text-ink-soft/60">cumulées</div>
          </div>
          <div className="rounded-brand border-2 border-border bg-white dark:bg-surface p-4 md:p-5">
            <div className="inline-flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet to-purple text-white mb-3">
              <Shield className="size-5" />
            </div>
            <div className="font-display text-2xl font-extrabold text-ink">
              {student.isPublic ? "Public" : "Privé"}
            </div>
            <div className="text-xs text-ink-soft">Visibilité</div>
            <div className="mt-0.5 text-[10px] text-ink-soft/60">portfolio</div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid gap-4 sm:grid-cols-2">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group rounded-brand border-2 border-border bg-white dark:bg-surface p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div
                    className={`flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${link.color} text-white`}
                  >
                    <link.icon className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-ink group-hover:text-sky transition">
                      {link.label}
                    </h3>
                    <p className="mt-0.5 text-sm text-ink-soft">{link.desc}</p>
                  </div>
                </div>
                <ChevronRight className="size-5 text-ink-soft group-hover:text-sky group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          ))}
        </div>

        {/* PDF Download */}
        <div className="rounded-brand border-2 border-border bg-white dark:bg-surface p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sky/10 text-sky">
                <Download className="size-5" />
              </div>
              <div>
                <h2 className="font-display text-base font-bold text-ink">Bilan PDF</h2>
                <p className="text-sm text-ink-soft">
                  Télécharger le rapport complet de {student.firstName}
                </p>
              </div>
            </div>
            <button
              onClick={handleDownloadPdf}
              disabled={pdfLoading}
              className="btn-primary px-5 py-2.5 disabled:opacity-60"
            >
              {pdfLoading ? (
                <><Loader2 className="mr-2 inline size-4 animate-spin" />Génération...</>
              ) : (
                <><Download className="mr-2 inline size-4" />Télécharger PDF</>
              )}
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-brand border-2 border-border bg-white dark:bg-surface p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`flex size-10 items-center justify-center rounded-xl ${
                notifications ? "bg-sky/10 text-sky" : "bg-surface text-ink-soft"
              }`}>
                {notifications ? <Bell className="size-5" /> : <BellOff className="size-5" />}
              </div>
              <div>
                <h2 className="font-display text-base font-bold text-ink">Notifications</h2>
                <p className="text-sm text-ink-soft">
                  Recevoir les mises à jour de {student.firstName}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setNotifications(!notifications);
                showToast(
                  notifications ? "Notifications désactivées" : "Notifications activées",
                  "info"
                );
              }}
              className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition ${
                notifications ? "bg-sky" : "bg-gray-300 dark:bg-slate-600"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 rounded-full bg-white shadow transition ${
                  notifications ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
