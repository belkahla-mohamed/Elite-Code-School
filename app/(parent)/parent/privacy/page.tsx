"use client";

import { useParentStudent } from "@/hooks/useParentStudent";
import { Breadcrumb } from "@/components/layout/parent-nav";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Globe, Lock, Eye, ExternalLink } from "lucide-react";
import Link from "next/link";
import { showToast } from "@/components/ui/toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function ParentPrivacyPage() {
  const { student, loading, error, togglePrivacy } = useParentStudent();

  if (loading) {
    return (
      <div>
        <Skeleton className="mb-6 h-4 w-40" />
        <div className="rounded-brand border-2 border-border bg-white dark:bg-surface p-8">
          <Skeleton className="mb-6 h-8 w-48" />
          <Skeleton className="mb-4 h-24 w-full rounded-brand" />
          <Skeleton className="h-24 w-full rounded-brand" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Breadcrumb items={[{ label: "Espace parent", href: "/parent" }, { label: "Confidentialité" }]} />
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

  const portfolioUrl = `${window.location.origin}/portfolios/${student.slug}`;

  return (
    <div>
      <Breadcrumb items={[
        { label: "Espace parent", href: "/parent" },
        { label: "Confidentialité" }
      ]} />

      <div className="space-y-6">
        {/* Page Header */}
        <div className="rounded-brand border-2 border-border bg-white dark:bg-surface p-6 md:p-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-sky/10 text-sky">
              {student.isPublic ? <Globe className="size-7" /> : <Lock className="size-7" />}
            </div>
            <div>
              <h1 className="font-display text-2xl font-extrabold text-ink">Confidentialité</h1>
              <p className="text-sm text-ink-soft">
                Gérez la visibilité du portfolio de {student.firstName}
              </p>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className={`rounded-brand border-2 p-6 md:p-8 ${
          student.isPublic
            ? "border-lime/30 bg-gradient-to-br from-lime/5 to-emerald/5"
            : "border-amber/30 bg-gradient-to-br from-amber/5 to-orange/5"
        }`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${
                student.isPublic ? "bg-lime text-white" : "bg-amber text-white"
              }`}>
                {student.isPublic ? <Eye className="size-6" /> : <Lock className="size-6" />}
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-ink">
                  Portfolio {student.isPublic ? "visible" : "privé"}
                </h2>
                <p className="mt-1 text-sm text-ink-soft leading-relaxed max-w-lg">
                  {student.isPublic
                    ? "Tout le monde peut voir le portfolio de votre enfant. Les projets, certifications et la galerie sont accessibles publiquement."
                    : "Seuls vous et l'administration pouvez voir les informations de votre enfant. Le portfolio n'apparaît pas dans la liste publique."
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <Switch id="privacy-toggle" checked={student.isPublic} onCheckedChange={togglePrivacy} />
              <Label htmlFor="privacy-toggle" className="text-sm font-bold text-ink cursor-pointer">
                {student.isPublic ? "Public" : "Privé"}
              </Label>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-brand border-2 border-border bg-white dark:bg-surface p-6">
            <div className="flex size-10 items-center justify-center rounded-xl bg-sky/10 text-sky mb-4">
              <Globe className="size-5" />
            </div>
            <h3 className="font-display text-lg font-bold text-ink">Mode public</h3>
            <ul className="mt-3 space-y-2 text-sm text-ink-soft">
              <li className="flex items-start gap-2">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-lime" />
                Portfolio visible sur la page des élèves
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-lime" />
                Partage de certifications via lien direct
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-lime" />
                Accès public aux projets et à la galerie
              </li>
            </ul>
          </div>

          <div className="rounded-brand border-2 border-border bg-white dark:bg-surface p-6">
            <div className="flex size-10 items-center justify-center rounded-xl bg-amber/10 text-amber mb-4">
              <Lock className="size-5" />
            </div>
            <h3 className="font-display text-lg font-bold text-ink">Mode privé</h3>
            <ul className="mt-3 space-y-2 text-sm text-ink-soft">
              <li className="flex items-start gap-2">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-amber" />
                Portfolio masqué du grand public
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-amber" />
                Accès réservé aux parents et à l&apos;école
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-amber" />
                Certifications vérifiables via code unique
              </li>
            </ul>
          </div>
        </div>

        {/* Public Link */}
        {student.isPublic && (
          <div className="rounded-brand border-2 border-border bg-white dark:bg-surface p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-base font-bold text-ink">Lien du portfolio</h3>
                <p className="mt-1 text-sm text-ink-soft break-all font-mono">{portfolioUrl}</p>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(portfolioUrl);
                  showToast("Lien copié", "success");
                }}
                className="btn-outline shrink-0 px-5 py-2 text-sm"
              >
                Copier le lien
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
