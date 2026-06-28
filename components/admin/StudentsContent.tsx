"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Search, ChevronLeft, ChevronRight, PanelTop, ExternalLink, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { showToast } from "@/components/ui/toast";

const PAGE_SIZE = 12;

export function StudentsContent() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/students");
      if (!res.ok) { showToast("Erreur chargement", "error"); return; }
      const data = await res.json();
      setStudents(data.students ?? []);
    } catch { showToast("Erreur chargement", "error"); }
    finally { setLoading(false); }
  }

  const filtered = useMemo(() => {
    if (!search.trim()) return students;
    const q = search.toLowerCase();
    return students.filter((s) =>
      s.firstName.toLowerCase().includes(q) ||
      s.lastName.toLowerCase().includes(q) ||
      (s.levelLabel && s.levelLabel.toLowerCase().includes(q))
    );
  }, [students, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-black text-ink">Élèves</h2>
        <p className="text-sm text-ink-soft">Gérez les dossiers et portfolios des élèves</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Rechercher un élève..."
            className="w-full rounded-full border-2 border-border bg-body py-2.5 pl-10 pr-4 text-sm text-ink outline-none transition focus:border-sky"
          />
        </div>
        <span className="text-sm text-ink-soft">
          {filtered.length} élève{filtered.length > 1 ? "s" : ""}
        </span>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="dash-card animate-pulse">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-full bg-sky/10" />
                <div className="flex-1 space-y-1">
                  <div className="h-4 w-32 rounded bg-sky/10" />
                  <div className="h-3 w-20 rounded bg-sky/5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : paged.length > 0 ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paged.map((s) => (
              <div key={s.id} className="dash-card">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-sky to-cyan font-display text-lg font-black text-white">
                      {s.avatar || s.firstName[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-ink">{s.firstName} {s.lastName}</h3>
                      <p className="text-xs text-ink-soft">{s.levelLabel ?? "Niveau non défini"}</p>
                    </div>
                  </div>
                  <Badge variant={s.isPublic ? "success" : "pending"} size="sm">
                    {s.isPublic ? "Public" : "Privé"}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/students/${s.id}`}
                    className="inline-flex flex-1 items-center justify-center gap-1 rounded-full border-2 border-border bg-surface px-4 py-2 text-xs font-bold text-ink transition hover:border-sky hover:text-sky"
                  >
                    <Settings className="size-3" />
                    Gérer
                  </Link>
                  <Link
                    href={`/portfolio/${s.slug}`}
                    className="inline-flex flex-1 items-center justify-center gap-1 rounded-full bg-sky px-4 py-2 text-xs font-black uppercase tracking-wide text-white transition hover:bg-sky-dark"
                  >
                    <ExternalLink className="size-3" />
                    Portfolio
                  </Link>
                </div>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-1">
              <p className="text-sm text-ink-soft">
                Page {page} sur {totalPages}
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
      ) : (
        <div className="dash-card flex flex-col items-center py-20 text-ink-soft">
          <PanelTop className="mb-4 size-12" />
          <p className="font-bold text-lg">Aucun élève</p>
          <p className="text-sm mt-1">Aucun élève ne correspond à vos critères.</p>
        </div>
      )}
    </div>
  );
}
