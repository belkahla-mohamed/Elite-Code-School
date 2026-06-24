"use client";

import { useState } from "react";

export function QuickContactForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.currentTarget.reset();
    setSent(true);
  }

  return (
    <form onSubmit={onSubmit} className="card p-6">
      <h3 className="font-display text-2xl font-extrabold">Contact rapide</h3>
      <p className="mt-2 text-sm text-ink-soft">Question rapide? L'équipe vous rappelle sans créer une inscription.</p>
      <div className="mt-5 grid gap-3">
        <input required name="name" className="rounded-brand-sm border border-ink/15 bg-surface px-4 py-3 text-sm outline-none focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/15" placeholder="Votre nom" />
        <input required name="phone" type="tel" className="rounded-brand-sm border border-ink/15 bg-surface px-4 py-3 text-sm outline-none focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/15" placeholder="Téléphone" />
        <textarea name="message" className="min-h-24 rounded-brand-sm border border-ink/15 bg-surface px-4 py-3 text-sm outline-none focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/15" placeholder="Votre question…" />
      </div>
      <button className="btn-primary mt-5 w-full">Envoyer le message</button>
      {sent && <p className="mt-4 rounded-brand-sm bg-emerald-50 p-3 text-center text-sm text-emerald-700">Message noté. On vous rappelle bientôt.</p>}
    </form>
  );
}
