"use client";

import { useState, useEffect } from "react";
import { showToast } from "@/components/ui/toast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ViewToggle, useViewMode } from "@/components/ui/view-toggle";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2, Pencil, Eye, X, BookOpen, Download, LayoutGrid, LayoutList, Image as ImageIcon } from "lucide-react";
import { downloadCsv } from "@/lib/csv-export";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUpload } from "@/components/ui/file-upload";

interface Program {
  id: string; title: string; ageRange: string; level: string; priceMonthly: number;
  description: string; tools: string[]; color: string;
  image: string; duration?: string; objectives?: string; prerequisites?: string; schedule?: string;
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
  const [cardColumns, setCardColumns] = useState<1 | 2>(2);

  const [form, setForm] = useState({ title: "", ageRange: "", level: "debutant", priceMonthly: 0, description: "", color: "accent", image: "", duration: "", objectives: "", prerequisites: "", schedule: "" });
  const [durationMonths, setDurationMonths] = useState("");
  const [durationSessions, setDurationSessions] = useState("");
  const [durationCustom, setDurationCustom] = useState("");


  function load() {
    fetch("/api/programs").then((r) => r.json()).then((data) => {
      setPrograms(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }

  useEffect(() => { load(); }, []);

  function parseDuration(dur: string) {
    if (!dur) { setDurationMonths(""); setDurationSessions(""); setDurationCustom(""); return }
    const m = dur.match(/(\d+)\s*mois/i)
    const s = dur.match(/(\d+)\s*séances/i)
    const months = m ? m[1] : ""
    const sessions = s ? s[1] : ""
    if (months || sessions) {
      setDurationMonths(months || "custom")
      setDurationSessions(sessions || "custom")
      setDurationCustom(dur)
    } else {
      setDurationMonths("custom")
      setDurationSessions("custom")
      setDurationCustom(dur)
    }
  }

  function formatDuration(): string {
    const months = durationMonths === "custom" ? "" : durationMonths
    const sessions = durationSessions === "custom" ? "" : durationSessions
    if (durationMonths === "custom" || durationSessions === "custom") return durationCustom
    const parts: string[] = []
    if (months) parts.push(`${months} mois`)
    if (sessions) parts.push(`${sessions} séances`)
    return parts.join(" · ") || ""
  }

  function openEdit(p: Program) {
    setEditing(p);
    setForm({ title: p.title, ageRange: p.ageRange, level: p.level, priceMonthly: p.priceMonthly, description: p.description, color: p.color, image: p.image ?? "", duration: p.duration ?? "", objectives: p.objectives ?? "", prerequisites: p.prerequisites ?? "", schedule: p.schedule ?? "" });
    parseDuration(p.duration ?? "")
    setShowForm(true);
  }

  function openNew() {
    setEditing(null);
    setForm({ title: "", ageRange: "", level: "debutant", priceMonthly: 0, description: "", color: "accent", image: "", duration: "", objectives: "", prerequisites: "", schedule: "" });
    setDurationMonths(""); setDurationSessions(""); setDurationCustom("")
    setShowForm(true);
  }

  async function save() {
    setSaving(true);
    const url = editing ? `/api/programs/${editing.id}` : "/api/programs";
    const method = editing ? "PATCH" : "POST";
    const payload = { ...form, duration: formatDuration(), level: form.level as any, color: form.color as any }
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
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
                <th className="px-5 py-3.5 font-black text-xs uppercase tracking-wider text-ink-soft hidden lg:table-cell">Durée</th>
                <th className="px-5 py-3.5 font-black text-xs uppercase tracking-wider text-ink-soft hidden xl:table-cell">Prix</th>
                <th className="px-5 py-3.5 font-black text-xs uppercase tracking-wider text-ink-soft text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-border">
              {programs.map((p) => (
                <tr key={p.id} className="hover:bg-surface/50 transition">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {p.image ? (
                        <img src={p.image} alt="" className="size-10 shrink-0 rounded-lg object-cover" />
                      ) : (
                        <span className="flex size-10 items-center justify-center rounded-lg bg-surface text-lg font-bold text-ink-soft">?</span>
                      )}
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
                  <td className="px-5 py-4 text-ink-soft hidden lg:table-cell">{p.duration || "—"}</td>
                  <td className="px-5 py-4 text-ink-soft hidden xl:table-cell">{p.priceMonthly} DH/mois</td>
                    <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/curricula/${p.id}`} className="rounded-full bg-ink-soft/10 p-2 text-ink-soft hover:bg-ink-soft/20 transition"><Eye className="size-4" /></Link>
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
      <div className={cardColumns === 2 ? "grid grid-cols-1 md:grid-cols-2 gap-3" : "space-y-3"}>
        {programs.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-brand border-2 border-border bg-white dark:bg-surface px-5 py-4 transition hover:border-sky hover:shadow-sm">
            <div className="flex items-center gap-4">
              {p.image ? (
                <img src={p.image} alt="" className="size-14 shrink-0 rounded-lg object-cover" />
              ) : (
                <span className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-surface text-2xl font-bold text-ink-soft">?</span>
              )}
              <div>
                <h3 className="font-bold text-ink">{p.title}</h3>
                <p className="text-sm text-ink-soft">{p.ageRange} · {levelLabels[p.level] || p.level} · {p.priceMonthly} DH/mois</p>
                {p.description && <p className="text-xs text-ink-soft/60 mt-0.5 line-clamp-1">{p.description}</p>}
                {p.duration && <p className="text-xs text-ink-soft/60 mt-0.5">{p.duration}{p.schedule ? ` · ${p.schedule}` : ""}</p>}
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`/curricula/${p.id}`} className="rounded-full bg-ink-soft/10 p-2.5 text-ink-soft hover:bg-ink-soft/20 transition"><Eye className="size-4" /></Link>
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
              Prix: `${p.priceMonthly} DH/mois`, Durée: p.duration ?? "", Horaires: p.schedule ?? "",
              Description: p.description.replace(/,/g, ";"),
              "Au programme": (p.objectives ?? "").replace(/,/g, ";"),
              Prérequis: (p.prerequisites ?? "").replace(/,/g, ";"),
              Outils: (p.tools ?? []).join("; "),
            })), "programmes.csv")}
              className="btn-outline py-1.5 text-xs">
              <Download className="mr-1 inline size-3" /> CSV
            </button>
          )}
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
          <div className="w-full max-w-xl max-h-[85vh] overflow-y-auto [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar-thumb]:hidden scrollbar-none rounded-brand bg-white dark:bg-surface shadow-card" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 z-10 flex items-center justify-between border-b-2 border-border bg-white dark:bg-surface px-6 py-4">
              <h2 className="font-display text-lg font-black text-ink">{editing ? "Modifier" : "Nouveau"} programme</h2>
              <button onClick={() => setShowForm(false)} className="flex size-8 items-center justify-center rounded-full text-ink-soft hover:bg-surface hover:text-ink transition"><X className="size-4" /></button>
            </div>

            <div className="p-6 space-y-6">
              {/* Image */}
              <div>
                <label className="mb-2 block text-xs font-bold text-ink-soft uppercase tracking-wider">Image de couverture</label>
                <div className="flex items-start gap-4">
                  {form.image ? (
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-brand-sm border-2 border-border">
                      <img src={form.image} alt="" className="size-full object-cover" />
                      <button onClick={() => setForm({ ...form, image: "" })} className="absolute top-0.5 right-0.5 rounded-full bg-black/50 p-0.5 text-white"><X className="size-3" /></button>
                    </div>
                  ) : (
                    <div className="flex size-20 shrink-0 items-center justify-center rounded-brand-sm border-2 border-dashed border-border bg-surface text-ink-soft">
                      <ImageIcon className="size-7" />
                    </div>
                  )}
                  <FileUpload folder="programs" onUploaded={(url) => setForm({ ...form, image: url })} />
                </div>
              </div>

              {/* General */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-ink-soft">Titre</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ex: Scratch & Créativité" className="w-full rounded-brand-sm border-2 border-border px-3 py-2.5 text-sm text-ink focus:border-sky focus:outline-none bg-body" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-ink-soft">Tranche d&apos;âge</label>
                  <input value={form.ageRange} onChange={(e) => setForm({ ...form, ageRange: e.target.value })} placeholder="Ex: 7–10 ans" className="w-full rounded-brand-sm border-2 border-border px-3 py-2.5 text-sm text-ink focus:border-sky focus:outline-none bg-body" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-ink-soft">Niveau</label>
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
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-ink-soft">Prix (DH/mois)</label>
                  <input value={form.priceMonthly} onChange={(e) => setForm({ ...form, priceMonthly: Number(e.target.value) })} type="number" placeholder="Ex: 650" className="w-full rounded-brand-sm border-2 border-border px-3 py-2.5 text-sm text-ink focus:border-sky focus:outline-none bg-body" />
                </div>
              </div>

              {/* Duration & Schedule */}
              <div>
                <p className="mb-3 text-xs font-bold text-ink-soft uppercase tracking-wider">Durée & Horaires</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-ink-soft">Mois</label>
                    <select value={durationMonths} onChange={(e) => setDurationMonths(e.target.value)}
                      className="w-full rounded-brand-sm border-2 border-border bg-body px-3 py-2.5 text-sm text-ink focus:border-sky focus:outline-none appearance-none">
                      <option value="">—</option>
                      {[1,2,3,4,5,6,7,8,9,10,11,12].map((n) => <option key={n} value={n}>{n} mois</option>)}
                      <option value="custom">Autre...</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-ink-soft">Séances</label>
                    <select value={durationSessions} onChange={(e) => setDurationSessions(e.target.value)}
                      className="w-full rounded-brand-sm border-2 border-border bg-body px-3 py-2.5 text-sm text-ink focus:border-sky focus:outline-none appearance-none">
                      <option value="">—</option>
                      {[4,6,8,10,12,16,20,24,30,36].map((n) => <option key={n} value={n}>{n} séances</option>)}
                      <option value="custom">Autre...</option>
                    </select>
                  </div>
                </div>
                {(durationMonths === "custom" || durationSessions === "custom") && (
                  <input value={durationCustom} onChange={(e) => setDurationCustom(e.target.value)}
                    placeholder="Durée personnalisée (ex: 2 trimestres · 24 séances)"
                    className="mt-3 w-full rounded-brand-sm border-2 border-border px-3 py-2.5 text-sm text-ink focus:border-sky focus:outline-none bg-body" />
                )}
                <div className="mt-4">
                  <label className="mb-1.5 block text-xs font-bold text-ink-soft">Horaires</label>
                  <input value={form.schedule} onChange={(e) => setForm({ ...form, schedule: e.target.value })} placeholder="Ex: Samedi 10h–12h" className="w-full rounded-brand-sm border-2 border-border px-3 py-2.5 text-sm text-ink focus:border-sky focus:outline-none bg-body" />
                </div>
              </div>

              {/* Content */}
              <div>
                <p className="mb-3 text-xs font-bold text-ink-soft uppercase tracking-wider">Contenu</p>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-ink-soft">Description</label>
                    <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brève description du programme" rows={2} className="w-full rounded-brand-sm border-2 border-border px-3 py-2.5 text-sm text-ink focus:border-sky focus:outline-none bg-body resize-none" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-ink-soft">Au programme</label>
                    <textarea value={form.objectives} onChange={(e) => setForm({ ...form, objectives: e.target.value })} placeholder="Ce que l'élève va apprendre..." rows={3} className="w-full rounded-brand-sm border-2 border-border px-3 py-2.5 text-sm text-ink focus:border-sky focus:outline-none bg-body resize-none" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-ink-soft">Prérequis <span className="text-ink-soft/60">(optionnel)</span></label>
                    <textarea value={form.prerequisites} onChange={(e) => setForm({ ...form, prerequisites: e.target.value })} placeholder="Ce qu'il faut savoir avant de s'inscrire" rows={2} className="w-full rounded-brand-sm border-2 border-border px-3 py-2.5 text-sm text-ink focus:border-sky focus:outline-none bg-body resize-none" />
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 border-t-2 border-border bg-white dark:bg-surface px-6 py-4">
              <button onClick={save} disabled={saving} className="btn-primary w-full py-2.5 text-sm">
                {saving ? "Enregistrement..." : editing ? "Modifier le programme" : "Créer le programme"}
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
