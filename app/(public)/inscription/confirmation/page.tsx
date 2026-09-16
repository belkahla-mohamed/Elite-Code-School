"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle, Clock, EnvelopeSimple, Confetti, Sparkle, ShieldCheck } from "@phosphor-icons/react";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const requestId = searchParams.get("id");

  return (
    <div className="min-h-screen bg-white dark:bg-body">
      {/* Hero band */}
      <section className="relative overflow-hidden bg-brand dark:bg-brand-dark">
        <div aria-hidden className="absolute -left-20 -top-20 size-64 rounded-full bg-white/10" />
        <div aria-hidden className="absolute -right-24 top-24 size-80 rounded-full bg-white/10" />
        <div aria-hidden className="absolute -bottom-28 left-[40%] size-72 rounded-full bg-amber/25" />

        <div className="container-shell relative py-16 text-center sm:py-20">
          <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm sm:size-24">
            <Confetti className="size-10 text-white sm:size-12" />
          </div>
          <h1 className="mt-6 font-display text-3xl font-black text-white sm:text-4xl md:text-5xl">
            Demande d&apos;inscription reçue !
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base font-medium leading-7 text-white/80 sm:text-lg">
            Merci pour votre confiance. Notre équipe va étudier votre demande
            et vous recontacter sous <strong className="text-white">24 heures</strong>.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 sm:py-16">
        <div className="container-shell">
          {/* Reference ID */}
          {requestId && (
            <div className="mx-auto mb-10 max-w-md rounded-brand border-2 border-brand/20 bg-brand/5 p-6 text-center">
              <p className="text-xs font-bold uppercase tracking-wider text-ink-soft dark:text-slate-400">
                Numéro de dossier
              </p>
              <p className="mt-2 font-mono text-2xl font-black text-brand tracking-wider">
                {requestId}
              </p>
              <p className="mt-2 text-xs text-ink-soft dark:text-slate-400">
                Gardez ce numéro — vous en aurez besoin pour le suivi.
              </p>
            </div>
          )}

          {/* Info cards grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-brand border border-border bg-white p-6 transition duration-300 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-md dark:border-white/10 dark:bg-[#1e293b]">
              <span className="flex size-12 items-center justify-center rounded-brand-sm bg-amber/15">
                <Clock className="size-6 text-amber" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-ink dark:text-white">Réponse sous 24h</h3>
              <p className="mt-2 text-sm leading-6 text-ink-soft dark:text-slate-400">
                Notre équipe pédagogique examine chaque demande. Vous recevrez
                un appel ou un email pour confirmer l&apos;inscription et planifier
                la première séance d&apos;essai.
              </p>
            </div>

            <div className="rounded-brand border border-border bg-white p-6 transition duration-300 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-md dark:border-white/10 dark:bg-[#1e293b]">
              <span className="flex size-12 items-center justify-center rounded-brand-sm bg-sky/15">
                <EnvelopeSimple className="size-6 text-sky" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-ink dark:text-white">Vérifiez vos emails</h3>
              <p className="mt-2 text-sm leading-6 text-ink-soft dark:text-slate-400">
                Un email de confirmation a été envoyé à l&apos;adresse indiquée.
                Pensez à vérifier vos spams si vous ne recevez rien.
              </p>
            </div>

            <div className="rounded-brand border border-border bg-white p-6 transition duration-300 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-md dark:border-white/10 dark:bg-[#1e293b] sm:col-span-2 lg:col-span-1">
              <span className="flex size-12 items-center justify-center rounded-brand-sm bg-lime/15">
                <ShieldCheck className="size-6 text-lime" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-ink dark:text-white">Votre espace parent</h3>
              <p className="mt-2 text-sm leading-6 text-ink-soft dark:text-slate-400">
                Dès validation, vous recevrez vos identifiants pour accéder
                à l&apos;Espace Parent — suivez la progression de votre enfant
                en temps réel.
              </p>
            </div>
          </div>

          {/* Steps timeline */}
          <div className="mx-auto mt-12 max-w-2xl">
            <h2 className="text-center font-display text-xl font-bold text-ink dark:text-white">Prochaines étapes</h2>
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">1</div>
                <p className="mt-3 text-sm font-semibold text-ink dark:text-white">Appel de confirmation</p>
                <p className="mt-1 text-xs text-ink-soft dark:text-slate-400">Nous vous contactons sous 24h</p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">2</div>
                <p className="mt-3 text-sm font-semibold text-ink dark:text-white">Séance d&apos;essai</p>
                <p className="mt-1 text-xs text-ink-soft dark:text-slate-400">Rencontrez votre enfant</p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">3</div>
                <p className="mt-3 text-sm font-semibold text-ink dark:text-white">Espace Parent</p>
                <p className="mt-1 text-xs text-ink-soft dark:text-slate-400">Suivez la progression</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/" className="btn-primary inline-flex items-center gap-2 px-8 py-3">
              Retour à l&apos;accueil <ArrowRight className="size-4" />
            </Link>
            <Link href="/curricula" className="btn-outline inline-flex items-center gap-2 px-8 py-3">
              Découvrir nos programmes
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-body">
          <div className="size-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
