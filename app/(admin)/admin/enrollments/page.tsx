"use client";

import { useState, useEffect, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { showToast } from "@/components/ui/toast";
import { ViewToggle, useViewMode } from "@/components/ui/view-toggle";
import { Skeleton } from "@/components/ui/skeleton";
import { downloadCsv } from "@/lib/csv-export";
import { apiFetch } from "@/lib/api-fetch";
import { cn } from "@/lib/utils";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle, XCircle, Clock, ChevronDown, ChevronUp,
  Mail, Phone, User, CalendarDays, Download, ArrowUpDown,
  Square, CheckSquare, FileText, LayoutGrid, LayoutList
} from "lucide-react";

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
  adminNotes?: string;
  rejectionMessage?: string;
}

interface Program {
  id: string;
  title: string;
}

type Filter = "all" | "pending" | "accepted" | "refused";

const statusConfig: Record<string, { variant: "pending" | "accepted" | "rejected"; label: string; icon: any; color: string }> = {
  pending: { variant: "pending", label: "En attente", icon: Clock, color: "bg-amber/10 text-amber" },
  accepted: { variant: "accepted", label: "Accepté", icon: CheckCircle, color: "bg-lime/10 text-lime" },
  refused: { variant: "rejected", label: "Refusé", icon: XCircle, color: "bg-coral/10 text-coral" },
};

