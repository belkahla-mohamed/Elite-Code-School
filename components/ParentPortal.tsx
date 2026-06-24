"use client";

import { useState } from "react";
import type { StudentPortfolio } from "@/lib/types";

export function ParentPortal() {
  const [email, setEmail] = useState("");
  const [secret, setSecret] = useState("");
  const [student, setStudent] = useState<StudentPortfolio | null>(null);
  const [message, setMessage] = useState("");

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch("/api/auth/parent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, secret })
    });

    const result = await response.json();
    if (!response.ok) {
      setMessage(result.error ?? "Accès invalide.");
      return;
    }

    setStudent(result.student);
    setMessage("Accès parent ouvert.");
  }

  async function togglePrivacy() {
    if (!student) return;
    const response = await fetch(`/api/students/${student.id}/privacy`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublic: !student.isPublic })
    });
    const result = await response.json();
    if (!response.ok) {
      setMessage(result.error ?? "Modification impossible.");
      return;
    }
    setStudent(result.student);
    setMessage(result.student.isPublic ? "Portfolio rendu public." : "Portfolio rendu privé.");
  }

  if (!student) {
    return (
      <div className="mx-auto max-w-md rounded-brand border border-ink/10 bg-white p-8 shadow-card">
        <span className="tag">Parent</span>
        <h1 className="mt-4 font-display text-3xl font-extrabold">Espace parent</h1>
        <p className="mt-2 text-sm text-ink-soft">Demo: <code className="font-mono">parent.youssef@example.com</code> + <code className="font-mono">YOUSEEF-2026</code></p>
        <form onSubmit={login} className="mt-6 flex flex-col gap-4">
          <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="Email parent" className="rounded-brand-sm border border-ink/15 bg-surface px-4 py-3 outline-none focus:border-accent focus:ring-4 focus:ring-accent/15" />
          <input value={secret} onChange={(event) => setSecret(event.target.value)} type="password" placeholder="Secret enfant" className="rounded-brand-sm border border-ink/15 bg-surface px-4 py-3 outline-none focus:border-accent focus:ring-4 focus:ring-accent/15" />
          <button className="btn-primary">Accéder</button>
        </form>
        {message && <p className="mt-4 rounded-brand-sm bg-red-50 p-3 text-sm text-red-700">{message}</p>}
      </div>
    );
  }

  return (
    <div className="container-shell py-10">
      <div className="rounded-brand border border-ink/10 bg-white p-8 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-2xl font-display text-xl font-bold text-white" style={{ background: student.avatarGradient }}>{student.avatar}</div>
            <div>
              <span className="tag">Espace parent</span>
              <h1 className="mt-2 font-display text-3xl font-extrabold">{student.firstName} {student.lastName}</h1>
              <p className="text-ink-soft">{student.levelLabel}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={togglePrivacy} className={student.isPublic ? "btn-outline px-5 py-2" : "btn-primary px-5 py-2"}>
              {student.isPublic ? "Rendre privé" : "Rendre public"}
            </button>
            <a href={`/portfolio/${student.slug}`} className="btn-outline px-5 py-2">Voir portfolio</a>
          </div>
        </div>
        {message && <p className="mt-5 rounded-brand-sm bg-accent/10 p-3 text-sm text-accent">{message}</p>}
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <Stat label="Visibilité" value={student.isPublic ? "Public" : "Privé"} />
          <Stat label="Projets" value={String(student.projects.length)} />
          <Stat label="Certificats" value={String(student.certifications.length)} />
          <Stat label="Heures de code" value={`${student.hours}h`} />
        </div>
        <div className="mt-8 rounded-brand-sm bg-surface p-5">
          <h2 className="font-display text-xl font-bold">Bilan téléchargeable</h2>
          <p className="mt-2 text-sm text-ink-soft">Pour le MVP, le bilan est préparé côté interface. La génération PDF peut être ajoutée ensuite avec le même modèle de données.</p>
          <button onClick={() => window.print()} className="btn-primary mt-4 px-5 py-2">Imprimer / sauvegarder PDF</button>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-brand-sm bg-surface p-4">
      <div className="text-sm text-ink-soft">{label}</div>
      <div className="mt-1 font-display text-2xl font-bold">{value}</div>
    </div>
  );
}
