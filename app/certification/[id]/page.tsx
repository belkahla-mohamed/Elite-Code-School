import { getCertificationById } from "@/lib/store";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle, ExternalLink, Linkedin, Share2 } from "lucide-react";

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
      title: `${certification.emoji} ${certification.title} — Elite Code School`,
      description: `Félicitations à ${student.firstName} ${student.lastName} pour l'obtention de la certification ${certification.title} avec la mention "${certification.mention}"`,
      type: "website",
    },
  };
}

export default async function CertificationPage({ params }: Props) {
  const { id } = await params;
  const result = await getCertificationById(id);
  if (!result) {
    notFound();
  }

  const { certification, student } = result;
  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://elitecodeschool.ma"}/certification/${id}`;
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(`🎓 ${certification.emoji} ${certification.title} — ${certification.mention}\n${shareUrl}`)}`;

  return (
    <main className="min-h-screen bg-gradient-to-b from-surface to-white py-16">
      <section className="container-shell max-w-lg">
        <Link href="/portfolios" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-ink-soft hover:text-sky transition">
          <ArrowLeft className="size-4" /> Tous les portfolios
        </Link>

        <div className="rounded-brand border-2 border-border bg-white dark:bg-surface p-8 text-center shadow-card">
          {/* Verification Badge */}
          <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full bg-lime/10 px-4 py-2">
            <CheckCircle className="size-5 text-lime" />
            <span className="text-sm font-black uppercase tracking-wide text-lime">Vérifié</span>
          </div>

          {/* Emoji Badge */}
          <div className="mx-auto flex size-24 items-center justify-center rounded-3xl text-6xl shadow-lg" style={{ background: certification.gradient }}>
            {certification.emoji}
          </div>

          {/* Title */}
          <h1 className="mt-6 font-display text-3xl font-extrabold text-ink">{certification.title}</h1>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <span className="rounded-full bg-sky/10 px-4 py-1.5 text-sm font-bold text-sky">
              Mention: {certification.mention}
            </span>
            <span className="rounded-full bg-surface px-4 py-1.5 text-sm text-ink-soft">
              {certification.dateLabel}
            </span>
          </div>

          {/* Student Info */}
          <div className="mt-8 rounded-2xl bg-gradient-to-br from-sky/5 to-cyan/5 border-2 border-border p-6">
            <p className="text-xs font-black uppercase tracking-wide text-ink-soft">Décerné à</p>
            <p className="mt-1 font-display text-2xl font-bold text-ink">{student.firstName} {student.lastName}</p>
            <p className="mt-1 text-sm text-ink-soft">Elite Code School · Marrakech</p>
            <div className="mt-4 rounded-xl bg-white dark:bg-surface p-3 border border-border">
              <p className="text-[10px] font-black uppercase tracking-wider text-ink-soft">Code de vérification unique</p>
              <p className="mt-1 font-mono text-sm font-bold tracking-wider text-sky break-all">{id}</p>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="mt-8 space-y-3">
            <p className="text-xs font-black uppercase tracking-wide text-ink-soft">Partager cette certification</p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href={linkedinShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#0A66C2] px-6 py-3 text-sm font-bold text-white hover:bg-[#0A66C2]/90 transition"
              >
                <Linkedin className="size-4" />
                LinkedIn
              </a>
              <a
                href={whatsappShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-bold text-white hover:bg-[#25D366]/90 transition"
              >
                <Share2 className="size-4" />
                WhatsApp
              </a>
              <Link href={`/portfolios/${student.slug}`} className="btn-outline px-6 py-3">
                <ExternalLink className="size-4" /> Portfolio
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
