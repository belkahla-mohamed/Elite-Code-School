"use client";

import { useEffect, useState } from "react";
import { Search, Activity, UserPlus, FileText, Award, ClipboardList, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showToast } from "@/components/ui/toast";
import { downloadCsv } from "@/lib/csv-export";

interface ActivityEntry {
  id: string;
  type: "student" | "project" | "certification" | "request";
  action: string;
  description: string;
  createdAt: string;
}

const typeIcons: Record<string, { icon: typeof Activity; bg: string; fg: string }> = {
  student: { icon: UserPlus, bg: "bg-sky/10", fg: "text-sky" },
  project: { icon: Award, bg: "bg-amber/10", fg: "text-amber" },
  certification: { icon: FileText, bg: "bg-lime/10", fg: "text-lime" },
  request: { icon: ClipboardList, bg: "bg-purple/10", fg: "text-purple" },
};

const typeLabels: Record<string, string> = {
  all: "Tous",
  student: "Élèves",
  project: "Projets",
  certification: "Certifications",
  request: "Inscriptions",
};

const PAGE_SIZE = 15;

export default function ActivityPage() {
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/activity-log");
      if (!res.ok) { showToast("Erreur chargement", "error"); return; }
      const data = await res.json();
      setActivities(data.activities ?? []);
    } catch { showToast("Erreur chargement", "error"); }
    finally { setLoading(false); }
  }

  const filtered = activities.filter((a) => {
    if (typeFilter !== "all" && a.type !== typeFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return a.action.toLowerCase().includes(q) || a.description.toLowerCase().includes(q);
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const typeCounts = activities.reduce((acc, a) => {
    acc[a.type] = (acc[a.type] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
      <div>
        <h1 className="font-display text-2xl font-black text-ink">Journal d&apos;activité</h1>
        <p className="text-sm text-ink-soft">Historique complet des actions administrateurs</p>
      </div>
      {filtered.length > 0 && (
        <button onClick={() => downloadCsv(filtered.map((a) => ({
          Date: new Date(a.createdAt).toLocaleString("fr-FR"),
          Type: typeLabels[a.type] || a.type,
          Action: a.action,
          Description: a.description,
        })), "activite.csv")}
          className="btn-outline py-1.5 text-xs shrink-0">
          <Download className="mr-1 inline size-3" /> CSV
        </button>
      )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Rechercher dans l'activité..."
            className="w-full rounded-full border-2 border-border bg-body py-2.5 pl-10 pr-4 text-sm text-ink outline-none transition focus:border-sky"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {["all", "student", "project", "certification", "request"].map((t) => (
            <button
              key={t}
              onClick={() => { setTypeFilter(t); setPage(1); }}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition ${
                typeFilter === t
                  ? "bg-sky text-white"
                  : "border-2 border-border bg-white dark:bg-surface text-ink-soft hover:border-sky"
              }`}
            >
              {typeLabels[t]}
              {t !== "all" && typeCounts[t] !== undefined && (
                <span className="ml-1.5 opacity-70">({typeCounts[t]})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Activity List */}
      {loading ? (
        <div className="dash-card space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="size-9 rounded-full bg-sky/10" />
              <div className="flex-1 space-y-1">
                <div className="h-4 w-48 rounded bg-sky/10" />
                <div className="h-3 w-24 rounded bg-sky/5" />
              </div>
            </div>
          ))}
        </div>
      ) : paged.length === 0 ? (
        <div className="dash-card flex flex-col items-center py-16 text-ink-soft">
          <Activity className="mb-4 size-12" />
          <p className="font-bold text-lg">Aucune activité</p>
          <p className="text-sm mt-1">Aucune activité ne correspond à vos critères.</p>
        </div>
      ) : (
        <>
          <div className="dash-card p-0">
            <div className="divide-y-2 divide-border">
              {paged.map((entry) => {
                const meta = typeIcons[entry.type] ?? typeIcons.student;
                const Icon = meta.icon;
                return (
                  <div key={entry.id} className="flex items-start gap-4 px-5 py-4 transition hover:bg-sky/[0.02]">
                    <div className={`flex size-10 shrink-0 items-center justify-center rounded-full ${meta.bg}`}>
                      <Icon className={`size-4 ${meta.fg}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-ink">{entry.action}</p>
                      <p className="text-sm text-ink-soft">{entry.description}</p>
                      <p className="mt-0.5 text-xs text-ink-soft/60">
                        {new Date(entry.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <span className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wide ${meta.bg} ${meta.fg}`}>
                      {typeLabels[entry.type] ?? entry.type}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-ink-soft">
                Page {page} sur {totalPages} — {filtered.length} entrée{filtered.length > 1 ? "s" : ""}
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
        </>
      )}
    </div>
  );
}
