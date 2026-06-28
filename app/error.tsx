"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center px-6">
      <span className="text-8xl font-display font-black text-coral/20">500</span>
      <h1 className="font-display font-black text-3xl text-ink mt-4">Erreur serveur</h1>
      <p className="text-ink-soft mt-2 max-w-sm">
        Une erreur s&apos;est produite. Veuillez réessayer plus tard.
      </p>
      <div className="flex gap-3 mt-8">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-full bg-sky px-6 py-3 text-sm font-black uppercase tracking-wide text-white hover:bg-sky-dark transition"
        >
          Réessayer
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border-2 border-[#E8EEF6] dark:border-border bg-white dark:bg-surface px-6 py-3 text-sm font-black uppercase tracking-wide text-ink hover:border-sky transition"
        >
          Accueil
        </Link>
      </div>
    </div>
  );
}
