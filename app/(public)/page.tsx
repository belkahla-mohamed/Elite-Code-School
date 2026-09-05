import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  BrainCircuit,
  CalendarDays,
  Check,
  CircuitBoard,
  Clock,
  Facebook,
  GraduationCap,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Puzzle,
  Quote,
  Rocket,
  Sparkles,
  Star,
  Trophy,
  Users,
  Youtube,
  Zap,
} from "lucide-react";
import { QuickContactForm } from "@/components/QuickContactForm";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { getPrograms } from "@/lib/store";
import type { Program } from "@/lib/types";

export default async function HomePage() {
  const programs = await getPrograms();

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
      <TopBar />
      <Hero />
      <Welcome />
      <About />
      <Programs programs={programs} />
      <StatsBand />
      <Team />
      <Facilities />
      <Gallery />
      <Testimonials />
      <News />
      <ContactCta />
    </div>
  );
}

function TopBar() {
  return (
    <div className="bg-brand-dark text-white">
      <div className="container-shell flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-2 text-[11px] font-semibold sm:text-xs">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="size-3.5" /> Lun – Sam : 9h30 – 18h30
        </span>
        <div className="flex items-center gap-4">
          <a href="tel:+212600000000" suppressHydrationWarning className="inline-flex items-center gap-1.5 transition hover:opacity-80">
            <Phone className="size-3.5" /> +212 600 000 000
          </a>
          <span className="hidden items-center gap-1.5 sm:inline-flex">
            <MapPin className="size-3.5" /> Marrakech, Maroc
          </span>
          <span className="hidden items-center gap-3 md:flex">
            <a aria-label="Facebook" href="https://facebook.com" target="_blank" rel="noreferrer" className="transition hover:opacity-80">
              <Facebook className="size-3.5" />
            </a>
            <a aria-label="Instagram" href="https://instagram.com" target="_blank" rel="noreferrer" className="transition hover:opacity-80">
              <Instagram className="size-3.5" />
            </a>
            <a aria-label="YouTube" href="https://youtube.com" target="_blank" rel="noreferrer" className="transition hover:opacity-80">
              <Youtube className="size-3.5" />
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative isolate">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/hero-student.jpg"
          alt="Élève Elite Code School pendant un cours de programmation"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/80 to-ink/35" />
      </div>
      <div className="container-shell py-24 sm:py-32 lg:py-44">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold text-white backdrop-blur">
            <Sparkles className="size-3.5 text-amber" /> École de coding, robotique & IA — Marrakech
          </p>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.02em] text-white sm:text-6xl">
            Une nouvelle façon d&apos;apprendre <span className="text-brand-light">le code</span>
          </h1>
          <p className="mt-5 max-w-xl text-base font-medium leading-7 text-white/85 sm:text-lg sm:leading-8">
            Dès 7 ans : des missions ludiques sur Scratch et les robots. Ados : de vrais projets en Python, web et IA — avec un portfolio public et un suivi clair pour les parents.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/inscription"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3 text-sm font-bold text-white transition hover:bg-brand-dark"
            >
              Inscription maintenant <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/curricula"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/50 px-7 py-3 text-sm font-bold text-white transition hover:bg-white/15"
            >
              Nos programmes
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-xs font-bold text-white/80">
            {["Sans prérequis", "8 élèves max par classe", "Portail parent", "Certificats validés"].map((item) => (
              <span key={item} className="inline-flex items-center gap-1.5">
                <Check className="size-3.5 text-amber" /> {item}
              </span>
            ))}
          </div>

          {/* Floating gamification cards — desktop only, playful kids-coding signature */}
          <div className="pointer-events-none absolute hidden lg:flex right-[4%] top-1/2 -translate-y-1/2 flex-col gap-4">
            <div className="flex items-center gap-3 rounded-brand-sm border-2 border-brand/15 bg-white px-4 py-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber/15">
                <Trophy className="size-5 text-amber" />
              </span>
              <div>
                <p className="text-xs font-bold text-ink">Badge débloqué</p>
                <p className="text-[11px] font-semibold text-ink-soft">Logique — Mission Mars</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-brand-sm border-2 border-brand/15 bg-white px-4 py-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sky/15">
                <Zap className="size-5 text-sky-dark" />
              </span>
              <div>
                <p className="text-xs font-bold text-ink">+120 XP cette semaine</p>
                <p className="text-[11px] font-semibold text-ink-soft">Niveau 3 · Apprenti codeur</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const welcomeItems = [
  { icon: Puzzle, tint: "bg-[#E8F7FF] text-sky", title: "Apprentissage actif", text: "On touche, on teste, on casse, on répare : chaque notion passe par un projet concret." },
  { icon: Users, tint: "bg-[#FFF3D6] text-amber", title: "Espace parents", text: "Portail sécurisé pour suivre les heures de code, projets, certificats et séances." },
  { icon: GraduationCap, tint: "bg-[#F1EAFE] text-violet", title: "Formateurs experts", text: "Des passionnés de tech, formés à la pédagogie pour les 7–17 ans." },
  { icon: Rocket, tint: "bg-[#EFF9D8] text-lime", title: "Projets réels", text: "Jeux, robots, sites web et IA : chaque parcours se termine par une démo publique." },
];

function Welcome() {
  return (
    <section className="bg-white py-16 sm:py-24 dark:bg-body">
      <div className="container-shell">
        <SectionHeader
          eyebrow="Bienvenue"
          title="Bienvenue chez Elite Code School"
          subtitle="L'école où les enfants deviennent des makers : on apprend la tech en créant de vraies choses, ensemble."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {welcomeItems.map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 80} className="h-full">
              <div className="h-full rounded-brand border border-border bg-surface p-6 text-center transition hover:border-sky dark:border-border dark:bg-surface">
                <span className={`mx-auto flex size-14 items-center justify-center rounded-full ${item.tint}`}>
                  <item.icon className="size-6" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink dark:text-ink">{item.title}</h3>
                <p className="mt-2 text-sm font-medium leading-6 text-ink-soft dark:text-ink-soft">{item.text}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const aboutPoints = [
  "Parcours progressif : Scratch → robots → Python, web et IA",
  "Portfolio public pour chaque élève, contrôlé par les parents",
  "Heures de code, badges et certificats validés par l'école",
  "Groupes de 8 élèves max pour un vrai accompagnement",
];

function About() {
  return (
    <section className="bg-surface py-16 sm:py-24 dark:bg-body">
      <div className="container-shell grid items-center gap-12 lg:grid-cols-2">
        <div className="relative">
          <div className="overflow-hidden rounded-brand border border-border">
            <Image
              src="/images/kids-stem.jpg"
              alt="Enfants en atelier scientifique et technique"
              width={1200}
              height={800}
              className="h-auto w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-5 right-4 flex items-center gap-3 rounded-brand-sm border border-border bg-white px-4 py-3 sm:right-8 dark:border-border dark:bg-surface">
            <span className="flex size-10 items-center justify-center rounded-full bg-amber/15">
              <Star className="size-5 fill-amber text-amber" />
            </span>
            <span>
              <strong className="block font-display text-lg font-semibold text-ink dark:text-ink">4,9/5</strong>
              <small className="text-xs font-bold text-ink-soft dark:text-ink-soft">avis des parents</small>
            </span>
          </div>
        </div>
        <div>
          <SectionHeaderAlign eyebrow="À propos" title="Une école où l'on apprend en créant" />
          <p className="text-sm font-medium leading-7 text-ink-soft sm:text-base sm:leading-8 dark:text-ink-soft">
            Chez Elite Code School, la tech n&apos;est pas une matière théorique. Les enfants explorent la logique et la créativité numérique, les ados construisent de vrais projets — et chaque famille suit les progrès en temps réel depuis son espace parent.
          </p>
          <ul className="mt-6 grid gap-3">
            {aboutPoints.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm font-semibold text-ink dark:text-ink">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand/15">
                  <Check className="size-3 text-brand" />
                </span>
                {point}
              </li>
            ))}
          </ul>
          <Link href="/inscription" className="btn-primary mt-8 inline-flex text-sm">
            Inscription maintenant <ArrowRight data-icon="inline-end" />
          </Link>
        </div>
      </div>
    </section>
  );
}

const programAccents: Record<string, string> = {
  accent: "#689033",
  cyan: "#06b6d4",
  amber: "#f59e0b",
  green: "#22c55e",
  rose: "#f43f5e",
  purple: "#a855f7",
};

const programLevels: Record<string, string> = {
  debutant: "Débutant",
  intermediaire: "Intermédiaire",
  avance: "Avancé",
};

function Programs({ programs }: { programs: Program[] }) {
  return (
    <section className="bg-white py-16 sm:py-24 dark:bg-body">
      <div className="container-shell">
        <SectionHeader
          eyebrow="Nos classes"
          title="Nos programmes populaires"
          subtitle="Un parcours complet de 7 à 17 ans : chacun avance à son rythme, d'un premier jeu Scratch jusqu'à l'intelligence artificielle."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {programs.slice(0, 6).map((program, index) => {
            const accent = programAccents[program.color] ?? "#82b440";
            return (
              <ScrollReveal key={program.id} delay={(index % 3) * 90} className="h-full">
                <article className="group flex h-full flex-col overflow-hidden rounded-brand border border-border bg-white transition hover:border-brand dark:border-border dark:bg-surface">
                  <div className="relative h-44 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={program.image} alt={program.title} loading="lazy" className="size-full object-cover transition duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
                    <span className="absolute left-4 top-4 rounded-full border border-border bg-white px-3 py-1 text-xs font-bold text-ink">{program.ageRange}</span>
                    <span
                      className="absolute bottom-3 left-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white"
                      style={{ backgroundColor: accent }}
                    >
                      <span className="size-1.5 rounded-full bg-white/80" /> {programLevels[program.level]}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-xl font-semibold text-ink dark:text-ink">{program.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm font-medium leading-6 text-ink-soft dark:text-ink-soft">{program.description}</p>
                  <ul className="mt-4 grid gap-2 border-t border-border pt-4 text-xs font-bold text-ink-soft dark:border-border dark:text-ink-soft">
                    <li className="flex items-center gap-2"><Clock className="size-3.5 text-sky" /> {program.schedule}</li>
                    <li className="flex items-center gap-2"><CalendarDays className="size-3.5 text-sky" /> {program.duration}</li>
                    <li className="flex items-center gap-2"><Users className="size-3.5 text-sky" /> 8 élèves max</li>
                  </ul>
                  <div className="mt-auto flex items-center justify-between border-t border-border pt-5">
                      <span className="font-display text-lg font-semibold text-ink dark:text-ink">
                        {program.priceMonthly} <small className="text-xs font-bold text-ink-soft dark:text-ink-soft">DH/mois</small>
                      </span>
                    <Link href="/curricula" className="inline-flex items-center gap-1 text-xs font-bold text-brand transition group-hover:gap-2">
                      Voir le détail <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const stats = [
  { value: 120, suffix: "+", label: "Élèves inscrits" },
  { value: 300, suffix: "+", label: "Projets réalisés" },
  { value: 5000, suffix: "+", label: "Heures de code" },
  { value: 98, suffix: "%", label: "Parents satisfaits" },
];

function StatsBand() {
  return (
    <section className="relative isolate overflow-hidden bg-brand">
      <div
        className="absolute inset-0 -z-10 opacity-20"
        style={{ backgroundImage: "radial-gradient(circle at 20% 30%, rgba(255,255,255,.35) 0, transparent 40%), radial-gradient(circle at 80% 70%, rgba(255,255,255,.25) 0, transparent 40%)" }}
      />
      <div className="container-shell py-16 sm:py-20">
        <h2 className="text-center font-display text-3xl font-semibold tracking-[-0.02em] text-white md:text-4xl">
          Un environnement d&apos;apprentissage unique
        </h2>
        <div className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <strong className="block font-display text-4xl font-semibold text-white sm:text-5xl">
                          <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                        </strong>
              <span className="mt-2 block text-xs font-bold uppercase tracking-wider text-white/70">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const team = [
  { name: "Mehdi A.", role: "Robotique & Arduino", image: "/images/teacher-board.jpg", tint: "bg-[#E8F7FF] text-sky", initials: "MA" },
  { name: "Salma B.", role: "Scratch & Créativité", image: null, tint: "bg-[#F1EAFE] text-violet", initials: "SB" },
  { name: "Yassine K.", role: "Développement Web", image: null, tint: "bg-[#EFF9D8] text-lime", initials: "YK" },
  { name: "Nadia R.", role: "Intelligence artificielle", image: null, tint: "bg-[#FFF3D6] text-amber", initials: "NR" },
];

function Team() {
  return (
    <section className="bg-surface py-16 sm:py-24 dark:bg-body">
      <div className="container-shell">
        <SectionHeader
          eyebrow="Notre équipe"
          title="Nos formateurs"
          subtitle="Des professionnels de la tech qui aiment transmettre — et qui savent parler aux enfants comme aux ados."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <article key={member.name} className="rounded-brand border border-border bg-white p-6 text-center transition hover:border-amber dark:border-border dark:bg-surface">
              {member.image ? (
                <Image
                  src={member.image}
                  alt={member.name}
                  width={300}
                  height={300}
                  className="mx-auto size-24 rounded-full object-cover"
                />
              ) : (
                <span className={`mx-auto flex size-24 items-center justify-center rounded-full font-display text-2xl font-semibold ${member.tint}`}>
                  {member.initials}
                </span>
              )}
              <h3 className="mt-4 font-display text-lg font-semibold text-ink dark:text-ink">{member.name}</h3>
              <p className="mt-1 text-xs font-bold uppercase tracking-wider text-ink-soft dark:text-ink-soft">{member.role}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const facilities = [
  { icon: CircuitBoard, tint: "bg-[#E8F7FF] text-sky", title: "Robotique & hardware", text: "mBot, Arduino, Micro:bit, Raspberry Pi : de vraies machines à programmer, pas des simulations." },
  { icon: BrainCircuit, tint: "bg-[#F1EAFE] text-violet", title: "Coding & IA", text: "De Scratch à Python jusqu'aux projets d'IA : un cursus structuré qui suit l'élève pendant des années." },
  { icon: Trophy, tint: "bg-[#FFF3D6] text-amber", title: "Suivi & certificats", text: "Portfolio public, heures de code comptabilisées, badges et certificats validés par l'administration." },
];

function Facilities() {
  return (
    <section className="bg-white py-16 sm:py-24 dark:bg-body">
      <div className="container-shell">
        <SectionHeader
          eyebrow="Nos atouts"
          title="Ce qui fait la différence"
          subtitle="Du matériel réel, un cursus complet et un suivi transparent pour toute la famille."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {facilities.map((item) => (
            <div key={item.title} className="flex gap-4 rounded-brand border border-border bg-surface p-6 dark:border-border dark:bg-surface">
              <span className={`flex size-12 shrink-0 items-center justify-center rounded-brand-sm ${item.tint}`}>
                <item.icon className="size-6" />
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold text-ink dark:text-ink">{item.title}</h3>
                <p className="mt-2 text-sm font-medium leading-6 text-ink-soft dark:text-ink-soft">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const gallery = [
  { src: "/images/hero-mentoring.jpg", alt: "Accompagnement personnalisé sur un projet", label: "Atelier mentorat" },
  { src: "/images/kid-elearning.jpg", alt: "Élève en session de code", label: "Session de code" },
  { src: "/images/kids-stem.jpg", alt: "Expérience STEM en atelier", label: "Atelier STEM" },
  { src: "/images/girl-writing.jpg", alt: "Élève en train de documenter son projet", label: "Documentation de projet" },
  { src: "/images/hero-family.jpg", alt: "Parent et enfant devant l'ordinateur", label: "Moment famille" },
  { src: "/images/teacher-board.jpg", alt: "Explication devant le tableau", label: "Cours magistral" },
];

function Gallery() {
  return (
    <section className="bg-surface py-16 sm:py-24 dark:bg-body">
      <div className="container-shell">
        <SectionHeader
          eyebrow="Galerie"
          title="La vie à l'école"
          subtitle="Un aperçu des ateliers, des projets et des moments de partage à Elite Code School."
        />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {gallery.map((item) => (
            <figure key={item.src} className="group relative overflow-hidden rounded-brand border border-border">
              <Image
                src={item.src}
                alt={item.alt}
                width={600}
                height={450}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-ink/85 via-ink/40 to-transparent p-4 pt-12 text-xs font-bold text-white">
                <span>{item.label}</span>
                <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/25">
                  <ArrowUpRight className="size-4" />
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

const testimonials = [
  {
    quote: "Mon fils compte les jours avant son cours. Il a commencé par des jeux Scratch, aujourd'hui il programme son propre robot.",
    author: "Nadia",
    context: "maman d'Adam, 9 ans",
  },
  {
    quote: "Le portail parent change tout : je vois les heures de code, les projets et les certificats sans jamais avoir à réclamer un compte-rendu.",
    author: "Youssef",
    context: "papa de Lina, 12 ans",
  },
  {
    quote: "En un an, ma fille est passée de Scratch à un vrai site web qu'elle a présenté devant toute la classe. Le portfolio est superbe.",
    author: "Khadija",
    context: "maman de Sara, 14 ans",
  },
];

function Testimonials() {
  return (
    <section className="bg-white py-16 sm:py-24 dark:bg-body">
      <div className="container-shell">
        <SectionHeader
          eyebrow="Témoignages"
          title="Ce que disent les parents"
          subtitle="La confiance des familles est notre meilleure preuve de qualité."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <blockquote key={item.author} className="relative rounded-brand border border-border bg-surface p-6 dark:border-border dark:bg-surface">
              <Quote aria-hidden="true" className="absolute right-5 top-5 size-9 text-sky/10" />
              <div className="flex gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="size-4 fill-amber text-amber" />
                ))}
              </div>
              <p className="mt-4 text-sm font-medium leading-7 text-ink dark:text-ink">&ldquo;{item.quote}&rdquo;</p>
              <footer className="mt-4 border-t border-border pt-4 dark:border-border">
                <strong className="block text-sm font-bold text-ink dark:text-ink">{item.author}</strong>
                <span className="text-xs font-semibold text-ink-soft dark:text-ink-soft">{item.context}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

const news = [
  { image: "/images/kids-stem.jpg", date: "12 sept. 2026", title: "Lancement de la Mission Planète Mars", text: "Le grand défi de l'année : concevoir, coder et présenter un rover martien en équipe." },
  { image: "/images/kid-elearning.jpg", date: "26 sept. 2026", title: "Journée portes ouvertes", text: "Venez découvrir les robots, les projets des élèves et rencontrer nos formateurs." },
  { image: "/images/hero-mentoring.jpg", date: "3 août 2026", title: "Nos élèves brillent au hackathon", text: "Deux équipes d'Elite Code School sur le podium du hackathon junior de Marrakech." },
];

function News() {
  return (
    <section className="bg-surface py-16 sm:py-24 dark:bg-body">
      <div className="container-shell">
        <SectionHeader
          eyebrow="Actualités"
          title="Les dernières nouvelles"
          subtitle="Événements, compétitions et vie de l'école : restez connectés."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {news.map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 90} className="h-full">
              <article className="group flex h-full flex-col overflow-hidden rounded-brand border border-border bg-white transition hover:border-brand dark:border-border dark:bg-surface">
                <div className="relative">
                  <Image src={item.image} alt={item.title} width={600} height={400} className="h-44 w-full object-cover" />
                  <span className="absolute left-4 top-4 rounded-full border border-border bg-white px-3 py-1 text-[11px] font-bold text-ink">{item.date}</span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-lg font-semibold text-ink transition group-hover:text-brand dark:text-ink">{item.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm font-medium leading-6 text-ink-soft dark:text-ink-soft">{item.text}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-xs font-bold text-brand transition group-hover:gap-2.5">
                    Lire la suite <ArrowRight className="size-3.5" />
                  </span>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactCta() {
  return (
    <section className="bg-white py-16 sm:py-24 dark:bg-body">
      <div className="container-shell">
        <SectionHeader
          eyebrow="Contact"
          title="Une question ? Écrivez-nous"
          subtitle="Nous répondons sous 24h ouvrées — ou passez nous voir à Marrakech."
        />
        <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-3">
          <a href="tel:+212600000000" suppressHydrationWarning className="rounded-brand border border-border bg-surface p-5 text-center transition hover:border-brand dark:border-border dark:bg-surface">
            <Phone className="mx-auto size-5 text-brand" />
            <strong className="mt-2 block text-sm font-bold text-ink dark:text-ink">+212 600 000 000</strong>
            <small className="text-xs font-semibold text-ink-soft dark:text-ink-soft">Lun – Sam, 9h30 – 18h30</small>
          </a>
          <a href="mailto:contact@elitecodeschool.ma" className="rounded-brand border border-border bg-surface p-5 text-center transition hover:border-brand dark:border-border dark:bg-surface">
            <Mail className="mx-auto size-5 text-brand" />
            <strong className="mt-2 block break-all text-sm font-bold text-ink dark:text-ink">contact@elitecodeschool.ma</strong>
            <small className="text-xs font-semibold text-ink-soft dark:text-ink-soft">Réponse sous 24h</small>
          </a>
          <span className="rounded-brand border border-border bg-surface p-5 text-center dark:border-border dark:bg-surface">
            <MapPin className="mx-auto size-5 text-brand" />
            <strong className="mt-2 block text-sm font-bold text-ink dark:text-ink">Marrakech, Maroc</strong>
            <small className="text-xs font-semibold text-ink-soft dark:text-ink-soft">Adresse exacte sur demande</small>
          </span>
        </div>
        <div className="mx-auto mt-10 max-w-2xl rounded-brand border border-border bg-surface p-6 sm:p-8 dark:border-border dark:bg-surface">
          <QuickContactForm />
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <div className="mb-10 text-center sm:mb-14">
      <span className="tag">{eyebrow}</span>
      <h2 className="mx-auto mt-4 max-w-3xl font-display text-3xl font-semibold tracking-[-0.02em] text-ink dark:text-ink md:text-5xl">{title}</h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-7 text-ink-soft sm:mt-4 sm:text-base sm:leading-8 dark:text-ink-soft">{subtitle}</p>
    </div>
  );
}

function SectionHeaderAlign({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-4">
      <span className="tag">{eyebrow}</span>
      <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.02em] text-ink dark:text-ink sm:text-4xl">{title}</h2>
    </div>
  );
}
