"use client";

import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import type { DashboardSnapshot } from "@/lib/types";
import { Users, GraduationCap, BookOpen, CheckCircle, XCircle, Pulse, CaretRight, Browser, MagnifyingGlass, TrendUp, CurrencyDollar, FolderOpen, Lightbulb } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { showToast } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { NotificationIcon } from "@/components/ui/notification-icon";

const BarChart = dynamic(() => import("recharts").then((m) => m.BarChart), { ssr: false })
const Bar = dynamic(() => import("recharts").then((m) => m.Bar), { ssr: false })
const XAxis = dynamic(() => import("recharts").then((m) => m.XAxis), { ssr: false })
const YAxis = dynamic(() => import("recharts").then((m) => m.YAxis), { ssr: false })
const Tooltip = dynamic(() => import("recharts").then((m) => m.Tooltip), { ssr: false })
const ResponsiveContainer = dynamic(() => import("recharts").then((m) => m.ResponsiveContainer), { ssr: false })
const LineChart = dynamic(() => import("recharts").then((m) => m.LineChart), { ssr: false })
const Line = dynamic(() => import("recharts").then((m) => m.Line), { ssr: false })
const CartesianGrid = dynamic(() => import("recharts").then((m) => m.CartesianGrid), { ssr: false })

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
  { label: "Total Élèves", key: "totalStudents" as const, icon: Users, accent: "bg-sky", bg: "bg-sky/10 text-sky" },
  { label: "Revenu Mensuel", key: "revenue" as const, icon: CurrencyDollar, accent: "bg-lime", bg: "bg-lime/10 text-lime" },
  { label: "En Attente", key: "pendingRequests" as const, icon: BookOpen, accent: "bg-amber", bg: "bg-amber/10 text-amber" },
  { label: "Taux Complétion", key: "completionRate" as const, icon: CheckCircle, accent: "bg-violet", bg: "bg-violet/10 text-violet" },
  { label: "Programmes", key: "totalPrograms" as const, icon: Lightbulb, accent: "bg-pink", bg: "bg-pink/10 text-pink" },
  { label: "Acceptées", key: "acceptedRequests" as const, icon: GraduationCap, accent: "bg-mint", bg: "bg-mint/10 text-mint" },
];

