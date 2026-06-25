"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Mission = {
  id: string; title: string; description: string; icon: string; xp: number; done: boolean;
};

export default function MissionsPage() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/student/dashboard")
      .then((r) => r.json())
      .then((data) => { setMissions(data.missions ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="container-shell py-16 text-center">Chargement...</div>;

  const done = missions.filter((m) => m.done).length;
  const totalXp = missions.filter((m) => m.done).reduce((a, m) => a + m.xp, 0);

  return (
    <section className="container-shell py-8">
      <div className="mb-8 rounded-brand bg-white p-6 shadow-sm ring-1 ring-[#E6EEF8]">
        <h1 className="font-display text-3xl font-extrabold">🎯 Missions</h1>
        <p className="mt-2 text-ink-soft">{done}/{missions.length} missions complétées · {totalXp} XP gagnés</p>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-sky/10">
          <div className="h-full rounded-full bg-gradient-to-r from-sky to-blue-400 transition-all" style={{ width: `${(done / Math.max(missions.length, 1)) * 100}%` }} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {missions.map((m) => (
          <div key={m.id} className={`rounded-brand p-5 shadow-sm ring-1 transition ${m.done ? "bg-green-50 ring-green-200" : "bg-white ring-[#E6EEF8]"}`}>
            <div className="flex items-center justify-between">
              <span className="text-3xl">{m.icon}</span>
              {m.done ? <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">Fait</span>
              : <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">En cours</span>}
            </div>
            <h2 className="mt-3 font-display text-lg font-bold">{m.title}</h2>
            <p className="mt-1 text-sm text-ink-soft">{m.description}</p>
            <div className="mt-3 text-sm font-semibold text-sky">+{m.xp} XP</div>
          </div>
        ))}
      </div>
    </section>
  );
}
