"use client";

import { useEffect, useState } from "react";
import type { StudentPortfolio, Teacher } from "@/lib/types";

type TeacherDashboard = {
  teacher: Teacher;
  students: StudentPortfolio[];
};

export function TeacherPortal() {
  const [email, setEmail] = useState("");
  const [secret, setSecret] = useState("");
  const [dashboard, setDashboard] = useState<TeacherDashboard | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    void load();
  }, []);

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
    if (!response.ok) {
      setMessage(result.error ?? "Accès teacher invalide.");
      return;
    }

    setMessage("Session teacher ouverte.");
    setEmail("");
    setSecret("");
    await load();
  }

  async function addStudentItem(event: React.FormEvent<HTMLFormElement>, student: StudentPortfolio, type: "projects" | "certifications" | "gallery") {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload =
      type === "projects"
        ? {
            title: form.get("title"),
            description: form.get("description"),
            tags: String(form.get("tags") ?? "")
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean),
            status: form.get("status"),
            progress: form.get("progress"),
            dateLabel: form.get("dateLabel"),
            emoji: form.get("emoji")
          }
        : type === "certifications"
          ? {
              title: form.get("title"),
              mention: form.get("mention"),
              dateLabel: form.get("dateLabel"),
              emoji: form.get("emoji")
            }
          : {
              label: form.get("title"),
              emoji: form.get("emoji")
            };

    const response = await fetch(`/api/students/${student.id}/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    setMessage(response.ok ? "Portfolio mis à jour." : result.error ?? "Ajout impossible.");
    if (response.ok) {
      event.currentTarget.reset();
      await load();
    }
  }

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

  return (
    <div className="container-shell py-10">
      <div className="mb-8 rounded-brand border border-ink/10 bg-white p-6">
        <span className="tag">Teacher dashboard</span>
        <h1 className="mt-3 font-display text-4xl font-extrabold">Bonjour {dashboard.teacher.fullName}</h1>
        <p className="mt-2 text-ink-soft">
          Tu peux enrichir les portfolios élèves. Les inscriptions, parents, privacy et teachers restent côté admin.
        </p>
      </div>

      {message && <p className="mb-4 rounded-brand-sm bg-accent/10 p-3 text-sm text-accent">{message}</p>}

      <section className="grid gap-5">
        {dashboard.students.map((student) => (
          <article key={student.id} className="rounded-brand border border-ink/10 bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex size-14 items-center justify-center rounded-xl bg-accent font-bold text-white">{student.avatar}</div>
                <div>
                  <h3 className="font-display text-xl font-bold">{student.firstName} {student.lastName}</h3>
                  <p className="text-sm text-ink-soft">{student.levelLabel} · {student.projects.length} projets</p>
                </div>
              </div>
              <a href={`/portfolio/${student.slug}`} className="btn-outline px-4 py-2">Voir portfolio</a>
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
