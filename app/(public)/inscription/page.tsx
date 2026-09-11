import Link from "next/link";
import { ArrowRight, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { EnrollmentForm } from "@/components/forms/enrollment-form";
import { getPrograms } from "@/lib/store";

interface Props { searchParams: Promise<{ program?: string }> }

const reassurances = [
  "Âge validé entre 7 et 17 ans.",
  "Aucun élève n'est créé avant validation admin.",
  "Le secret parent est généré après acceptation.",
];

export default async function InscriptionPage({ searchParams }: Props) {
  const programs = await getPrograms();
  const { program } = await searchParams;
  const initialProgramId = program && programs.some((p) => p.id === program) ? program : "";

  return (
    <div className="overflow-hidden bg-white dark:bg-body">
      {/* Form + reassurances */}
      <section className="bg-white py-16 sm:py-24 dark:bg-body">
        <div className="container-shell grid items-start gap-10 lg:grid-cols-[.9fr_1.1fr] lg:gap-12">
          <div>
            <span className="tag">Comment ça marche</span>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-[-0.02em] text-ink dark:text-white sm:text-4xl">
              Une demande simple, étape par étape.
            </h2>
            <div className="mt-8 grid gap-3">
              {reassurances.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-brand border border-border bg-surface p-4 text-sm font-semibold text-ink-soft transition duration-300 ease-out hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-md dark:border-white/10 dark:bg-[#1e293b] dark:text-slate-300">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-brand-sm bg-brand/10">
                    <CheckCircle className="size-5 text-brand" />
                  </span>
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-brand bg-brand p-6 dark:bg-brand-dark">
              <h3 className="font-display text-lg font-semibold text-white">Une question avant de vous inscrire ?</h3>
              <p className="mt-1 text-sm font-medium leading-6 text-white/80">
                L&apos;équipe vous aide à choisir le bon parcours pour votre enfant.
              </p>
              <Link href="/contact" className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-white transition duration-300 ease-out hover:gap-2.5">
                Écrivez-nous <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          <EnrollmentForm programs={programs} initialProgramId={initialProgramId} />
        </div>
      </section>
    </div>
  );
}