export function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [confirmAction, setConfirmAction] = useState<{ id: string; action: "accept" | "reject" } | null>(null);
  const [processingDashboard, setProcessingDashboard] = useState(false);
  const [createdSecret, setCreatedSecret] = useState("");
  const [chartsReady, setChartsReady] = useState(false);

  useEffect(() => { loadData(); }, []);

  // Recharts v3 measures its container before layout settles on first paint → 0-width charts.
  // Mount charts one frame after the cards are laid out.
  useEffect(() => {
    const id = requestAnimationFrame(() => setChartsReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [dashRes, actRes] = await Promise.all([
        fetch("/api/dashboard"),
        fetch("/api/activity-log"),
      ]);
      if (dashRes.ok) {
        const d = await dashRes.json();
        setData(d);
      } else {
        showToast("Erreur chargement données", "error");
      }
      if (actRes.ok) {
        const a = await actRes.json();
        setActivities(a.activities ?? []);
      }
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

  const pendingList = useMemo(() => (data?.recentRequests ?? []).filter((r: any) => r.status === "pending"), [data]);

  const filteredRequests = useMemo(() => {
    if (!data?.recentRequests) return [];
    let items = data.recentRequests;
    if (statusFilter !== "all") items = items.filter((r: any) => r.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (r: any) =>
          r.studentFirstName.toLowerCase().includes(q) ||
          r.studentLastName.toLowerCase().includes(q) ||
          r.parentEmail.toLowerCase().includes(q)
      );
    }
    return items;
  }, [data, search, statusFilter]);

  function renderStatValue(key: string) {
    if (!data) return "—";
    const s = data.stats;
    switch (key) {
      case "totalStudents": return String(s.totalStudents);
      case "revenue": return `${s.monthlyRevenue.toLocaleString()} DH`;
      case "pendingRequests": return String(s.pendingRequests);
      case "completionRate": return `${s.completionRate}%`;
      case "totalPrograms": return String(s.totalPrograms);
      case "acceptedRequests": return String(s.acceptedRequests);
      default: return "—";
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => <StatCardSkeleton key={i} />)}
        </div>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="dash-card min-w-0 xl:col-span-2">
            <Skeleton className="mb-5 h-6 w-48" />
            <TableSkeleton rows={5} />
          </div>
          <div className="dash-card min-w-0">
            <Skeleton className="mb-5 h-6 w-32" />
            <TableSkeleton rows={4} />
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-ink-soft">
        <Browser className="mb-4 size-12" />
        <p className="font-bold">Impossible de charger les données</p>
        <Button variant="secondary" className="mt-4" onClick={loadData}>
          Réessayer
        </Button>
      </div>
    );
  }

  const hasChartData = data.studentsByProgram?.length > 0;
  const hasGrowthData = data.growthData?.some((d: any) => d.count > 0);

  return (
    <ErrorBoundary>
    <div className="space-y-6">
      {createdSecret && (
        <div className="rounded-brand-sm bg-amber/15 p-4 text-sm text-amber">
          Secret parent généré: <strong className="font-mono">{createdSecret}</strong>. À transmettre au parent une seule fois.
        </div>
      )}

      {/* 6 stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {statCards.map((card) => (
          <div key={card.key} className="dash-card relative overflow-hidden p-5">
            <span className={`absolute inset-x-0 top-0 h-1 ${card.accent}`} />
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="font-display text-2xl font-black text-ink">
                  {renderStatValue(card.key)}
                </p>
                <p className="mt-1 truncate text-sm font-bold text-ink-soft">{card.label}</p>
              </div>
              <span className={`flex size-10 shrink-0 items-center justify-center rounded-brand-sm ${card.bg}`}>
                <card.icon className="size-5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Growth chart */}
        <div className="dash-card min-w-0">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendUp className="size-4 text-sky" />
              <h3 className="font-display font-black text-ink">Croissance (6 mois)</h3>
            </div>
          </div>
          {hasGrowthData ? (
            chartsReady ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={data.growthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6b7280" }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={2.5} dot={{ r: 3, fill: "#4f46e5" }} name="Élèves" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px]" />
            )
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-ink-soft/60">
              <TrendUp className="size-8" />
              <p className="text-sm font-bold">Aucune inscription sur les 6 derniers mois</p>
            </div>
          )}
        </div>

        {/* Program distribution */}
        <div className="dash-card min-w-0">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderOpen className="size-4 text-violet" />
              <h3 className="font-display font-black text-ink">Élèves par programme</h3>
            </div>
          </div>
          {hasChartData ? (
            chartsReady ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data.studentsByProgram} layout="vertical" margin={{ left: 0, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: "#6b7280" }} />
                  <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11, fill: "#6b7280" }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#4f46e5" radius={[0, 6, 6, 0]} name="Élèves" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px]" />
            )
          ) : (
            <div className="flex items-center justify-center py-12 text-ink-soft/50"><FolderOpen className="size-8" /></div>
          )}
        </div>
      </div>

      {/* Bottom section: requests + activity */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="dash-card min-w-0 xl:col-span-2">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-lg font-black text-ink">Demandes récentes</h2>
            <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:gap-3">
              <div className="relative min-w-0 flex-1 sm:flex-none">
                <MagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-full min-w-0 rounded-full border-2 border-border bg-body py-1.5 pl-9 pr-3 text-sm text-ink outline-none transition focus:border-sky sm:w-36"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="shrink-0 rounded-full border-2 border-border bg-body px-3 py-1.5 text-sm text-ink outline-none transition focus:border-sky"
              >
                <option value="all">Tous</option>
                <option value="pending">En attente</option>
                <option value="accepted">Acceptés</option>
                <option value="refused">Refusés</option>
              </select>
              <a
                href="/admin/enrollments"
                className="inline-flex shrink-0 items-center gap-1 rounded-full bg-sky/10 px-4 py-2 text-xs font-black uppercase tracking-wide text-sky transition hover:bg-sky hover:text-white"
              >
                Voir tout <CaretRight className="size-3" />
              </a>
            </div>
          </div>

          {filteredRequests.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Élève</th>
                    <th className="hidden lg:table-cell">Parent</th>
                    <th className="hidden 2xl:table-cell">Âge</th>
                    <th className="hidden lg:table-cell">Statut</th>
                    <th className="text-right lg:text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.slice(0, 8).map((request: any) => {
                    const statusLabel = request.status === "pending" ? "En attente" : request.status === "accepted" ? "Accepté" : "Refusé"
                    const statusVariant = request.status === "pending" ? "pending" : request.status === "accepted" ? "accepted" : "rejected"
                    return (
                    <tr key={request.id}>
                      <td>
                        <div className="flex items-start gap-3">
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-brand-sm bg-sky/10 font-display text-sm font-black text-sky">
                            {request.studentFirstName[0]}{request.studentLastName[0]}
                          </div>
                          <div className="min-w-0">
                            <span className="block font-bold text-ink lg:truncate">{request.studentFirstName} {request.studentLastName}</span>
                            {request.parentEmail && (
                              <span className="block break-all text-xs text-ink-soft lg:hidden">{request.parentEmail}</span>
                            )}
                            <span className="mt-1 block lg:hidden">
                              <Badge variant={statusVariant} size="sm">{statusLabel}</Badge>
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="hidden text-ink-soft lg:table-cell">{request.parentEmail}</td>
                      <td className="hidden text-ink-soft 2xl:table-cell">{request.age} ans</td>
                      <td className="hidden lg:table-cell">
                        <Badge variant={statusVariant} size="sm">{statusLabel}</Badge>
                      </td>
                      <td className="text-right lg:text-left">
                        {request.status === "pending" && (
                          <div className="flex justify-end gap-2 lg:justify-start">
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
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center py-14 text-ink-soft">
              <Browser className="mb-3 size-10" />
              <p className="font-bold">Aucune demande d&apos;inscription</p>
            </div>
          )}
        </div>

        <div className="dash-card min-w-0">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-lg font-black text-ink">Activité récente</h2>
            <span className="flex size-8 items-center justify-center rounded-full bg-sky/10 text-sky">
              <Pulse className="size-4" />
            </span>
          </div>
          {activities.length > 0 ? (
            <div className="space-y-3">
              {activities.slice(0, 7).map((a: any) => (
                <div key={a.id} className="flex items-start gap-3 rounded-brand-sm bg-body p-3 transition hover:bg-sky/5">
                  <NotificationIcon type={a.type} className="size-8" />
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
              <Pulse className="mb-3 size-10" />
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
              ? "L'élève sera inscrit et un accès parent sera généré."
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
