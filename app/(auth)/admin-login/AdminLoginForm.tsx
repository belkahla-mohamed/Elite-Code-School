"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showToast } from "@/components/ui/toast";

export function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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

      if (!res.ok) {
        const data = await res.json();
        showToast(data.error ?? "Identifiants incorrects", "error");
        return;
      }

      window.location.href = "/dashboard";
    } catch {
      showToast("Erreur de connexion", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1">
      {/* Left Panel — Branding / Welcome */}
      <div className="hidden w-1/2 flex-col items-center justify-center bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] p-12 lg:flex relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="admin-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#admin-grid)" />
          </svg>
        </div>
        <div className="absolute top-0 left-0 w-full h-full">
          <svg viewBox="0 0 800 800" className="absolute -bottom-40 -left-40 w-[600px] h-[600px] opacity-[0.04]">
            <circle cx="400" cy="400" r="350" fill="none" stroke="white" strokeWidth="2" />
            <circle cx="400" cy="400" r="250" fill="none" stroke="white" strokeWidth="1.5" />
            <circle cx="400" cy="400" r="150" fill="none" stroke="white" strokeWidth="1" />
          </svg>
        </div>
        <div className="relative z-10 max-w-md text-center">
          <div className="mx-auto mb-8 flex size-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm p-4">
            <Image
              src="/logos/logo-icon.png"
              alt="Elite Code School"
              width={48}
              height={48}
              className="size-12"
            />
          </div>
          <h1 className="font-display text-4xl font-black text-white">Espace Administration</h1>
          <p className="mt-4 text-base text-white/60 leading-relaxed">
            Accédez au tableau de bord pour gérer les inscriptions, les élèves, les enseignants et les programmes pédagogiques.
          </p>
          <div className="mt-10 flex items-center justify-center gap-6 text-sm text-white/40">
            <span className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-lime" />
              Sécurisé
            </span>
            <span className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-sky" />
              Privé
            </span>
            <span className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-amber" />
              Restreint
            </span>
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-body p-6">
        <div className="w-full max-w-sm">
          <div className="dash-card p-8">
            <div className="text-center">
              <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-brand-sm bg-white dark:bg-surface p-2.5">
                <Image
                  src="/logos/logo-icon.png"
                  alt="Elite Code School"
                  width={36}
                  height={36}
                  className="size-9"
                />
              </div>
              <h1 className="font-display text-2xl font-black text-ink">Bon retour</h1>
              <p className="mt-1 text-sm text-ink-soft">Connectez-vous à l&apos;espace administration</p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-ink-soft">
                  Email ou nom d&apos;utilisateur
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="text"
                  placeholder="admin@elitecodeschool.com"
                  className="w-full rounded-full border-2 border-border bg-body px-5 py-3 text-sm text-ink outline-none transition focus:border-sky"
                  autoFocus
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-ink-soft">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    key={String(showPassword)}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    placeholder="Saisissez votre mot de passe"
                    className="w-full rounded-full border-2 border-border bg-body px-5 py-3 pr-12 text-sm text-ink outline-none transition focus:border-sky"
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={togglePassword}
                    className="absolute right-1 top-0 z-10 flex h-full w-10 items-center justify-center rounded-full text-ink-soft hover:text-ink transition cursor-pointer"
                    aria-label={showPassword ? "Masquer" : "Afficher"}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" isLoading={loading}>
                <LogIn className="size-4" />
                {loading ? "Connexion en cours..." : "Se connecter"}
              </Button>
            </form>

            <p className="mt-6 text-center text-xs text-ink-soft">
              Accès réservé aux administrateurs d&apos;Elite Code School.
            </p>
          </div>

          <p className="mt-4 text-center text-xs text-ink-soft/60">
            Identifiants demo: <code className="rounded bg-body px-2 py-0.5 font-mono text-xs text-sky">admin@elitecodeschool.com</code> / <code className="rounded bg-body px-2 py-0.5 font-mono text-xs text-sky">admin1234</code>
          </p>
        </div>
      </div>
    </div>
  );
}
