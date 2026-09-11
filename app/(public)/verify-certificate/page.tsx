import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Medal, CalendarBlank, Hash, DownloadSimple } from "@phosphor-icons/react/dist/ssr";
import { getCertificationById } from "@/lib/store";
import { PrintButton } from "@/components/ui/print-button";

export const metadata = {
  title: "Vérification de Certificat | Elite Code School",
  description: "Vérifiez l'authenticité d'un certificat délivré par Elite Code School.",
};

export default async function VerifyCertificatePage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;

  if (!id) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-4 text-center">
        <h1 className="font-display text-2xl font-bold text-ink">ID de certificat manquant</h1>
        <p className="mt-2 text-ink-soft">Veuillez fournir un identifiant valide pour vérifier le certificat.</p>
        <Link href="/" className="btn-primary mt-6"><ArrowLeft className="mr-2 size-4" /> Retour à l&apos;accueil</Link>
      </div>
    );
  }

  const result = await getCertificationById(id);

  if (!result) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-4 text-center">
        <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-coral/10 text-coral">
          <Medal className="size-8" />
        </div>
        <h1 className="font-display text-2xl font-bold text-ink">Certificat introuvable</h1>
        <p className="mt-2 text-ink-soft">L&apos;identifiant fourni ne correspond à aucun certificat valide dans notre base de données.</p>
        <Link href="/" className="btn-primary mt-6"><ArrowLeft className="mr-2 size-4" /> Retour à l&apos;accueil</Link>
      </div>
    );
  }

  const { certification: cert, student } = result;

  return (
    <div className="bg-body py-12 sm:py-24">
      <div className="container-shell max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <Link href={`/portfolios/${student.slug}`} className="inline-flex items-center gap-2 text-sm font-bold text-ink-soft hover:text-ink transition">
            <ArrowLeft className="size-4" /> Retour au portfolio
          </Link>
          <PrintButton />
        </div>

        <div className="overflow-hidden rounded-2xl border-2 border-border bg-white shadow-xl dark:border-white/10 dark:bg-[#1e293b]">
          <div className="border-b-2 border-border bg-surface p-6 text-center dark:border-white/10 dark:bg-white/5">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-lime/10 text-lime mb-4">
              <CheckCircle className="size-8" />
            </div>
            <h1 className="font-display text-2xl font-bold text-ink dark:text-white">Certificat Valide</h1>
            <p className="mt-1 text-sm text-ink-soft dark:text-slate-400">Ce certificat a été vérifié et certifié authentique par Elite Code School.</p>
          </div>

          <div className="p-8 sm:p-12 text-center" style={{ background: cert.gradient }}>
            <div className="mb-8 flex justify-center">
              <span className="flex size-20 items-center justify-center rounded-2xl bg-white/20 text-4xl shadow-sm backdrop-blur-sm">
                {cert.emoji}
              </span>
            </div>
            <h2 className="font-display text-4xl font-black text-white sm:text-5xl">{cert.title}</h2>
            <p className="mt-6 text-lg font-medium text-white/90">décerné avec succès à</p>
            <p className="mt-2 font-display text-3xl font-bold text-white">{student.firstName} {student.lastName}</p>
            <div className="mt-8 inline-block rounded-full bg-white/20 px-6 py-2 backdrop-blur-sm">
              <p className="text-lg font-bold text-white">{cert.mention}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y-2 sm:divide-y-0 sm:divide-x-2 divide-border dark:divide-white/10 bg-white dark:bg-[#1e293b]">
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <CalendarBlank className="mb-2 size-6 text-ink-soft dark:text-slate-400" />
              <p className="text-xs font-bold uppercase tracking-wider text-ink-soft dark:text-slate-500">Date d&apos;émission</p>
              <p className="mt-1 font-bold text-ink dark:text-white">{new Date(cert.issueDate).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}</p>
            </div>
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <Hash className="mb-2 size-6 text-ink-soft dark:text-slate-400" />
              <p className="text-xs font-bold uppercase tracking-wider text-ink-soft dark:text-slate-500">Numéro de série</p>
              <p className="mt-1 font-mono font-bold text-ink dark:text-white">{cert.serialCode || cert.id}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-ink-soft">
          <p>Pour toute question concernant ce certificat, veuillez contacter <a href="mailto:contact@elitecodeschool.ma" className="font-bold underline">contact@elitecodeschool.ma</a>.</p>
        </div>
      </div>
    </div>
  );
}
