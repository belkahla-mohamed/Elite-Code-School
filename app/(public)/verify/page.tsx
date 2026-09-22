"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MagnifyingGlass, ShieldCheck } from "@phosphor-icons/react";

export default function VerifyPage() {
  const [code, setCode] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) return;
    router.push(`/verify/${encodeURIComponent(trimmed)}`);
  }

  return (
    <div className="min-h-[70vh] bg-body py-16 px-4 flex items-center justify-center">
      <div className="w-full max-w-xl text-center">
        <div className="inline-flex items-center justify-center size-16 rounded-full bg-sky/10 text-sky mb-6">
          <ShieldCheck className="size-8" />
        </div>
        <h1 className="font-display text-4xl font-black text-ink mb-3">
          Vérification de Certificat
        </h1>
        <p className="text-ink-soft mb-10 max-w-md mx-auto">
          Entrez le numéro de série d&apos;un certificat Elite Code School pour
          vérifier son authenticité.
        </p>

        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-ink-soft" />
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="ECS-XXXXXXXX-XXXX"
              className="w-full rounded-full border-2 border-border bg-white dark:bg-surface pl-12 pr-4 py-3.5 text-base font-mono font-bold text-ink placeholder:text-ink-soft/50 focus:border-sky focus:outline-none transition"
              autoFocus
            />
          </div>
          <button type="submit" className="btn-primary rounded-full px-8 py-3.5 text-base">
            Vérifier
          </button>
        </form>
      </div>
    </div>
  );
}
