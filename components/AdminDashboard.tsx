"use client";

import { useEffect, useState, useMemo } from "react";
import type { DashboardSnapshot } from "@/lib/types";
import {
  Users, GraduationCap, BookOpen, CheckCircle, XCircle,
  Activity, ChevronRight, PanelTop, Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { showToast } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorBoundary } from "@/components/ui/error-boundary";

function StatCardSkeleton() {
  return (
    <div className="dash-card border-l-4 border-l-border-subtle">
      <Skeleton className="mb-3 size-10 rounded-brand-sm" />
      <Skeleton className="mb-1 h-8 w-16" />
      <Skeleton className="h-4 w-20" />
    </div>
  );
}

function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="size-9 rounded-brand-sm shrink-0" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
      ))}
    </div>
  );
}

const statCards = [
  { label: "Total Élèves", key: "students" as const, icon: GraduationCap, color: "border-l-sky" },
  { label: "En Attente", key: "pending" as const, icon: Users, color: "border-l-amber" },
  { label: "Demandes", key: "total" as const, icon: BookOpen, color: "border-l-lime" },
];

export function AdminDashboard() {
  const [snapshot, setSnapshot] = useState<DashboardSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [confirmAction, setConfirmAction] = useState<{ id: string; action: "accept" | "reject" } | null>(null);
  const [processingDashboard, setProcessingDashboard] = useState(false);
  const [createdSecret, setCreatedSecret] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [requestsRes, studentsRes] = await Promise.all([
        fetch("/api/inscriptions"),
        fetch("/api/students"),
      ]);
      if (!requestsRes.ok || !studentsRes.ok) {
        showToast("Erreur chargement données", "error");
        return;
      }
      const requestsData = await requestsRes.json();
      const studentsData = await studentsRes.json();
      setSnapshot({
        requests: requestsData.requests ?? [],
        students: studentsData.students ?? [],
        programs: [],
        categories: [],
      });
      fetch("/api/activity-log").then((r) => r.json()).then((data) => {
        if (data.activities) setActivities(data.activities);
      }).catch(() => {});
    } catch {
      showToast("Erreur chargement données", "error");
    } finally {
      setLoading(false);
    }
  }

  async function updateRequest(id: string, action: "accept" | "reject") {
    setProcessingDashboard(true);
    setConfirmAction(null);
    const res = await fetch(`/api/inscriptions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    const result = await res.json();
    if (!res.ok) {
      showToast(result.error ?? "Action impossible", "error");
      setProcessingDashboard(false);
      return;
    }
    showToast(action === "accept" ? "Demande acceptée" : "Demande refusée", "success");
    if (result.parentSecret) setCreatedSecret(result.parentSecret);
    await loadData();
    setProcessingDashboard(false);
  }


  const pending = useMemo(
    () => (snapshot?.requests ?? []).filter((r) => r.status === "pending"),
    [snapshot]
  );

  const filteredRequests = useMemo(() => {
    if (!snapshot) return [];
    let items = snapshot.requests;
    if (statusFilter !== "all") items = items.filter((r) => r.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (r) =>
          r.studentFirstName.toLowerCase().includes(q) ||
          r.studentLastName.toLowerCase().includes(q) ||
          r.parentEmail.toLowerCase().includes(q)
      );
    }
    return items;
  }, [snapshot, search, statusFilter]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <StatCardSkeleton key={i} />)}
        </div>
        <div className="grid gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2 dash-card">
            <Skeleton className="mb-5 h-6 w-48" />
            <TableSkeleton rows={5} />
          </div>
          <div className="dash-card">
            <Skeleton className="mb-5 h-6 w-32" />
            <TableSkeleton rows={4} />
          </div>
        </div>
      </div>
    );
  }

  if (!snapshot) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-ink-soft">
        <PanelTop className="mb-4 size-12" />
        <p className="font-bold">Impossible de charger les données</p>
        <Button variant="secondary" className="mt-4" onClick={loadData}>
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
    <div className="space-y-6">
      {createdSecret && (
        <div className="rounded-brand-sm bg-amber/15 p-4 text-sm text-amber">
          Secret parent généré: <strong className="font-mono">{createdSecret}</strong>. À transmettre au parent une seule fois.
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {statCards.map((card) => (
          <div key={card.key} className={`dash-card border-l-4 ${card.color}`}>
            <div className="mb-3 flex items-center justify-between">
              <span className={`flex size-10 items-center justify-center rounded-brand-sm bg-${card.key === "students" ? "sky" : card.key === "pending" ? "amber" : "lime"}/10 text-${card.key === "students" ? "sky" : card.key === "pending" ? "amber" : "lime"}`}>
                <card.icon className="size-5" />
              </span>
            </div>
            <p className="font-display text-3xl font-black text-ink">
              {card.key === "students" ? snapshot.students.length : card.key === "pending" ? pending.length : snapshot.requests.length}
            </p>
            <p className="mt-1 text-sm font-bold text-ink-soft">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 dash-card">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-lg font-black text-ink">Demandes d&apos;inscription</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-44 rounded-full border-2 border-border bg-body py-1.5 pl-9 pr-3 text-sm text-ink outline-none transition focus:border-sky"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-full border-2 border-border bg-body px-3 py-1.5 text-sm text-ink outline-none transition focus:border-sky"
              >
                <option value="all">Tous</option>
                <option value="pending">En attente</option>
                <option value="accepted">Acceptés</option>
                <option value="refused">Refusés</option>
              </select>
              <a
                href="/admin/enrollments"
                className="inline-flex items-center gap-1 rounded-full bg-sky/10 px-4 py-2 text-xs font-black uppercase tracking-wide text-sky transition hover:bg-sky hover:text-white shrink-0"
              >
                Voir tout <ChevronRight className="size-3" />
              </a>
            </div>
          </div>

          {filteredRequests.length > 0 ? (
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
                  {filteredRequests.slice(0, 8).map((request) => (
                    <tr key={request.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="flex size-9 items-center justify-center rounded-brand-sm bg-sky/10 font-display text-sm font-black text-sky">
                            {request.studentFirstName[0]}{request.studentLastName[0]}
                          </div>
                          <span className="font-bold text-ink">{request.studentFirstName} {request.studentLastName}</span>
                        </div>
                      </td>
                      <td className="text-ink-soft">{request.parentEmail}</td>
                      <td className="text-ink-soft">{request.age} ans</td>
                      <td>
                        <Badge variant={request.status === "pending" ? "pending" : request.status === "accepted" ? "accepted" : "rejected"} size="sm">
                          {request.status === "pending" ? "En attente" : request.status === "accepted" ? "Accepté" : "Refusé"}
                        </Badge>
                      </td>
                      <td>
                        {request.status === "pending" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => setConfirmAction({ id: request.id, action: "accept" })}
                              className="flex size-8 items-center justify-center rounded-full bg-lime/10 text-lime transition hover:bg-lime hover:text-white"
                              title="Accepter"
                            >
                              <CheckCircle className="size-4" />
                            </button>
                            <button
                              onClick={() => setConfirmAction({ id: request.id, action: "reject" })}
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
          ) : (
            <div className="flex flex-col items-center py-14 text-ink-soft">
              <PanelTop className="mb-3 size-10" />
              <p className="font-bold">Aucune demande d&apos;inscription</p>
            </div>
          )}
        </div>

        <div className="dash-card">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-lg font-black text-ink">Activité récente</h2>
            <span className="flex size-8 items-center justify-center rounded-full bg-sky/10 text-sky">
              <Activity className="size-4" />
            </span>
          </div>
          {activities.length > 0 ? (
            <div className="space-y-3">
              {activities.slice(0, 7).map((a) => (
                <div key={a.id} className="flex items-start gap-3 rounded-brand-sm bg-body p-3 transition hover:bg-sky/5">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface text-sm">
                    {a.type === "student" ? "👤" : a.type === "request" ? "📋" : "📦"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-ink">{a.description}</p>
                    <p className="text-xs text-ink-soft">
                      {new Date(a.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-14 text-ink-soft">
              <Activity className="mb-3 size-10" />
              <p className="font-bold">Aucune activité</p>
            </div>
          )}
        </div>
      </div>

      {confirmAction && (
        <ConfirmDialog
          title={confirmAction.action === "accept" ? "Accepter l'inscription" : "Refuser l'inscription"}
          description={
            confirmAction.action === "accept"
              ? "L&apos;élève sera inscrit et un accès parent sera généré."
              : "L'inscription sera définitivement refusée."
          }
          confirmLabel={confirmAction.action === "accept" ? "Accepter" : "Refuser"}
          variant={confirmAction.action === "accept" ? "default" : "danger"}
          loading={processingDashboard}
          onConfirm={() => updateRequest(confirmAction.id, confirmAction.action)}
          onCancel={() => setConfirmAction(null)}
        />
      )}
    </div>
    </ErrorBoundary>
  );
}

