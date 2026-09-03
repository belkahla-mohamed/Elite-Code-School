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
    <main className="bg-surface py-20">
      <div className="container-shell max-w-lg">
        {/* Back link */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-ink-soft hover:text-sky transition"
        >
          <ArrowLeft className="size-4" /> Retour à l&apos;accueil
        </Link>

        {/* Success card */}
        <div className="rounded-brand border-2 border-border bg-white p-8 text-center dark:bg-surface sm:p-12">
          {/* Success animation */}
          <div className="mx-auto flex size-24 items-center justify-center rounded-brand bg-sky">
            <PartyPopper className="size-12 text-white" />
          </div>

          {/* Title */}
          <h1 className="mt-6 font-display text-3xl font-black text-ink sm:text-4xl">
            Demande envoyée !
          </h1>
          <p className="mt-3 text-ink-soft leading-relaxed">
            Merci pour votre confiance ! Votre demande d&apos;inscription a bien
            été reçue et sera traitée dans les plus brefs délais.
          </p>

          {/* Reference ID */}
          {requestId && (
            <div className="mt-8 inline-flex items-center gap-3 rounded-brand-sm border-2 border-sky/20 bg-sky/5 px-6 py-4">
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
            <div className="flex items-start gap-4 rounded-brand-sm border-2 border-border bg-surface p-5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-brand-sm bg-amber/10">
                <Clock className="size-5 text-amber" />
              </div>
              <div>
                <h3 className="font-black text-ink">Traitement sous 24h</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                  Notre équipe examine chaque demande avec attention. Vous
                  recevrez une réponse par email ou téléphone.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-brand-sm border-2 border-border bg-surface p-5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-brand-sm bg-sky/10">
                <Mail className="size-5 text-sky" />
              </div>
              <div>
                <h3 className="font-black text-ink">Vérifiez vos emails</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                  Un email de confirmation vous sera envoyé. Pensez à vérifier
                  vos spams si vous ne recevez rien.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-brand-sm border-2 border-border bg-surface p-5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-brand-sm bg-lime/10">
                <Sparkles className="size-5 text-lime" />
              </div>
              <div>
                <h3 className="font-black text-ink">Prochaines étapes</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">
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
