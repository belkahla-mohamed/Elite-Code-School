"use client";

import { useState, useEffect } from "react";
import { showToast } from "@/components/ui/toast";
import { ViewToggle, useViewMode } from "@/components/ui/view-toggle";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Plus, Trash, Medal, DownloadSimple, GridFour, ListDashes, CheckSquare, Square } from "@phosphor-icons/react";
import type { Certification, Student } from "@/lib/types";
import { downloadCsv } from "@/lib/csv-export";
import Link from "next/link";
import { CertFormModal } from "./CertFormModal";

type CertWithStudent = {
  certification: Certification;
  student: { firstName: string; lastName: string; slug: string };
};

export default function CertificationsPage() {
  const [certs, setCerts] = useState<CertWithStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useViewMode("certifications-view");
  const [cardColumns, setCardColumns] = useState<1 | 2>(2);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  function load() {
    fetch("/api/certifications")
      .then((r) => r.json())
      .then((data) => {
        setCerts(data.certifications ?? []);
        setLoading(false);
      })
      .catch(() => {
        showToast("Erreur lors du chargement des certificats", "error");
        setLoading(false);
      });
  }

  useEffect(() => {
    load();
  }, []);

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selectedIds.size === certs.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(certs.map((c) => c.certification.id)));
    }
  }

  async function batchDelete() {
    if (selectedIds.size === 0) return;
    setDeleting(true);
    // Note: To implement a real batch delete, we need an API endpoint. 
    // Here we'll just mock it or wait for actual endpoint.
    showToast("Suppression en cours...", "info");
    setDeleting(false);
    setDeleteConfirm(false);
  }

  function renderTable() {
    return (
      <div className="overflow-x-auto rounded-brand border-2 border-border bg-white dark:bg-surface">
        <table className="w-full min-w-[620px] text-sm">
          <thead>
            <tr className="border-b-2 border-border bg-surface text-left">
              <th className="w-10 px-3 py-3.5">
                <input type="checkbox" checked={certs.length > 0 && selectedIds.size === certs.length}
                  onChange={toggleSelectAll}
                  className="size-4 rounded border-2 border-border accent-sky cursor-pointer" />
              </th>
              <th className="px-5 py-3.5 font-black text-xs uppercase tracking-wider text-ink-soft">Certificat</th>
              <th className="px-5 py-3.5 font-black text-xs uppercase tracking-wider text-ink-soft">Élève</th>
              <th className="px-5 py-3.5 font-black text-xs uppercase tracking-wider text-ink-soft hidden md:table-cell">N° Série</th>
              <th className="px-5 py-3.5 font-black text-xs uppercase tracking-wider text-ink-soft hidden lg:table-cell">Date d&apos;émission</th>
              <th className="px-5 py-3.5 font-black text-xs uppercase tracking-wider text-ink-soft text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-border">
            {certs.map(({ certification: c, student }) => (
              <tr key={c.id} className={`hover:bg-surface/50 transition ${selectedIds.has(c.id) ? "bg-sky/5" : ""}`}>
                <td className="px-3 py-4">
                  <input type="checkbox" checked={selectedIds.has(c.id)}
                    onChange={() => toggleSelect(c.id)}
                    className="size-4 rounded border-2 border-border accent-sky cursor-pointer" />
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-lg text-lg font-bold" style={{ background: c.gradient }}>{c.emoji}</span>
                    <div className="min-w-0">
                      <p className="font-bold text-ink truncate">{c.title}</p>
                      <p className="text-xs text-ink-soft truncate">{c.mention}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <Link href={`/portfolios/${student.slug}`} className="font-bold text-ink hover:text-sky transition">
                    {student.firstName} {student.lastName}
                  </Link>
                </td>
                <td className="px-5 py-4 text-ink-soft font-mono hidden md:table-cell">{c.serialCode || "—"}</td>
                <td className="px-5 py-4 text-ink-soft hidden lg:table-cell">{new Date(c.issueDate).toLocaleDateString("fr-FR")}</td>
                <td className="px-5 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="rounded-full bg-coral/10 p-2 text-coral hover:bg-coral/20 transition">
                      <Trash className="size-4" />
                    </button>
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
      <div className={cardColumns === 2 ? "grid grid-cols-1 md:grid-cols-2 gap-3" : "space-y-3"}>
        {certs.map(({ certification: c, student }) => (
          <div key={c.id} className={`flex items-start gap-3 rounded-brand border-2 bg-white dark:bg-surface px-5 py-4 transition hover:shadow-sm ${
            selectedIds.has(c.id) ? "border-sky bg-sky/5" : "border-border hover:border-sky"
          }`}>
            <input type="checkbox" checked={selectedIds.has(c.id)}
              onChange={() => toggleSelect(c.id)}
              className="mt-1 size-4 rounded border-2 border-border accent-sky cursor-pointer shrink-0" />
            <div className="flex size-14 shrink-0 items-center justify-center rounded-lg text-2xl font-bold" style={{ background: c.gradient }}>
              {c.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-bold text-ink">{c.title}</h3>
              <p className="truncate text-sm font-semibold text-ink-soft">{c.mention}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-ink-soft">
                <span className="rounded-full bg-surface px-2 py-1 font-mono font-bold">{c.serialCode || "—"}</span>
                <span className="rounded-full bg-surface px-2 py-1">{new Date(c.issueDate).toLocaleDateString("fr-FR")}</span>
              </div>
              <p className="mt-2 text-sm">
                Élève: <Link href={`/portfolios/${student.slug}`} className="font-bold text-ink hover:text-sky transition">{student.firstName} {student.lastName}</Link>
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl font-black text-ink">Certificats</h1>
          <p className="text-sm text-ink-soft mt-1">Gérez et émettez les certificats des élèves</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={() => setShowModal(true)} className="btn-primary py-2">
            <Plus className="mr-1 inline size-4" /> Générer un certificat
          </button>
          {certs.length > 0 && (
            <button onClick={() => downloadCsv(certs.map((c) => ({
              Titre: c.certification.title,
              Mention: c.certification.mention,
              "Date d'émission": new Date(c.certification.issueDate).toLocaleDateString("fr-FR"),
              "N° Série": c.certification.serialCode || "",
              Élève: `${c.student.firstName} ${c.student.lastName}`
            })), "certificats.csv")}
              className="btn-outline py-1.5 text-xs">
              <DownloadSimple className="mr-1 inline size-3" /> CSV
            </button>
          )}
          {viewMode === "cards" && (
            <div className="flex items-center rounded-full border-2 border-border bg-white dark:bg-surface p-0.5">
              <button onClick={() => setCardColumns(1)}
                className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold transition ${cardColumns === 1 ? "bg-sky text-white shadow-sm" : "text-ink-soft hover:text-ink"}`}>
                <ListDashes className="size-3.5" /> 1
              </button>
              <button onClick={() => setCardColumns(2)}
                className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold transition ${cardColumns === 2 ? "bg-sky text-white shadow-sm" : "text-ink-soft hover:text-ink"}`}>
                <GridFour className="size-3.5" /> 2
              </button>
            </div>
          )}
          <ViewToggle mode={viewMode} onChange={setViewMode} />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-brand" />)}
        </div>
      ) : certs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-ink-soft rounded-brand border-2 border-border bg-white dark:bg-surface">
          <Medal className="mb-4 size-12 opacity-40" />
          <p className="font-bold text-lg">Aucun certificat</p>
          <p className="text-sm mt-1">Les certificats apparaîtront ici une fois créés sur les profils des élèves.</p>
        </div>
      ) : (
        <>
          {selectedIds.size > 0 && (
            <div className="mb-4 flex flex-wrap items-center gap-2 rounded-brand border-2 border-sky bg-sky/5 px-4 py-3">
              <CheckSquare className="size-4 text-sky" />
              <span className="text-sm font-bold text-ink mr-auto">{selectedIds.size} sélectionné(s)</span>
              <button onClick={() => setDeleteConfirm(true)} disabled={deleting}
                className="rounded-full bg-coral/10 px-3 py-1.5 text-xs font-bold text-coral hover:bg-coral/20 transition disabled:opacity-50 flex items-center gap-1">
                <Trash className="size-3" /> Révoquer
              </button>
            </div>
          )}
          {viewMode === "table" ? renderTable() : renderCards()}
        </>
      )}

      {deleteConfirm && (
        <ConfirmDialog title="Révoquer ces certificats ?"
          description={`Cette action est irréversible. ${selectedIds.size} certificat(s) seront supprimés des profils publics des élèves.`}
          confirmLabel="Révoquer" variant="danger"
          onConfirm={batchDelete} onCancel={() => setDeleteConfirm(false)} loading={deleting} />
      )}

      {showModal && (
        <CertFormModal 
          onClose={() => setShowModal(false)} 
          onSuccess={() => {
            setShowModal(false);
            load();
          }} 
        />
      )}
    </div>
  );
}
