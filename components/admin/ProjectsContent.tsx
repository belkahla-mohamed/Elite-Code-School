"use client";

import { useEffect, useState } from "react";
import { Award, ExternalLink, ChevronLeft, ChevronRight, CheckCircle, Clock, LayoutGrid, LayoutList } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { showToast } from "@/components/ui/toast";
import { ViewToggle, useViewMode } from "@/components/ui/view-toggle";

const PAGE_SIZE = 8;

export function ProjectsContent() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useViewMode("projects-view");
  const [cardColumns, setCardColumns] = useState<1 | 2>(2);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/students");
      if (!res.ok) { showToast("Erreur chargement", "error"); return; }
      const data = await res.json();
      setStudents((data.students ?? []).filter((s: any) => s.projects?.length > 0 || s.certifications?.length > 0));
    } catch { showToast("Erreur chargement", "error"); }
    finally { setLoading(false); }
  }

  const totalPages = Math.max(1, Math.ceil(students.length / PAGE_SIZE));
  const paged = students.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function renderTable() {
    return (
      <div className="overflow-x-auto rounded-brand border-2 border-border bg-white dark:bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-border bg-surface text-left">
              <th className="px-5 py-3.5 font-black text-xs uppercase tracking-wider text-ink-soft">Élève</th>
              <th className="px-5 py-3.5 font-black text-xs uppercase tracking-wider text-ink-soft hidden md:table-cell">Niveau</th>
              <th className="px-5 py-3.5 font-black text-xs uppercase tracking-wider text-ink-soft">Projets</th>
              <th className="px-5 py-3.5 font-black text-xs uppercase tracking-wider text-ink-soft hidden md:table-cell">Certifications</th>
              <th className="px-5 py-3.5 font-black text-xs uppercase tracking-wider text-ink-soft text-right">Portfolio</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-border">
            {paged.map((s) => (
              <tr key={s.id} className="hover:bg-surface/50 transition">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-sky to-cyan font-display text-xs font-black text-white">
                      {s.firstName?.[0]}{s.lastName?.[0]}
                    </div>
                    <span className="font-bold text-ink">{s.firstName} {s.lastName}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-ink-soft hidden md:table-cell">{s.levelLabel}</td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-1">
                    {(s.projects ?? []).slice(0, 3).map((p: any, i: number) => (
                      <span key={i} className="inline-flex items-center gap-0.5 rounded-full bg-sky/10 px-2.5 py-0.5 text-xs font-bold text-sky">
                        {p.emoji}{p.title}
                      </span>
                    ))}
                    {(s.projects ?? []).length > 3 && (
                      <span className="text-xs text-ink-soft">+{s.projects.length - 3}</span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-4 hidden md:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {(s.certifications ?? []).slice(0, 2).map((c: any, i: number) => (
                      <span key={i} className="inline-flex items-center gap-0.5 rounded-full bg-lime/10 px-2.5 py-0.5 text-xs font-bold text-lime">
                        {c.emoji}{c.title}
                      </span>
                    ))}
                    {(s.certifications ?? []).length > 2 && (
                      <span className="text-xs text-ink-soft">+{s.certifications.length - 2}</span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-4 text-right">
                  <a href={`/portfolios/${s.slug}`}
                    className="inline-flex items-center gap-1 rounded-full border-2 border-border px-4 py-1.5 text-xs font-bold text-ink-soft hover:border-sky hover:text-sky transition">
                    <ExternalLink className="size-3" /> Voir
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  function renderCards() {
    return (
      <div className={cardColumns === 2 ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"}>
        {paged.map((s) => (
          <div key={s.id} className="rounded-brand border-2 border-border bg-white dark:bg-surface p-5 transition hover:shadow-sm">
            <div className="mb-4 flex items-center gap-4">
              <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-sky to-cyan font-display text-sm font-black text-white">
                {s.firstName?.[0]}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-ink">{s.firstName} {s.lastName}</h3>
                <p className="text-xs text-ink-soft">{s.levelLabel}</p>
              </div>
              <a href={`/portfolios/${s.slug}`}
                className="inline-flex items-center gap-1 rounded-full bg-sky/10 px-4 py-2 text-xs font-bold text-sky transition hover:bg-sky hover:text-white">
                <ExternalLink className="size-3" />
                Portfolio
              </a>
            </div>
            {(s.projects ?? []).length > 0 && (
              <div className="mb-3">
                <p className="mb-2 text-xs font-black uppercase tracking-wide text-ink-soft flex items-center gap-1.5">
                  <CheckCircle className="size-3 text-sky" /> Projets ({s.projects.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {s.projects.map((p: any, i: number) => (
                    <span key={i} className="inline-flex items-center gap-1 rounded-full bg-sky/10 px-3 py-1 text-xs font-bold text-sky">
                      {p.emoji && <span>{p.emoji}</span>}
                      {p.title}
                      {p.status === "completed" && <CheckCircle className="size-3 text-lime ml-0.5" />}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {(s.certifications ?? []).length > 0 && (
              <div>
                <p className="mb-2 text-xs font-black uppercase tracking-wide text-ink-soft flex items-center gap-1.5">
                  <Award className="size-3 text-lime" /> Certifications ({s.certifications.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {s.certifications.map((c: any, i: number) => (
                    <span key={i} className="inline-flex items-center gap-1 rounded-full bg-lime/10 px-3 py-1 text-xs font-bold text-lime">
                      {c.emoji && <span>{c.emoji}</span>}
                      {c.title}
                      {c.mention && <Badge variant="success" size="sm">{c.mention}</Badge>}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {(s.projects ?? []).length === 0 && (s.certifications ?? []).length === 0 && (
              <p className="text-sm text-ink-soft italic">Aucun contenu</p>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-black text-ink">Projets & Certifications</h2>
          <p className="text-sm text-ink-soft">Consultez les projets et certifications des élèves</p>
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

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-brand" />
          ))}
        </div>
      ) : paged.length > 0 ? (
        <>
          {viewMode === "table" ? renderTable() : renderCards()}
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
        <div className="flex flex-col items-center justify-center py-20 text-ink-soft rounded-brand border-2 border-border bg-white dark:bg-surface">
          <Award className="mb-4 size-12 opacity-40" />
          <p className="font-bold text-lg">Aucun projet ou certification</p>
          <p className="text-sm mt-1">Les élèves n&apos;ont pas encore ajouté de contenu.</p>
        </div>
      )}
    </div>
  );
}
