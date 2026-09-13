import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Clock, FacebookLogo, GraduationCap, InstagramLogo, EnvelopeSimple, MapPin, Phone, PuzzlePiece, Rocket, Sparkle, Users, YoutubeLogo } from "@phosphor-icons/react/dist/ssr";
import { QuickContactForm } from "@/components/QuickContactForm";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { ProgramsSection } from "@/components/programs-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { TeamSection } from "@/components/team-section";
import { FacilitiesSection } from "@/components/facilities-section";
import { GallerySection } from "@/components/gallery-section";
import { getPrograms } from "@/lib/store";

export const dynamic = "force-dynamic";

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
      <ProgramsSection programs={programs} />
      <StatsBand />
      <TeamSection />
      <FacilitiesSection />
      <GallerySection />
      <TestimonialsSection />
      <BlogFeed />
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
          <Clock className="size-3.5" /> Lun – Dim : 9h30 – 18h30
        </span>
        <div className="flex items-center gap-4">
          <a href="https://wa.me/212600000000" target="_blank" rel="noreferrer" suppressHydrationWarning className="inline-flex items-center gap-1.5 transition duration-200 ease-out hover:opacity-80">
            <Phone className="size-3.5" /> +212 600 000 000
          </a>
          <span className="hidden items-center gap-1.5 sm:inline-flex">
            <MapPin className="size-3.5" /> Marrakech, Maroc
          </span>
          <span className="hidden items-center gap-3 md:flex">
            <a aria-label="FacebookLogo" href="https://facebook.com" target="_blank" rel="noreferrer" className="transition duration-200 ease-out hover:opacity-80">
              <FacebookLogo className="size-3.5" />
            </a>
            <a aria-label="InstagramLogo" href="https://instagram.com" target="_blank" rel="noreferrer" className="transition duration-200 ease-out hover:opacity-80">
              <InstagramLogo className="size-3.5" />
            </a>
            <a aria-label="YouTube" href="https://youtube.com" target="_blank" rel="noreferrer" className="transition duration-200 ease-out hover:opacity-80">
              <YoutubeLogo className="size-3.5" />
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand dark:bg-brand-dark">
      {/* Decorative solid shapes — playful, no glow */}
      <div aria-hidden className="absolute -left-20 -top-20 size-64 rounded-full bg-white/10" />
      <div aria-hidden className="absolute -right-24 top-24 size-80 rounded-full bg-white/10" />
      <div aria-hidden className="absolute -bottom-28 left-[40%] size-72 rounded-full bg-amber/25" />
      <div aria-hidden className="absolute left-[6%] top-14 size-8 -rotate-12 rounded-lg bg-amber" />
      <div aria-hidden className="absolute right-[34%] top-32 size-6 rotate-12 rounded-lg bg-cream/40" />
      <div aria-hidden className="absolute bottom-16 left-[30%] size-5 rounded-full bg-sky-light" />
      <div aria-hidden className="absolute bottom-24 right-[8%] size-4 rounded-full bg-lime" />

      <div className="container-shell relative grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:py-28">
        {/* Left — content */}
        <div className="min-w-0">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-1.5 text-xs font-bold text-white">
            <Sparkle className="size-3.5 text-amber" /> École de coding, robotique &amp; IA — Marrakech
          </p>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.08] tracking-[-0.01em] text-white sm:text-5xl lg:text-6xl">
            Une nouvelle façon d&apos;apprendre{" "}
            <span className="relative inline-block text-cream">
              le code
              <svg
                aria-hidden
                viewBox="0 0 120 12"
                preserveAspectRatio="none"
                className="absolute -bottom-2 left-0 h-3 w-full text-amber"
              >
                <path d="M3 9 Q 60 2 117 8" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-base font-medium leading-7 text-white/90 sm:text-lg sm:leading-8">
            Dès 7 ans : des missions ludiques sur Scratch et les robots. Dès 10 ans : de vrais projets en Python, web et IA — avec un portfolio public et un suivi clair pour les parents.
          </p>
