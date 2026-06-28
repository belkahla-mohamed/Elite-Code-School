import { getCertificationById } from "@/lib/store";
import type { Metadata } from "next";
import Link from "next/link";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const result = await getCertificationById(id);
  if (!result) return { title: "Certification introuvable" };
  const { certification, student } = result;
  return {
    title: `${certification.title} — ${student.firstName} ${student.lastName}`,
    description: `Certification obtenue par ${student.firstName} ${student.lastName}: ${certification.title} — ${certification.mention}`,
    openGraph: {
      title: `${certification.emoji} ${certification.title}`,
      description: `Félicitations à ${student.firstName} ${student.lastName} pour l'obtention de la certification ${certification.title} avec la mention "${certification.mention}"`,
    },
  };
}

export default async function CertificationPage({ params }: Props) {
  const { id } = await params;
  const result = await getCertificationById(id);
  if (!result) return <div className="container-shell py-16 text-center text-ink-soft">Certification introuvable</div>;

  const { certification, student } = result;

  return (
    <main className="min-h-screen bg-surface py-16">
      <section className="container-shell max-w-lg">
        <div className="rounded-brand border-2 border-[#E6EEF8] dark:border-border bg-white dark:bg-surface p-8 text-center shadow-card">
          <div className="mx-auto flex size-20 items-center justify-center rounded-2xl text-5xl" style={{ background: certification.gradient }}>
            {certification.emoji}
          </div>
          <h1 className="mt-6 font-display text-3xl font-extrabold">{certification.title}</h1>
          <p className="mt-2 text-ink-soft">Mention: <span className="font-bold text-sky">{certification.mention}</span></p>
          <p className="mt-1 text-sm text-ink-soft">{certification.dateLabel}</p>

          <div className="mt-8 rounded-brand-sm bg-surface p-5">
            <p className="text-sm text-ink-soft">Décerné à</p>
            <p className="font-display text-xl font-bold">{student.firstName} {student.lastName}</p>
            <p className="text-sm text-ink-soft">Elite Code School · Marrakech</p>
          </div>

          <div className="mt-6 rounded-brand-sm bg-sky/5 p-4">
            <p className="text-xs text-ink-soft">Code de vérification</p>
            <p className="font-mono text-lg font-bold tracking-wider text-sky">{id}</p>
          </div>

          <div className="mt-8 flex justify-center gap-3">
            <Link href={`/portfolio/${student.firstName.toLowerCase()}-${student.lastName.toLowerCase()}`} className="btn-outline px-5 py-2">
              Voir le portfolio
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
