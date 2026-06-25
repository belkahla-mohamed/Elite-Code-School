"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Loader2, X } from "lucide-react";
import { showToast } from "@/components/ui/toast";
import { FileUpload } from "@/components/ui/file-upload";

interface Project {
  id: string; title: string; description: string; tags: string[];
  status: string; progress: number; dateLabel: string; emoji: string; coverImage?: string;
}

export default function StudentProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({ title: "", description: "", tags: "", dateLabel: "", emoji: "💼" });
  const [coverUrl, setCoverUrl] = useState("");

  function load() {
    fetch("/api/student/projects").then((r) => r.json()).then((data) => {
      setProjects(data.projects ?? []);
      setLoading(false);
    });
  }

  useEffect(() => { load(); }, []);

  async function addProject(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/student/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title, description: form.description,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        dateLabel: form.dateLabel || "En cours",
        emoji: form.emoji,
        coverImage: coverUrl || undefined,
        gradient: "linear-gradient(135deg,#2563EB,#06B6D4)",
      }),
    });
    if (res.ok) { showToast("Projet soumis pour validation", "success"); setShowForm(false); load(); setForm({ title: "", description: "", tags: "", dateLabel: "", emoji: "💼" }); setCoverUrl(""); }
    else { const j = await res.json(); showToast(j.error ?? "Erreur", "error"); }
    setSaving(false);
  }

  const statusLabel: Record<string, { label: string; color: string }> = {
    pending: { label: "En attente", color: "bg-amber-100 text-amber-700" },
    progress: { label: "En cours", color: "bg-blue-100 text-blue-700" },
    done: { label: "Terminé", color: "bg-green-100 text-green-700" },
    planned: { label: "Planifié", color: "bg-gray-100 text-gray-600" },
  };

  if (loading) return <div className="container-shell py-16 text-center text-ink-soft">Chargement...</div>;

  return (
    <section className="container-shell py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold">💼 Mes projets</h1>
          <p className="mt-1 text-ink-soft">{projects.length} projet{projects.length > 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary py-2"><Plus className="mr-1 inline size-4" /> Nouveau projet</button>
      </div>

      {showForm && (
        <div className="mb-8 rounded-brand border-2 border-[#E8EEF6] bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold">Nouveau projet</h2>
            <button onClick={() => setShowForm(false)}><X className="size-5 text-ink-soft" /></button>
          </div>
          <form onSubmit={addProject} className="space-y-3">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="Titre du projet" className="w-full rounded-brand-sm border-2 border-[#E8EEF6] px-3 py-2 text-sm focus:border-sky focus:outline-none" />
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required placeholder="Description" rows={3} className="w-full rounded-brand-sm border-2 border-[#E8EEF6] px-3 py-2 text-sm focus:border-sky focus:outline-none" />
            <div className="grid grid-cols-2 gap-3">
              <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="Tags (virgule)" className="rounded-brand-sm border-2 border-[#E8EEF6] px-3 py-2 text-sm focus:border-sky focus:outline-none" />
              <input value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })} placeholder="Emoji" className="rounded-brand-sm border-2 border-[#E8EEF6] px-3 py-2 text-sm focus:border-sky focus:outline-none" />
            </div>
            <div className="flex items-center gap-3">
              <FileUpload folder={`student-projects`} onUploaded={(url) => { setCoverUrl(url); showToast("Image ajoutée", "success"); }}>
                <span className="inline-flex items-center gap-1 rounded-brand-sm border-2 border-[#E8EEF6] px-3 py-2 text-sm font-semibold text-ink-soft hover:border-sky transition">
                  {coverUrl ? "✅ Image" : "🖼️ Cover"}
                </span>
              </FileUpload>
            </div>
            <button type="submit" disabled={saving} className="btn-primary py-2">{saving ? "Envoi..." : "Soumettre le projet"}</button>
          </form>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="rounded-brand bg-white p-12 text-center shadow-sm ring-1 ring-[#E6EEF8]">
          <div className="text-5xl">💼</div>
          <p className="mt-4 font-display text-xl font-bold">Aucun projet</p>
          <p className="mt-1 text-ink-soft">Ajoute ton premier projet !</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => {
            const st = statusLabel[p.status] ?? { label: p.status, color: "bg-gray-100 text-gray-600" };
            return (
              <div key={p.id} className="group rounded-brand bg-white shadow-sm ring-1 ring-[#E6EEF8] overflow-hidden">
                {p.coverImage && (
                  <div className="h-36 bg-surface" style={{ background: `url(${p.coverImage}) center/cover` }} />
                )}
                <div className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-2xl">{p.emoji}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${st.color}`}>{st.label}</span>
                  </div>
                  <h3 className="font-display text-lg font-bold">{p.title}</h3>
                  <p className="mt-1 text-sm text-ink-soft line-clamp-2">{p.description}</p>
                  {p.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {p.tags.map((t, i) => <span key={i} className="rounded-full bg-sky/10 px-2 py-0.5 text-xs font-semibold text-sky">{t}</span>)}
                    </div>
                  )}
                  {p.status !== "pending" && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-ink-soft">
                        <span>Progression</span>
                        <span>{p.progress}%</span>
                      </div>
                      <div className="mt-1 h-2 overflow-hidden rounded-full bg-sky/10">
                        <div className="h-full rounded-full bg-gradient-to-r from-sky to-blue-400" style={{ width: `${p.progress}%` }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