export default function EnrollmentsPage() {
  const [requests, setRequests] = useState<InscriptionRequest[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useViewMode("enrollments-view");
  const [cardColumns, setCardColumns] = useState<1 | 2>(2);
  const [sortBy, setSortBy] = useState<"date" | "name" | "status">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [programMap, setProgramMap] = useState<Record<string, string>>({});
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"accept" | "reject">("accept");
  const [dialogIds, setDialogIds] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [rejectionMsg, setRejectionMsg] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/inscriptions").then((r) => r.json()),
      fetch("/api/programs").then((r) => r.json()),
    ]).then(([inscriptions, programs]) => {
      setRequests(inscriptions.requests ?? []);
      const map: Record<string, string> = {};
      const list = Array.isArray(programs) ? programs : (programs as any)?.programs ?? [];
      for (const p of list) map[p.id] = p.title;
      setProgramMap(map);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    let list = filter === "all" ? requests : requests.filter((r) => r.status === filter);
    return [...list].sort((a, b) => {
      let cmp = 0;
      if (sortBy === "date") cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      else if (sortBy === "name") cmp = `${a.studentLastName} ${a.studentFirstName}`.localeCompare(`${b.studentLastName} ${b.studentFirstName}`);
      else if (sortBy === "status") cmp = a.status.localeCompare(b.status);
      return sortDir === "desc" ? -cmp : cmp;
    });
  }, [requests, filter, sortBy, sortDir]);
  const pendingCount = requests.filter((r) => r.status === "pending").length;

  function toggleSort(field: typeof sortBy) {
    if (sortBy === field) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setSortBy(field); setSortDir("desc"); }
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((r) => r.id)));
    }
  }

  function openActionModal(mode: "accept" | "reject", ids: string[]) {
    setNotes("");
    setRejectionMsg("");
    setDialogMode(mode);
    setDialogIds(ids);
    setDialogOpen(true);
  }

  async function executeAction() {
    const mode = dialogMode;
    const ids = dialogIds;
    setDialogOpen(false);

    if (ids.length === 1) {
      const id = ids[0];
      setProcessingId(id);
      const res = await apiFetch(`/api/inscriptions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: mode === "accept" ? "accept" : "reject",
          notes: notes || undefined,
          rejectionMessage: mode === "reject" ? (rejectionMsg || undefined) : undefined,
        }),
      });
      if (res.ok) {
        const newStatus = mode === "accept" ? "accepted" : "refused";
        setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: newStatus, adminNotes: notes || r.adminNotes, rejectionMessage: rejectionMsg || r.rejectionMessage } : r));
        showToast(mode === "accept" ? "Demande acceptée" : "Demande refusée", mode === "accept" ? "success" : "info");
      } else showToast("Erreur lors du traitement", "error");
      setProcessingId(null);
      return;
    }

    const res = await apiFetch("/api/inscriptions/batch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: mode === "accept" ? "accept" : "reject",
        ids,
        rejectionMessage: mode === "reject" ? (rejectionMsg || undefined) : undefined,
      }),
    });
    if (res.ok) {
      const newStatus = mode === "accept" ? "accepted" : "refused";
      setRequests((prev) => prev.map((r) => ids.includes(r.id) ? { ...r, status: newStatus } : r));
      setSelectedIds(new Set());
      showToast(`${ids.length} demande(s) ${mode === "accept" ? "acceptée(s)" : "refusée(s)"}`, mode === "accept" ? "success" : "info");
    } else showToast("Erreur lors du traitement", "error");
  }

  const filters = [
    { key: "all" as Filter, label: "Toutes", count: requests.length },
    { key: "pending" as Filter, label: "En attente", count: pendingCount },
    { key: "accepted" as Filter, label: "Acceptées", count: requests.filter((r) => r.status === "accepted").length },
    { key: "refused" as Filter, label: "Refusées", count: requests.filter((r) => r.status === "refused").length },
  ];

  function renderTable() {
    return (
      <div className="overflow-x-auto rounded-brand border-2 border-border bg-white dark:bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-border bg-surface text-left">
              <th className="px-3 py-3.5 w-10">
                <button onClick={toggleSelectAll} className="text-ink-soft hover:text-ink transition">
                  {selectedIds.size === filtered.length && filtered.length > 0 ? <CheckSquare className="size-4" /> : <Square className="size-4" />}
                </button>
              </th>
              <th className="px-3 py-3.5 font-black text-xs uppercase tracking-wider text-ink-soft">
                <button onClick={() => toggleSort("name")} className="flex items-center gap-1 hover:text-ink transition">
                  Élève <ArrowUpDown className="size-3" />
                </button>
              </th>
              <th className="px-3 py-3.5 font-black text-xs uppercase tracking-wider text-ink-soft hidden md:table-cell">Âge</th>
              <th className="px-3 py-3.5 font-black text-xs uppercase tracking-wider text-ink-soft hidden lg:table-cell">Parent</th>
              <th className="px-3 py-3.5 font-black text-xs uppercase tracking-wider text-ink-soft hidden lg:table-cell">Tél</th>
              <th className="px-3 py-3.5 font-black text-xs uppercase tracking-wider text-ink-soft">
                <button onClick={() => toggleSort("status")} className="flex items-center gap-1 hover:text-ink transition">
                  Statut <ArrowUpDown className="size-3" />
                </button>
              </th>
              <th className="px-3 py-3.5 font-black text-xs uppercase tracking-wider text-ink-soft hidden sm:table-cell">
                <button onClick={() => toggleSort("date")} className="flex items-center gap-1 hover:text-ink transition">
                  Date <ArrowUpDown className="size-3" />
                </button>
              </th>
              <th className="px-3 py-3.5 font-black text-xs uppercase tracking-wider text-ink-soft text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-border">
            {filtered.map((req) => {
              const st = statusConfig[req.status];
              const StatusIcon = st.icon;
              const isProcessing = processingId === req.id;
              const isSelected = selectedIds.has(req.id);
              return (
                <tr key={req.id} className={cn("hover:bg-surface/50 transition", isSelected && "bg-sky/5")}>
                  <td className="px-3 py-4">
                    <button onClick={() => toggleSelect(req.id)} className="text-ink-soft hover:text-ink transition">
                      {isSelected ? <CheckSquare className="size-4 text-sky" /> : <Square className="size-4" />}
                    </button>
                  </td>
                  <td className="px-3 py-4">
                    <span className="font-bold text-ink">{req.studentFirstName} {req.studentLastName}</span>
                  </td>
                  <td className="px-3 py-4 text-ink-soft hidden md:table-cell">{req.age} ans</td>
                  <td className="px-3 py-4 text-ink-soft hidden lg:table-cell">{req.parentEmail}</td>
                  <td className="px-3 py-4 text-ink-soft hidden lg:table-cell">{req.parentPhone}</td>
                  <td className="px-3 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${st.color}`}>
                      <StatusIcon className="size-3" />
                      {st.label}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-ink-soft hidden sm:table-cell">
                    {new Date(req.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-3 py-4 text-right">
                    {req.status === "pending" ? (
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openActionModal("accept", [req.id])} disabled={isProcessing}
                          className="rounded-full bg-lime px-4 py-1.5 text-xs font-black uppercase tracking-wide text-white hover:bg-lime/90 transition disabled:opacity-50">
                          Accepter
                        </button>
                        <button onClick={() => openActionModal("reject", [req.id])} disabled={isProcessing}
                          className="rounded-full bg-coral/10 px-4 py-1.5 text-xs font-black uppercase tracking-wide text-coral hover:bg-coral/20 transition disabled:opacity-50">
                          Refuser
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setExpanded(expanded === req.id ? null : req.id)}
                        className="text-ink-soft hover:text-ink transition">
                        {expanded === req.id ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  function renderCards() {
    return (
      <div className={cardColumns === 2 ? "grid grid-cols-1 md:grid-cols-2 gap-3" : "space-y-3"}>
        {filtered.map((req) => {
          const isOpen = expanded === req.id;
          const st = statusConfig[req.status];
          const StatusIcon = st.icon;
          const isProcessing = processingId === req.id;
          const isSelected = selectedIds.has(req.id);
          return (
            <div key={req.id} className={cn("rounded-brand border-2 border-border bg-white dark:bg-surface overflow-hidden transition hover:shadow-sm", isSelected && "border-sky bg-sky/5")}>
              <div className="flex items-start gap-3 px-5 pt-4">
                <button onClick={() => toggleSelect(req.id)} className="mt-1 text-ink-soft hover:text-ink transition shrink-0">
                  {isSelected ? <CheckSquare className="size-4 text-sky" /> : <Square className="size-4" />}
                </button>
                <button onClick={() => setExpanded(isOpen ? null : req.id)}
                  className="flex-1 flex items-center justify-between text-left hover:bg-surface/50 transition">
                  <div className="flex items-center gap-4">
                    <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-sky to-cyan font-display text-sm font-black text-white">
                      {req.studentFirstName[0]}{req.studentLastName[0]}
                    </div>
                    <div>
                      <span className="font-bold text-ink">{req.studentFirstName} {req.studentLastName}</span>
                      <p className="text-xs text-ink-soft">{req.age} ans · {programMap[req.programId] || req.programId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${st.color}`}>
                      <StatusIcon className="size-3" />
                      {st.label}
                    </span>
                    {isOpen ? <ChevronUp className="size-4 text-ink-soft" /> : <ChevronDown className="size-4 text-ink-soft" />}
                  </div>
                </button>
              </div>
              {isOpen && (
                <div className="px-5 pb-5 border-t-2 border-border pt-4 mt-4 space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="size-4 text-ink-soft" />
                      <span className="text-ink-soft">Parent:</span>
                      <span className="font-semibold text-ink">{req.parentEmail}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="size-4 text-ink-soft" />
                      <span className="text-ink-soft">Tél:</span>
                      <span className="font-semibold text-ink">{req.parentPhone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="size-4 text-ink-soft" />
                      <span className="text-ink-soft">Niveau:</span>
                      <span className="font-semibold text-ink">{req.schoolLevel || "—"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="size-4 text-ink-soft" />
                      <span className="text-ink-soft">Date:</span>
                      <span className="font-semibold text-ink">{new Date(req.createdAt).toLocaleDateString("fr-FR")}</span>
                    </div>
                  </div>
                  {req.message && (
                    <p className="text-sm text-ink-soft italic bg-surface rounded-brand-sm p-3">&ldquo;{req.message}&rdquo;</p>
                  )}
                  {req.adminNotes && (
                    <div className="flex items-start gap-2 text-sm">
                      <FileText className="size-4 text-ink-soft mt-0.5 shrink-0" />
                      <div>
                        <span className="text-ink-soft font-bold text-xs uppercase tracking-wider">Note interne:</span>
                        <p className="text-ink mt-0.5">{req.adminNotes}</p>
                      </div>
                    </div>
                  )}
                  {req.rejectionMessage && (
                    <div className="flex items-start gap-2 text-sm rounded-brand-sm bg-coral/5 p-3">
                      <XCircle className="size-4 text-coral mt-0.5 shrink-0" />
                      <div>
                        <span className="text-coral font-bold text-xs uppercase tracking-wider">Message au parent:</span>
                        <p className="text-ink mt-0.5">{req.rejectionMessage}</p>
                      </div>
                    </div>
                  )}
                  {req.status === "pending" && (
                    <div className="flex gap-3 pt-1">
                      <button onClick={() => openActionModal("accept", [req.id])} disabled={isProcessing}
                        className="rounded-full bg-lime px-5 py-2 text-sm font-black uppercase tracking-wide text-white hover:bg-lime/90 transition disabled:opacity-50 flex items-center gap-2">
                        <CheckCircle className="size-4" />
                        Accepter
                      </button>
                      <button onClick={() => openActionModal("reject", [req.id])} disabled={isProcessing}
                        className="rounded-full bg-coral/10 px-5 py-2 text-sm font-black uppercase tracking-wide text-coral hover:bg-coral/20 transition disabled:opacity-50 flex items-center gap-2">
                        <XCircle className="size-4" />
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
    );
  }

  return (
    <div>
      {/* Action Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "accept" ? "Accepter la demande" : "Refuser la demande"}
            </DialogTitle>
            <DialogDescription>
              {dialogIds.length === 1 ? `Confirmer pour ${requests.find((r) => r.id === dialogIds[0])?.studentFirstName ?? ""} ?` : `${dialogIds.length} demande(s) sélectionnée(s)`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <label className="block text-xs font-bold text-ink-soft uppercase tracking-wider mb-1">Note interne (optionnelle)</label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                rows={2} placeholder="Commentaire interne..."
              />
            </div>
            {dialogMode === "reject" && (
              <div>
                <label className="block text-xs font-bold text-ink-soft uppercase tracking-wider mb-1">Message au parent (optionnel)</label>
                <Textarea value={rejectionMsg} onChange={(e) => setRejectionMsg(e.target.value)}
                  rows={2} placeholder="Expliquer le motif du refus..."
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <button className="rounded-full border-2 border-border px-4 py-2 text-sm font-bold text-ink-soft hover:border-sky transition">Annuler</button>
            </DialogClose>
            <button onClick={executeAction}
              className={cn("rounded-full px-4 py-2 text-sm font-black uppercase tracking-wide text-white transition",
                dialogMode === "accept" ? "bg-lime hover:bg-lime/90" : "bg-coral hover:bg-coral/90")}>
              {dialogMode === "accept" ? "Accepter" : "Refuser"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl font-black text-ink">Inscriptions</h1>
          <p className="text-sm text-ink-soft mt-1">Gérez les demandes d&apos;inscription</p>
        </div>
        <div className="flex items-center gap-3">
          {pendingCount > 0 && (
            <span className="rounded-full bg-amber/15 px-4 py-1.5 text-sm font-bold text-amber flex items-center gap-1.5">
              <Clock className="size-4" />
              {pendingCount} en attente
            </span>
          )}
          {filtered.length > 0 && (
            <button onClick={() => downloadCsv(filtered.map((r) => ({
              Prénom: r.studentFirstName, Nom: r.studentLastName, Âge: r.age,
              Niveau: r.schoolLevel || "", Téléphone: r.parentPhone, Email: r.parentEmail,
              Statut: r.status === "pending" ? "En attente" : r.status === "accepted" ? "Accepté" : "Refusé",
              Date: new Date(r.createdAt).toLocaleDateString("fr-FR"),
            })), "inscriptions.csv")}
              className="btn-outline py-1.5 text-xs">
              <Download className="mr-1 inline size-3" /> CSV
            </button>
          )}
          <div className="flex items-center gap-1 text-xs text-ink-soft">
            <button onClick={() => toggleSort("date")}
              className={`rounded-full px-2.5 py-1 font-bold transition ${sortBy === "date" ? "bg-sky/10 text-sky" : "hover:text-ink"}`}>
              Date {sortBy === "date" ? (sortDir === "desc" ? "↓" : "↑") : ""}
            </button>
            <button onClick={() => toggleSort("name")}
              className={`rounded-full px-2.5 py-1 font-bold transition ${sortBy === "name" ? "bg-sky/10 text-sky" : "hover:text-ink"}`}>
              Nom {sortBy === "name" ? (sortDir === "desc" ? "↓" : "↑") : ""}
            </button>
            <button onClick={() => toggleSort("status")}
              className={`rounded-full px-2.5 py-1 font-bold transition ${sortBy === "status" ? "bg-sky/10 text-sky" : "hover:text-ink"}`}>
              Statut {sortBy === "status" ? (sortDir === "desc" ? "↓" : "↑") : ""}
            </button>
          </div>
          {viewMode === "cards" && (
            <div className="flex items-center rounded-full border-2 border-border bg-white dark:bg-surface p-0.5">
              <button onClick={() => setCardColumns(1)}
                className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold transition ${cardColumns === 1 ? "bg-sky text-white shadow-sm" : "text-ink-soft hover:text-ink"}`}>
                <LayoutList className="size-3.5" /> 1
              </button>
              <button onClick={() => setCardColumns(2)}
                className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold transition ${cardColumns === 2 ? "bg-sky text-white shadow-sm" : "text-ink-soft hover:text-ink"}`}>
                <LayoutGrid className="size-3.5" /> 2
              </button>
            </div>
          )}
          <ViewToggle mode={viewMode} onChange={setViewMode} />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {filters.map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition ${
              filter === f.key ? "bg-sky text-white shadow-sm" : "bg-white dark:bg-surface border-2 border-border text-ink-soft hover:border-sky"
            }`}>
            {f.label}
            <span className="ml-1.5 text-xs opacity-70">({f.count})</span>
          </button>
        ))}
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="mb-4 flex items-center gap-3 rounded-brand border-2 border-sky bg-sky/5 px-4 py-3">
          <span className="text-sm font-bold text-ink">
            {selectedIds.size} sélectionnée(s)
          </span>
          <button onClick={() => openActionModal("accept", Array.from(selectedIds))}
            className="rounded-full bg-lime px-4 py-1.5 text-xs font-black uppercase tracking-wide text-white hover:bg-lime/90 transition">
            Accepter toutes
          </button>
          <button onClick={() => openActionModal("reject", Array.from(selectedIds))}
            className="rounded-full bg-coral/10 px-4 py-1.5 text-xs font-black uppercase tracking-wide text-coral hover:bg-coral/20 transition">
            Refuser toutes
          </button>
          <button onClick={() => setSelectedIds(new Set())}
            className="ml-auto text-xs font-bold text-ink-soft hover:text-ink transition">
            Annuler
          </button>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-brand" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-ink-soft">
          <Clock className="size-12 mb-3 opacity-40" />
          <p className="font-bold text-lg">Aucune demande trouvée</p>
          <p className="text-sm mt-1">Aucune demande ne correspond à vos critères.</p>
        </div>
      ) : viewMode === "table" ? renderTable() : renderCards()}
    </div>
  );
}
