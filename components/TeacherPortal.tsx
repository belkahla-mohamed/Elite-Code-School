"use client";

import { useEffect, useState } from "react";
import { Search, ExternalLink } from "lucide-react";
import type { StudentPortfolio, Teacher } from "@/lib/types";
import { showToast } from "@/components/ui/toast";

type TeacherDashboard = {
  teacher: Teacher;
  students: StudentPortfolio[];
};

export function TeacherPortal() {
  const [email, setEmail] = useState("");
  const [secret, setSecret] = useState("");
  const [dashboard, setDashboard] = useState<TeacherDashboard | null>(null);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => { void load(); }, []);

  async function load() {
    const response = await fetch("/api/teacher/dashboard");
    if (!response.ok) return;
    setDashboard(await response.json());
  }

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch("/api/auth/teacher", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, secret })
    });
    const result = await response.json();
    if (!response.ok) { setMessage(result.error ?? "Accès teacher invalide."); return; }
    setMessage("Session teacher ouverte.");
    setEmail(""); setSecret("");
    await load();
  }

  const totalStudents = dashboard?.students.length ?? 0;
  const totalProjects = dashboard?.students.reduce((a, s) => a + s.projects.length, 0) ?? 0;
  const pendingProjects = dashboard?.students.reduce((a, s) => a + s.projects.filter((p: any) => p.status === "pending").length, 0) ?? 0;

  if (!dashboard) {
    return (
      <div className="mx-auto max-w-md rounded-brand border border-ink/10 bg-white p-8">
        <span className="tag">Teacher</span>
        <h1 className="mt-4 font-display text-3xl font-extrabold">Espace teacher</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Demo: <code className="font-mono">teacher.nadia@example.com</code> + <code className="font-mono">TEACHER-2026</code>
        </p>
        <form onSubmit={login} className="mt-6 flex flex-col gap-4">
          <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="Email teacher" className="rounded-brand-sm border border-ink/15 bg-surface px-4 py-3 outline-none focus:border-accent focus:ring-4 focus:ring-accent/15" />
          <input value={secret} onChange={(event) => setSecret(event.target.value)} type="password" placeholder="Secret teacher" className="rounded-brand-sm border border-ink/15 bg-surface px-4 py-3 outline-none focus:border-accent focus:ring-4 focus:ring-accent/15" />
          <button className="btn-primary">Accéder</button>
        </form>
        {message && <p className="mt-4 rounded-brand-sm bg-red-50 p-3 text-sm text-red-700">{message}</p>}
      </div>
    );
  }

  const filtered = dashboard.students.filter((s) =>
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container-shell py-10">
      <div className="mb-8 rounded-brand border border-ink/10 bg-white p-6">
        <span className="tag">Teacher dashboard</span>
        <h1 className="mt-3 font-display text-4xl font-extrabold">Bonjour {dashboard.teacher.fullName}</h1>
        <p className="mt-2 text-ink-soft">Gère tes élèves et enrichis leurs portfolios.</p>
      </div>

      <div className="mb-8 grid grid-cols-3 gap-4">
        <div className="rounded-brand bg-white p-5 shadow-sm ring-1 ring-[#E6EEF8]">
          <div className="text-sm text-ink-soft">Élèves</div>
          <div className="mt-1 font-display text-3xl font-extrabold text-sky">{totalStudents}</div>
        </div>
        <div className="rounded-brand bg-white p-5 shadow-sm ring-1 ring-[#E6EEF8]">
          <div className="text-sm text-ink-soft">Projets</div>
          <div className="mt-1 font-display text-3xl font-extrabold text-sky">{totalProjects}</div>
        </div>
        <div className="rounded-brand bg-white p-5 shadow-sm ring-1 ring-[#E6EEF8]">
          <div className="text-sm text-ink-soft">En attente</div>
          <div className="mt-1 font-display text-3xl font-extrabold text-amber">{pendingProjects}</div>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un élève..."
          className="w-full rounded-brand-sm border-2 border-[#E8EEF6] bg-white py-2.5 pl-10 pr-4 font-body text-ink transition focus:border-sky focus:outline-none" />
      </div>

      {message && <p className="mb-4 rounded-brand-sm bg-accent/10 p-3 text-sm text-accent">{message}</p>}

      <section className="grid gap-5">
        {filtered.map((student) => (
          <article key={student.id} className="rounded-brand border border-ink/10 bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex size-14 items-center justify-center rounded-xl font-bold text-white" style={{ background: student.avatarGradient }}>{student.avatar}</div>
                <div>
                  <h3 className="font-display text-xl font-bold">{student.firstName} {student.lastName}</h3>
                  <p className="text-sm text-ink-soft">{student.levelLabel} · {student.hours}h · {student.projects.length} projets</p>
                </div>
              </div>
              <div className="flex gap-2">
                {pendingProjects > 0 && <span className="tag bg-amber-100 text-amber-700">{pendingProjects} en attente</span>}
                <a href={`/portfolio/${student.slug}`} className="btn-outline px-4 py-2"><ExternalLink className="mr-1 inline size-4" /> Voir</a>
              </div>
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              <MiniAddForm title="Projet" fields={["description", "tags", "status", "progress", "dateLabel", "emoji"]} onSubmit={(event) => addStudentItem(event, student, "projects")} />
              <MiniAddForm title="Certificat" fields={["mention", "dateLabel", "emoji"]} onSubmit={(event) => addStudentItem(event, student, "certifications")} />
              <MiniAddForm title="Photo galerie" fields={["emoji"]} onSubmit={(event) => addStudentItem(event, student, "gallery")} />
            </div>
          </article>
        ))}
      </section>
    </div>
  );

  async function addStudentItem(event: React.FormEvent<HTMLFormElement>, student: StudentPortfolio, type: "projects" | "certifications" | "gallery") {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload =
      type === "projects"
        ? { title: form.get("title"), description: form.get("description"), tags: String(form.get("tags") ?? "").split(",").map((t: string) => t.trim()).filter(Boolean), status: form.get("status"), progress: form.get("progress"), dateLabel: form.get("dateLabel"), emoji: form.get("emoji") }
        : type === "certifications"
          ? { title: form.get("title"), mention: form.get("mention"), dateLabel: form.get("dateLabel"), emoji: form.get("emoji") }
          : { label: form.get("title"), emoji: form.get("emoji") };

    const response = await fetch(`/api/students/${student.id}/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    showToast(response.ok ? "Ajouté" : result.error ?? "Erreur", response.ok ? "success" : "error");
    if (response.ok) { event.currentTarget.reset(); await load(); }
  }
}

function MiniAddForm({ title, fields, onSubmit }: { title: string; fields: string[]; onSubmit: (event: React.FormEvent<HTMLFormElement>) => void }) {
  return (
    <form onSubmit={onSubmit} className="rounded-brand-sm bg-surface p-4">
      <h4 className="font-semibold">Ajouter {title.toLowerCase()}</h4>
      <input name="title" required placeholder="Titre" className="mt-3 w-full rounded-brand-sm border border-ink/10 px-3 py-2 text-sm" />
      {fields.includes("description") && <textarea name="description" required placeholder="Description" className="mt-2 min-h-20 w-full rounded-brand-sm border border-ink/10 px-3 py-2 text-sm" />}
      {fields.includes("tags") && <input name="tags" placeholder="Tags séparés par virgule" className="mt-2 w-full rounded-brand-sm border border-ink/10 px-3 py-2 text-sm" />}
      {fields.includes("status") && (
        <select name="status" className="mt-2 w-full rounded-brand-sm border border-ink/10 px-3 py-2 text-sm">
          <option value="progress">En cours</option>
          <option value="done">Terminé</option>
          <option value="planned">Planifié</option>
          <option value="pending">En attente</option>
        </select>
      )}
      {fields.includes("progress") && <input name="progress" type="number" min="0" max="100" defaultValue="40" className="mt-2 w-full rounded-brand-sm border border-ink/10 px-3 py-2 text-sm" />}
      {fields.includes("mention") && <input name="mention" placeholder="Mention" className="mt-2 w-full rounded-brand-sm border border-ink/10 px-3 py-2 text-sm" />}
      {fields.includes("dateLabel") && <input name="dateLabel" placeholder="Date affichée" className="mt-2 w-full rounded-brand-sm border border-ink/10 px-3 py-2 text-sm" />}
      {fields.includes("emoji") && <input name="emoji" placeholder="Emoji" className="mt-2 w-full rounded-brand-sm border border-ink/10 px-3 py-2 text-sm" />}
      <button className="btn-primary mt-3 w-full px-4 py-2">Ajouter</button>
    </form>
  );
}
