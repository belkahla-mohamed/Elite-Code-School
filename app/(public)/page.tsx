import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  CircuitBoard,
  Cpu,
  GraduationCap,
  MonitorPlay,
  Rocket,
  School,
  Sparkles,
  Star,
  Trophy
} from "lucide-react";
import { QuickContactForm } from "@/components/QuickContactForm";
import { getPrograms, getPublicPortfolios } from "@/lib/store";

const hardware = [
  [Bot, "mBot", "Robot programmable pour capteurs, moteurs et challenges."],
  [CircuitBoard, "Arduino", "Électronique, IoT et prototypes physiques."],
  [Cpu, "Micro:bit", "Premiers circuits et logique embarquée."],
  [BrainCircuit, "Dadabit AI", "Vision, sons et projets IA éducatifs."],
  [Rocket, "Raspberry Pi", "Linux, serveurs, vision et projets avancés."],
  [Sparkles, "VinciBot", "Robot créatif avec vision et apprentissage."],
  [Trophy, "Mission Mars", "Compétition annuelle et portfolio final."]
] as const;

const learningSteps = [
  ["Jouer", "Jeux guidés, robots et mini-missions pour déclencher la curiosité."],
  ["Apprendre", "Concepts clairs: logique, algorithmique, hardware, IA et web."],
  ["Créer", "Chaque élève finit par créer, présenter et documenter son projet."]
];

const trustBadges = ["Sans préparation", "Portfolio visible", "Confidentialité parent", "Suivi de progression"];

