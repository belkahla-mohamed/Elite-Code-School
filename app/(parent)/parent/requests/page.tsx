"use client";

import { useCallback, useEffect, useState } from "react";
import { useParentStudent } from "@/hooks/useParentStudent";
import { Breadcrumb } from "@/components/layout/parent-nav";
import { Skeleton } from "@/components/ui/skeleton";
import { showToast } from "@/components/ui/toast";
import { apiFetch } from "@/lib/api-fetch";
import type { StudentRequest } from "@/lib/types";
import { User, ClipboardCheck, Clock, Award, Loader2 } from "lucide-react";
import Link from "next/link";

const certEmojis = ["🏅", "🎨", "🚀", "🤖", "🎮", "💡", "🧩", "🐍", "🌍", "⚡"];
const certGradients = [
  "linear-gradient(135deg,#f59e0b,#f97316)",
  "linear-gradient(135deg,#2563EB,#06B6D4)",
  "linear-gradient(135deg,#8B5CF6,#FB7185)",
  "linear-gradient(135deg,#059669,#84CC16)",
  "linear-gradient(135deg,#EC4899,#8B5CF6)",
];

const statusConfig: Record<string, { label: string; classes: string; dot: string }> = {
  pending: { label: "En attente", classes: "bg-amber/10 text-amber", dot: "bg-amber" },
  accepted: { label: "Acceptée", classes: "bg-lime/10 text-lime", dot: "bg-lime" },
  refused: { label: "Refusée", classes: "bg-coral/10 text-coral", dot: "bg-coral" },
};

