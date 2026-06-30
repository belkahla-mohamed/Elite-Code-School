"use client";

import { useState, useEffect } from "react";
import { showToast } from "@/components/ui/toast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2, Pencil, X, Filter } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
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

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl font-black text-ink">Catégories</h1>
          <p className="text-sm text-ink-soft mt-1">Gérez les catégories de programmes</p>
        </div>
        <button onClick={openNew} className="btn-primary py-2">
          <Plus className="mr-1.5 inline size-4" /> Ajouter
        </button>
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
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-ink-soft">Couleur</label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((c) => (
                      <button key={c} onClick={() => setForm({ ...form, color: c })}
                        className={`size-8 rounded-full border-2 transition ${form.color === c ? "border-ink scale-110" : "border-border"} bg-${c}`}
                        style={{ backgroundColor: c === "sky" ? "#0EA5E9" : c === "accent" ? "#6366F1" : c === "cyan" ? "#06B6D4" : c === "amber" ? "#F59E0B" : c === "green" ? "#22C55E" : c === "rose" ? "#F43F5E" : c === "purple" ? "#A855F7" : c === "coral" ? "#FB7185" : c === "emerald" ? "#10B981" : c === "violet" ? "#8B5CF6" : "#6B7280" }} />
                    ))}
                  </div>
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
      ) : (
        <div className="space-y-2">
          {categories.map((c) => (
            <div key={c.id} className="flex items-center justify-between rounded-brand border-2 border-border bg-white dark:bg-surface px-5 py-3.5 transition hover:border-sky">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-ink">{c.name}</h3>
                      <span className="rounded-full px-2.5 py-0.5 text-xs font-bold text-white" style={{ backgroundColor: c.color === "sky" ? "#0EA5E9" : c.color === "accent" ? "#6366F1" : c.color === "cyan" ? "#06B6D4" : c.color === "amber" ? "#F59E0B" : c.color === "green" ? "#22C55E" : c.color === "rose" ? "#F43F5E" : c.color === "purple" ? "#A855F7" : "#6B7280" }}>{c.slug}</span>
                    </div>
                    {c.description && <p className="text-xs text-ink-soft mt-0.5">{c.description}</p>}
                  </div>
                </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(c)} className="rounded-full bg-sky/10 p-2.5 text-sky hover:bg-sky/20 transition"><Pencil className="size-4" /></button>
                <button onClick={() => setConfirmDelete(c.id)} className="rounded-full bg-coral/10 p-2.5 text-coral hover:bg-coral/20 transition"><Trash2 className="size-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {confirmDelete && (
        <ConfirmDialog title="Supprimer cette catégorie ?" description="Les programmes associés perdront leur catégorie." confirmLabel="Supprimer" loading={deleting}
          onCancel={() => setConfirmDelete(null)} onConfirm={() => del(confirmDelete)} />
      )}
    </div>
  );
}
