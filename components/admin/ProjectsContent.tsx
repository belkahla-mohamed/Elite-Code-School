"use client";

import { useEffect, useState } from "react";
import { Award, PanelTop, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { showToast } from "@/components/ui/toast";

const PAGE_SIZE = 8;

export function ProjectsContent() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-black text-ink">Projets & Certifications</h2>
        <p className="text-sm text-ink-soft">Consultez les projets et certifications des élèves</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="dash-card animate-pulse">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-full bg-sky/10" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-40 rounded bg-sky/10" />
                  <div className="h-3 w-64 rounded bg-sky/5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : paged.length > 0 ? (
        <>
          <div className="space-y-4">
            {paged.map((s) => (
              <div key={s.id} className="dash-card">
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-sky to-cyan font-display text-sm font-black text-white">
                    {s.firstName[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-ink">{s.firstName} {s.lastName}</h3>
                    <p className="text-xs text-ink-soft">{s.levelLabel}</p>
                  </div>
                  <a href={`/portfolio/${s.slug}`} className="inline-flex items-center gap-1 rounded-full bg-sky/10 px-4 py-2 text-xs font-bold text-sky transition hover:bg-sky hover:text-white">
                    <ExternalLink className="size-3" />
                    Portfolio
                  </a>
                </div>
                {(s.projects ?? []).length > 0 && (
                  <div className="mb-3">
                    <p className="mb-2 text-xs font-black uppercase tracking-wide text-ink-soft">Projets</p>
                    <div className="flex flex-wrap gap-2">
                      {s.projects.map((p: any, i: number) => (
                        <span key={i} className="inline-flex items-center gap-1 rounded-full bg-sky/10 px-3 py-1 text-xs font-bold text-sky">
                          {p.emoji && <span>{p.emoji}</span>}
                          {p.title}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {(s.certifications ?? []).length > 0 && (
                  <div>
                    <p className="mb-2 text-xs font-black uppercase tracking-wide text-ink-soft">Certifications</p>
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
          <Award className="mb-4 size-12" />
          <p className="font-bold text-lg">Aucun projet ou certification</p>
          <p className="text-sm mt-1">Les élèves n&apos;ont pas encore ajouté de contenu.</p>
        </div>
      )}
    </div>
  );
}
