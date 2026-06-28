"use client";

import { useEffect, useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, CheckCircle, XCircle, PanelTop } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { showToast } from "@/components/ui/toast";

const PAGE_SIZE = 10;

interface Inscription {
  id: string;
  studentFirstName: string;
  studentLastName: string;
  parentEmail: string;
  age: number;
  status: string;
}

export function InscriptionsContent() {
  const [requests, setRequests] = useState<Inscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [confirmAction, setConfirmAction] = useState<{ id: string; action: "accept" | "refuse" } | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/inscriptions");
      if (!res.ok) { showToast("Erreur chargement", "error"); return; }
      const data = await res.json();
      setRequests(data.requests ?? []);
    } catch { showToast("Erreur chargement", "error"); }
    finally { setLoading(false); }
  }

  async function updateRequest(id: string, action: "accept" | "refuse") {
    setConfirmAction(null);
    const res = await fetch(`/api/inscriptions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    if (!res.ok) { showToast("Action impossible", "error"); return; }
    showToast(action === "accept" ? "Demande acceptée" : "Demande refusée", "success");
    if (action === "accept") {
      const data = await res.json();
      if (data.parentSecret) showToast(`Secret parent: ${data.parentSecret}`, "info");
    }
    await load();
  }

  const filtered = useMemo(() => {
    let items = requests;
    if (statusFilter !== "all") items = items.filter((r) => r.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter((r) =>
        r.studentFirstName.toLowerCase().includes(q) ||
        r.studentLastName.toLowerCase().includes(q) ||
        r.parentEmail.toLowerCase().includes(q)
      );
    }
    return items;
  }, [requests, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-black text-ink">Inscriptions</h2>
        <p className="text-sm text-ink-soft">Gérez les demandes d&apos;inscription</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Rechercher un élève ou email parent..."
            className="w-full rounded-full border-2 border-border bg-body py-2.5 pl-10 pr-4 text-sm text-ink outline-none transition focus:border-sky"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="rounded-full border-2 border-border bg-body px-4 py-2.5 text-sm text-ink outline-none transition focus:border-sky"
        >
          <option value="all">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="accepted">Acceptés</option>
          <option value="refused">Refusés</option>
        </select>
      </div>

      {loading ? (
        <div className="dash-card">
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="size-9 rounded-brand-sm bg-sky/10" />
                <div className="flex-1 space-y-1">
                  <div className="h-4 w-40 rounded bg-sky/10" />
                  <div className="h-3 w-24 rounded bg-sky/5" />
                </div>
                <div className="h-6 w-20 rounded-full bg-sky/10" />
              </div>
            ))}
          </div>
        </div>
      ) : paged.length > 0 ? (
        <div className="dash-card p-0">
          <div className="overflow-x-auto">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Élève</th>
                  <th>Parent</th>
                  <th>Âge</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-brand-sm bg-sky/10 font-display text-sm font-black text-sky">
                          {r.studentFirstName[0]}{r.studentLastName[0]}
                        </div>
                        <span className="font-bold text-ink">{r.studentFirstName} {r.studentLastName}</span>
                      </div>
                    </td>
                    <td className="text-ink-soft">{r.parentEmail}</td>
                    <td className="text-ink-soft">{r.age} ans</td>
                    <td>
                      <Badge variant={r.status === "pending" ? "pending" : r.status === "accepted" ? "accepted" : "rejected"} size="sm">
                        {r.status === "pending" ? "En attente" : r.status === "accepted" ? "Accepté" : "Refusé"}
                      </Badge>
                    </td>
                    <td>
                      {r.status === "pending" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setConfirmAction({ id: r.id, action: "accept" })}
                            className="flex size-8 items-center justify-center rounded-full bg-lime/10 text-lime transition hover:bg-lime hover:text-white"
                            title="Accepter"
                          >
                            <CheckCircle className="size-4" />
                          </button>
                          <button
                            onClick={() => setConfirmAction({ id: r.id, action: "refuse" })}
                            className="flex size-8 items-center justify-center rounded-full bg-coral/10 text-coral transition hover:bg-coral hover:text-white"
                            title="Refuser"
                          >
                            <XCircle className="size-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t-2 border-border px-4 py-3">
              <p className="text-sm text-ink-soft">
                Page {page} sur {totalPages} — {filtered.length} résultat{(filtered.length) > 1 ? "s" : ""}
              </p>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                  <ChevronLeft className="size-4" />
                </Button>
                <Button variant="secondary" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="dash-card flex flex-col items-center py-20 text-ink-soft">
          <PanelTop className="mb-4 size-12" />
          <p className="font-bold text-lg">Aucune demande</p>
          <p className="text-sm mt-1">Aucune demande ne correspond à vos critères.</p>
        </div>
      )}

      {confirmAction && (
        <ConfirmDialog
          title={confirmAction.action === "accept" ? "Accepter l&apos;inscription" : "Refuser l&apos;inscription"}
          description={
            confirmAction.action === "accept"
              ? "L&apos;élève sera inscrit et un accès parent sera généré."
              : "L&apos;inscription sera définitivement refusée."
          }
          confirmLabel={confirmAction.action === "accept" ? "Accepter" : "Refuser"}
          variant={confirmAction.action === "accept" ? "default" : "danger"}
          onConfirm={() => updateRequest(confirmAction.id, confirmAction.action)}
          onCancel={() => setConfirmAction(null)}
        />
      )}
    </div>
  );
}
