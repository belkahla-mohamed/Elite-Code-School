import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CalendarBlank, Tag, ArrowLeft } from "@phosphor-icons/react/dist/ssr"
import { PageHero, CtaBand } from "@/components/page-sections"
import { ScrollReveal } from "@/components/ui/scroll-reveal"

export const metadata: Metadata = {
  title: "Blog — Elite Code School",
  description: "Conseils, guides et actualités pour les parents : education numerique, robotique, programmation et IA pour les jeunes de 7 a 17 ans.",
}

const categories = [
  { slug: "tous", label: "Tous" },
  { slug: "robotique", label: "Robotique" },
  { slug: "programmation", label: "Programmation" },
  { slug: "ia", label: "Intelligence artificielle" },
  { slug: "parents", label: "Conseils parents" },
  { slug: "evenements", label: "Événements" },
]

const articles = [
  {
    slug: "robotique-7-ans",
    image: "/images/kids-stem.jpg",
    date: "10 sept. 2026",
    category: "robotique",
    title: "Pourquoi apprendre la robotique des 7 ans ?",
    excerpt: "Les bienfaits de la robotique educative sur le developpement cognitif des enfants : logique, creativite et cooperation.",
    content: "Des 7 ans, les enfants commencent a comprendre la relation cause-effet. La robotique exploite cette curiosite naturelle en transformant des concepts abstraits en actions concretes. Un robot qui avance, tourne ou evite un obstacle, c'est la physique et la logique en mouvement. Chez Elite Code School, nous utilisons des kits mBot et Micro:bit adaptes aux petits : assemblage visuel, capteurs simples, programmation par blocs. Chaque session se termine par un defi concret que l'enfant resout en equipe.",
  },
  {
    slug: "scratch-vs-python",
    image: "/images/kid-elearning.jpg",
    date: "5 sept. 2026",
    category: "programmation",
    title: "Scratch vs Python : par ou commencer ?",
    excerpt: "Guide pratique pour choisir le premier langage de programmation de votre enfant selon son age et ses interests.",
    content: "Scratch est le point de depart ideal pour les 7-10 ans : interface visuelle, blocs couleurs, resultats immediats. A partir de 10-11 ans, Python devient pertinent : syntaxe textuelle simple, usage reel (scripts, jeux, science des donnees). L'erreur courante est de sauter trop tot sur Python. Un enfant qui a maitrise Scratch possede deja la logique algorithmique — le passage au code texte devient alors naturel et motivant.",
  },
  {
    slug: "projets-ia-ados",
    image: "/images/hero-mentoring.jpg",
    date: "28 août 2026",
    category: "ia",
    title: "5 projets IA accessibles aux ados",
    excerpt: "Des projets concrets d'intelligence artificielle que les 12-17 ans peuvent realiser avec du materiel accessible.",
    content: "L'IA n'est plus reservee aux universites. Un ado de 14 ans peut aujourd'hui entrainer un modele de reconnaissance d'images avec Teachable Machine, construire un chatbot avec Python et NLTK, ou analyser des donnees de sport avec Pandas. A Elite Code School, chaque projet IA suit un cycle reel : collecte de donnees, entrainement, evaluation, presentation. Les eleves apprennent aussi l'ethique de l'IA — biais, confidentialite, impact sociétal.",
  },
  {
    slug: "portail-parent",
    image: "/images/hero-family.jpg",
    date: "20 août 2026",
    category: "parents",
    title: "Le portail parent : suivez chaque progres",
    excerpt: "Comment utiliser le portail parent pour suivre les heures de code, projets et certificats de votre enfant en temps reel.",
    content: "Le portail parent d'Elite Code School donne acces en temps reel a toutes les informations de votre enfant : heures de code validees, projets realises avec photos et descriptions, badges obtenus, niveaux franchis. Vous pouvez discuter directement avec le formateur, consulter le calendrier des sessions et telecharger les certificats. Un tableau de bord synthetique montre la progression globale et les points a renforcer.",
  },
  {
    slug: "hackathon-marrakech",
    image: "/images/teacher-board.jpg",
    date: "15 août 2026",
    category: "evenements",
    title: "Notre hackathon junior a Marrakech",
    excerpt: "Retour sur le hackathon junior de Marrakech ou deux equipes d'Elite Code School ont ete primées.",
    content: "Le 10 août, deux equipes d'Elite Code School ont participe au hackathon junior de Marrakech. L'equipe 'Mars Rovers' a presente un prototype de rover martien Arduino, et l'equipe 'GreenAI' a developpe un systeme de tri des dechets par vision par ordinateur. Les deux equipes ont ete primées — 2e et 3e places sur 12 equipes participantes. Une experience formidble qui montre que nos eleves sont prets a relever des defis reels.",
  },
  {
    slug: "seance-essai",
    image: "/images/girl-writing.jpg",
    date: "10 août 2026",
    category: "parents",
    title: "Comment preparer la seance d'essai ?",
    excerpt: "Tout ce qu'il faut savoir pour la premiere visite de votre enfant a Elite Code School.",
    content: "La seance d'essai dure 1h30. Votre enfant sera accueilli par son formateur, fera un mini-bilan de niveau, puis participera a une activite adaptee a son age. Pas besoin d'ordinateur personnel — nous fournissons tout le materiel. Conseils : venez avec un pyjama deco (les ateliers sont parfois un peu salissants), et n'hesitez pas a poser des questions au formateur. Le bilan de niveau est offert et sans engagement.",
  },
]