<div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/inscription"
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold text-brand transition duration-200 ease-out hover:bg-cream"
            >
              Inscription maintenant <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/curricula"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 bg-white/10 px-7 py-3 text-sm font-bold text-white transition duration-200 ease-out hover:border-white hover:bg-white/20"
            >
              Nos programmes
            </Link>
          </div>
          <div className="mt-9 flex flex-wrap gap-2.5">
            {["Sans prérequis", "8 élèves max par classe", "Portail parent", "Certificats validés"].map((item) => (
              <span key={item} className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3.5 py-1.5 text-xs font-bold text-white">
                <Check className="size-3.5 text-amber" /> {item}
              </span>
            ))}
          </div>
        </div>

        {/* Right — photo frame + floating gamification cards */}
        <div className="relative mx-auto w-full max-w-lg lg:ml-auto">
          <div aria-hidden className="absolute -inset-3 -rotate-2 rounded-brand border-2 border-dashed border-white/40" />
          <div className="relative overflow-hidden rounded-brand border-4 border-white bg-white">
            <Image
              src="/images/hero-student.jpg"
              alt="Élève Elite Code School pendant un cours de programmation"
              width={800}
              height={533}
              priority
              sizes="(max-width: 1024px) 90vw, 540px"
              className="aspect-[4/3] w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/65 via-ink/15 to-transparent px-5 pb-4 pt-12 text-white">
              <p className="font-display text-lg font-semibold">Makers en herbe</p>
              <p className="text-xs font-bold text-white/85">Coding · Robotique · IA — Marrakech</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave divider */}
      <svg
        aria-hidden
        viewBox="0 0 1440 64"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 h-10 w-full text-white dark:text-body sm:h-14"
      >
        <path d="M0,40 C240,64 480,0 720,20 C960,40 1200,56 1440,28 L1440,64 L0,64 Z" fill="currentColor" />
      </svg>
    </section>
  );
}

const welcomeItems = [
  { icon: PuzzlePiece, tint: "bg-brand/10 text-brand", title: "Apprentissage actif", text: "On touche, on teste, on casse, on répare : chaque notion passe par un projet concret." },
  { icon: Users, tint: "bg-amber/15 text-amber", title: "Espace parents", text: "Portail sécurisé pour suivre les heures de code, projets, certificats et séances." },
  { icon: GraduationCap, tint: "bg-violet/15 text-violet", title: "Formateurs experts", text: "Des passionnés de tech, formés à la pédagogie pour les 7–17 ans." },
  { icon: Rocket, tint: "bg-sky/15 text-sky", title: "Projets réels", text: "Jeux, robots, sites web et IA : chaque parcours se termine par une démo publique." },
];

