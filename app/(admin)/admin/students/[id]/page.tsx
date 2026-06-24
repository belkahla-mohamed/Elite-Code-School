"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Trash2, Plus, Loader2 } from "lucide-react";
import { showToast } from "@/components/ui/toast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface Student {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  age: number;
  avatar: string;
  levelLabel: string;
  hours: number;
  isPublic: boolean;
  parentEmail: string;
  projects: any[];
  certifications: any[];
  gallery: any[];
}

export default function StudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<{ type: string; name: string; id: string } | null>(null);

  useEffect(() => {
    fetch(`/api/students/${id}`).then((r) => r.json()).then((data) => {
      setStudent(data.student ?? data);
      setLoading(false);
    });
  }, [id]);

  async function addProject(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const res = await fetch(`/api/students/${id}/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        description: form.get("description"),
        tags: String(form.get("tags") ?? "").split(",").map((t) => t.trim()).filter(Boolean),
        status: form.get("status"),
        progress: Number(form.get("progress") ?? 0),
        dateLabel: form.get("dateLabel"),
        emoji: form.get("emoji") || "💼",
        gradient: "linear-gradient(135deg,#2563EB,#06B6D4)",
      }),
    });
    if (res.ok) {
      showToast("Projet ajouté", "success");
      e.currentTarget.reset();
      const data = await fetch(`/api/students/${id}`).then((r) => r.json());
      setStudent(data.student ?? data);
    }
  }

  async function addCertification(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const res = await fetch(`/api/students/${id}/certifications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        mention: form.get("mention"),
        dateLabel: form.get("dateLabel"),
        emoji: form.get("emoji") || "🏅",
        gradient: "linear-gradient(135deg,#84CC16,#2DD4BF)",
      }),
    });
    if (res.ok) {
      showToast("Certificat ajouté", "success");
      e.currentTarget.reset();
      const data = await fetch(`/api/students/${id}`).then((r) => r.json());
      setStudent(data.student ?? data);
    }
  }

  async function deleteItem(type: string, itemId: string) {
    const endpoint = type === "project" ? `/api/students/${id}/projects` : `/api/students/${id}/certifications`;
    const res = await fetch(`${endpoint}?id=${itemId}`, { method: "DELETE" });
    if (res.ok) {
      showToast("Supprimé", "info");
      const data = await fetch(`/api/students/${id}`).then((r) => r.json());
      setStudent(data.student ?? data);
    }
    setConfirmDelete(null);
  }

  if (loading) return <div className="text-center py-12 text-ink-soft">Chargement...</div>;
  if (!student) return <div className="text-center py-12 text-ink-soft">Élève introuvable.</div>;

  return (
    <div>
      <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-sm font-bold text-ink-soft hover:text-sky transition mb-6">
        <ArrowLeft className="size-4" /> Retour
      </button>

      <div className="flex items-center gap-4 mb-8">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-sky font-display text-2xl font-black text-white">
          {student.avatar}
        </div>
        <div>
          <h1 className="font-display text-3xl font-black text-ink">{student.firstName} {student.lastName}</h1>
          <p className="text-sm text-ink-soft">{student.age} ans · {student.levelLabel} · {student.hours}h</p>
        </div>
      </div>

      {/* Projects */}
      <section className="mb-8">
        <h2 className="font-display text-xl font-black mb-4">Projets ({student.projects.length})</h2>
        <div className="space-y-2 mb-4">
          {student.projects.map((p: any) => (
            <div key={p.id} className="flex items-center justify-between rounded-brand-sm border-2 border-[#E8EEF6] bg-white px-4 py-3">
              <span className="font-bold text-sm">{p.emoji} {p.title}</span>
              <button onClick={() => setConfirmDelete({ type: "project", name: p.title, id: p.id })} className="text-coral hover:text-coral/80">
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
        <form onSubmit={addProject} className="rounded-brand border-2 border-[#E8EEF6] bg-white p-4 grid gap-3 sm:grid-cols-2">
          <input name="title" required placeholder="Titre du projet" className="rounded-brand-sm border-2 border-[#E8EEF6] px-3 py-2 text-sm focus:border-sky focus:outline-none" />
          <input name="description" required placeholder="Description" className="rounded-brand-sm border-2 border-[#E8EEF6] px-3 py-2 text-sm focus:border-sky focus:outline-none" />
          <input name="tags" placeholder="Tags (virgule)" className="rounded-brand-sm border-2 border-[#E8EEF6] px-3 py-2 text-sm focus:border-sky focus:outline-none" />
          <input name="dateLabel" placeholder="Date affichée" className="rounded-brand-sm border-2 border-[#E8EEF6] px-3 py-2 text-sm focus:border-sky focus:outline-none" />
          <select name="status" className="rounded-brand-sm border-2 border-[#E8EEF6] px-3 py-2 text-sm focus:border-sky focus:outline-none">
            <option value="progress">En cours</option>
            <option value="done">Terminé</option>
          </select>
          <input name="progress" type="number" min="0" max="100" defaultValue="40" className="rounded-brand-sm border-2 border-[#E8EEF6] px-3 py-2 text-sm focus:border-sky focus:outline-none" />
          <button type="submit" className="sm:col-span-2 btn-primary py-2"><Plus className="size-4 inline mr-1" /> Ajouter</button>
        </form>
      </section>

      {/* Certifications */}
      <section>
        <h2 className="font-display text-xl font-black mb-4">Certifications ({student.certifications.length})</h2>
        <div className="space-y-2 mb-4">
          {student.certifications.map((c: any) => (
            <div key={c.id} className="flex items-center justify-between rounded-brand-sm border-2 border-[#E8EEF6] bg-white px-4 py-3">
              <span className="font-bold text-sm">{c.emoji} {c.title} — {c.mention}</span>
              <button onClick={() => setConfirmDelete({ type: "certification", name: c.title, id: c.id })} className="text-coral hover:text-coral/80">
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
        <form onSubmit={addCertification} className="rounded-brand border-2 border-[#E8EEF6] bg-white p-4 grid gap-3 sm:grid-cols-2">
          <input name="title" required placeholder="Titre" className="rounded-brand-sm border-2 border-[#E8EEF6] px-3 py-2 text-sm focus:border-sky focus:outline-none" />
          <input name="mention" required placeholder="Mention" className="rounded-brand-sm border-2 border-[#E8EEF6] px-3 py-2 text-sm focus:border-sky focus:outline-none" />
          <input name="dateLabel" placeholder="Date" className="rounded-brand-sm border-2 border-[#E8EEF6] px-3 py-2 text-sm focus:border-sky focus:outline-none" />
          <button type="submit" className="btn-primary py-2"><Plus className="size-4 inline mr-1" /> Ajouter</button>
        </form>
      </section>

      {confirmDelete && (
        <ConfirmDialog
          title={`Supprimer ${confirmDelete.type === "project" ? "le projet" : "le certificat"} ?`}
          description={`"${confirmDelete.name}" sera définitivement supprimé.`}
          confirmLabel="Supprimer"
          onCancel={() => setConfirmDelete(null)}
          onConfirm={() => deleteItem(confirmDelete.type, confirmDelete.id)}
        />
      )}
    </div>
  );
}
