"use client";

import { useEffect, useState } from "react";
import { Image as ImageIcon, PanelTop, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showToast } from "@/components/ui/toast";

const PAGE_SIZE = 6;

export function GalleryContent() {
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
      setStudents((data.students ?? []).filter((s: any) => s.gallery?.length > 0));
    } catch { showToast("Erreur chargement", "error"); }
    finally { setLoading(false); }
  }

  const allGalleryItems = students.flatMap((s) =>
    (s.gallery ?? []).map((g: any) => ({ ...g, studentName: `${s.firstName} ${s.lastName}`, slug: s.slug }))
  );

  const totalPages = Math.max(1, Math.ceil(allGalleryItems.length / PAGE_SIZE));
  const paged = allGalleryItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-black text-ink">Galerie</h2>
        <p className="text-sm text-ink-soft">Médias des portfolios des élèves</p>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="dash-card animate-pulse">
              <div className="aspect-square rounded-brand-sm bg-sky/10 mb-3" />
              <div className="h-4 w-32 rounded bg-sky/10" />
            </div>
          ))}
        </div>
      ) : paged.length > 0 ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paged.map((item, i) => (
              <div key={i} className="dash-card">
                <div className="mb-3 flex aspect-square items-center justify-center rounded-brand-sm bg-gradient-to-br from-sky/10 to-cyan/10 text-4xl">
                  {item.emoji ?? "🖼️"}
                </div>
                <p className="truncate text-sm font-bold text-ink">{item.label ?? "Sans titre"}</p>
                <p className="text-xs text-ink-soft">{item.studentName}</p>
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
          <ImageIcon className="mb-4 size-12" />
          <p className="font-bold text-lg">Aucun média</p>
          <p className="text-sm mt-1">Les élèves n&apos;ont pas encore ajouté de médias à leur galerie.</p>
        </div>
      )}
    </div>
  );
}
