"use client";

import { useState, useEffect } from "react";
import { showToast } from "@/components/ui/toast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ViewToggle, useViewMode } from "@/components/ui/view-toggle";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2, Pencil, X, BookOpen, Download } from "lucide-react";
import { downloadCsv } from "@/lib/csv-export";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Program {
  id: string; title: string; ageRange: string; level: string; priceMonthly: number;
  description: string; tools: string[]; icon: string; color: string;
}

const levelLabels: Record<string, string> = {
  debutant: "Débutant",
  intermediaire: "Intermédiaire",
  avance: "Avancé",
};

export default function CurriculaAdminPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Program | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useViewMode("curricula-view");

  const [form, setForm] = useState({ title: "", ageRange: "", level: "debutant", priceMonthly: 0, description: "", icon: "💻", color: "accent" });

  function load() {
    fetch("/api/programs").then((r) => r.json()).then((data) => {
      setPrograms(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }

  useEffect(() => { load(); }, []);

  function openEdit(p: Program) {
    setEditing(p);
    setForm({ title: p.title, ageRange: p.ageRange, level: p.level, priceMonthly: p.priceMonthly, description: p.description, icon: p.icon, color: p.color });
    setShowForm(true);
  }

  function openNew() {
    setEditing(null);
    setForm({ title: "", ageRange: "", level: "debutant", priceMonthly: 0, description: "", icon: "💻", color: "accent" });
    setShowForm(true);
  }

  async function save() {
    setSaving(true);
    const url = editing ? `/api/programs/${editing.id}` : "/api/programs";
    const method = editing ? "PATCH" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, level: form.level as any, color: form.color as any }) });
    if (res.ok) { showToast(editing ? "Programme modifié" : "Programme créé", "success"); setShowForm(false); load(); }
    else { const j = await res.json(); showToast(j.error ?? "Erreur", "error"); }
    setSaving(false);
  }

  async function del(id: string) {
    const res = await fetch(`/api/programs/${id}`, { method: "DELETE" });
    if (res.ok) { showToast("Programme supprimé", "info"); load(); }
    setConfirmDelete(null);
  }

  const colors = ["accent", "cyan", "amber", "green", "rose", "purple"];

  function renderTable() {
    return (
      <div className="overflow-x-auto rounded-brand border-2 border-border bg-white dark:bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-border bg-surface text-left">
              <th className="px-5 py-3.5 font-black text-xs uppercase tracking-wider text-ink-soft">Programme</th>
              <th className="px-5 py-3.5 font-black text-xs uppercase tracking-wider text-ink-soft hidden md:table-cell">Âge</th>
              <th className="px-5 py-3.5 font-black text-xs uppercase tracking-wider text-ink-soft hidden md:table-cell">Niveau</th>
              <th className="px-5 py-3.5 font-black text-xs uppercase tracking-wider text-ink-soft hidden lg:table-cell">Prix</th>
              <th className="px-5 py-3.5 font-black text-xs uppercase tracking-wider text-ink-soft text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-border">
            {programs.map((p) => (
              <tr key={p.id} className="hover:bg-surface/50 transition">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{p.icon}</span>
                    <div>
                      <span className="font-bold text-ink">{p.title}</span>
                      {p.description && <p className="text-xs text-ink-soft line-clamp-1">{p.description}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-ink-soft hidden md:table-cell">{p.ageRange}</td>
                <td className="px-5 py-4 hidden md:table-cell">
                  <span className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-ink-soft">
                    {levelLabels[p.level] || p.level}
                  </span>
                </td>
                <td className="px-5 py-4 text-ink-soft hidden lg:table-cell">{p.priceMonthly} DH/mois</td>
                <td className="px-5 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(p)} className="rounded-full bg-sky/10 p-2 text-sky hover:bg-sky/20 transition"><Pencil className="size-4" /></button>
                    <button onClick={() => setConfirmDelete(p.id)} className="rounded-full bg-coral/10 p-2 text-coral hover:bg-coral/20 transition"><Trash2 className="size-4" /></button>
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
      <div className="space-y-3">
        {programs.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-brand border-2 border-border bg-white dark:bg-surface px-5 py-4 transition hover:border-sky hover:shadow-sm">
            <div className="flex items-center gap-4">
              <span className="text-3xl">{p.icon}</span>
              <div>
                <h3 className="font-bold text-ink">{p.title}</h3>
                <p className="text-sm text-ink-soft">{p.ageRange} · {levelLabels[p.level] || p.level} · {p.priceMonthly} DH/mois</p>
                {p.description && <p className="text-xs text-ink-soft/60 mt-0.5 line-clamp-1">{p.description}</p>}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(p)} className="rounded-full bg-sky/10 p-2.5 text-sky hover:bg-sky/20 transition"><Pencil className="size-4" /></button>
              <button onClick={() => setConfirmDelete(p.id)} className="rounded-full bg-coral/10 p-2.5 text-coral hover:bg-coral/20 transition"><Trash2 className="size-4" /></button>
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
          <h1 className="font-display text-3xl font-black text-ink">Programmes</h1>
          <p className="text-sm text-ink-soft mt-1">Gérez les programmes pédagogiques</p>
        </div>
        <div className="flex items-center gap-3">
          {programs.length > 0 && (
            <button onClick={() => downloadCsv(programs.map((p) => ({
              Titre: p.title, Niveau: levelLabels[p.level] ?? p.level, "Tranche d'âge": p.ageRange,
              Prix: `${p.priceMonthly} DH/mois`, Description: p.description.replace(/,/g, ";"),
              Outils: (p.tools ?? []).join("; "),
            })), "programmes.csv")}
              className="btn-outline py-1.5 text-xs">
              <Download className="mr-1 inline size-3" /> CSV
            </button>
          )}
          <button onClick={openNew} className="btn-primary py-2">
            <Plus className="mr-1.5 inline size-4" /> Ajouter
          </button>
          <ViewToggle mode={viewMode} onChange={setViewMode} />
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-8 rounded-brand border-2 border-border bg-white dark:bg-surface p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-ink">{editing ? "Modifier" : "Nouveau"} programme</h2>
            <button onClick={() => setShowForm(false)} className="text-ink-soft hover:text-ink transition"><X className="size-5" /></button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Titre" className="rounded-brand-sm border-2 border-border px-3 py-2.5 text-sm focus:border-sky focus:outline-none bg-body" />
            <input value={form.ageRange} onChange={(e) => setForm({ ...form, ageRange: e.target.value })} placeholder="Âge (ex: 7-10 ans)" className="rounded-brand-sm border-2 border-border px-3 py-2.5 text-sm focus:border-sky focus:outline-none bg-body" />
            <Select value={form.level} onValueChange={(v) => setForm({ ...form, level: v })}>
              <SelectTrigger className="rounded-brand-sm border-2 border-border">
                <SelectValue placeholder="Niveau" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="debutant">Débutant</SelectItem>
                <SelectItem value="intermediaire">Intermédiaire</SelectItem>
                <SelectItem value="avance">Avancé</SelectItem>
              </SelectContent>
            </Select>
            <input value={form.priceMonthly} onChange={(e) => setForm({ ...form, priceMonthly: Number(e.target.value) })} type="number" placeholder="Prix (DH/mois)" className="rounded-brand-sm border-2 border-border px-3 py-2.5 text-sm focus:border-sky focus:outline-none bg-body" />
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="sm:col-span-2 rounded-brand-sm border-2 border-border px-3 py-2.5 text-sm focus:border-sky focus:outline-none bg-body" />
            <div className="sm:col-span-2 flex gap-4 items-center">
              <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="Emoji" className="w-16 rounded-brand-sm border-2 border-border px-3 py-2.5 text-sm focus:border-sky focus:outline-none bg-body text-center" />
              <div className="flex gap-1.5">
                {colors.map((c) => (
                  <button key={c} onClick={() => setForm({ ...form, color: c })}
                    className={`h-8 w-8 rounded-lg border-2 transition ${form.color === c ? "border-sky scale-110" : "border-transparent hover:scale-110"}`}
                    style={{ background: `var(--${c})` }} />
                ))}
              </div>
            </div>
          </div>
          <button onClick={save} disabled={saving} className="btn-primary mt-5 py-2.5 px-6">
            {saving ? "Enregistrement..." : editing ? "Modifier le programme" : "Créer le programme"}
          </button>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-brand" />)}
        </div>
      ) : programs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-ink-soft">
          <BookOpen className="size-12 mb-3 opacity-40" />
          <p className="font-bold text-lg">Aucun programme</p>
          <p className="text-sm mt-1">Créez votre premier programme pédagogique.</p>
        </div>
      ) : viewMode === "table" ? renderTable() : renderCards()}

      {confirmDelete && (
        <ConfirmDialog title="Supprimer ce programme ?" description="Cette action est irréversible." confirmLabel="Supprimer"
          onCancel={() => setConfirmDelete(null)} onConfirm={() => del(confirmDelete)} />
      )}
    </div>
  );
}
