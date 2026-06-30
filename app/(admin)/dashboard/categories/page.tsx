"use client";

import { useState, useEffect } from "react";
import { showToast } from "@/components/ui/toast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ViewToggle, useViewMode } from "@/components/ui/view-toggle";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2, Pencil, X, Filter, LayoutGrid, LayoutList } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", description: "", color: "sky" });
  const [viewMode, setViewMode] = useViewMode("categories-view");
  const [cardColumns, setCardColumns] = useState<1 | 2>(2);

  function load() {
    fetch("/api/categories").then((r) => r.json()).then((data) => {
      setCategories(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }

  useEffect(() => { load(); }, []);

  function openEdit(c: Category) {
    setEditing(c);
    setForm({ name: c.name, slug: c.slug, description: c.description, color: c.color });
    setShowForm(true);
  }

  function openNew() {
    setEditing(null);
    setForm({ name: "", slug: "", description: "", color: "sky" });
    setShowForm(true);
  }

  useEffect(() => {
    if (!editing) {
      setForm((f) => ({ ...f, slug: f.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") }));
    }
  }, [form.name, editing]);

  async function save() {
    setSaving(true);
    const url = editing ? `/api/categories/${editing.id}` : "/api/categories";
    const method = editing ? "PATCH" : "POST";
    const payload = { ...form, slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") }
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (res.ok) { showToast(editing ? "Catégorie modifiée" : "Catégorie créée", "success"); setShowForm(false); load(); }
    else { const j = await res.json(); showToast(j.error ?? "Erreur", "error"); }
    setSaving(false);
  }

  async function del(id: string) {
    setDeleting(true);
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (res.ok) { showToast("Catégorie supprimée", "info"); load(); }
    setConfirmDelete(null);
    setDeleting(false);
  }

  const colors = ["sky", "accent", "cyan", "amber", "green", "rose", "purple", "coral", "emerald", "violet"];

  function colorBg(c: string) {
    const map: Record<string, string> = {
      sky: "#0EA5E9", accent: "#6366F1", cyan: "#06B6D4", amber: "#F59E0B",
      green: "#22C55E", rose: "#F43F5E", purple: "#A855F7", coral: "#FB7185",
      emerald: "#10B981", violet: "#8B5CF6",
    }
    return map[c] || "#6B7280"
  }

  function renderTable() {
    return (
      <div className="overflow-x-auto rounded-brand border-2 border-border bg-white dark:bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-border bg-surface text-left">
              <th className="px-5 py-3.5 font-black text-xs uppercase tracking-wider text-ink-soft">Nom</th>
              <th className="px-5 py-3.5 font-black text-xs uppercase tracking-wider text-ink-soft hidden sm:table-cell">Slug</th>
              <th className="px-5 py-3.5 font-black text-xs uppercase tracking-wider text-ink-soft hidden md:table-cell">Description</th>
              <th className="px-5 py-3.5 font-black text-xs uppercase tracking-wider text-ink-soft text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-border">
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-surface/50 transition">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="size-3 rounded-full shrink-0" style={{ backgroundColor: colorBg(c.color) }} />
                    <span className="font-bold text-ink">{c.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4 hidden sm:table-cell">
                  <span className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-ink-soft">{c.slug}</span>
                </td>
                <td className="px-5 py-4 text-ink-soft hidden md:table-cell text-xs line-clamp-1">{c.description || "—"}</td>
                <td className="px-5 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(c)} className="rounded-full bg-sky/10 p-2 text-sky hover:bg-sky/20 transition"><Pencil className="size-4" /></button>
                    <button onClick={() => setConfirmDelete(c.id)} className="rounded-full bg-coral/10 p-2 text-coral hover:bg-coral/20 transition"><Trash2 className="size-4" /></button>
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
        {categories.map((c) => (
          <div key={c.id} className="flex items-center justify-between rounded-brand border-2 border-border bg-white dark:bg-surface px-5 py-4 transition hover:border-sky">
            <div className="flex items-center gap-4">
              <span className="size-4 rounded-full shrink-0" style={{ backgroundColor: colorBg(c.color) }} />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-ink">{c.name}</h3>
                  <span className="rounded-full px-2.5 py-0.5 text-xs font-bold text-white" style={{ backgroundColor: colorBg(c.color) }}>{c.slug}</span>
                </div>
                {c.description && <p className="text-xs text-ink-soft mt-0.5 line-clamp-1">{c.description}</p>}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(c)} className="rounded-full bg-sky/10 p-2.5 text-sky hover:bg-sky/20 transition"><Pencil className="size-4" /></button>
              <button onClick={() => setConfirmDelete(c.id)} className="rounded-full bg-coral/10 p-2.5 text-coral hover:bg-coral/20 transition"><Trash2 className="size-4" /></button>
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
          <h1 className="font-display text-3xl font-black text-ink">Catégories</h1>
          <p className="text-sm text-ink-soft mt-1">Gérez les catégories de programmes</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={openNew} className="btn-primary py-2">
            <Plus className="mr-1.5 inline size-4" /> Ajouter
          </button>
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

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={() => setShowForm(false)}>
          <div className="w-full max-w-lg rounded-brand bg-white dark:bg-surface shadow-card" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 z-10 flex items-center justify-between border-b-2 border-border bg-white dark:bg-surface px-6 py-4">
              <h2 className="font-display text-lg font-black text-ink">{editing ? "Modifier" : "Nouvelle"} catégorie</h2>
              <button onClick={() => setShowForm(false)} className="flex size-8 items-center justify-center rounded-full text-ink-soft hover:bg-surface hover:text-ink transition"><X className="size-4" /></button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-ink-soft">Nom</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex: Robotique" className="w-full rounded-brand-sm border-2 border-border px-3 py-2.5 text-sm text-ink focus:border-sky focus:outline-none bg-body" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-ink-soft">Slug</label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="Ex: robotique" className="w-full rounded-brand-sm border-2 border-border px-3 py-2.5 text-sm text-ink focus:border-sky focus:outline-none bg-body" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-ink-soft">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brève description" rows={2} className="w-full rounded-brand-sm border-2 border-border px-3 py-2.5 text-sm text-ink focus:border-sky focus:outline-none bg-body resize-none" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-ink-soft">Couleur</label>
                <div className="flex flex-wrap gap-2">
                  {colors.map((c) => (
                    <button key={c} onClick={() => setForm({ ...form, color: c })}
                      className={`size-8 rounded-full border-2 transition ${form.color === c ? "border-ink scale-110" : "border-border"}`}
                      style={{ backgroundColor: colorBg(c) }} />
                  ))}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 border-t-2 border-border bg-white dark:bg-surface px-6 py-4">
              <button onClick={save} disabled={saving || !form.name.trim()} className="btn-primary w-full py-2.5 text-sm">
                {saving ? "Enregistrement..." : editing ? "Modifier la catégorie" : "Créer la catégorie"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-brand" />)}
        </div>
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-ink-soft">
          <Filter className="size-12 mb-3 opacity-40" />
          <p className="font-bold text-lg">Aucune catégorie</p>
          <p className="text-sm mt-1">Créez votre première catégorie de programmes.</p>
        </div>
      ) : viewMode === "table" ? renderTable() : renderCards()}

      {confirmDelete && (
        <ConfirmDialog title="Supprimer cette catégorie ?" description="Les programmes associés perdront leur catégorie." confirmLabel="Supprimer" loading={deleting}
          onCancel={() => setConfirmDelete(null)} onConfirm={() => del(confirmDelete)} />
      )}
    </div>
  );
}
