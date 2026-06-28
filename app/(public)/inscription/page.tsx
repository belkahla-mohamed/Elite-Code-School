import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { EnrollmentForm } from "@/components/forms/enrollment-form";
import { getPrograms } from "@/lib/store";

export default async function InscriptionPage() {
  const programs = await getPrograms();

  return (
    <div className="py-20">
      <div className="container-shell">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-ink-soft hover:text-sky transition mb-8">
          <ArrowLeft className="size-4" /> Retour à l&apos;accueil
        </Link>
        <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <section>
            <span className="tag">Inscription</span>
            <h1 className="mt-4 font-display text-3xl sm:text-5xl font-extrabold tracking-[-0.05em] text-ink">
              Une demande simple, étape par étape.
            </h1>
            <p className="mt-5 leading-8 text-ink-soft">
              Un formulaire court en 4 étapes: élève, parcours, contact parent, puis récapitulatif.
            </p>
            <div className="mt-8 grid gap-3">
              {[
                "Âge validé entre 7 et 17 ans.",
                "Aucun élève n'est créé avant validation admin.",
                "Le secret parent est généré après acceptation.",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border-2 border-border bg-white dark:bg-surface p-4 text-sm font-semibold text-ink-soft">
                  <CheckCircle2 className="size-5 text-sky" />
                  {item}
                </div>
              ))}
            </div>
          </section>
          <EnrollmentForm programs={programs} />
        </div>
      </div>
    </div>
  );
}
