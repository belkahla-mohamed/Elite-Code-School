import Link from "next/link";

export default function StudentPage() {
  return (
    <main className="min-h-screen bg-surface py-12">
      <section className="container-shell max-w-3xl">
        <div className="rounded-brand border border-[#E6EEF8] bg-white p-8">
          <span className="tag">Student · Phase 2</span>
          <h1 className="mt-4 font-display text-4xl font-extrabold tracking-[-0.04em]">Espace student prévu</h1>
          <p className="mt-4 leading-8 text-ink-soft">
            Interface pour élève: missions, projets, badges, certificats et portfolio personnel. Pour le MVP, le parent contrôle la confidentialité.
          </p>
          <Link href="/login" className="btn-primary mt-6 inline-flex">Retour au choix de rôle</Link>
        </div>
      </section>
    </main>
  );
}
