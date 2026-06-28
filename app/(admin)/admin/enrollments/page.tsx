"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { showToast } from "@/components/ui/toast";

interface InscriptionRequest {
  id: string;
  studentFirstName: string;
  studentLastName: string;
  age: number;
  schoolLevel?: string;
  programId: string;
  parentPhone: string;
  parentEmail: string;
  message?: string;
  status: "pending" | "accepted" | "refused";
  createdAt: string;
}

type Filter = "all" | "pending" | "accepted" | "refused";

const statusMap: Record<string, { variant: "pending" | "accepted" | "rejected"; label: string }> = {
  pending: { variant: "pending", label: "En attente" },
  accepted: { variant: "accepted", label: "Accepté" },
  refused: { variant: "rejected", label: "Refusé" },
};

export default function EnrollmentsPage() {
  const [requests, setRequests] = useState<InscriptionRequest[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/inscriptions").then((r) => r.json()).then((data) => {
      setRequests(data.requests ?? []);
      setLoading(false);
    });
  }, []);

  const filtered = filter === "all" ? requests : requests.filter((r) => r.status === filter);
  const pendingCount = requests.filter((r) => r.status === "pending").length;

  async function handleAccept(id: string) {
    setProcessingId(id);
    const res = await fetch(`/api/inscriptions/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "accept" }) });
    if (res.ok) {
      setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: "accepted" } : r));
      showToast("Demande acceptée avec succès", "success");
    } else {
      showToast("Erreur lors de l'acceptation", "error");
    }
    setProcessingId(null);
  }

  async function handleReject(id: string) {
    setProcessingId(id);
    const res = await fetch(`/api/inscriptions/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "reject" }) });
    if (res.ok) {
      setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: "refused" } : r));
      showToast("Demande refusée", "info");
    } else {
      showToast("Erreur lors du refus", "error");
    }
    setProcessingId(null);
  }

  const filters: { key: Filter; label: string; count?: number }[] = [
    { key: "all", label: "Toutes", count: requests.length },
    { key: "pending", label: "En attente", count: pendingCount },
    { key: "accepted", label: "Acceptées", count: requests.filter((r) => r.status === "accepted").length },
    { key: "refused", label: "Refusées", count: requests.filter((r) => r.status === "refused").length },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-black text-ink">Inscriptions</h1>
        {pendingCount > 0 && (
          <span className="rounded-full bg-amber/15 px-4 py-1.5 text-sm font-bold text-amber">
            {pendingCount} en attente
          </span>
        )}
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition ${
              filter === f.key ? "bg-sky text-white" : "bg-white dark:bg-surface border-2 border-[#E8EEF6] dark:border-border text-ink-soft hover:border-sky"
            }`}
          >
            {f.label} {f.count !== undefined && <span className="ml-1 text-xs opacity-70">({f.count})</span>}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-ink-soft">Chargement...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-ink-soft">Aucune demande trouvée.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((req) => {
            const isOpen = expanded === req.id;
            const st = statusMap[req.status];
            return (
              <div key={req.id} className="rounded-brand border-2 border-[#E8EEF6] dark:border-border bg-white dark:bg-surface overflow-hidden">
                <button
                  onClick={() => setExpanded(isOpen ? null : req.id)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-surface transition"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-display font-black text-ink">{req.studentFirstName} {req.studentLastName}</span>
                    <span className="text-sm text-ink-soft">{req.age} ans</span>
                    <Badge variant={st.variant} size="sm">{st.label}</Badge>
                  </div>
                  <span className="text-sm text-ink-soft">{new Date(req.createdAt).toLocaleDateString("fr-FR")}</span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 border-t-2 border-[#E8EEF6] dark:border-border pt-4 space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2 text-sm">
                      <div><span className="font-bold text-ink-soft">Parent:</span> {req.parentEmail}</div>
                      <div><span className="font-bold text-ink-soft">Tél:</span> {req.parentPhone}</div>
                      <div><span className="font-bold text-ink-soft">Niveau:</span> {req.schoolLevel || "—"}</div>
                      <div><span className="font-bold text-ink-soft">Programme:</span> {req.programId}</div>
                    </div>
                    {req.message && <p className="text-sm text-ink-soft italic">&ldquo;{req.message}&rdquo;</p>}
                    {req.status === "pending" && (
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => handleAccept(req.id)}
                          disabled={processingId === req.id}
                          className="rounded-full bg-lime px-5 py-2 text-sm font-black uppercase tracking-wide text-white hover:bg-lime/90 transition disabled:opacity-50"
                        >
                          Accepter
                        </button>
                        <button
                          onClick={() => handleReject(req.id)}
                          disabled={processingId === req.id}
                          className="rounded-full bg-coral/10 px-5 py-2 text-sm font-black uppercase tracking-wide text-coral hover:bg-coral/20 transition disabled:opacity-50"
                        >
                          Refuser
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
