"use client";

import { useEffect, useState } from "react";
import type { DashboardSnapshot, StudentPortfolio } from "@/lib/types";

export function AdminDashboard() {
  const [snapshot, setSnapshot] = useState<DashboardSnapshot | null>(null);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [createdSecret, setCreatedSecret] = useState<string | null>(null);
  const [createdTeacherSecret, setCreatedTeacherSecret] = useState<string | null>(null);

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    const [requestsResponse, studentsResponse, teachersResponse] = await Promise.all([
      fetch("/api/inscriptions"),
      fetch("/api/students"),
      fetch("/api/teachers")
    ]);
    if (!requestsResponse.ok || !studentsResponse.ok || !teachersResponse.ok) return;

    const requestsData = await requestsResponse.json();
    const studentsData = await studentsResponse.json();
    const teachersData = await teachersResponse.json();
    setSnapshot({
      requests: requestsData.requests,
      students: studentsData.students,
      teachers: teachersData.teachers,
      programs: []
    });
  }

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch("/api/auth/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });

    if (!response.ok) {
      setMessage("Mot de passe incorrect.");
      return;
    }

    setPassword("");
    setMessage("Session admin ouverte.");
    await load();
  }

  async function createTeacherAccount(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/teachers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: form.get("fullName"),
        email: form.get("email"),
        specialty: form.get("specialty")
      })
    });

    const result = await response.json();
    if (!response.ok) {
      setMessage(result.error ?? "Création teacher impossible.");
      return;
    }

    setMessage("Teacher créé. Secret généré à transmettre une seule fois.");
    setCreatedTeacherSecret(result.teacherSecret);
    event.currentTarget.reset();
    await load();
  }

  async function updateRequest(id: string, action: "accept" | "refuse") {
    const response = await fetch(`/api/inscriptions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action })
    });
    const result = await response.json();
    if (!response.ok) {
      setMessage(result.error ?? "Action impossible.");
      return;
    }
    setMessage(action === "accept" ? "Demande acceptée, élève + accès parent créés." : "Demande refusée.");
    setCreatedSecret(result.parentSecret ?? null);
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

  if (!snapshot) {
    return (
      <div className="mx-auto max-w-md rounded-brand border border-ink/10 bg-white p-8">
        <h1 className="font-display text-3xl font-extrabold">Espace admin</h1>
        <p className="mt-2 text-sm text-ink-soft">Mot de passe demo: <code className="font-mono">admin123</code>. Change-le dans <code className="font-mono">ADMIN_PASSWORD</code>.</p>
        <form onSubmit={login} className="mt-6 flex flex-col gap-4">
          <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Mot de passe admin" className="rounded-brand-sm border border-ink/15 bg-surface px-4 py-3 outline-none focus:border-accent focus:ring-4 focus:ring-accent/15" />
          <button className="btn-primary">Entrer</button>
        </form>
        {message && <p className="mt-4 rounded-brand-sm bg-red-50 p-3 text-sm text-red-700">{message}</p>}
      </div>
    );
  }

  const pending = snapshot.requests.filter((request) => request.status === "pending");

  return (
    <div className="container-shell py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="tag">Admin dashboard</span>
          <h1 className="mt-3 font-display text-4xl font-extrabold">Pilotage Elite Code School</h1>
          <p className="mt-2 text-ink-soft">Admin valide les inscriptions, crée les parents/students et invite les teachers.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-center text-sm md:grid-cols-4">
          <Stat value={snapshot.students.length} label="Élèves" />
          <Stat value={pending.length} label="En attente" />
          <Stat value={snapshot.requests.length} label="Demandes" />
          <Stat value={snapshot.teachers.length} label="Teachers" />
        </div>
      </div>

      {message && <p className="mb-4 rounded-brand-sm bg-accent/10 p-3 text-sm text-accent">{message}</p>}
      {createdSecret && (
        <p className="mb-6 rounded-brand-sm bg-amber/10 p-4 text-sm text-amber-900">
          Secret parent généré: <strong className="font-mono">{createdSecret}</strong>. À transmettre au parent une seule fois.
        </p>
      )}
      {createdTeacherSecret && (
        <p className="mb-6 rounded-brand-sm bg-amber/10 p-4 text-sm text-amber-900">
          Secret teacher généré: <strong className="font-mono">{createdTeacherSecret}</strong>. À transmettre au teacher une seule fois.
        </p>
      )}

      <section className="mb-10 rounded-brand border border-ink/10 bg-white p-6">
        <h2 className="font-display text-2xl font-bold">Teachers</h2>
        <p className="mt-2 text-sm text-ink-soft">Seul l'admin crée les accès teacher. Pas de création libre côté public.</p>
        <form onSubmit={createTeacherAccount} className="mt-5 grid gap-3 lg:grid-cols-[1fr_1fr_1fr_auto]">
          <input name="fullName" required placeholder="Nom complet" className="rounded-brand-sm border border-ink/10 px-3 py-2 text-sm" />
          <input name="email" required type="email" placeholder="Email teacher" className="rounded-brand-sm border border-ink/10 px-3 py-2 text-sm" />
          <input name="specialty" placeholder="Spécialité" className="rounded-brand-sm border border-ink/10 px-3 py-2 text-sm" />
          <button className="btn-primary px-4 py-2">Créer</button>
        </form>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {snapshot.teachers.map((teacher) => (
            <article key={teacher.id} className="rounded-brand-sm border border-ink/10 bg-surface p-4">
              <h3 className="font-semibold">{teacher.fullName}</h3>
              <p className="text-sm text-ink-soft">{teacher.email} · {teacher.specialty ?? "Général"}</p>
              <span className="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold">{teacher.status}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-10 rounded-brand border border-ink/10 bg-white p-6">
        <h2 className="font-display text-2xl font-bold">Demandes d'inscription</h2>
        <div className="mt-5 grid gap-4">
          {snapshot.requests.map((request) => (
            <article key={request.id} className="rounded-brand-sm border border-ink/10 bg-surface p-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold">{request.studentFirstName} {request.studentLastName} · {request.age} ans</h3>
                  <p className="text-sm text-ink-soft">{request.parentEmail} · {request.parentPhone}</p>
                  {request.message && <p className="mt-2 text-sm">{request.message}</p>}
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold">{request.status}</span>
              </div>
              {request.status === "pending" && (
                <div className="mt-4 flex gap-2">
                  <button onClick={() => updateRequest(request.id, "accept")} className="btn-primary px-4 py-2">Accepter</button>
                  <button onClick={() => updateRequest(request.id, "refuse")} className="btn-outline px-4 py-2">Refuser</button>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-5">
        <h2 className="font-display text-2xl font-bold">Élèves & portfolios</h2>
        {snapshot.students.map((student) => (
          <article key={student.id} className="rounded-brand border border-ink/10 bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex size-14 items-center justify-center rounded-xl bg-accent font-bold text-white">{student.avatar}</div>
                <div>
                  <h3 className="font-display text-xl font-bold">{student.firstName} {student.lastName}</h3>
                  <p className="text-sm text-ink-soft">{student.levelLabel} · {student.isPublic ? "Public" : "Privé"}</p>
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

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <span className="rounded-brand bg-white p-4">
      <strong>{value}</strong>
      <br />
      {label}
    </span>
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
