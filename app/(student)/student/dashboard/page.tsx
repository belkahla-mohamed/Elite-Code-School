"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type DashboardData = {
  student: {
    firstName: string; lastName: string; avatar: string; avatarGradient: string;
    levelLabel: string; hours: number; program: { title: string } | null;
  };
  stats: { projectsDone: number; projectsInProgress: number; certifications: number; gallery: number; totalHours: number };
  level: number;
  xp: { current: number; nextLevel: number; xpInLevel: number; progress: number };
  missions: { id: string; title: string; description: string; icon: string; xp: number; done: boolean }[];
  badges: { id: string; name: string; icon: string; earned: boolean; description: string }[];
  recentActivity: { date: string; text: string; type: string }[];
};

const statCards = [
  { key: "projectsDone", label: "Projets finis", color: "from-green-400 to-emerald-500" },
  { key: "projectsInProgress", label: "En cours", color: "from-amber-400 to-orange-500" },
  { key: "certifications", label: "Certificats", color: "from-purple-400 to-violet-500" },
  { key: "totalHours", label: "Heures", suffix: "h", color: "from-sky-400 to-blue-500" },
] as const;

export default function StudentDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/student/dashboard")
      .then((r) => r.json())
      .then((json) => {
        if (json.error) setError(json.error);
        else setData(json);
      })
      .catch(() => setError("Erreur de connexion"));
  }, []);

  if (error) {
    return (
      <section className="container-shell py-16 text-center">
        <div className="mx-auto max-w-md rounded-brand border border-[#E6EEF8] bg-white p-8">
          <span className="text-4xl">🔒</span>
          <h1 className="mt-4 font-display text-2xl font-extrabold">Accès restreint</h1>
          <p className="mt-2 text-ink-soft">{error}</p>
          <Link href="/login" className="btn-primary mt-6 inline-flex">Connexion</Link>
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="container-shell py-16 text-center">
        <div className="mx-auto max-w-md rounded-brand border border-[#E6EEF8] bg-white p-8">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-sky border-t-transparent" />
          <p className="mt-4 text-ink-soft">Chargement...</p>
        </div>
      </section>
    );
  }

  const { student, stats, level, xp, missions, badges, recentActivity } = data;

  return (
    <section className="container-shell py-8">
      <div className="mb-8 flex items-center gap-6">
        <div
          className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br text-4xl shadow-md"
          style={{ background: student.avatarGradient }}>
          {student.avatar}
        </div>
        <div className="flex-1">
          <h1 className="font-display text-3xl font-extrabold tracking-[-0.04em]">
            Bonjour, {student.firstName} 👋
          </h1>
          <p className="mt-1 text-ink-soft">
            {student.program?.title} · {student.levelLabel}
          </p>
        </div>
        <div className="rounded-brand bg-white px-6 py-3 text-center shadow-sm ring-1 ring-[#E6EEF8]">
          <div className="font-display text-3xl font-extrabold text-sky">{level}</div>
          <div className="text-xs font-semibold text-ink-soft">Niveau</div>
        </div>
      </div>

      <div className="mb-8 overflow-hidden rounded-brand bg-white shadow-sm ring-1 ring-[#E6EEF8]">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-ink-soft">XP</span>
            <span className="text-sm font-semibold text-sky">{xp.xpInLevel} / {xp.nextLevel}</span>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-sky/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky to-blue-400 transition-all duration-700"
              style={{ width: `${xp.progress}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-ink-soft">{xp.current} XP total</p>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((card) => {
          const val = stats[card.key as keyof typeof stats];
          return (
            <div key={card.key} className="rounded-brand bg-white p-5 shadow-sm ring-1 ring-[#E6EEF8]">
              <div className={`mb-3 h-2 w-12 rounded-full bg-gradient-to-r ${card.color}`} />
              <div className="font-display text-3xl font-extrabold">{val}{"suffix" in card ? card.suffix : ""}</div>
              <div className="mt-1 text-sm font-semibold text-ink-soft">{card.label}</div>
            </div>
          );
        })}
      </div>

      <div className="mb-8">
        <h2 className="mb-4 font-display text-xl font-extrabold">🎯 Missions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {missions.map((m) => (
            <div
              key={m.id}
              className={`rounded-brand p-4 shadow-sm ring-1 transition ${
                m.done ? "bg-green-50 ring-green-200" : "bg-white ring-[#E6EEF8]"
              }`}>
              <div className="flex items-center justify-between">
                <span className="text-2xl">{m.icon}</span>
                {m.done && <span className="text-sm text-green-600">✅</span>}
              </div>
              <h3 className="mt-3 font-display text-lg font-bold">{m.title}</h3>
              <p className="mt-1 text-xs text-ink-soft">{m.description}</p>
              <div className="mt-2 text-xs font-semibold text-sky">+{m.xp} XP</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 font-display text-xl font-extrabold">🏅 Badges</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {badges.map((b) => (
              <div
                key={b.id}
                className={`rounded-brand p-4 text-center shadow-sm ring-1 transition ${
                  b.earned ? "bg-white ring-[#E6EEF8]" : "bg-gray-50 ring-gray-100 opacity-40"
                }`}
                title={b.description}>
                <div className="text-3xl">{b.icon}</div>
                <div className="mt-2 text-xs font-bold">{b.name}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-4 font-display text-xl font-extrabold">⚡ Activité récente</h2>
          <div className="rounded-brand bg-white p-5 shadow-sm ring-1 ring-[#E6EEF8]">
            {recentActivity.length === 0 ? (
              <p className="py-8 text-center text-ink-soft">Pas encore d&apos;activité</p>
            ) : (
              <ul className="space-y-3">
                {recentActivity.map((a, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky/10 text-xs">
                      {a.text.match(/^[^\s]+/)?.[0]}
                    </span>
                    <span className="flex-1">{a.text.replace(/^[^\s]+\s/, "")}</span>
                    <span className="text-xs text-ink-soft">{a.date}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
