import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, CalendarBlank, Tag } from "@phosphor-icons/react/dist/ssr"
import { CtaBand } from "@/components/page-sections"

const articles = [
  { slug: "robotique-7-ans", image: "/images/kids-stem.jpg", date: "10 sept. 2026", category: "robotique", title: "Pourquoi apprendre la robotique des 7 ans ?", excerpt: "Les bienfaits de la robotique educative sur le developpement cognitif des enfants.", content: "Des 7 ans, les enfants commencent a comprendre la relation cause-effet. La robotique exploite cette curiosite naturelle en transformant des concepts abstraits en actions concretes. Un robot qui avance, tourne ou evite un obstacle, c'est la physique et la logique en mouvement.\n\nChez Elite Code School, nous utilisons des kits mBot et Micro:bit adaptes aux petits : assemblage visuel, capteurs simples, programmation par blocs. Chaque session se termine par un defi concret que l'enfant resout en equipe.\n\nLes bienfaits se mesurent rapidement : meilleure concentration, capacite a decomposer les problemes, et confiance en soi quand le robot execute enfin le programme. La robotique n'est pas un loisir — c'est un veritable outil de developpement cognitif." },
  { slug: "scratch-vs-python", image: "/images/kid-elearning.jpg", date: "5 sept. 2026", category: "programmation", title: "Scratch vs Python : par ou commencer ?", excerpt: "Guide pratique pour choisir le premier langage de programmation de votre enfant.", content: "Scratch est le point de depart ideal pour les 7-10 ans : interface visuelle, blocs couleurs, resultats immediats. A partir de 10-11 ans, Python devient pertinent : syntaxe textuelle simple, usage reel.\n\nL'erreur courante est de sauter trop tot sur Python. Un enfant qui a maitrise Scratch possede deja la logique algorithmique — le passage au code texte devient alors naturel et motivant.\n\nConseil : laissez votre enfant maitriser Scratch pendant au moins un an avant de passer a Python. La patience paie — un Python appris trop tot devient un obstacle, pas un outil." },
  { slug: "projets-ia-ados", image: "/images/hero-mentoring.jpg", date: "28 août 2026", category: "ia", title: "5 projets IA accessibles aux ados", excerpt: "Des projets concrets d'intelligence artificielle que les 12-17 ans peuvent realiser.", content: "L'IA n'est plus reservee aux universites. Un ado de 14 ans peut aujourd'hui entrainer un modele de reconnaissance d'images avec Teachable Machine, construire un chatbot avec Python et NLTK, ou analyser des donnees de sport avec Pandas.\n\nA Elite Code School, chaque projet IA suit un cycle reel : collecte de donnees, entrainement, evaluation, presentation. Les eleves apprennent aussi l'ethique de l'IA — biais, confidentialite, impact sociétal.\n\n5 projets concrets : reconnaissance d'images de dechets, chatbot educatif, analyse de sentiments sur les reseaux sociaux, classification de musique, prevision meteo par machine learning." },
  { slug: "portail-parent", image: "/images/hero-family.jpg", date: "20 août 2026", category: "parents", title: "Le portail parent : suivez chaque progres", excerpt: "Comment utiliser le portail parent pour suivre les heures de code et certificats.", content: "Le portail parent d'Elite Code School donne acces en temps reel a toutes les informations de votre enfant : heures de code validees, projets realises avec photos et descriptions, badges obtenus, niveaux franchis.\n\nVous pouvez discuter directement avec le formateur, consulter le calendrier des sessions et telecharger les certificats. Un tableau de bord synthetique montre la progression globale et les points a renforcer." },
  { slug: "hackathon-marrakech", image: "/images/teacher-board.jpg", date: "15 août 2026", category: "evenements", title: "Notre hackathon junior a Marrakech", excerpt: "Retour sur le hackathon junior de Marrakech ou deux equipes ont ete primees.", content: "Le 10 août, deux equipes d'Elite Code School ont participe au hackathon junior de Marrakech. L'equipe Mars Rovers a presente un prototype de rover martien Arduino, et l'equipe GreenAI a developpe un systeme de tri des dechets par vision par ordinateur.\n\nLes deux equipes ont ete primees — 2e et 3e places sur 12 equipes participantes. Une experience formidble qui montre que nos eleves sont prets a relever des defis reels." },
  { slug: "seance-essai", image: "/images/girl-writing.jpg", date: "10 août 2026", category: "parents", title: "Comment preparer la seance d'essai ?", excerpt: "Tout ce qu'il faut savoir pour la premiere visite de votre enfant.", content: "La seance d'essai dure 1h30. Votre enfant sera accueilli par son formateur, fera un mini-bilan de niveau, puis participera a une activite adaptee a son age.\n\nPas besoin d'ordinateur personnel — nous fournissons tout le materiel. Conseils : venez avec un pyjama deco, et n'hesitez pas a poser des questions au formateur. Le bilan de niveau est offert et sans engagement." },
];

const categoryLabels: Record<string, string> = {
  robotique: "Robotique",
  programmation: "Programmation",
  ia: "Intelligence artificielle",
  parents: "Conseils parents",
  evenements: "Événements",
};

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const article = articles.find((a) => a.slug === params.slug);
  if (!article) return { title: "Article non trouve" };
  return {
    title: `${article.title} — Blog — Elite Code School`,
    description: article.excerpt,
  };
}

export default function BlogArticlePage({ params }: { params: { slug: string } }) {
  const article = articles.find((a) => a.slug === params.slug);

  if (!article) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h1 className="font-display text-3xl font-bold text-ink">Article non trouve</h1>
        <Link href="/blog" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-brand">
          <ArrowLeft className="size-4" /> Retour au blog
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Hero image */}
      <div className="relative h-64 w-full overflow-hidden sm:h-80 lg:h-96">
        <Image
          src={article.image}
          alt={article.title}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 container-shell pb-8">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            <Tag className="size-2.5" /> {categoryLabels[article.category] ?? article.category}
          </span>
        </div>
      </div>

      {/* Article content */}
      <article className="container-shell py-10 sm:py-14">
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-bold text-brand transition hover:gap-2.5"
        >
          <ArrowLeft className="size-4" /> Retour au blog
        </Link>

        <div className="mx-auto max-w-3xl">
          <span className="flex items-center gap-1.5 text-xs font-bold text-ink-soft">
            <CalendarBlank className="size-3" /> {article.date}
          </span>

          <h1 className="mt-3 font-display text-3xl font-semibold tracking-[-0.02em] text-ink dark:text-ink sm:text-4xl lg:text-5xl">
            {article.title}
          </h1>

          <p className="mt-4 text-base font-medium leading-7 text-ink-soft sm:text-lg sm:leading-8">
            {article.excerpt}
          </p>

          <div className="mt-8 space-y-6">
            {article.content.split("\n\n").map((paragraph, i) => (
              <p key={i} className="text-sm font-medium leading-7 text-ink-soft sm:text-base sm:leading-8 dark:text-ink-soft">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Share / back */}
          <div className="mt-12 border-t border-border pt-8 dark:border-white/10">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full border-2 border-brand/30 bg-brand/10 px-6 py-3 text-sm font-bold text-brand transition hover:bg-brand hover:text-white"
            >
              <ArrowLeft className="size-4" /> Tous les articles
            </Link>
          </div>
        </div>
      </article>

      <CtaBand />
    </div>
  );
}
