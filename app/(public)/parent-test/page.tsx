"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Info } from "@phosphor-icons/react";
import { showToast } from "@/components/ui/toast";

export default function ParentTestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("parent.youssef@example.com");
  const [secret, setSecret] = useState("YOUSSEF-2026");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/parent-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, secretCode: secret })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("ecs_token", data.token);
        showToast("Connexion réussie", "success");
        window.location.href = "/parent/dashboard";
      } else {
        showToast(data.error || "Identifiants invalides", "error");
      }
    } catch (e) {
      showToast("Erreur serveur", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-body p-4">
      <div className="w-full max-w-md rounded-brand border-2 border-border bg-white p-8 shadow-card dark:border-white/10 dark:bg-[#1e293b]">
        <h1 className="font-display text-2xl font-black text-ink dark:text-white">Test Espace Parent</h1>
        <p className="mt-2 text-sm text-ink-soft dark:text-slate-400">
          Connectez-vous pour tester l&apos;espace parent.
        </p>

        <div className="mt-6 flex items-start gap-3 rounded-brand bg-sky/10 p-4 text-sky">
          <Info className="mt-0.5 size-5 shrink-0" />
          <div className="text-sm">
            <p className="font-bold">Identifiants de démonstration :</p>
            <p className="mt-1">Email : <code>parent.youssef@example.com</code></p>
            <p className="mt-0.5">Code Secret : <code>YOUSSEF-2026</code></p>
          </div>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-bold text-ink dark:text-white mb-1.5">Email parent</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-brand border-2 border-border bg-body px-4 py-2.5 text-sm outline-none transition focus:border-sky dark:bg-white/5 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-ink dark:text-white mb-1.5">Code Secret</label>
            <input
              type="text"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className="w-full rounded-brand border-2 border-border bg-body px-4 py-2.5 text-sm outline-none transition focus:border-sky dark:bg-white/5 dark:text-white"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary mt-2 w-full py-3">
            {loading ? "Connexion..." : (
              <>Accéder au portail <ArrowRight className="ml-2 size-4" /></>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
