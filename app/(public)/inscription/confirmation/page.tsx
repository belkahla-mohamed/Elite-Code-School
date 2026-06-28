import Link from "next/link";
import { Home, BookOpen, CheckCircle } from "lucide-react";

export default function ConfirmationPage() {
  return (
    <div className="py-20 text-center">
      <div className="container-shell max-w-lg">
        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-lime/15">
          <CheckCircle className="size-10 text-lime" />
        </div>
        <h1 className="mt-6 font-display text-4xl font-black text-ink">Demande envoyée !</h1>
        <p className="mt-4 text-base font-semibold leading-7 text-ink-soft">
          Votre demande d&apos;inscription a bien été reçue. L&apos;équipe Elite Code School vous
          contactera sous <strong>24 heures</strong> pour confirmer le parcours et planifier la séance d&apos;essai.
        </p>
        <div className="mt-6 rounded-brand border-2 border-border bg-surface p-4 text-sm font-semibold text-ink-soft">
          Vous recevrez un email de confirmation à l&apos;adresse fournie.
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-sky px-6 py-3 text-sm font-black uppercase tracking-wide text-white hover:bg-sky-dark transition">
            <Home className="size-4" /> Accueil
          </Link>
          <Link href="/curricula" className="inline-flex items-center gap-2 rounded-full border-2 border-border bg-white dark:bg-surface px-6 py-3 text-sm font-black uppercase tracking-wide text-ink hover:border-sky transition">
            <BookOpen className="size-4" /> Programmes
          </Link>
        </div>
      </div>
    </div>
  );
}
