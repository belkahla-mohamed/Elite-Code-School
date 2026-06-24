import type { Metadata } from "next";
import { Target, Heart, Lightbulb, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "À propos",
  description: "Elite Code School — mission, vision et approche pédagogique pour l'éducation STEM à Marrakech.",
};

export default function AboutPage() {
  return (
    <div className="py-20">
      <section className="container-shell text-center mb-20">
        <span className="tag">À propos</span>
        <h1 className="font-display text-5xl font-black tracking-[-0.04em] text-ink mt-4">
          Former la prochaine génération de créateurs
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg font-semibold leading-8 text-ink-soft">
          Elite Code School est une academy STEM basée à Marrakech, dédiée à l&apos;apprentissage
          de la robotique, du code et de l&apos;intelligence artificielle pour les 7–17 ans.
        </p>
      </section>

      <section className="bg-surface py-20">
        <div className="container-shell grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Target, title: "Mission", text: "Rendre la tech accessible, ludique et formatrice pour chaque enfant, quel que soit son niveau." },
            { icon: Heart, title: "Valeurs", text: "Créativité, persévérance, collaboration et pensée critique au cœur de chaque programme." },
            { icon: Lightbulb, title: "Approche", text: "Projets concrets, robots, missions et défis — pas de cours magistraux, que du pratique." },
            { icon: Users, title: "Encadrement", text: "Des coachs formés, un suivi parent clair et des classes à effectif réduit." },
          ].map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-brand border-2 border-[#E8EEF6] bg-white p-8 text-center">
              <Icon className="mx-auto size-10 text-sky" />
              <h3 className="mt-5 font-display text-xl font-black">{title}</h3>
              <p className="mt-3 text-sm font-semibold leading-6 text-ink-soft">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="py-20">
        <div className="container-shell max-w-3xl text-center">
          <h2 className="font-display text-4xl font-black tracking-[-0.04em]">Notre approche pédagogique</h2>
          <div className="mt-10 space-y-6 text-left">
            {[
              ["Apprentissage par projet", "Chaque élève construit des projets concrets: robots, jeux, applications web, modèles IA."],
              ["Parcours personnalisé", "Un niveau d'entrée évalué, un programme adapté à l'âge et au rythme de l'élève."],
              ["Suivi transparent", "Les parents accèdent au portfolio, aux projets et aux certificats en temps réel."],
              ["Compétition annuelle", "Mission Mars: un défi collectif qui mobilise robotique, code et travail d'équipe."],
            ].map(([title, text]) => (
              <div key={title} className="flex gap-4 items-start">
                <span className="mt-1 size-2 rounded-full bg-sky shrink-0" />
                <div>
                  <h3 className="font-display text-lg font-black">{title}</h3>
                  <p className="text-sm font-semibold text-ink-soft">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