export default async function HomePage() {
  const [programs, portfolios] = await Promise.all([getPrograms(), getPublicPortfolios()]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Elite Code School",
    description: "Coding, robotique et IA pour les 7–17 ans à Marrakech",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://elitecodeschool.ma",
    address: { "@type": "PostalAddress", addressLocality: "Marrakech", addressCountry: "MA" },
    areaServed: "Marrakech",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Programmes STEM",
      itemListElement: programs.map((p) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Course", name: p.title, description: p.description },
      })),
    },
  };

  return (
    <div className="overflow-hidden bg-white dark:bg-body">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="bg-white pt-20 sm:pt-28 dark:bg-body">
        <div className="container-shell grid items-center gap-10 pb-10 sm:pb-14 lg:grid-cols-[.95fr_1.05fr]">
          <div>
            <h1 className="font-display text-[3rem] font-semibold leading-[1.02] tracking-[-0.02em] text-ink dark:text-ink sm:text-6xl lg:text-[4.6rem]">
              L&apos;école coding où les enfants deviennent des makers.
            </h1>
            <p className="mt-5 max-w-xl text-base sm:text-lg font-medium leading-7 sm:leading-8 text-ink-soft dark:text-ink-soft">
              Coding, robotique et IA pour les 7–17 ans: des missions fun pour enfants, des vrais projets pour ados, et un suivi clair pour parents.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/inscription" className="btn-primary text-xs sm:text-sm px-6 sm:px-8">
                Commencer l&apos;aventure <ArrowRight data-icon="inline-end" />
              </Link>
              <Link href="/login" className="btn-outline text-xs sm:text-sm px-6 sm:px-8">
                Connexion
              </Link>
            </div>
            <Link href="/inscription" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-sky transition hover:text-sky-dark">
              Séance découverte gratuite <ArrowRight className="size-4" />
            </Link>
          </div>
          <HeroPhoto />
        </div>
      </section>

      {/* ── Trust badges ──────────────────────────────────────── */}
      <section className="bg-sky py-6 text-white">
        <div className="container-shell text-center">
          <h2 className="font-display text-xl sm:text-3xl font-semibold">Ils codent déjà à Marrakech</h2>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {trustBadges.map((badge) => (
              <span key={badge} className="rounded-full bg-white/15 px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wide text-white">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Formations ────────────────────────────────────────── */}
      <section id="formations" className="py-14 sm:py-24 bg-white dark:bg-body">
        <SectionHeader
          title="Taper. Penser. Coder. Créer."
          subtitle="Un parcours pour chaque âge: coding, STEM, robotique, créativité, IA et web."
        />
        <div className="container-shell grid gap-6 lg:grid-cols-[.78fr_1.22fr]">
          <div className="rounded-brand border border-border bg-white p-5 sm:p-6 dark:border-border dark:bg-surface">
            <h3 className="font-display text-xl sm:text-2xl font-semibold text-amber">Elite Code Basics</h3>
            <p className="mt-3 text-sm font-medium leading-6 text-ink-soft dark:text-ink-soft">
              Les premiers pas: logique, clavier, blocs, robots et petites victoires visibles dès la première séance.
            </p>
            <ul className="mt-5 grid gap-3 text-sm font-bold text-ink dark:text-ink">
              {["Penser logiquement et enchaîner les étapes", "Gagner confiance avec les outils de code", "Devenir autonome dès le départ"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Star className="size-4 fill-amber text-amber" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-6 grid gap-3">
              {programs.slice(0, 4).map((program, index) => (
                <Link key={program.id} href="/inscription" className="flex items-center justify-between rounded-brand-sm border border-border bg-surface p-3 sm:p-4 font-bold transition hover:border-sky dark:border-border dark:bg-surface dark:text-ink">
                  <span className="text-sm">{program.title}</span>
                  <span className={`rounded-full px-2 sm:px-3 py-1 text-[10px] sm:text-xs ${programPill(index)}`}>{program.ageRange}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden lg:block rounded-brand border border-sky/20 bg-sky/5 p-5">
            <div className="rounded-brand-sm border border-sky/15 bg-sky/10 p-4">
              <div className="rounded-brand-sm bg-sky/10 p-5">
                <div className="grid min-h-[360px] place-items-center rounded-brand-sm border border-white bg-white p-6 shadow-card">
                  <GameBoard />
                </div>
                <div className="mt-4 flex items-center justify-between rounded-brand-sm bg-sky px-4 py-3 font-bold text-white">
                  <span>Mission: guide le robot</span>
                  <span className="rounded-full bg-white px-4 py-2 text-xs font-bold text-sky-dark">Indice</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <Link href="/inscription" className="btn-primary">Explorer la plateforme</Link>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────── */}
      <section id="how-it-works" className="bg-surface py-14 sm:py-20 dark:bg-body">
        <SectionHeader
          title="Comment ça marche à l'école"
          subtitle="Simple pour parents, motivant pour élèves."
        />
        <div className="container-shell grid gap-4 sm:grid-cols-3">
          {([
            [School, "Inscription & validation", "Le parent fait une demande; l'admin valide avant de créer l'accès."],
            [MonitorPlay, "L'élève apprend", "Missions, robots, projets et badges pour progresser en s'amusant."],
            [GraduationCap, "Suivi des progrès", "Le parent voit le portfolio, les certifs et la progression."]
          ] as const).map(([Icon, title, text]) => (
            <article key={title} className="rounded-brand border border-border bg-white p-6 sm:p-8 text-center shadow-card dark:border-border dark:bg-surface">
              <Icon className="mx-auto size-10 sm:size-12 text-sky" />
              <h3 className="mt-4 sm:mt-5 font-display text-xl sm:text-2xl font-semibold dark:text-ink">{title}</h3>
              <p className="mt-3 text-sm font-medium leading-6 text-ink-soft dark:text-ink-soft">{text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── CTA banner ────────────────────────────────────────── */}
      <section className="relative bg-sky py-14 sm:py-20 text-center text-white">
        <div className="container-shell">
          <span className="inline-flex rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-white">
            Prêt à commencer ?
          </span>
          <h2 className="mx-auto mt-4 max-w-3xl font-display text-3xl sm:text-5xl font-semibold tracking-[-0.02em]">
            Créez le compte de votre enfant aujourd&apos;hui
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base font-medium leading-7 text-white/90">
            Crée une demande en quelques étapes. L&apos;équipe confirme le niveau et le meilleur parcours.
          </p>
          <Link href="/inscription" className="mt-7 inline-flex rounded-brand-sm bg-white px-6 sm:px-8 py-3 text-xs sm:text-sm font-bold text-sky-dark shadow-card transition hover:bg-sky-light hover:text-white">
            Créer un compte gratuit <ArrowRight data-icon="inline-end" />
          </Link>
        </div>
      </section>

      {/* ── Building skills ───────────────────────────────────── */}
      <section id="materiel" className="py-14 sm:py-24 bg-white dark:bg-body">
        <SectionHeader
          title="Des compétences qui durent"
          subtitle="Des compétences durables grâce aux jeux, aux robots, aux projets et à la créativité."
        />
        <div className="container-shell grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {learningSteps.map(([title, text], index) => (
              <article key={title} className="rounded-brand border border-border bg-white p-5 sm:p-6 shadow-card dark:border-border dark:bg-surface">
                <span className="flex size-10 items-center justify-center rounded-full bg-sky font-display text-lg font-semibold text-white">{index + 1}</span>
                <h3 className="mt-3 font-display text-2xl font-semibold dark:text-ink">{title}</h3>
                <p className="mt-2 text-sm font-medium leading-6 text-ink-soft dark:text-ink-soft">{text}</p>
              </article>
            ))}
          </div>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-2">
            {hardware.map(([Icon, name, description], index) => (
              <article key={name} className="rounded-brand-sm border border-border bg-surface p-4 sm:p-6 transition hover:border-sky hover:shadow-card dark:border-border dark:bg-surface">
                <div className={`mb-4 flex size-10 sm:size-12 items-center justify-center rounded-brand-sm ${programIconBg(index)}`}>
                  <Icon className="text-ink dark:text-ink size-5 sm:size-6" />
                </div>
                <h3 className="font-display text-base sm:text-lg font-semibold dark:text-ink">{name}</h3>
                <p className="mt-1 text-xs sm:text-sm font-medium leading-5 sm:leading-6 text-ink-soft dark:text-ink-soft">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Competition ───────────────────────────────────────── */}
      <section id="competition" className="bg-[#FFF2D7] py-12 sm:py-20 dark:bg-body">
        <div className="container-shell grid items-center gap-8 rounded-[24px] sm:rounded-[34px] border-2 border-[#FFD489] bg-cream p-6 sm:p-8 dark:border-border dark:bg-surface lg:grid-cols-[.85fr_1.15fr]">
          <div>
            <span className="tag">Mission annuelle</span>
            <h2 className="mt-4 font-display text-3xl sm:text-5xl font-black tracking-[-0.04em] text-ink dark:text-ink">Mission Planète Mars</h2>
            <p className="mt-4 text-sm sm:text-base font-semibold leading-7 sm:leading-8 text-ink-soft dark:text-ink-soft">
              Une compétition façon mission control: stratégie, robotique, présentation et certificat final.
            </p>
            <Link href="/inscription" className="btn-primary mt-6 sm:mt-7 text-xs sm:text-sm">Rejoindre la mission</Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {learningSteps.map(([title, text], index) => (
              <div key={title} className="rounded-2xl sm:rounded-3xl border-2 border-white bg-white p-4 sm:p-5 dark:border-border dark:bg-surface">
                <span className="flex size-10 sm:size-12 items-center justify-center rounded-full bg-sky font-display text-lg sm:text-xl font-black text-white">0{index + 1}</span>
                <h3 className="mt-3 sm:mt-4 font-display text-base sm:text-xl font-black dark:text-ink">{title}</h3>
                <p className="mt-2 text-xs sm:text-sm font-semibold text-ink-soft dark:text-ink-soft">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Portfolios ────────────────────────────────────────── */}
      <section id="portfolios" className="py-14 sm:py-24 bg-surface dark:bg-body">
        <SectionHeader
          title="Adoré par les enfants. Clair pour les parents."
          subtitle="Chaque élève a un portfolio: projets, certificats, galerie, progression et confidentialité parent."
        />
        <div className="container-shell grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {portfolios.map((student, index) => (
            <Link
              key={student.id}
              href={`/portfolios/${student.slug}`}
              className="rounded-brand border border-border bg-white p-5 sm:p-6 shadow-card transition hover:border-sky hover:shadow-card-hover dark:border-border dark:bg-surface"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className={`flex size-12 sm:size-16 items-center justify-center rounded-brand-sm font-display text-xl sm:text-2xl font-semibold text-white ${studentAvatarBg(index)}`}>
                  {student.avatar}
                </div>
                <div>
                  <h3 className="font-display text-base sm:text-xl font-semibold dark:text-ink">{student.firstName} {student.lastName}</h3>
                  <p className="text-xs sm:text-sm font-bold text-ink-soft dark:text-ink-soft">{student.levelLabel}</p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2 text-center text-sm">
                <MiniStat value={student.projects.length} label="Projets" />
                <MiniStat value={student.certifications.length} label="Certifs" />
                <MiniStat value={`${student.hours}h`} label="Code" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Contact ───────────────────────────────────────────── */}
      <section id="contact-support" className="py-14 sm:py-24 bg-white dark:bg-body">
        <div className="container-shell grid gap-10 lg:grid-cols-[.85fr_1.15fr]">
          <div>
            <span className="tag">Support</span>
            <h2 className="mt-4 font-display text-3xl sm:text-5xl font-semibold tracking-[-0.02em] dark:text-ink">Emmenez votre enfant chez Elite Code.</h2>
            <p className="mt-4 text-sm sm:text-base font-semibold leading-7 sm:leading-8 text-ink-soft dark:text-ink-soft">
              Question rapide avant l&apos;inscription? Contactez l&apos;équipe sans remplir la demande complète.
            </p>
            <Link href="/inscription" className="btn-primary mt-7 inline-flex text-xs sm:text-sm">
              Aller à l&apos;inscription <ArrowRight data-icon="inline-end" />
            </Link>
          </div>
          <QuickContactForm />
        </div>
      </section>
    </div>
  );
}

function HeroPhoto() {
  return (
    <div className="relative pb-8 sm:pb-0">
      <div className="relative overflow-hidden rounded-brand border border-border bg-surface shadow-card dark:border-border dark:bg-surface">
        <Image
          src="/images/hero-student.jpg"
          alt="Élève en séance de coding à Elite Code School"
          width={1200}
          height={800}
          priority
          className="h-auto w-full object-cover"
        />
      </div>
      <div className="absolute right-5 -top-4 flex items-center gap-2 rounded-brand-sm border border-border bg-white px-4 py-2.5 shadow-card dark:border-border dark:bg-surface">
        <Star className="size-4 fill-amber text-amber" />
        <span className="text-xs font-bold text-ink dark:text-ink">Dès 7 ans</span>
      </div>
      <div className="absolute -bottom-2 left-4 hidden w-40 overflow-hidden rounded-brand-sm border-4 border-white bg-white shadow-card sm:block lg:-left-6 lg:w-48">
        <Image
          src="/images/hero-mentoring.jpg"
          alt="Accompagnement personnalisé pendant un atelier"
          width={400}
          height={300}
          className="h-auto w-full object-cover"
        />
      </div>
    </div>
  );
}

function GameBoard() {
  return (
    <div className="grid w-full max-w-xl gap-4">
      <div className="grid grid-cols-5 gap-3">
        {Array.from({ length: 15 }, (_, index) => (
          <div key={index} className={`aspect-square rounded-xl border-2 border-white ${index === 4 ? "bg-amber" : index % 7 === 0 ? "bg-amber/60" : "bg-sky"}`} />
        ))}
      </div>
      <div className="flex justify-center gap-2">
        {["←", "↑", "→", "GO"].map((item) => (
          <span key={item} className="rounded-full bg-sky/10 px-4 py-2 font-display font-semibold text-sky-dark">{item}</span>
        ))}
      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="container-shell mb-10 sm:mb-14 text-center">
      <h2 className="mx-auto max-w-3xl font-display text-3xl font-semibold tracking-[-0.02em] text-ink dark:text-ink md:text-5xl">{title}</h2>
      <p className="mx-auto mt-3 sm:mt-4 max-w-2xl text-sm sm:text-base font-medium leading-7 sm:leading-8 text-ink-soft dark:text-ink-soft">{subtitle}</p>
    </div>
  );
}

function MiniStat({ value, label }: { value: string | number; label: string }) {
  return (
    <span className="rounded-brand-sm border border-border bg-surface p-3 dark:border-border dark:bg-surface">
      <strong className="font-display text-lg font-semibold dark:text-ink">{value}</strong>
      <br />
      <small className="font-bold text-ink-soft dark:text-ink-soft">{label}</small>
    </span>
  );
}

function programPill(index: number) {
  return ["bg-[#E8F7FF] text-sky-dark", "bg-[#EFF9D8] text-ink", "bg-[#FFF3D6] text-ink", "bg-[#F1EAFE] text-violet"][index % 4];
}

function programIconBg(index: number) {
  return ["bg-[#E8F7FF]", "bg-[#EFF9D8]", "bg-[#FFF3D6]", "bg-[#F1EAFE]", "bg-[#FFE8ED]", "bg-[#EAF0FF]"][index % 6];
}

function studentAvatarBg(index: number) {
  return ["bg-sky", "bg-pink", "bg-amber"][index % 3];
}
