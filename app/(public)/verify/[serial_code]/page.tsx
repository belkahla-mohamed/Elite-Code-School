"use client";

import { useEffect, useState, use } from "react";
import { Medal, CheckCircle, XCircle, MagnifyingGlass, CalendarBlank, User, Hash } from "@phosphor-icons/react";
import { OptimizedImage } from "@/components/ui/optimized-image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function VerifyCertificatePage({ params }: { params: Promise<{ serial_code: string }> }) {
  const { serial_code } = use(params);
  const [cert, setCert] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/verify/${serial_code}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.certification) {
          setCert(data);
          setError(false);
        } else {
          setError(true);
        }
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [serial_code]);

  return (
    <div className="min-h-[70vh] bg-body py-16 px-4 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center size-16 rounded-full bg-sky/10 text-sky mb-4">
            <MagnifyingGlass className="size-8" />
          </div>
          <h1 className="font-display text-4xl font-black text-ink mb-2">Vérification de Certificat</h1>
          <p className="text-ink-soft">Vérifiez l&apos;authenticité d&apos;un certificat Elite Code School</p>
        </div>

        <div className="rounded-brand-lg border-2 border-border bg-white dark:bg-surface shadow-card overflow-hidden">
          {loading ? (
            <div className="p-8 space-y-4">
              <Skeleton className="h-12 w-3/4 mx-auto" />
              <Skeleton className="h-8 w-1/2 mx-auto" />
              <div className="pt-8 grid grid-cols-2 gap-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          ) : error || !cert ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center size-20 rounded-full bg-coral/10 text-coral mb-6">
                <XCircle className="size-10" />
              </div>
              <h2 className="text-2xl font-black text-ink mb-2">Certificat introuvable</h2>
              <p className="text-ink-soft mb-6">
                Le numéro de série <span className="font-mono font-bold px-2 py-1 bg-surface rounded text-ink">{serial_code}</span> ne correspond à aucun certificat valide.
              </p>
              <Link href="/" className="btn-primary inline-flex items-center gap-2">
                Retour à l&apos;accueil
              </Link>
            </div>
          ) : (
            <div>
              <div className="p-8 border-b-2 border-border bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 text-center">
                <div className="inline-flex items-center justify-center size-20 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 mb-4 ring-8 ring-emerald-50 dark:ring-emerald-900/10">
                  <CheckCircle className="size-10" />
                </div>
                <h2 className="text-2xl font-black text-ink mb-1">Certificat Valide</h2>
                <p className="text-emerald-600 dark:text-emerald-400 font-bold">L&apos;authenticité de ce document a été vérifiée.</p>
              </div>

              <div className="p-8">
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                  
                  <div className="flex-1 space-y-6 w-full">
                    <div>
                      <p className="text-sm font-bold text-ink-soft uppercase tracking-wider mb-1 flex items-center gap-2">
                        <Medal className="size-4" /> Certificat
                      </p>
                      <h3 className="text-2xl font-black text-ink">{cert.certification.title}</h3>
                      <p className="text-lg font-bold text-sky mt-1">{cert.certification.mention}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-body p-4 rounded-brand-sm border-2 border-border">
                        <p className="text-xs font-bold text-ink-soft uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <User className="size-3.5" /> Décerné à
                        </p>
                        <p className="font-bold text-ink">{cert.student.firstName} {cert.student.lastName}</p>
                      </div>
                      
                      <div className="bg-body p-4 rounded-brand-sm border-2 border-border">
                        <p className="text-xs font-bold text-ink-soft uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <CalendarBlank className="size-3.5" /> Date d&apos;émission
                        </p>
                        <p className="font-bold text-ink">{new Date(cert.certification.issueDate).toLocaleDateString("fr-FR")}</p>
                      </div>
                    </div>

                    <div className="bg-body p-4 rounded-brand-sm border-2 border-border flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-ink-soft uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <Hash className="size-3.5" /> Numéro de série
                        </p>
                        <p className="font-mono font-bold text-ink">{cert.certification.serialCode}</p>
                      </div>
                      <div className="size-12 rounded-lg flex items-center justify-center text-2xl" style={{ background: cert.certification.gradient }}>
                        {cert.certification.emoji}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
