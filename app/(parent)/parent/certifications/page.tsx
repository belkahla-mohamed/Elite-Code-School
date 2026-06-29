"use client";

import { useState } from "react";
import { useParentStudent } from "@/hooks/useParentStudent";
import { Breadcrumb } from "@/components/layout/parent-nav";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User, Share2, Copy, Check, Linkedin, ExternalLink, Award
} from "lucide-react";
import Link from "next/link";
import { showToast } from "@/components/ui/toast";

export default function ParentCertificationsPage() {
  const { student, loading, error } = useParentStudent();
  const [copiedId, setCopiedId] = useState("");

  function copyCertLink(certId: string) {
    const url = `${window.location.origin}/certification/${certId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(certId);
      showToast("Lien copié dans le presse-papier", "success");
      setTimeout(() => setCopiedId(""), 2000);
    });
  }

  function shareWhatsApp(cert: any) {
    const url = `${window.location.origin}/certification/${cert.id}`;
    const text = `🎓 ${cert.emoji} ${cert.title} — ${cert.mention}\nÉlève: ${student?.firstName} ${student?.lastName}\nElite Code School\n🔗 ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }

  function shareLinkedin(cert: any) {
    const url = `${window.location.origin}/certification/${cert.id}`;
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      "_blank"
    );
  }

  if (loading) {
    return (
      <div>
        <Skeleton className="mb-6 h-4 w-40" />
        <div className="rounded-brand border-2 border-border bg-white dark:bg-surface p-8">
          <Skeleton className="mb-6 h-8 w-48" />
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-44 w-full rounded-brand" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Breadcrumb items={[{ label: "Espace parent", href: "/parent" }, { label: "Certificats" }]} />
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
        { label: "Certificats" }
      ]} />

      <div className="rounded-brand border-2 border-border bg-white dark:bg-surface p-6 md:p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-amber/10 text-amber">
            <Award className="size-7" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-extrabold text-ink">Certifications</h1>
            <p className="text-sm text-ink-soft">
              {student.certifications.length > 0
                ? `${student.certifications.length} certification${student.certifications.length > 1 ? "s" : ""} obtenue${student.certifications.length > 1 ? "s" : ""} par ${student.firstName}`
                : `${student.firstName} n'a pas encore de certification`
              }
            </p>
          </div>
        </div>

        {student.certifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-surface py-16">
            <Award className="size-16 text-ink-soft/20" />
            <p className="mt-4 text-sm text-ink-soft">Aucune certification pour le moment</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {student.certifications.map((cert) => (
              <div
                key={cert.id}
                className="group overflow-hidden rounded-brand border-2 border-border bg-white dark:bg-surface transition hover:shadow-lg hover:-translate-y-0.5"
              >
                {/* Header with gradient */}
                <div className="relative p-6 text-white" style={{ background: cert.gradient }}>
                  <div className="text-5xl mb-3">{cert.emoji}</div>
                  <h3 className="font-display text-xl font-bold">{cert.title}</h3>
                  <p className="mt-1 text-sm text-white/80">{cert.mention}</p>
                  <span className="mt-3 inline-flex rounded-full bg-white/15 px-3 py-1 font-mono text-xs">
                    {cert.dateLabel}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between p-4">
                  <Link
                    href={`/certification/${cert.id}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky hover:text-sky/80 transition"
                  >
                    <ExternalLink className="size-4" />
                    Voir détail
                  </Link>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyCertLink(cert.id)}
                      className="rounded-full bg-sky/10 p-2.5 text-sky hover:bg-sky/20 transition"
                      title="Copier le lien"
                    >
                      {copiedId === cert.id ? (
                        <Check className="size-4" />
                      ) : (
                        <Copy className="size-4" />
                      )}
                    </button>
                    <button
                      onClick={() => shareWhatsApp(cert)}
                      className="rounded-full bg-green-100 p-2.5 text-green-700 hover:bg-green-200 transition"
                      title="Partager WhatsApp"
                    >
                      <Share2 className="size-4" />
                    </button>
                    <button
                      onClick={() => shareLinkedin(cert)}
                      className="rounded-full bg-blue-100 p-2.5 text-blue-700 hover:bg-blue-200 transition"
                      title="Partager LinkedIn"
                    >
                      <Linkedin className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