export default function ParentRequestsPage() {
  const { student, loading, error } = useParentStudent();
  const [requests, setRequests] = useState<StudentRequest[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [certTitle, setCertTitle] = useState("");
  const [certDescription, setCertDescription] = useState("");
  const [certEmoji, setCertEmoji] = useState(certEmojis[0]);
  const [certGradient, setCertGradient] = useState(certGradients[0]);

  const [hoursTitle, setHoursTitle] = useState("");
  const [hoursDescription, setHoursDescription] = useState("");
  const [hoursCount, setHoursCount] = useState("2");

  const loadRequests = useCallback(async () => {
    setPageLoading(true);
    try {
      const res = await fetch("/api/parent/requests");
      if (!res.ok) throw new Error("Erreur de chargement");
      const data = await res.json();
      setRequests(data.requests ?? []);
    } catch {
      showToast("Erreur de chargement des demandes", "error");
    } finally {
      setPageLoading(false);
    }
  }, []);

  useEffect(() => {
    if (student) loadRequests();
  }, [student, loadRequests]);

  async function sendRequest(payload: Record<string, unknown>) {
    setSending(true);
    try {
      const res = await apiFetch("/api/parent/requests", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur lors de l'envoi");
      setRequests((prev) => [data.request, ...prev]);
      showToast("Demande envoyée à l'administration 🚀", "success");
      return true;
    } catch (e: any) {
      showToast(e.message ?? "Erreur lors de l'envoi", "error");
      return false;
    } finally {
      setSending(false);
    }
  }

  async function submitCertificate() {
    const ok = await sendRequest({
      type: "certificate",
      title: certTitle,
      description: certDescription,
      certificateTitle: certTitle,
      certificateEmoji: certEmoji,
      certificateGradient: certGradient,
    });
    if (ok) {
      setCertTitle("");
      setCertDescription("");
    }
  }

  async function submitHours() {
    const ok = await sendRequest({
      type: "hours",
      title: hoursTitle,
      description: hoursDescription,
      hours: Number(hoursCount),
    });
    if (ok) {
      setHoursTitle("");
      setHoursDescription("");
      setHoursCount("2");
    }
  }

  if (loading) {
    return (
      <div>
        <Skeleton className="mb-6 h-4 w-40" />
        <Skeleton className="mb-6 h-24 w-full rounded-brand" />
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-brand" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Breadcrumb items={[{ label: "Espace parent", href: "/parent" }, { label: "Demandes" }]} />
        <div className="mx-auto max-w-md rounded-brand border-2 border-border bg-white dark:bg-surface p-8 text-center">
          <User className="mx-auto size-12 text-ink-soft/40" />
          <h2 className="mt-4 font-display text-xl font-bold text-ink">{error}</h2>
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
        { label: "Demandes" }
      ]} />

      <div className="mb-6 overflow-hidden rounded-brand bg-gradient-to-br from-amber via-orange-400 to-coral p-6 text-white md:p-8">
        <div className="flex items-center gap-4">
          <div className="grid size-14 place-items-center rounded-2xl bg-white/20 text-3xl">📬</div>
          <div>
            <h1 className="font-display text-2xl font-black tracking-tight">Certificats &amp; Heures de code</h1>
            <p className="text-sm text-white/85">
              Envoie ta demande, l&apos;administration la valide, et tu suis le statut en temps réel !
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8 grid gap-5 md:grid-cols-2">
        {/* Form certificate */}
        <div className="rounded-brand border-2 border-border bg-white dark:bg-surface p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-amber/10 text-amber">
              <Award className="size-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-black text-ink">Demander un certificat</h2>
              <p className="text-xs font-semibold text-ink-soft">
                Ajouter ou modifier un certificat dans le portfolio
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="cert-title" className="mb-1.5 block text-xs font-black uppercase tracking-wide text-ink-soft">
                Titre du certificat
              </label>
              <input
                id="cert-title"
                value={certTitle}
                onChange={(e) => setCertTitle(e.target.value)}
                placeholder="Ex : Robotique avancée — Niveau 2"
                className="w-full rounded-xl border-2 border-border bg-white px-4 py-2.5 text-sm font-semibold outline-none transition focus:border-sky"
              />
            </div>
            <div>
              <label htmlFor="cert-desc" className="mb-1.5 block text-xs font-black uppercase tracking-wide text-ink-soft">
                Justificatif
              </label>
              <textarea
                id="cert-desc"
                value={certDescription}
                onChange={(e) => setCertDescription(e.target.value)}
                rows={3}
                placeholder="Explique pourquoi ce certificat : projet final validé, compétition, etc."
                className="w-full rounded-xl border-2 border-border bg-white px-4 py-2.5 text-sm font-semibold outline-none transition focus:border-sky"
              />
            </div>
            <div>
              <span className="mb-1.5 block text-xs font-black uppercase tracking-wide text-ink-soft">Emoji</span>
              <div className="flex flex-wrap gap-1.5">
                {certEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setCertEmoji(emoji)}
                    className={`grid size-10 place-items-center rounded-xl border-2 text-lg transition ${certEmoji === emoji ? "border-sky bg-sky/10" : "border-border bg-surface hover:border-sky"}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1.5 block text-xs font-black uppercase tracking-wide text-ink-soft">Couleur</p>
              <div className="flex gap-2">
                {certGradients.map((gradient) => (
                  <button
                    key={gradient}
                    onClick={() => setCertGradient(gradient)}
                    className={`size-10 rounded-xl transition ${certGradient === gradient ? "ring-2 ring-sky ring-offset-2" : ""}`}
                    style={{ background: gradient }}
                    aria-label="Choisir la couleur"
                  />
                ))}
              </div>
            </div>
            <button
              onClick={submitCertificate}
              disabled={sending || !certTitle || certDescription.length < 10}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-amber px-6 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:opacity-90 disabled:opacity-40"
            >
              {sending ? <Loader2 className="size-4 animate-spin" /> : <Award className="size-4" />}
              Envoyer la demande
            </button>
          </div>
        </div>

        {/* Form hours */}
        <div className="rounded-brand border-2 border-border bg-white dark:bg-surface p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-lime/10 text-lime">
              <Clock className="size-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-black text-ink">Ajouter des heures de code</h2>
              <p className="text-xs font-semibold text-ink-soft">
                Projet bonus fait à la maison ? Fais valider tes heures !
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="hours-title" className="mb-1.5 block text-xs font-black uppercase tracking-wide text-ink-soft">
                Titre de la demande
              </label>
              <input
                id="hours-title"
                value={hoursTitle}
                onChange={(e) => setHoursTitle(e.target.value)}
                placeholder="Ex : Projet bonus — Robot aide-jardinier"
                className="w-full rounded-xl border-2 border-border bg-white px-4 py-2.5 text-sm font-semibold outline-none transition focus:border-sky"
              />
            </div>
            <div>
              <label htmlFor="hours-count" className="mb-1.5 block text-xs font-black uppercase tracking-wide text-ink-soft">
                Heures à ajouter
              </label>
              <div className="flex gap-2">
                {["2", "4", "6", "8"].map((h) => (
                  <button
                    key={h}
                    onClick={() => setHoursCount(h)}
                    className={`flex-1 rounded-xl border-2 py-2.5 font-display text-lg font-black transition ${hoursCount === h ? "border-lime bg-lime/10 text-lime" : "border-border bg-surface text-ink-soft hover:border-lime"}`}
                  >
                    +{h}h
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="hours-desc" className="mb-1.5 block text-xs font-black uppercase tracking-wide text-ink-soft">
                Justificatif
              </label>
              <textarea
                id="hours-desc"
                value={hoursDescription}
                onChange={(e) => setHoursDescription(e.target.value)}
                rows={3}
                placeholder="Décris le travail réalisé : projet bonus à la maison, tutoriel suivi, etc."
                className="w-full rounded-xl border-2 border-border bg-white px-4 py-2.5 text-sm font-semibold outline-none transition focus:border-sky"
              />
            </div>
            <button
              onClick={submitHours}
              disabled={sending || !hoursTitle || hoursDescription.length < 10}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-lime px-6 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:opacity-85 disabled:opacity-40"
            >
              {sending ? <Loader2 className="size-4 animate-spin" /> : <Clock className="size-4" />}
              Demander l&apos;ajustement
            </button>
          </div>
        </div>
      </div>

      {/* History with live status */}
      <div className="rounded-brand border-2 border-border bg-white dark:bg-surface p-6 md:p-8">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-sky/10 text-sky">
            <ClipboardCheck className="size-5" />
          </div>
          <div>
            <h2 className="font-display text-lg font-black text-ink">Suivi de mes demandes</h2>
            <p className="text-xs font-semibold text-ink-soft">
              {requests.length > 0
                ? `${requests.filter((r) => r.status === "pending").length} demande(s) en attente`
                : "Aucune demande envoyée pour le moment"}
            </p>
          </div>
        </div>

        {pageLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-2xl" />
            ))}
          </div>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-surface px-6 py-12 text-center">
            <div className="text-5xl">🗒️</div>
            <p className="mt-3 font-display text-lg font-bold text-ink">Aucune demande</p>
            <p className="mt-1 text-sm text-ink-soft">Utilise les formulaires ci-dessus pour commencer.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((request) => {
              const status = statusConfig[request.status] ?? statusConfig.pending;
              return (
                <div
                  key={request.id}
                  className="flex items-start gap-4 rounded-2xl border-2 border-border bg-surface p-4"
                >
                  <div
                    className="grid size-12 shrink-0 place-items-center rounded-xl text-xl text-white"
                    style={{ background: request.type === "hours" ? "linear-gradient(135deg,#059669,#84CC16)" : request.certificateGradient ?? "linear-gradient(135deg,#f59e0b,#f97316)" }}
                  >
                    {request.type === "hours" ? "🕒" : (request.certificateEmoji ?? "🏅")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-base font-black text-ink">{request.title}</h3>
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${status.classes}`}>
                        <span className={`size-1.5 rounded-full ${status.dot}`} />
                        {status.label}
                      </span>
                    </div>
                    <p className="mt-1 text-sm leading-5 text-ink-soft">{request.description}</p>
                    {request.type === "hours" && (
                      <p className="mt-1.5 text-xs font-black text-lime">+{request.hours}h de code</p>
                    )}
                    {request.adminNotes && (
                      <div className="mt-2 rounded-xl border-2 border-border bg-white p-3 text-xs font-semibold text-ink-soft">
                        <span className="font-black uppercase tracking-wide text-ink">💬 Note de l&apos;administration : </span>
                        {request.adminNotes}
                      </div>
                    )}
                    <p className="mt-2 text-[11px] font-semibold text-ink-soft/70">
                      Envoyée le {formatDate(request.createdAt)}
                      {request.processedAt && ` · Traitée le ${formatDate(request.processedAt)}`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-MA", { day: "numeric", month: "short", year: "numeric" });
}