function ArticleCard({ article, index }: { article: (typeof articles)[number]; index: number }) {
  return (
    <ScrollReveal delay={index * 80}>
      <article className="group flex h-full flex-col overflow-hidden rounded-brand border border-border bg-white transition duration-300 ease-out hover:-translate-y-0.5 hover:border-brand hover:shadow-md dark:border-white/10 dark:bg-[#1e293b]">
        <div className="relative overflow-hidden">
          <Image
            src={article.image}
            alt={article.title}
            width={600}
            height={400}
            className="h-48 w-full object-cover transition duration-500 ease-out group-hover:scale-105"
          />
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-brand px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            <Tag className="size-2.5" /> {categories.find((c) => c.slug === article.category)?.label}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <span className="flex items-center gap-1.5 text-xs font-bold text-ink-soft">
            <CalendarBlank className="size-3" /> {article.date}
          </span>
          <h3 className="mt-2 font-display text-base font-semibold text-ink transition duration-300 ease-out group-hover:text-brand dark:text-ink">
            {article.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm font-medium leading-6 text-ink-soft dark:text-ink-soft">
            {article.excerpt}
          </p>
          <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-xs font-bold text-brand transition duration-300 ease-out group-hover:gap-2.5">
            Lire la suite <ArrowRight className="size-3.5" />
          </span>
        </div>
      </article>
    </ScrollReveal>
  )
}

export default function BlogPage() {
  return (
    <div>
      <PageHero
        badge="Blog"
        titleBefore="Conseils et"
        titleHighlight="actualites"
        subtitle="Guides pratiques, retours d'experience et conseils pour les parents qui souhaitent accompagner leurs enfants dans l'education numerique."
      />

      <section className="bg-white py-16 sm:py-24 dark:bg-body">
        <div className="container-shell">
          {/* Back link */}
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-1.5 text-sm font-bold text-brand transition hover:gap-2.5"
          >
            <ArrowLeft className="size-4" /> Retour a l&apos;accueil
          </Link>

          {/* Category filters */}
          <div className="mb-10 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <span
                key={cat.slug}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-2 text-xs font-bold text-ink-soft transition hover:border-brand hover:text-brand dark:border-white/10 dark:bg-[#1e293b] dark:text-slate-300 dark:hover:border-brand dark:hover:text-brand"
              >
                {cat.label}
              </span>
            ))}
          </div>

          {/* Articles grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, i) => (
              <ArticleCard key={article.slug} article={article} index={i} />
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </div>
  )
}
