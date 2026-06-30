"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [secret, setSecret] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { isAuthenticated, isAdmin, isParent, login } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(isAdmin ? "/dashboard" : "/parent");
    }
  }, [isAuthenticated, isAdmin, router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/parent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, secret }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Identifiants incorrects");
        setLoading(false);
        return;
      }

      login(data.user, data.token);
      router.replace("/parent");
    } catch {
      setError("Erreur de connexion");
      setLoading(false);
    }
  }

  return (
    <div className="py-20">
      <div className="container-shell max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-ink-soft hover:text-sky transition mb-8">
          <ArrowLeft className="size-4" /> Retour à l&apos;accueil
        </Link>

        <div className="mb-8 rounded-brand border-2 border-border bg-white dark:bg-surface p-6">
          <Image
            src="/logos/logo-icon.png"
            alt="Elite Code School"
            width={36}
            height={36}
            className="size-9"
          />
          <h1 className="mt-3 font-display text-3xl font-black text-ink">Connexion Parent</h1>
          <p className="mt-2 text-sm text-ink-soft">
            Entrez l&apos;email et le code d&apos;accès fournis par l&apos;école pour accéder au portfolio de votre enfant.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <label className="flex flex-col gap-2 text-sm font-semibold text-ink">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="parent@email.com"
              className="rounded-brand-sm border-2 border-border bg-white dark:bg-surface px-4 py-2.5 font-body text-ink transition focus:border-sky focus:outline-none placeholder:text-ink-soft/50"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-ink">
            Code d&apos;accès
            <div className="relative">
              <input
                type={showSecret ? "text" : "password"}
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded-brand-sm border-2 border-border bg-white dark:bg-surface px-4 py-2.5 pr-10 font-body text-ink transition focus:border-sky focus:outline-none placeholder:text-ink-soft/50"
              />
              <button type="button" onClick={() => setShowSecret(!showSecret)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft">
                {showSecret ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </label>

          {error && <p className="text-sm text-coral bg-coral/10 rounded-brand-sm px-4 py-3">{error}</p>}

          <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-50">
            {loading ? <Loader2 className="size-4 animate-spin" /> : "Se connecter"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-soft">
          Pas de code d&apos;accès? Contactez l&apos;école.
        </p>

        <div className="mt-6 text-center">
          <Link href="/admin-login" className="text-sm font-bold text-ink-soft hover:text-sky transition">
            Espace administration →
          </Link>
        </div>
      </div>
    </div>
  );
}
