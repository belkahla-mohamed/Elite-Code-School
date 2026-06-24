import Link from "next/link";
import { notFound } from "next/navigation";
import { PortfolioTabs } from "@/components/PortfolioTabs";
import { getPortfolioBySlug } from "@/lib/store";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function PortfolioPage({ params }: Props) {
  const { slug } = await params;
  const student = await getPortfolioBySlug(slug);
  if (!student) notFound();

  return (
    <main className="min-h-screen bg-surface">
      <div className="bg-ink text-white">
        <div className="container-shell py-8">
          <Link href="/" className="text-sm text-white/60 hover:text-white">← Retour au site</Link>
          <div className="mt-8 grid gap-6 pb-10 md:grid-cols-[auto_1fr_auto] md:items-center">
            <div className="flex size-24 items-center justify-center rounded-3xl font-display text-3xl font-extrabold" style={{ background: student.avatarGradient }}>
              {student.avatar}
            </div>
            <div>
              <h1 className="font-display text-4xl font-extrabold">{student.firstName} {student.lastName}</h1>
              <p className="mt-2 text-white/70">{student.levelLabel}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-sm text-white/75">
                <span className="rounded-full bg-white/10 px-3 py-1">📅 {student.age} ans</span>
                <span className="rounded-full bg-white/10 px-3 py-1">📚 {student.program?.title}</span>
                <span className="rounded-full bg-white/10 px-3 py-1">⏱ {student.hours}h de code</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <span className="rounded-brand-sm bg-white/10 p-4"><strong>{student.projects.length}</strong><br /><small>Projets</small></span>
              <span className="rounded-brand-sm bg-white/10 p-4"><strong>{student.certifications.length}</strong><br /><small>Certifs</small></span>
              <span className="rounded-brand-sm bg-white/10 p-4"><strong>{student.hours}h</strong><br /><small>Code</small></span>
            </div>
          </div>
        </div>
      </div>
      <section className="container-shell py-10">
        <PortfolioTabs student={student} />
      </section>
    </main>
  );
}