function Welcome() {
  return (
    <section className="bg-white py-16 sm:py-24 dark:bg-body">
      <div className="container-shell grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Left — content + features */}
        <div>
          <ScrollReveal>
            <span className="tag">Bienvenue</span>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-[-0.02em] text-ink dark:text-ink sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
              Bienvenue chez{" "}
              <span className="text-brand">Elite Code School</span>
            </h2>
            <p className="mt-4 max-w-lg text-sm font-medium leading-7 text-ink-soft sm:text-base sm:leading-8 dark:text-ink-soft">
              L&apos;école où les enfants deviennent des makers : on apprend la tech en créant de vraies choses, ensemble.
            </p>
          </ScrollReveal>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {welcomeItems.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 80}>
                <div className="flex gap-4 rounded-brand border border-border bg-surface p-5 transition duration-300 ease-out hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-md dark:border-white/10 dark:bg-[#1e293b]">
                  <span className={`flex size-12 shrink-0 items-center justify-center rounded-brand-sm ${item.tint}`}>
                    <item.icon className="size-6" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display text-base font-semibold text-ink dark:text-ink">{item.title}</h3>
                    <p className="mt-1 text-xs font-medium leading-5 text-ink-soft dark:text-ink-soft">{item.text}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Right — image */}
        <ScrollReveal delay={200} className="relative hidden lg:block">
          {/* Decorative accent shape */}
          <div aria-hidden className="absolute -left-6 -top-6 size-32 rounded-brand bg-brand/10" />
          <div aria-hidden className="absolute -bottom-4 -right-4 size-20 rounded-full bg-amber/15" />
          {/* Main image */}
          <div className="relative overflow-hidden rounded-brand border-4 border-white dark:border-body">
            <Image
              src="/images/kids-stem.jpg"
              alt="Enfants en atelier STEM à Elite Code School"
              width={800}
              height={600}
              sizes="(max-width: 1024px) 0vw, 480px"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </ScrollReveal>
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
    <section className="relative overflow-hidden bg-brand py-16 sm:py-24 dark:bg-brand-dark">
      {/* Decorative shapes */}
      <div aria-hidden className="absolute -left-16 top-12 size-40 rounded-full bg-white/10" />
      <div aria-hidden className="absolute bottom-8 right-[15%] size-24 rounded-full bg-amber/20" />
      <div aria-hidden className="absolute left-[8%] top-1/2 size-6 rotate-12 rounded-lg bg-cream/40" />
      <div aria-hidden className="absolute right-[6%] top-16 size-8 -rotate-12 rounded-lg bg-white/15" />

      <div className="container-shell grid items-center gap-12 lg:grid-cols-2">
        {/* Left — image */}
        <ScrollReveal className="relative">
          <div className="relative overflow-hidden rounded-brand border-4 border-white/25">
            <Image
              src="/images/kids-stem.jpg"
              alt="Enfants en atelier scientifique et technique"
              width={1200}
              height={800}
              sizes="(max-width: 1024px) 90vw, 520px"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </ScrollReveal>

        {/* Right — content */}
        <ScrollReveal delay={150}>
          <span className="inline-flex rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-white">
            À propos
          </span>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-[-0.02em] text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
            Une école où l&apos;on apprend en{" "}
            <span className="text-cream">créant</span>
          </h2>
          <p className="mt-5 max-w-lg text-sm font-medium leading-7 text-white/80 sm:text-base sm:leading-8">
            Chez Elite Code School, la tech n&apos;est pas une matière théorique. Les enfants explorent la logique et la créativité numérique à travers Scratch et la robotique. Les ados construisent de vrais projets en Python, web et IA — et chaque famille suit les progrès en temps réel via notre portail parent.
          </p>
          <ul className="mt-6 grid gap-3">
            {aboutPoints.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm font-semibold text-white">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-white/20">
                  <Check className="size-3 text-white" />
                </span>
                {point}
              </li>
            ))}
          </ul>
          <Link
            href="/inscription"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold text-brand transition duration-200 ease-out hover:bg-cream"
          >
            Inscription maintenant <ArrowRight className="size-4" />
          </Link>
        </ScrollReveal>
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
    <section className="relative isolate overflow-hidden bg-brand dark:bg-brand-dark">
      {/* Decorative shapes — matching About section */}
      <div aria-hidden className="absolute -left-16 top-12 size-40 rounded-full bg-white/10" />
      <div aria-hidden className="absolute bottom-8 right-[15%] size-24 rounded-full bg-amber/20" />
      <div aria-hidden className="absolute left-[8%] top-1/2 size-6 rotate-12 rounded-lg bg-cream/40" />
      <div aria-hidden className="absolute right-[6%] top-16 size-8 -rotate-12 rounded-lg bg-white/15" />
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

