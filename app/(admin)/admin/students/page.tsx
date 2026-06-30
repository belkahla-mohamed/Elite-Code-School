"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Eye, Download, Globe, Lock, Trash2, CheckSquare, Plus, X, LayoutGrid, LayoutList } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { downloadCsv } from "@/lib/csv-export";
import { ViewToggle, useViewMode } from "@/components/ui/view-toggle";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { showToast } from "@/components/ui/toast";
import type { Program, ProgramLevel, ProgramColor } from "@/lib/types";

interface Student {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  age: number;
  avatar: string;
  programId: string;
  levelLabel: string;
  hours: number;
  isPublic: boolean;
  parentEmail: string;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useViewMode("students-view");
  const [cardColumns, setCardColumns] = useState<1 | 2>(2);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [addForm, setAddForm] = useState({ firstName: "", lastName: "", age: "", programId: "", parentEmail: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/students").then((r) => r.json()).then((data) => {
      setStudents(data.students ?? []);
      setLoading(false);
    });
    fetch("/api/programs").then((r) => r.json()).then((data) => {
      setPrograms(data.programs ?? []);
    });
  }, []);

  const filtered = students.filter((s) =>
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  const allFilteredSelected = filtered.length > 0 && filtered.every((s) => selectedIds.has(s.id));

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (allFilteredSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((s) => s.id)));
    }
  }

  async function batchSetPublic(isPublic: boolean) {
    if (selectedIds.size === 0) return;
    setProcessing(true);
    const res = await fetch("/api/students/batch-privacy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: Array.from(selectedIds), isPublic }),
    });
    if (res.ok) {
      setStudents((prev) => prev.map((s) => selectedIds.has(s.id) ? { ...s, isPublic } : s));
      showToast(isPublic ? "Élèves rendus publics" : "Élèves rendus privés", "success");
    } else {
      showToast("Erreur", "error");
    }
    setProcessing(false);
  }

  async function createStudent(e: React.FormEvent) {
    e.preventDefault();
    if (!addForm.firstName || !addForm.lastName || !addForm.age || !addForm.programId) return;
    setSaving(true);
    const res = await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...addForm, age: Number(addForm.age) }),
    });
    if (res.ok) {
      showToast("Élève créé avec succès", "success");
      setShowAddForm(false);
      setAddForm({ firstName: "", lastName: "", age: "", programId: "", parentEmail: "" });
      const data = await fetch("/api/students").then((r) => r.json());
      setStudents(data.students ?? []);
    } else {
      const data = await res.json();
      showToast(data.error ?? "Erreur", "error");
    }
    setSaving(false);
  }

  async function batchDelete() {
    if (selectedIds.size === 0) return;
    setProcessing(true);
    const res = await fetch("/api/students/batch-delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: Array.from(selectedIds) }),
    });
    if (res.ok) {
      setStudents((prev) => prev.filter((s) => !selectedIds.has(s.id)));
      setSelectedIds(new Set());
      setDeleteConfirm(false);
      showToast("Élèves supprimés", "info");
    } else {
      showToast("Erreur", "error");
    }
    setProcessing(false);
  }

  function renderTable() {
    return (
      <div className="overflow-x-auto rounded-brand border-2 border-border bg-white dark:bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-border bg-surface text-left">
              <th className="w-10 px-3 py-3.5">
                <input type="checkbox" checked={allFilteredSelected}
                  onChange={toggleSelectAll}
                  className="size-4 rounded border-2 border-border accent-sky cursor-pointer" />
              </th>
              <th className="px-5 py-3.5 font-black text-xs uppercase tracking-wider text-ink-soft">Élève</th>
              <th className="px-5 py-3.5 font-black text-xs uppercase tracking-wider text-ink-soft hidden md:table-cell">Âge</th>
              <th className="px-5 py-3.5 font-black text-xs uppercase tracking-wider text-ink-soft hidden lg:table-cell">Niveau</th>
              <th className="px-5 py-3.5 font-black text-xs uppercase tracking-wider text-ink-soft hidden lg:table-cell">Heures</th>
              <th className="px-5 py-3.5 font-black text-xs uppercase tracking-wider text-ink-soft">Visibilité</th>
              <th className="px-5 py-3.5 font-black text-xs uppercase tracking-wider text-ink-soft text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-border">
            {filtered.map((s) => (
              <tr key={s.id} className={`hover:bg-surface/50 transition ${selectedIds.has(s.id) ? "bg-sky/5" : ""}`}>
                <td className="px-3 py-4">
                  <input type="checkbox" checked={selectedIds.has(s.id)}
                    onChange={() => toggleSelect(s.id)}
                    className="size-4 rounded border-2 border-border accent-sky cursor-pointer" />
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-sky to-cyan font-display text-xs font-black text-white">
                      {s.avatar || s.firstName[0]}
                    </div>
                    <span className="font-bold text-ink">{s.firstName} {s.lastName}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-ink-soft hidden md:table-cell">{s.age} ans</td>
                <td className="px-5 py-4 text-ink-soft hidden lg:table-cell">{s.levelLabel}</td>
                <td className="px-5 py-4 text-ink-soft hidden lg:table-cell">{s.hours}h</td>
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
                    s.isPublic ? "bg-lime/15 text-lime" : "bg-ink-soft/10 text-ink-soft"
                  }`}>
                    {s.isPublic ? "Public" : "Privé"}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <Link href={`/admin/students/${s.id}`}
                    className="inline-flex items-center gap-1.5 rounded-full border-2 border-border px-4 py-1.5 text-xs font-bold text-ink-soft hover:border-sky hover:text-sky transition">
                    <Eye className="size-3" />
                    Gérer
                  </Link>
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
        {filtered.map((student) => (
          <div key={student.id} className={`flex items-center justify-between rounded-brand border-2 bg-white dark:bg-surface px-5 py-4 transition hover:shadow-sm ${
            selectedIds.has(student.id) ? "border-sky bg-sky/5" : "border-border hover:border-sky"
          }`}>
            <div className="flex items-center gap-4">
              <input type="checkbox" checked={selectedIds.has(student.id)}
                onChange={() => toggleSelect(student.id)}
                className="size-4 rounded border-2 border-border accent-sky cursor-pointer shrink-0" />
              <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-sky to-cyan font-display font-black text-sm text-white">
                {student.avatar || student.firstName[0]}
              </div>
              <div>
                <h3 className="font-bold text-ink">{student.firstName} {student.lastName}</h3>
                <p className="text-sm text-ink-soft">{student.age} ans · {student.levelLabel} · {student.hours}h</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${student.isPublic ? "bg-lime/15 text-lime" : "bg-ink-soft/10 text-ink-soft"}`}>
                {student.isPublic ? "Public" : "Privé"}
              </span>
              <Link href={`/admin/students/${student.id}`} className="flex items-center gap-1 rounded-full border-2 border-border px-3 py-1.5 text-xs font-bold text-ink-soft hover:border-sky hover:text-sky transition">
                <Eye className="size-3" /> Gérer
              </Link>
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
          <h1 className="font-display text-3xl font-black text-ink">Élèves</h1>
          <p className="text-sm text-ink-soft mt-1">Gérez les profils et portfolios des élèves</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowAddForm(true)} className="btn-primary py-2">
            <Plus className="mr-1 inline size-4" /> Ajouter
          </button>
          <span className="rounded-full bg-surface px-4 py-1.5 text-sm font-bold text-ink-soft">
            {students.length} élèves
          </span>
          {students.length > 0 && (
            <button onClick={() => downloadCsv(students.map((s) => ({ Prénom: s.firstName, Nom: s.lastName, Âge: s.age, Niveau: s.levelLabel, Heures: s.hours, Email: s.parentEmail })), "eleves.csv")}
              className="btn-outline py-1.5 text-xs">
              <Download className="mr-1 inline size-3" /> CSV
            </button>
          )}
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
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-ink-soft" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un élève..."
          className="w-full rounded-full border-2 border-border bg-white dark:bg-surface pl-10 pr-4 py-2.5 text-sm text-ink outline-none transition focus:border-sky" />
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-brand" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-ink-soft">
          <Search className="size-12 mb-3 opacity-40" />
          <p className="font-bold text-lg">Aucun élève trouvé</p>
          <p className="text-sm mt-1">Aucun élève ne correspond à votre recherche.</p>
        </div>
      ) : (
        <>
          {selectedIds.size > 0 && (
            <div className="mb-4 flex flex-wrap items-center gap-2 rounded-brand border-2 border-sky bg-sky/5 px-4 py-3">
              <CheckSquare className="size-4 text-sky" />
              <span className="text-sm font-bold text-ink mr-auto">{selectedIds.size} sélectionné(s)</span>
              <button onClick={() => batchSetPublic(true)} disabled={processing}
                className="rounded-full bg-lime/10 px-3 py-1.5 text-xs font-bold text-lime hover:bg-lime/20 transition disabled:opacity-50 flex items-center gap-1">
                <Globe className="size-3" /> Public
              </button>
              <button onClick={() => batchSetPublic(false)} disabled={processing}
                className="rounded-full bg-ink-soft/10 px-3 py-1.5 text-xs font-bold text-ink-soft hover:bg-ink-soft/20 transition disabled:opacity-50 flex items-center gap-1">
                <Lock className="size-3" /> Privé
              </button>
              <button onClick={() => downloadCsv(students.filter((s) => selectedIds.has(s.id)).map((s) => ({ Prénom: s.firstName, Nom: s.lastName, Âge: s.age, Niveau: s.levelLabel, Heures: s.hours, Email: s.parentEmail })), "eleves-selection.csv")}
                className="rounded-full bg-sky/10 px-3 py-1.5 text-xs font-bold text-sky hover:bg-sky/20 transition flex items-center gap-1">
                <Download className="size-3" /> CSV
              </button>
              <button onClick={() => setDeleteConfirm(true)} disabled={processing}
                className="rounded-full bg-coral/10 px-3 py-1.5 text-xs font-bold text-coral hover:bg-coral/20 transition disabled:opacity-50 flex items-center gap-1">
                <Trash2 className="size-3" /> Supprimer
              </button>
            </div>
          )}
          {viewMode === "table" ? renderTable() : renderCards()}
        </>
      )}

      {/* Add Student Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={() => setShowAddForm(false)}>
          <div className="w-full max-w-md rounded-brand bg-white dark:bg-surface p-6 shadow-card" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-ink">Nouvel élève</h2>
              <button onClick={() => setShowAddForm(false)}><X className="size-5 text-ink-soft" /></button>
            </div>
            <form onSubmit={createStudent} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input value={addForm.firstName} onChange={(e) => setAddForm({ ...addForm, firstName: e.target.value })}
                  placeholder="Prénom" required className="rounded-brand-sm border-2 border-border bg-body px-3 py-2 text-sm text-ink focus:border-sky focus:outline-none" />
                <input value={addForm.lastName} onChange={(e) => setAddForm({ ...addForm, lastName: e.target.value })}
                  placeholder="Nom" required className="rounded-brand-sm border-2 border-border bg-body px-3 py-2 text-sm text-ink focus:border-sky focus:outline-none" />
              </div>
              <input value={addForm.age} onChange={(e) => setAddForm({ ...addForm, age: e.target.value })}
                type="number" min="7" max="17" placeholder="Âge" required className="rounded-brand-sm border-2 border-border bg-body px-3 py-2 text-sm text-ink focus:border-sky focus:outline-none w-full" />
              <select value={addForm.programId} onChange={(e) => setAddForm({ ...addForm, programId: e.target.value })}
                required className="rounded-brand-sm border-2 border-border bg-body px-3 py-2 text-sm text-ink focus:border-sky focus:outline-none w-full">
                <option value="">Sélectionner un programme</option>
                {programs.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
              <input value={addForm.parentEmail} onChange={(e) => setAddForm({ ...addForm, parentEmail: e.target.value })}
                type="email" placeholder="Email parent (optionnel)" className="rounded-brand-sm border-2 border-border bg-body px-3 py-2 text-sm text-ink focus:border-sky focus:outline-none w-full" />
              <button type="submit" disabled={saving} className="btn-primary w-full py-2">
                {saving ? "Création..." : "Créer l'élève"}
              </button>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <ConfirmDialog title="Supprimer ces élèves ?"
          description={`Cette action est irréversible. ${selectedIds.size} élève(s) et leurs données associées seront supprimé(s).`}
          confirmLabel="Supprimer" variant="danger"
          onConfirm={batchDelete} onCancel={() => setDeleteConfirm(false)} />
      )}
    </div>
  );
}
