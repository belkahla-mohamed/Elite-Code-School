"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Eye, EyeClosed, SpinnerGap } from "@phosphor-icons/react";
import { useAuth } from "@/lib/auth-context";
import { showToast } from "@/components/ui/toast";

type Mode = "login" | "forgot" | "reset";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { isAuthenticated, isAdmin, isParent, login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("reset");
    if (token) {
      setResetToken(token);
      setMode("reset");
    }
  }, []);

  useEffect(() => {
    if (mode === "login" && isAuthenticated) {
      router.replace(isAdmin ? "/dashboard" : "/parent");
    }
  }, [isAuthenticated, isAdmin, mode, router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/parent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, secret: password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Identifiants incorrects");
        showToast(data.error ?? "Identifiants incorrects", "error");
        setLoading(false);
        return;
      }

      login(data.user, data.token);
      router.replace("/parent");
    } catch {
      setError("Erreur de connexion");
      showToast("Erreur de connexion", "error");
      setLoading(false);
    }
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/parent/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erreur lors de l'envoi");
        setLoading(false);
        return;
      }

      setInfo(data.message ?? "Si un compte existe pour cet email, un lien de réinitialisation vient d'être envoyé.");
      setLoading(false);
    } catch {
      setError("Erreur de connexion");
      setLoading(false);
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/parent/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: resetToken, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erreur lors de la réinitialisation");
        setLoading(false);
        return;
      }

      setInfo(data.message ?? "Mot de passe mis à jour. Vous pouvez vous connecter.");
      setMode("login");
      setPassword("");
      setConfirmPassword("");
      setLoading(false);
    } catch {
      setError("Erreur de connexion");
      setLoading(false);
    }
  }

  const inputClass = "rounded-brand-sm border-2 border-border bg-white px-4 py-2.5 font-body text-sm text-ink outline-none transition duration-200 ease-out focus:border-brand placeholder:text-ink-soft/50 dark:border-white/10 dark:bg-[#1e293b] dark:text-white dark:placeholder:text-slate-400";

  return (
    <div className="bg-white py-16 sm:py-24 dark:bg-body">
      <div className="container-shell max-w-md">
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
            <span className="tag">Espace parent</span>
          </div>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-[-0.02em] text-ink dark:text-white">
            {mode === "forgot" ? "Mot de passe oublié" : "Connexion Parent"}
          </h1>
          <p className="mt-2 text-sm font-medium leading-6 text-ink-soft dark:text-slate-300">
            {mode === "forgot"
              ? "Entrez votre email pour recevoir un lien de réinitialisation."
              : "Entrez votre email et votre mot de passe (ou le code d'accès fourni par l'école) pour accéder au portfolio de votre enfant."}
          </p>

        {mode === "login" && (
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <label className="flex flex-col gap-2 text-sm font-semibold text-ink">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="parent@email.com"
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-ink">
            Mot de passe ou code d&apos;accès
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className={`w-full pr-10 ${inputClass}`}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft transition duration-200 ease-out hover:text-ink">
                {showPassword ? <EyeClosed className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </label>

          {error && (
            <div className="rounded-md bg-coral/10 p-3 text-sm font-medium text-coral">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-50">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <SpinnerGap className="size-4 animate-spin" /> Connexion en cours...
              </span>
            ) : (
              "Se connecter"
            )}
          </button>

          <button
            type="button"
            onClick={() => { setMode("forgot"); setError(""); setInfo(""); }}
            className="w-full text-center text-sm font-semibold text-brand transition duration-200 ease-out hover:underline"
          >
            Mot de passe oublié ?
          </button>
        </form>
        )}

        {mode === "forgot" && (
        <form onSubmit={handleForgot} className="mt-6 space-y-4">
          <label className="flex flex-col gap-2 text-sm font-semibold text-ink">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="parent@email.com"
              className={inputClass}
            />
          </label>

          {error && <p className="text-sm text-coral bg-coral/10 rounded-brand-sm px-4 py-3">{error}</p>}
          {info && <p className="text-sm text-lime bg-lime/10 rounded-brand-sm px-4 py-3">{info}</p>}

          <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-50">
            {loading ? <SpinnerGap className="size-4 animate-spin" /> : "Envoyer le lien"}
          </button>

          <button
            type="button"
            onClick={() => { setMode("login"); setError(""); setInfo(""); }}
            className="w-full text-center text-sm font-semibold text-ink-soft hover:underline"
          >
            Retour à la connexion
          </button>
        </form>
        )}

        {mode === "reset" && (
        <form onSubmit={handleReset} className="mt-6 space-y-4">
          <label className="flex flex-col gap-2 text-sm font-semibold text-ink">
            Nouveau mot de passe
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              placeholder="••••••••"
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-ink">
            Confirmer le nouveau mot de passe
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              placeholder="••••••••"
              className={inputClass}
            />
          </label>

          {error && <p className="text-sm text-coral bg-coral/10 rounded-brand-sm px-4 py-3">{error}</p>}
          {info && <p className="text-sm text-lime bg-lime/10 rounded-brand-sm px-4 py-3">{info}</p>}

          <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-50">
            {loading ? <SpinnerGap className="size-4 animate-spin" /> : "Définir le mot de passe"}
          </button>

          <button
            type="button"
            onClick={() => { setMode("login"); setError(""); setInfo(""); }}
            className="w-full text-center text-sm font-semibold text-ink-soft hover:underline"
          >
            Retour à la connexion
          </button>
        </form>
        )}
        </div>

        {mode === "login" && (
          <p className="mt-6 text-center text-sm font-medium text-ink-soft dark:text-slate-400">
            Pas de code d&apos;accès? Contactez l&apos;école.
          </p>
        )}

        <div className="mt-6 text-center">
          <Link href="/admin-login" className="inline-flex items-center gap-1 text-sm font-bold text-ink-soft transition duration-200 ease-out hover:text-brand">
            Espace administration <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
