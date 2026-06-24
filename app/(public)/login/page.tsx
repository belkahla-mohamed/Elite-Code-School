"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, Loader2, Users, GraduationCap } from "lucide-react";

type Role = "parent" | "teacher" | null;

export default function LoginPage() {
  const [role, setRole] = useState<Role>(null);
  const [email, setEmail] = useState("");
  const [secret, setSecret] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = role === "parent" ? "/api/auth/parent" : "/api/auth/teacher";
      const body = role === "parent" ? { email, secret } : { email, secret };
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Identifiants incorrects");
        setLoading(false);
        return;
      }

      if (role === "parent") {
        router.push("/parent");
      } else {
        router.push("/teacher");
      }
    } catch {
      setError("Erreur de connexion");
      setLoading(false);
    }
  }

  if (!role) {
    return (
      <div className="py-20 text-center">
        <div className="container-shell max-w-lg">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-ink-soft hover:text-sky transition mb-8">
            <ArrowLeft className="size-4" /> Retour à l&apos;accueil
          </Link>
          <h1 className="font-display text-4xl font-black text-ink">Connexion</h1>
          <p className="mt-3 text-ink-soft">Choisissez votre espace</p>
          <div className="mt-8 grid gap-4">
            <button onClick={() => setRole("parent")} className="rounded-brand border-2 border-[#E8EEF6] bg-white p-6 text-left transition hover:border-sky hover:shadow-lg group">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-sky/10 text-sky group-hover:bg-sky group-hover:text-white transition">
                <Users className="size-7" />
              </div>
              <h3 className="mt-4 font-display text-xl font-black group-hover:text-sky transition">Parent</h3>
              <p className="text-sm text-ink-soft">Accéder au portfolio de votre enfant</p>
            </button>
            <button onClick={() => setRole("teacher")} className="rounded-brand border-2 border-[#E8EEF6] bg-white p-6 text-left transition hover:border-sky hover:shadow-lg group">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-lime/10 text-lime group-hover:bg-lime group-hover:text-white transition">
                <GraduationCap className="size-7" />
              </div>
              <h3 className="mt-4 font-display text-xl font-black group-hover:text-sky transition">Enseignant</h3>
              <p className="text-sm text-ink-soft">Gérer les élèves et les projets</p>
            </button>
          </div>
          <div className="mt-6">
            <Link href="/admin" className="text-sm font-bold text-ink-soft hover:text-sky transition">
              Espace administration →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20">
      <div className="container-shell max-w-md">
        <button onClick={() => { setRole(null); setError(""); setSecret(""); setEmail(""); }} className="inline-flex items-center gap-2 text-sm font-bold text-ink-soft hover:text-sky transition mb-8">
          <ArrowLeft className="size-4" /> Changer d&apos;espace
        </button>
        <h1 className="font-display text-3xl font-black text-ink">
          Connexion {role === "parent" ? "Parent" : "Enseignant"}
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          {role === "parent"
            ? "Entrez l'email et le code d'accès fournis par l'école."
            : "Entrez vos identifiants enseignant."}
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <label className="flex flex-col gap-2 text-sm font-semibold">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="parent@email.com"
              className="rounded-brand-sm border-2 border-[#E8EEF6] bg-white px-4 py-2.5 font-body text-ink transition focus:border-sky focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold">
            Code d&apos;accès / Secret
            <div className="relative">
              <input
                type={showSecret ? "text" : "password"}
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded-brand-sm border-2 border-[#E8EEF6] bg-white px-4 py-2.5 pr-10 font-body text-ink transition focus:border-sky focus:outline-none"
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

        {role === "parent" && (
          <p className="mt-6 text-center text-sm text-ink-soft">
            Pas de code d&apos;accès? Contactez l&apos;école.
          </p>
        )}
      </div>
    </div>
  );
}
