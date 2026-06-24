import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { RoleLoginChooser } from "@/components/RoleLoginChooser";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-surface py-10">
      <div className="container-shell">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-extrabold text-accent">
          <ArrowLeft className="size-4" />
          Retour à l'accueil
        </Link>
        <div className="mx-auto mt-10 max-w-5xl">
          <div className="mb-8 text-center">
            <h1 className="font-display text-5xl font-extrabold tracking-[-0.05em] text-ink">Choisir votre espace</h1>
            <p className="mx-auto mt-4 max-w-2xl leading-8 text-ink-soft">
              Parent, teacher ou student. Chaque personne entre par son espace, avec les informations adaptées à son rôle.
            </p>
          </div>
          <RoleLoginChooser />
        </div>
      </div>
    </main>
  );
}
