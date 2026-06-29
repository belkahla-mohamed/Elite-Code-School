"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

export function QuickContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = new FormData(event.currentTarget);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          phone: form.get("phone"),
          message: form.get("message"),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Erreur lors de l'envoi");
        return;
      }

      event.currentTarget.reset();
      setStatus("success");
      setMessage(data.message ?? "Message noté. On vous rappelle bientôt.");
    } catch {
      setStatus("error");
      setMessage("Erreur de connexion. Veuillez réessayer.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="card p-6">
      <h3 className="font-display text-2xl font-extrabold text-ink">Contact rapide</h3>
      <p className="mt-2 text-sm text-ink-soft">Question rapide? L&apos;équipe vous rappelle sans créer une inscription.</p>
      <div className="mt-5 grid gap-3">
        <input required name="name" className="rounded-brand-sm border-2 border-border bg-surface px-4 py-3 text-sm text-ink outline-none focus:border-accent focus:ring-4 focus:ring-accent/15 placeholder:text-ink-soft/50" placeholder="Votre nom" />
        <input required name="phone" type="tel" className="rounded-brand-sm border-2 border-border bg-surface px-4 py-3 text-sm text-ink outline-none focus:border-accent focus:ring-4 focus:ring-accent/15 placeholder:text-ink-soft/50" placeholder="Téléphone" />
        <Textarea name="message" required placeholder="Votre question…" className="min-h-24" />
      </div>
      <button type="submit" disabled={status === "loading"} className="btn-primary mt-5 w-full disabled:opacity-60">
        {status === "loading" ? "Envoi..." : "Envoyer le message"}
      </button>
      {message && (
        <p className={`mt-4 rounded-brand-sm p-3 text-center text-sm ${status === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
          {message}
        </p>
      )}
    </form>
  );
}
