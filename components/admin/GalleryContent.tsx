"use client";

import { useEffect, useState } from "react";
import { Image as ImageIcon, User, ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { showToast } from "@/components/ui/toast";
import { ViewToggle, useViewMode } from "@/components/ui/view-toggle";

const PAGE_SIZE = 6;

export function GalleryContent() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useViewMode("gallery-view");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/students");
      if (!res.ok) { showToast("Erreur chargement", "error"); return; }
      const data = await res.json();
      setStudents((data.students ?? []).filter((s: any) => s.gallery?.length > 0));
    } catch { showToast("Erreur chargement", "error"); }
    finally { setLoading(false); }
  }

  const allGalleryItems = students.flatMap((s) =>
    (s.gallery ?? []).map((g: any) => ({ ...g, studentName: `${s.firstName} ${s.lastName}`, slug: s.slug }))
  );

  const totalPages = Math.max(1, Math.ceil(allGalleryItems.length / PAGE_SIZE));
  const paged = allGalleryItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function renderTable() {
    return (
      <div className="overflow-x-auto rounded-brand border-2 border-border bg-white dark:bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-border bg-surface text-left">
              <th className="px-5 py-3.5 font-black text-xs uppercase tracking-wider text-ink-soft">Aperçu</th>
              <th className="px-5 py-3.5 font-black text-xs uppercase tracking-wider text-ink-soft">Titre</th>
              <th className="px-5 py-3.5 font-black text-xs uppercase tracking-wider text-ink-soft hidden md:table-cell">Élève</th>
              <th className="px-5 py-3.5 font-black text-xs uppercase tracking-wider text-ink-soft hidden lg:table-cell">Gradient</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-border">
            {paged.map((item, i) => (
              <tr key={i} className="hover:bg-surface/50 transition">
                <td className="px-5 py-4">
                  <div className="flex size-12 items-center justify-center rounded-brand-sm text-2xl"
                    style={{ background: item.gradient || "linear-gradient(135deg, #12AEEA, #06B6D4)" }}>
                    {item.emoji ?? "🖼️"}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="font-bold text-ink">{item.label ?? "Sans titre"}</span>
                </td>
                <td className="px-5 py-4 text-ink-soft hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <User className="size-3" />
                    {item.studentName}
                  </div>
                </td>
                <td className="px-5 py-4 hidden lg:table-cell">
                  <div className="flex items-center gap-2">
                    <span className="inline-block size-4 rounded-full border-2 border-border"
                      style={{ background: item.gradient || "linear-gradient(135deg, #12AEEA, #06B6D4)" }} />
                    <span className="font-mono text-[10px] text-ink-soft truncate max-w-[120px]">
                      {item.gradient ? item.gradient.slice(0, 30) + "..." : "—"}
                    </span>
                  </div>
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {paged.map((item, i) => (
          <div key={i} className="rounded-brand border-2 border-border bg-white dark:bg-surface overflow-hidden transition hover:shadow-sm hover:-translate-y-0.5">
            <div className="flex aspect-square items-center justify-center text-5xl"
              style={{ background: item.gradient || "linear-gradient(135deg, #12AEEA, #06B6D4)" }}>
              {item.emoji ?? "🖼️"}
            </div>
            <div className="p-4">
              <p className="truncate font-bold text-ink">{item.label ?? "Sans titre"}</p>
              <p className="mt-1 text-xs text-ink-soft flex items-center gap-1">
                <User className="size-3" />
                {item.studentName}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-black text-ink">Galerie</h2>
          <p className="text-sm text-ink-soft">Médias des portfolios des élèves</p>
        </div>
        <ViewToggle mode={viewMode} onChange={setViewMode} />
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full rounded-brand" />
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
          <ImageIcon className="mb-4 size-12 opacity-40" />
          <p className="font-bold text-lg">Aucun média</p>
          <p className="text-sm mt-1">Les élèves n&apos;ont pas encore ajouté de médias à leur galerie.</p>
        </div>
      )}
    </div>
  );
}
