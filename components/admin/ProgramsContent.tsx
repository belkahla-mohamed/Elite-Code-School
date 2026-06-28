"use client";

import { useEffect, useState } from "react";
import { BookOpen, Plus, PanelTop, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showToast } from "@/components/ui/toast";

const PAGE_SIZE = 8;

export function ProgramsContent() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/programs");
      if (!res.ok) { showToast("Erreur chargement", "error"); return; }
      const data = await res.json();
      setPrograms(data.programs ?? []);
    } catch { showToast("Erreur chargement", "error"); }
    finally { setLoading(false); }
  }

  const totalPages = Math.max(1, Math.ceil(programs.length / PAGE_SIZE));
  const paged = programs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-black text-ink">Programmes</h2>
          <p className="text-sm text-ink-soft">Gérez les programmes pédagogiques</p>
        </div>
        <Button>
          <Plus className="size-4" />
          Nouveau programme
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="dash-card animate-pulse">
              <div className="h-5 w-48 rounded bg-sky/10 mb-3" />
              <div className="h-3 w-full rounded bg-sky/5 mb-2" />
              <div className="h-3 w-3/4 rounded bg-sky/5" />
            </div>
          ))}
        </div>
      ) : paged.length > 0 ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            {paged.map((p) => (
              <div key={p.id} className="dash-card">
                <div className="flex items-start gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-brand-sm bg-sky/10 text-xl">
                    {p.emoji ?? "📖"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-ink">{p.title}</h3>
                    {p.description && (
                      <p className="mt-1 text-sm text-ink-soft line-clamp-2">{p.description}</p>
                    )}
                    <div className="mt-3 flex items-center gap-3 text-xs text-ink-soft">
                      {p.levels && <span>{p.levels} niveaux</span>}
                      {p.duration && <span>{p.duration}</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-1">
              <p className="text-sm text-ink-soft">Page {page} sur {totalPages}</p>
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
          <BookOpen className="mb-4 size-12" />
          <p className="font-bold text-lg">Aucun programme</p>
          <p className="text-sm mt-1">Créez votre premier programme.</p>
        </div>
      )}
    </div>
  );
}
