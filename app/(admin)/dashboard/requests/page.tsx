"use client";

import { useCallback, useEffect, useState } from "react";
import { ClipboardCheck, Loader2, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { showToast } from "@/components/ui/toast";
import { apiFetch } from "@/lib/api-fetch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import type { StudentPortfolio, StudentRequest } from "@/lib/types";

type Filter = "all" | "pending" | "certificate" | "hours";

const filterTabs: { id: Filter; label: string }[] = [
  { id: "all", label: "Toutes" },
  { id: "pending", label: "En attente" },
  { id: "certificate", label: "Certificats" },
  { id: "hours", label: "Heures" },
];

export default function StudentRequestsPage() {
  const [requests, setRequests] = useState<StudentRequest[]>([]);
  const [students, setStudents] = useState<StudentPortfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("pending");
  const [actionTarget, setActionTarget] = useState<StudentRequest | null>(null);
  const [actionMode, setActionMode] = useState<"approve" | "refuse">("approve");
  const [notes, setNotes] = useState("");
  const [processing, setProcessing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/student-requests");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur");
      setRequests(data.requests ?? []);
      setStudents(data.students ?? []);
    } catch (e: any) {
      showToast(e.message ?? "Erreur de chargement", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function studentOf(request: StudentRequest) {
    return students.find((s) => s.id === request.studentId);
  }

  async function processAction() {
    if (!actionTarget) return;
    setProcessing(true);
    try {
      const res = await apiFetch(`/api/admin/student-requests/${actionTarget.id}`, {
        method: "PATCH",
        body: JSON.stringify({ action: actionMode, adminNotes: notes.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur");
      setRequests((prev) => prev.map((r) => (r.id === actionTarget.id ? data.request : r)));
      showToast(
        actionMode === "approve" ? "Demande acceptée 🎉" : "Demande refusée",
        actionMode === "approve" ? "success" : "info"
      );
      setActionTarget(null);
      setNotes("");
    } catch (e: any) {
      showToast(e.message ?? "Action impossible", "error");
    } finally {
      setProcessing(false);
    }
  }

  function openAction(request: StudentRequest, mode: "approve" | "refuse") {
    setActionTarget(request);
    setActionMode(mode);
    setNotes("");
  }

  const filtered = requests.filter((r) => {
    if (filter === "pending") return r.status === "pending";
    if (filter === "certificate") return r.type === "certificate";
    if (filter === "hours") return r.type === "hours";
    return true;
  });

  const pendingCount = requests.filter((r) => r.status === "pending").length;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-black text-ink">Demandes des élèves</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Certificats et heures de code à valider {pendingCount > 0 && `· ${pendingCount} en attente`}
          </p>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-bold transition",
              filter === tab.id
                ? "bg-ink text-body"
                : "bg-surface text-ink-soft hover:bg-border"
            )}
          >
            {tab.label}
            {tab.id === "pending" && pendingCount > 0 && (
              <span className="ml-1.5 rounded-full bg-coral px-1.5 text-[10px] font-black text-white">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-brand" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-brand border-2 border-border bg-white dark:bg-surface py-20 text-ink-soft">
          <ClipboardCheck className="mb-4 size-12 opacity-40" />
          <p className="text-lg font-bold">Aucune demande</p>
          <p className="mt-1 text-sm">Les demandes envoyées depuis l&apos;espace parent apparaîtront ici.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((request) => {
            const student = studentOf(request);
            const status = request.status;
            return (
              <div
                key={request.id}
                className={cn(
                  "rounded-brand border-2 bg-white dark:bg-surface p-5",
                  status === "pending" ? "border-amber/40" : "border-border"
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div
                      className="flex size-11 shrink-0 items-center justify-center rounded-xl font-display text-sm font-black text-white"
                      style={{ background: student?.avatarGradient ?? "linear-gradient(135deg,#0284c7,#38bdf8)" }}
                    >
                      {student?.avatar ?? "?"}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-bold text-ink">
                          {student ? `${student.firstName} ${student.lastName}` : "Élève inconnu"}
                        </p>
                        <span className={cn(
                          "rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide",
                          request.type === "hours" ? "bg-lime/10 text-lime" : "bg-amber/10 text-amber"
                        )}>
                          {request.type === "hours" ? "🕒 Heures" : "🏅 Certificat"}
                        </span>
                        {status === "pending" ? (
                          <span className="rounded-full bg-amber/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-amber">
                            En attente
                          </span>
                        ) : status === "accepted" ? (
                          <span className="rounded-full bg-lime/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-lime">
                            Acceptée
                          </span>
                        ) : (
                          <span className="rounded-full bg-coral/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-coral">
                            Refusée
                          </span>
                        )}
                      </div>
                      <p className="mt-1 font-display text-base font-black text-ink">{request.title}</p>
                      <p className="mt-0.5 text-sm text-ink-soft">{request.description}</p>
                      {request.type === "hours" && (
                        <p className="mt-1 text-xs font-black text-lime">+{request.hours}h de code à ajouter</p>
                      )}
                      {request.adminNotes && (
                        <p className="mt-1.5 max-w-xl text-xs italic text-ink-soft">
                          Note admin : {request.adminNotes}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-ink-soft/50">
                        Reçue le {new Date(request.createdAt).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </div>

                  {status === "pending" && (
                    <div className="flex shrink-0 gap-2">
                      <button
                        onClick={() => openAction(request, "approve")}
                        className="inline-flex items-center gap-1.5 rounded-full bg-lime px-4 py-2 text-xs font-black uppercase tracking-wide text-white transition hover:opacity-85"
                      >
                        <Check className="size-4" /> Accepter
                      </button>
                      <button
                        onClick={() => openAction(request, "refuse")}
                        className="inline-flex items-center gap-1.5 rounded-full bg-coral px-4 py-2 text-xs font-black uppercase tracking-wide text-white transition hover:opacity-85"
                      >
                        <X className="size-4" /> Refuser
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={!!actionTarget} onOpenChange={(open) => !open && setActionTarget(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base">
              {actionMode === "approve" ? "Accepter la demande" : "Refuser la demande"}
            </DialogTitle>
            <DialogDescription>
              {actionTarget?.title} — l&apos;élève sera notifié automatiquement du résultat.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder={actionMode === "approve" ? "Note pour l'élève (optionnel) : bravo pour ce projet bonus !" : "Motif du refus (recommandé) : information manquante, etc."}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setActionTarget(null)}
              disabled={processing}
              className="rounded-full border-2 border-border px-5 py-2 text-sm font-bold text-ink-soft transition hover:bg-surface"
            >
              Annuler
            </button>
            <button
              onClick={processAction}
              disabled={processing}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-black uppercase tracking-wide text-white transition disabled:opacity-50",
                actionMode === "approve" ? "bg-lime hover:opacity-85" : "bg-coral hover:opacity-85"
              )}
            >
              {processing && <Loader2 className="size-4 animate-spin" />}
              {actionMode === "approve" ? "Accepter" : "Refuser"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}