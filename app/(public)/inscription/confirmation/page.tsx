"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Mail,
  PartyPopper,
  Sparkles,
} from "lucide-react";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const requestId = searchParams.get("id");

  return (
    <main className="min-h-screen bg-gradient-to-b from-surface to-white py-20">
      <div className="container-shell max-w-lg">
        {/* Back link */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-ink-soft hover:text-sky transition"
        >
          <ArrowLeft className="size-4" /> Retour à l&apos;accueil
        </Link>

        {/* Success card */}
        <div className="rounded-3xl border-2 border-border bg-white dark:bg-surface p-8 sm:p-12 text-center shadow-card">
          {/* Success animation */}
          <div className="mx-auto flex size-24 items-center justify-center rounded-3xl bg-gradient-to-br from-sky to-cyan shadow-lg shadow-sky/20">
            <PartyPopper className="size-12 text-white" />
          </div>

          {/* Title */}
          <h1 className="mt-6 font-display text-3xl sm:text-4xl font-extrabold text-ink">
            Demande envoyée ! 🎉
          </h1>
          <p className="mt-3 text-ink-soft leading-relaxed">
            Merci pour votre confiance ! Votre demande d&apos;inscription a bien
            été reçue et sera traitée dans les plus brefs délais.
          </p>

          {/* Reference ID */}
          {requestId && (
            <div className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-sky/5 border-2 border-sky/20 px-6 py-4">
              <CheckCircle2 className="size-6 text-sky" />
              <div className="text-left">
                <p className="text-xs font-black uppercase tracking-wide text-ink-soft">
                  Numéro de dossier
                </p>
                <p className="mt-0.5 font-mono text-lg font-bold text-sky tracking-wider">
                  {requestId}
                </p>
              </div>
            </div>
          )}

          {/* Info cards */}
          <div className="mt-8 grid gap-4 text-left">
            <div className="rounded-2xl bg-surface border-2 border-border p-5 flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber/10">
                <Clock className="size-5 text-amber" />
              </div>
              <div>
                <h3 className="font-bold text-ink">Traitement sous 24h</h3>
                <p className="mt-1 text-sm text-ink-soft leading-relaxed">
                  Notre équipe examine chaque demande avec attention. Vous
                  recevrez une réponse par email ou téléphone.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-surface border-2 border-border p-5 flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sky/10">
                <Mail className="size-5 text-sky" />
              </div>
              <div>
                <h3 className="font-bold text-ink">Vérifiez vos emails</h3>
                <p className="mt-1 text-sm text-ink-soft leading-relaxed">
                  Un email de confirmation vous sera envoyé. Pensez à vérifier
                  vos spams si vous ne recevez rien.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-surface border-2 border-border p-5 flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-lime/10">
                <Sparkles className="size-5 text-lime" />
              </div>
              <div>
                <h3 className="font-bold text-ink">Prochaines étapes</h3>
                <p className="mt-1 text-sm text-ink-soft leading-relaxed">
                  Une fois accepté, vous recevrez votre code d&apos;accès parent
                  pour suivre la progression de votre enfant.
                </p>
              </div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="btn-primary px-8 py-3">
              Retour à l&apos;accueil
            </Link>
            <Link
              href="/curricula"
              className="btn-outline px-8 py-3"
            >
              Découvrir nos programmes
            </Link>
          </div>
        </div>

        {/* Extra info */}
        <p className="mt-8 text-center text-xs text-ink-soft">
          Une question ? Contactez-nous au{" "}
          <span className="font-bold text-ink">+212 5XX XXX XXX</span> ou par
          email à{" "}
          <span className="font-bold text-ink">contact@elitecodeschool.ma</span>
        </p>
      </div>
    </main>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="size-8 animate-spin rounded-full border-4 border-sky border-t-transparent" />
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
