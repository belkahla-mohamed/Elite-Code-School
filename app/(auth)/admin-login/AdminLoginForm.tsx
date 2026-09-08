"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { showToast } from "@/components/ui/toast";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

const inputClass = "rounded-brand-sm border-2 border-border bg-white px-4 py-2.5 font-body text-sm text-ink outline-none transition duration-200 ease-out focus:border-brand placeholder:text-ink-soft/50 dark:border-white/10 dark:bg-[#1e293b] dark:text-white dark:placeholder:text-slate-400";

export function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  function togglePassword() {
    setShowPassword((prev) => !prev);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast("Veuillez remplir tous les champs", "error");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch("/api/auth/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error ?? "Identifiants incorrects", "error");
        return;
      }

      login(data.user, data.token);
      router.replace("/dashboard");
    } catch {
      showToast("Erreur de connexion", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 items-center bg-white py-16 sm:py-24 dark:bg-body">
      <div className="container-shell w-full max-w-md">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-ink-soft transition duration-200 ease-out hover:text-ink dark:hover:text-white">
          <ArrowLeft className="size-4" /> Retour à l&apos;accueil
        </Link>

        <div className="rounded-brand border border-border bg-white p-6 sm:p-8 dark:border-white/10 dark:bg-[#1e293b]">
          <Image
            src="/logos/logo-icon.png"
            alt="Elite Code School"
            width={36}
            height={36}
            className="size-9"
          />
          <div className="mt-4">
            <span className="tag">Administration</span>
          </div>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-[-0.02em] text-ink dark:text-white">Bon retour</h1>
          <p className="mt-2 text-sm font-medium leading-6 text-ink-soft dark:text-slate-300">Connectez-vous à l&apos;espace administration</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="flex flex-col gap-2 text-sm font-semibold text-ink">
              Email ou nom d&apos;utilisateur
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                placeholder="admin@elitecodeschool.com"
                className={inputClass}
                autoComplete="username"
                autoFocus
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-ink">
              Mot de passe
              <div className="relative">
                <input
                  key={String(showPassword)}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="Saisissez votre mot de passe"
                  className={`w-full pr-10 ${inputClass}`}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft transition duration-200 ease-out hover:text-ink"
                  aria-label={showPassword ? "Masquer" : "Afficher"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </label>

            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
              {loading ? <Loader2 className="size-4 animate-spin" /> : "Se connecter"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs font-medium text-ink-soft dark:text-slate-400">
          Accès réservé aux administrateurs d&apos;Elite Code School.
        </p>

        {process.env.NODE_ENV === "development" && (
          <p className="mt-4 text-center text-xs text-ink-soft/60">
            Identifiants demo: <code className="rounded bg-surface px-2 py-0.5 font-mono text-xs text-brand">admin@elitecodeschool.com</code> / <code className="rounded bg-surface px-2 py-0.5 font-mono text-xs text-brand">admin1234</code>
          </p>
        )}
      </div>
    </div>
  );
}