function BlogFeed() {
  const posts = [
    { image: "/images/kids-stem.jpg", date: "10 sept. 2026", title: "Pourquoi apprendre la robotique dès 7 ans ?", excerpt: "Les bienfaits de la robotique éducative sur le développement cognitif des enfants.", slug: "robotique-7-ans" },
    { image: "/images/kid-elearning.jpg", date: "5 sept. 2026", title: "Scratch vs Python : par où commencer ?", excerpt: "Guide pratique pour choisir le premier langage de programmation de votre enfant.", slug: "scratch-vs-python" },
    { image: "/images/hero-mentoring.jpg", date: "28 août 2026", title: "5 projets IA accessibles aux ados", excerpt: "Des projets concrets d'intelligence artificielle que les 12-17 ans peuvent réaliser.", slug: "projets-ia-ados" },
  ];

  return (
    <section className="bg-surface py-16 sm:py-24 dark:bg-[#0f172a]">
      <div className="container-shell">
        <div className="mb-10 text-center sm:mb-14">
          <span className="inline-flex rounded-full bg-brand/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-brand">Blog</span>
          <h2 className="mx-auto mt-4 max-w-3xl font-display text-3xl font-semibold tracking-[-0.02em] text-ink dark:text-ink md:text-5xl">
            Conseils pour les parents
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-7 text-ink-soft sm:mt-4 sm:text-base sm:leading-8 dark:text-ink-soft">
            Articles, guides et actualités pour mieux comprendre l&apos;éducation numérique.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog#${post.slug}`} className="group block overflow-hidden rounded-brand border border-border bg-white transition duration-300 ease-out hover:-translate-y-0.5 hover:border-brand hover:shadow-md dark:border-white/10 dark:bg-[#1e293b]">
              <div className="relative overflow-hidden">
                <Image src={post.image} alt={post.title} width={600} height={400} className="h-44 w-full object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="p-6">
                <span className="text-xs font-bold text-brand">{post.date}</span>
                <h3 className="mt-2 font-display text-lg font-semibold text-ink transition group-hover:text-brand dark:text-ink">{post.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm font-medium leading-6 text-ink-soft dark:text-ink-soft">{post.excerpt}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-brand transition group-hover:gap-2.5">
                  Lire l&apos;article <ArrowRight className="size-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/blog" className="inline-flex items-center gap-2 rounded-full border-2 border-brand/30 bg-brand/10 px-6 py-3 text-sm font-bold text-brand transition hover:bg-brand hover:text-white">
            Voir tous les articles <ArrowRight className="size-4" />
          </Link>
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
    <section className="bg-white py-16 sm:py-24 dark:bg-body">
      <div className="container-shell">
        <SectionHeader
          eyebrow="Actualités"
          title="Les dernières nouvelles"
          subtitle="Événements, compétitions et vie de l'école : restez connectés."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {news.map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 90} className="h-full">
              <article className="group flex h-full flex-col overflow-hidden rounded-brand border border-border bg-white transition duration-300 ease-out hover:-translate-y-0.5 hover:border-brand hover:shadow-md dark:border-white/10 dark:bg-[#1e293b]">
                <div className="relative">
                  <Image src={item.image} alt={item.title} width={600} height={400} className="h-44 w-full object-cover" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-lg font-semibold text-ink transition duration-300 ease-out group-hover:text-brand dark:text-ink">{item.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm font-medium leading-6 text-ink-soft dark:text-ink-soft">{item.text}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-xs font-bold text-brand transition duration-300 ease-out group-hover:gap-2.5">
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
    <section className="relative overflow-hidden bg-brand py-16 sm:py-24 dark:bg-brand-dark">
      {/* Decorative shapes */}
      <div aria-hidden className="absolute -left-16 top-12 size-40 rounded-full bg-white/10" />
      <div aria-hidden className="absolute bottom-8 right-[15%] size-24 rounded-full bg-amber/20" />
      <div aria-hidden className="absolute left-[8%] top-1/2 size-6 rotate-12 rounded-lg bg-cream/40" />
      <div aria-hidden className="absolute right-[6%] top-16 size-8 -rotate-12 rounded-lg bg-white/15" />

      <div className="container-shell grid items-end gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Left — info */}
        <div>
          <span className="inline-flex rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-white">
            Contact
          </span>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-[-0.02em] text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
            Une question ?{" "}
            <span className="text-cream">Ecrivez-nous</span>
          </h2>
          <p className="mt-4 max-w-lg text-sm font-medium leading-7 text-white/80 sm:text-base sm:leading-8">
            Nous repondons sous 24h ouvrees — ou passez nous voir a Marrakech.
          </p>

          {/* Info cards */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 lg:gap-3">
            <a href="tel:+212600000000" suppressHydrationWarning className="flex items-center gap-4 rounded-brand border border-white/20 bg-white/10 p-4 transition duration-300 ease-out hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/15 hover:shadow-lg">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/15">
                <Phone className="size-5 text-white" />
              </span>
              <div>
                <strong className="block text-sm font-bold text-white">+212 600 000 000</strong>
                <small className="text-xs font-semibold text-white/60">Lun – Sam, 9h30 – 18h30</small>
              </div>
            </a>
            <a href="mailto:contact@elitecodeschool.ma" className="flex items-center gap-4 rounded-brand border border-white/20 bg-white/10 p-4 transition duration-300 ease-out hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/15 hover:shadow-lg">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/15">
                <EnvelopeSimple className="size-5 text-white" />
              </span>
              <div>
                <strong className="block text-sm font-bold text-white">contact@elitecodeschool.ma</strong>
                <small className="text-xs font-semibold text-white/60">Reponse sous 24h</small>
              </div>
            </a>
            <span className="flex items-center gap-4 rounded-brand border border-white/20 bg-white/10 p-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/15">
                <MapPin className="size-5 text-white" />
              </span>
              <div>
                <strong className="block text-sm font-bold text-white">Marrakech, Maroc</strong>
                <small className="text-xs font-semibold text-white/60">Adresse exacte sur demande</small>
              </div>
            </span>
          </div>
        </div>

        {/* Right — form */}
        <div className="rounded-brand bg-white p-6 sm:p-8 dark:bg-surface">
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
