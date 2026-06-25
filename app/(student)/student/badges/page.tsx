"use client";

import { useEffect, useState } from "react";

type Badge = {
  id: string; name: string; icon: string; earned: boolean; description: string;
};

export default function BadgesPage() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/student/dashboard")
      .then((r) => r.json())
      .then((data) => { setBadges(data.badges ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="container-shell py-16 text-center">Chargement...</div>;

  const earned = badges.filter((b) => b.earned).length;

  return (
    <section className="container-shell py-8">
      <div className="mb-8 rounded-brand bg-white p-6 shadow-sm ring-1 ring-[#E6EEF8]">
        <h1 className="font-display text-3xl font-extrabold">🏅 Badges</h1>
        <p className="mt-2 text-ink-soft">{earned}/{badges.length} badges débloqués</p>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-sky/10">
          <div className="h-full rounded-full bg-gradient-to-r from-amber to-orange-400 transition-all" style={{ width: `${(earned / Math.max(badges.length, 1)) * 100}%` }} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {badges.map((b) => (
          <div key={b.id} className={`rounded-brand p-5 text-center shadow-sm ring-1 transition ${b.earned ? "bg-white ring-[#E6EEF8]" : "bg-gray-50 ring-gray-100 opacity-50"}`}>
            <div className="text-5xl">{b.icon}</div>
            <h2 className="mt-3 font-display text-lg font-bold">{b.name}</h2>
            <p className="mt-1 text-sm text-ink-soft">{b.description}</p>
            {b.earned ? (
              <span className="mt-3 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">Débloqué</span>
            ) : (
              <span className="mt-3 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-400">Verrouillé</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
