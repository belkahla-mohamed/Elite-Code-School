"use client";

import { useState, useEffect } from "react";
import { showToast } from "@/components/ui/toast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Plus, Trash2, Pencil, X } from "lucide-react";

interface Program {
  id: string; title: string; ageRange: string; level: string; priceMonthly: number;
  description: string; tools: string[]; icon: string; color: string;
}

export default function CurriculaAdminPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Program | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

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
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, level: form.level as "debutant" | "intermediaire" | "avance", color: form.color as "accent" | "cyan" | "amber" | "green" | "rose" | "purple" }) });
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

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-black text-ink">Programmes</h1>
        <button onClick={openNew} className="btn-primary py-2"><Plus className="mr-1 inline size-4" /> Ajouter</button>
      </div>

      {showForm && (
        <div className="mb-8 rounded-brand border-2 border-[#E8EEF6] bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold">{editing ? "Modifier" : "Nouveau"} programme</h2>
            <button onClick={() => setShowForm(false)}><X className="size-5 text-ink-soft" /></button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Titre" className="rounded-brand-sm border-2 border-[#E8EEF6] px-3 py-2 text-sm focus:border-sky focus:outline-none" />
            <input value={form.ageRange} onChange={(e) => setForm({ ...form, ageRange: e.target.value })} placeholder="Âge (ex: 7-10 ans)" className="rounded-brand-sm border-2 border-[#E8EEF6] px-3 py-2 text-sm focus:border-sky focus:outline-none" />
            <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} className="rounded-brand-sm border-2 border-[#E8EEF6] px-3 py-2 text-sm focus:border-sky focus:outline-none">
              <option value="debutant">Débutant</option><option value="intermediaire">Intermédiaire</option><option value="avance">Avancé</option>
            </select>
            <input value={form.priceMonthly} onChange={(e) => setForm({ ...form, priceMonthly: Number(e.target.value) })} type="number" placeholder="Prix (DH/mois)" className="rounded-brand-sm border-2 border-[#E8EEF6] px-3 py-2 text-sm focus:border-sky focus:outline-none" />
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="sm:col-span-2 rounded-brand-sm border-2 border-[#E8EEF6] px-3 py-2 text-sm focus:border-sky focus:outline-none" />
            <div className="sm:col-span-2 flex gap-4">
              <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="Emoji icône" className="w-20 rounded-brand-sm border-2 border-[#E8EEF6] px-3 py-2 text-sm focus:border-sky focus:outline-none" />
              <div className="flex gap-1">
                {colors.map((c) => (
                  <button key={c} onClick={() => setForm({ ...form, color: c })} className={`h-9 w-9 rounded-lg border-2 ${form.color === c ? "border-sky" : "border-transparent"}`} style={{ background: `var(--${c})` }} />
                ))}
              </div>
            </div>
          </div>
          <button onClick={save} disabled={saving} className="btn-primary mt-4 py-2">{saving ? "..." : editing ? "Modifier" : "Créer"}</button>
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-ink-soft">Chargement...</div>
      ) : (
        <div className="space-y-3">
          {programs.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-brand border-2 border-[#E8EEF6] bg-white px-6 py-4">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{p.icon}</span>
                <div>
                  <h3 className="font-bold text-ink">{p.title}</h3>
                  <p className="text-sm text-ink-soft">{p.ageRange} · {p.level} · {p.priceMonthly} DH/mois</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(p)} className="text-ink-soft hover:text-sky transition"><Pencil className="size-4" /></button>
                <button onClick={() => setConfirmDelete(p.id)} className="text-coral hover:text-coral/80"><Trash2 className="size-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {confirmDelete && (
        <ConfirmDialog title="Supprimer ce programme ?" description="Action irréversible." confirmLabel="Supprimer"
          onCancel={() => setConfirmDelete(null)} onConfirm={() => del(confirmDelete)} />
      )}
    </div>
  );
}
