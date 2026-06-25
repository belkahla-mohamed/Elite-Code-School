"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Trash2, Plus, Loader2, Camera, X, Pencil } from "lucide-react";
import { showToast } from "@/components/ui/toast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { FileUpload } from "@/components/ui/file-upload";
import NextImage from "next/image";

interface Student {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  age: number;
  avatar: string;
  avatarGradient: string;
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
  const [projectCover, setProjectCover] = useState("");
  const [certifImage, setCertifImage] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ firstName: "", lastName: "", age: 0, levelLabel: "", hours: 0, parentEmail: "" });
  const [saving, setSaving] = useState(false);
  const [deleteStudentConfirm, setDeleteStudentConfirm] = useState(false);

  useEffect(() => {
    fetch(`/api/students/${id}`).then((r) => r.json()).then((data) => {
      setStudent(data.student ?? data);
      setLoading(false);
    });
  }, [id]);

  function reload() {
    fetch(`/api/students/${id}`).then((r) => r.json()).then((data) => {
      setStudent(data.student ?? data);
    });
  }

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
        coverImage: projectCover || undefined,
      }),
    });
    if (res.ok) {
      showToast("Projet ajouté", "success");
      e.currentTarget.reset();
      setProjectCover("");
      reload();
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
        imageUrl: certifImage || undefined,
      }),
    });
    if (res.ok) {
      showToast("Certificat ajouté", "success");
      e.currentTarget.reset();
      setCertifImage("");
      reload();
    }
  }

  async function addGalleryImage(url: string) {
    const res = await fetch(`/api/students/${id}/gallery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: "Upload", imageUrl: url }),
    });
    if (res.ok) {
      showToast("Image ajoutée", "success");
      reload();
    }
  }

  async function deleteItem(type: string, itemId: string) {
    const endpoint = type === "project" ? `/api/students/${id}/projects` : `/api/students/${id}/certifications`;
    const res = await fetch(`${endpoint}?id=${itemId}`, { method: "DELETE" });
    if (res.ok) { showToast("Supprimé", "info"); reload(); }
    setConfirmDelete(null);
  }

  function openEdit() {
    if (!student) return;
    setEditForm({ firstName: student.firstName, lastName: student.lastName, age: student.age, levelLabel: student.levelLabel, hours: student.hours, parentEmail: student.parentEmail });
    setEditOpen(true);
  }

  async function saveEdit() {
    setSaving(true);
    const res = await fetch(`/api/students/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    if (res.ok) { showToast("Élève modifié", "success"); setEditOpen(false); reload(); }
    else { const j = await res.json(); showToast(j.error ?? "Erreur", "error"); }
    setSaving(false);
  }

  async function deleteStudent() {
    const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
    if (res.ok) { showToast("Élève supprimé", "info"); router.push("/admin/students"); }
    else { const j = await res.json(); showToast(j.error ?? "Erreur", "error"); }
    setDeleteStudentConfirm(false);
  }

  if (loading) return <div className="py-12 text-center text-ink-soft">Chargement...</div>;
  if (!student) return <div className="py-12 text-center text-ink-soft">Élève introuvable.</div>;

  return (
    <div>
      <button onClick={() => router.back()} className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-ink-soft transition hover:text-sky">
        <ArrowLeft className="size-4" /> Retour
      </button>

      <div className="mb-8 flex items-center gap-4">
        <div className="group relative">
          <div
            className="flex size-16 items-center justify-center rounded-2xl font-display text-2xl font-black text-white"
            style={{ background: student.avatarGradient }}>
            {student.avatar}
          </div>
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 opacity-0 transition group-hover:opacity-100">
            <FileUpload folder={`avatars/${id}`} onUploaded={(url) => showToast("Avatar mis à jour", "success")}>
              <Camera className="size-5 text-white" />
            </FileUpload>
          </div>
        </div>
        <div>
          <h1 className="font-display text-3xl font-black text-ink">{student.firstName} {student.lastName}</h1>
          <p className="text-sm text-ink-soft">{student.age} ans · {student.levelLabel} · {student.hours}h</p>
        </div>
        <div className="ml-auto flex gap-2">
          <button onClick={openEdit} className="btn-outline py-2"><Pencil className="mr-1 inline size-4" /> Modifier</button>
          <button onClick={() => setDeleteStudentConfirm(true)} className="rounded-brand-sm bg-coral px-4 py-2 text-sm font-bold text-white hover:bg-coral/90 transition"><Trash2 className="mr-1 inline size-4" /> Supprimer</button>
        </div>
      </div>

      {/* Gallery */}
      <section className="mb-8">
        <h2 className="mb-4 font-display text-xl font-black">Galerie ({student.gallery.length})</h2>
        <div className="mb-4 flex flex-wrap gap-3">
          {student.gallery.map((g: any) => (
            <div key={g.id} className="group relative h-24 w-24 overflow-hidden rounded-brand-sm border-2 border-[#E8EEF6] bg-surface">
              {g.imageUrl ? (
                <NextImage src={g.imageUrl} alt={g.label} fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-3xl" style={{ background: g.gradient }}>
                  {g.emoji}
                </div>
              )}
            </div>
          ))}
          <div className="flex h-24 w-24 items-center justify-center rounded-brand-sm border-2 border-dashed border-[#E8EEF6] bg-white">
            <FileUpload folder={`gallery/${id}`} onUploaded={addGalleryImage}>
              <Plus className="size-6 text-ink-soft" />
            </FileUpload>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="mb-8">
        <h2 className="mb-4 font-display text-xl font-black">Projets ({student.projects.length})</h2>
        <div className="mb-4 space-y-2">
          {student.projects.map((p: any) => (
            <div key={p.id} className="flex items-center justify-between rounded-brand-sm border-2 border-[#E8EEF6] bg-white px-4 py-3">
              <span className="text-sm font-bold">{p.emoji} {p.title}</span>
              <button onClick={() => setConfirmDelete({ type: "project", name: p.title, id: p.id })} className="text-coral hover:text-coral/80">
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
        <form onSubmit={addProject} className="grid gap-3 rounded-brand border-2 border-[#E8EEF6] bg-white p-4 sm:grid-cols-2">
          <input name="title" required placeholder="Titre du projet" className="rounded-brand-sm border-2 border-[#E8EEF6] px-3 py-2 text-sm focus:border-sky focus:outline-none" />
          <input name="description" required placeholder="Description" className="rounded-brand-sm border-2 border-[#E8EEF6] px-3 py-2 text-sm focus:border-sky focus:outline-none" />
          <input name="tags" placeholder="Tags (virgule)" className="rounded-brand-sm border-2 border-[#E8EEF6] px-3 py-2 text-sm focus:border-sky focus:outline-none" />
          <input name="dateLabel" placeholder="Date affichée" className="rounded-brand-sm border-2 border-[#E8EEF6] px-3 py-2 text-sm focus:border-sky focus:outline-none" />
          <select name="status" className="rounded-brand-sm border-2 border-[#E8EEF6] px-3 py-2 text-sm focus:border-sky focus:outline-none">
            <option value="progress">En cours</option>
            <option value="done">Terminé</option>
          </select>
          <input name="progress" type="number" min="0" max="100" defaultValue="40" className="rounded-brand-sm border-2 border-[#E8EEF6] px-3 py-2 text-sm focus:border-sky focus:outline-none" />
          <div className="sm:col-span-2 flex items-center gap-3">
            <FileUpload folder={`projects/${id}`} onUploaded={(url) => { setProjectCover(url); showToast("Cover ajoutée", "success"); }}>
              <span className="inline-flex items-center gap-1 rounded-brand-sm border-2 border-[#E8EEF6] px-3 py-2 text-sm font-semibold text-ink-soft hover:border-sky transition">
                {projectCover ? "✅ Cover" : "🖼️ Cover"}
              </span>
            </FileUpload>
            <button type="submit" className="flex-1 btn-primary py-2"><Plus className="mr-1 inline size-4" /> Ajouter</button>
          </div>
        </form>
      </section>

      {/* Certifications */}
      <section>
        <h2 className="mb-4 font-display text-xl font-black">Certifications ({student.certifications.length})</h2>
        <div className="mb-4 space-y-2">
          {student.certifications.map((c: any) => (
            <div key={c.id} className="flex items-center justify-between rounded-brand-sm border-2 border-[#E8EEF6] bg-white px-4 py-3">
              <span className="text-sm font-bold">{c.emoji} {c.title} — {c.mention}</span>
              <button onClick={() => setConfirmDelete({ type: "certification", name: c.title, id: c.id })} className="text-coral hover:text-coral/80">
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
        <form onSubmit={addCertification} className="grid gap-3 rounded-brand border-2 border-[#E8EEF6] bg-white p-4 sm:grid-cols-2">
          <input name="title" required placeholder="Titre" className="rounded-brand-sm border-2 border-[#E8EEF6] px-3 py-2 text-sm focus:border-sky focus:outline-none" />
          <input name="mention" required placeholder="Mention" className="rounded-brand-sm border-2 border-[#E8EEF6] px-3 py-2 text-sm focus:border-sky focus:outline-none" />
          <input name="dateLabel" placeholder="Date" className="rounded-brand-sm border-2 border-[#E8EEF6] px-3 py-2 text-sm focus:border-sky focus:outline-none" />
          <div className="flex items-center gap-3">
            <FileUpload folder={`certifications/${id}`} onUploaded={(url) => { setCertifImage(url); showToast("Image ajoutée", "success"); }}>
              <span className="inline-flex items-center gap-1 rounded-brand-sm border-2 border-[#E8EEF6] px-3 py-2 text-sm font-semibold text-ink-soft hover:border-sky transition">
                {certifImage ? "✅ Image" : "🖼️ Image"}
              </span>
            </FileUpload>
            <button type="submit" className="flex-1 btn-primary py-2"><Plus className="mr-1 inline size-4" /> Ajouter</button>
          </div>
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

      {deleteStudentConfirm && (
        <ConfirmDialog
          title="Supprimer cet élève ?"
          description={`${student.firstName} ${student.lastName} et toutes ses données seront supprimés définitivement.`}
          confirmLabel="Supprimer"
          onCancel={() => setDeleteStudentConfirm(false)}
          onConfirm={deleteStudent}
        />
      )}

      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={() => setEditOpen(false)}>
          <div className="w-full max-w-md rounded-brand bg-white p-6 shadow-card" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">Modifier l'élève</h2>
              <button onClick={() => setEditOpen(false)}><X className="size-5 text-ink-soft" /></button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input value={editForm.firstName} onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })} placeholder="Prénom" className="rounded-brand-sm border-2 border-[#E8EEF6] px-3 py-2 text-sm focus:border-sky focus:outline-none" />
                <input value={editForm.lastName} onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })} placeholder="Nom" className="rounded-brand-sm border-2 border-[#E8EEF6] px-3 py-2 text-sm focus:border-sky focus:outline-none" />
              </div>
              <input value={editForm.age} onChange={(e) => setEditForm({ ...editForm, age: Number(e.target.value) })} type="number" placeholder="Âge" className="rounded-brand-sm border-2 border-[#E8EEF6] px-3 py-2 text-sm focus:border-sky focus:outline-none w-full" />
              <input value={editForm.levelLabel} onChange={(e) => setEditForm({ ...editForm, levelLabel: e.target.value })} placeholder="Niveau" className="rounded-brand-sm border-2 border-[#E8EEF6] px-3 py-2 text-sm focus:border-sky focus:outline-none w-full" />
              <input value={editForm.hours} onChange={(e) => setEditForm({ ...editForm, hours: Number(e.target.value) })} type="number" placeholder="Heures" className="rounded-brand-sm border-2 border-[#E8EEF6] px-3 py-2 text-sm focus:border-sky focus:outline-none w-full" />
              <input value={editForm.parentEmail} onChange={(e) => setEditForm({ ...editForm, parentEmail: e.target.value })} type="email" placeholder="Email parent" className="rounded-brand-sm border-2 border-[#E8EEF6] px-3 py-2 text-sm focus:border-sky focus:outline-none w-full" />
            </div>
            <button onClick={saveEdit} disabled={saving} className="btn-primary mt-4 w-full py-2">{saving ? "Enregistrement..." : "Enregistrer"}</button>
          </div>
        </div>
      )}
    </div>
  );
}
