"use client";

import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react";

const facilities = [
  {
    image: "/images/hero-student.jpg",
    title: "Robotique & hardware",
    text: "mBot, Arduino, Micro:bit, Raspberry Pi : de vraies machines à programmer, pas des simulations.",
    anchor: "#robotique-detail",
  },
  {
    image: "/images/kid-elearning.jpg",
    title: "Coding & IA",
    text: "De Scratch à Python jusqu'aux projets d'IA : un cursus structuré qui suit l'élève pendant des années.",
    anchor: "#coding-detail",
  },
  {
    image: "/images/hero-family.jpg",
    title: "Suivi & certificats",
    text: "Portfolio public, heures de code comptabilisées, badges et certificats validés par l'administration.",
    anchor: "#suivi-detail",
  },
];

export function FacilitiesSection() {
  return (
    <>
      <section className="relative overflow-hidden bg-brand py-16 sm:py-24 dark:bg-brand-dark">
        {/* Decorative shapes */}
        <div aria-hidden className="absolute -left-16 top-12 size-40 rounded-full bg-white/10" />
        <div aria-hidden className="absolute bottom-8 right-[15%] size-24 rounded-full bg-amber/20" />
        <div aria-hidden className="absolute left-[8%] top-1/2 size-6 rotate-12 rounded-lg bg-cream/40" />
        <div aria-hidden className="absolute right-[6%] top-16 size-8 -rotate-12 rounded-lg bg-white/15" />

        <div className="container-shell">
          <div className="mb-10 text-center sm:mb-14">
            <span className="inline-flex rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-white">
              Nos atouts
            </span>
            <h2 className="mx-auto mt-4 max-w-3xl font-display text-3xl font-semibold tracking-[-0.02em] text-white md:text-5xl">
              Ce qui fait la différence
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-7 text-white/80 sm:mt-4 sm:text-base sm:leading-8">
              Du matériel réel, un cursus complet et un suivi transparent pour toute la famille.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {facilities.map((item) => (
              <a
                key={item.title}
                href={item.anchor}
                className="group block overflow-hidden rounded-brand transition duration-300 ease-out hover:-translate-y-1"
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={600}
                    height={450}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover transition duration-700 ease-out group-hover:scale-105"
                  />
                </div>
                <div className="bg-white px-6 py-6 dark:bg-[#1e293b]">
                  <h3 className="font-display text-lg font-semibold text-ink dark:text-white">{item.title}</h3>
                  <p className="mt-2 text-sm font-medium leading-6 text-ink-soft dark:text-slate-300">{item.text}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-brand transition group-hover:gap-2.5">
                    En savoir plus <ArrowUpRight className="size-3.5" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed breakdown sections */}
      <section id="robotique-detail" className="scroll-mt-24 bg-white py-16 sm:py-20 dark:bg-body">
        <div className="container-shell grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="inline-flex rounded-full bg-brand/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-brand">Robotique</span>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-[-0.02em] text-ink dark:text-ink sm:text-4xl">
              Matériel réel, pas de simulations
            </h2>
            <p className="mt-4 max-w-lg text-sm font-medium leading-7 text-ink-soft sm:text-base sm:leading-8 dark:text-ink-soft">
              Nos élèves manipulent de vrais robots et composants électroniques. Chaque projet combine mécanique, électronique et programmation pour une compréhension concrète de la technologie.
            </p>
            <ul className="mt-6 space-y-3">
              {["mBot 2 — robot autonome avec capteurs ultrason, ligne et lumière", "Arduino Uno & Nano — prototypage électronique", "Micro:bit V2 — calculateurs programmables avec écran LED", "Raspberry Pi 4 — mini-ordinateurs pour projets avancés"].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm font-semibold text-ink dark:text-ink">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand/15">
                    <span className="size-1.5 rounded-full bg-brand" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative hidden lg:block">
            <div aria-hidden className="absolute -left-6 -top-6 size-32 rounded-brand bg-brand/10" />
            <div className="relative overflow-hidden rounded-brand border-4 border-white dark:border-body">
              <Image src="/images/hero-student.jpg" alt="Élève avec robot Arduino" width={800} height={600} sizes="480px" className="aspect-[4/3] w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section id="coding-detail" className="scroll-mt-24 relative overflow-hidden bg-brand py-16 sm:py-20 dark:bg-brand-dark">
        <div className="container-shell grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative hidden lg:block">
            <div aria-hidden className="absolute -right-6 -bottom-6 size-32 rounded-full bg-white/10" />
            <div className="relative overflow-hidden rounded-brand border-4 border-white/25">
              <Image src="/images/kid-elearning.jpg" alt="Élève en session de code" width={800} height={600} sizes="480px" className="aspect-[4/3] w-full object-cover" />
            </div>
          </div>
          <div>
            <span className="inline-flex rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-white">Coding & IA</span>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-[-0.02em] text-white sm:text-4xl">
              Un cursus structuré de 7 à 17 ans
            </h2>
            <p className="mt-4 max-w-lg text-sm font-medium leading-7 text-white/80 sm:text-base sm:leading-8">
              De la pensée computational sur Scratch à l&apos;apprentissage automatique : chaque étape prépare la suivante avec des projets concrets et mesurables.
            </p>
            <ul className="mt-6 space-y-3">
              {["Scratch (7-9 ans) — logique, animations, jeux vidéo", "Python (10-13 ans) — scripts, automatisation, jeux", "Web Dev (12-15 ans) — HTML, CSS, JavaScript, React", "IA & Data Science (14-17 ans) — machine learning, NLP, vision"].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm font-semibold text-white">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-white/20">
                    <span className="size-1.5 rounded-full bg-cream" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="suivi-detail" className="scroll-mt-24 bg-white py-16 sm:py-20 dark:bg-body">
        <div className="container-shell grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="inline-flex rounded-full bg-brand/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-brand">Suivi & certificats</span>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-[-0.02em] text-ink dark:text-ink sm:text-4xl">
              Transparence totale pour les familles
            </h2>
            <p className="mt-4 max-w-lg text-sm font-medium leading-7 text-ink-soft sm:text-base sm:leading-8 dark:text-ink-soft">
              Chaque famille dispose d&apos;un portail sécurisé pour suivre les progrès. Les heures de code, projets réalisés et certifications sont tous documentés.
            </p>
            <ul className="mt-6 space-y-3">
              {["Portfolio public unique pour chaque élève avec galerie de projets", "Compteur d'heures de code validées par l'administration", "Badges de compétences et certificats officiels", "Suivi en temps réel via le portail parent sécurisé"].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm font-semibold text-ink dark:text-ink">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand/15">
                    <span className="size-1.5 rounded-full bg-brand" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative hidden lg:block">
            <div aria-hidden className="absolute -left-6 -top-6 size-32 rounded-full bg-amber/15" />
            <div className="relative overflow-hidden rounded-brand border-4 border-white dark:border-body">
              <Image src="/images/hero-family.jpg" alt="Parent et enfant devant l'ordinateur" width={800} height={600} sizes="480px" className="aspect-[4/3] w-full object-cover" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
