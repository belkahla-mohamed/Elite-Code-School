"use client";

import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Medal, Code, Cpu, Brain, Wrench, BookOpen } from "@phosphor-icons/react";
import { useState } from "react";

const team = [
  {
    name: "Mehdi A.",
    role: "Robotique & Arduino",
    image: "/images/teacher-board.jpg",
    tint: "bg-brand/10 text-brand",
    initials: "MA",
    bio: "Ingénieur en électronique, passionné de robotique éducative depuis 10 ans. Spécialiste Arduino, mBot et Micro:bit.",
    certifications: ["Certifié Arduino Educator", "Formateur mBot Level 2", "Coach FIRST LEGO League"],
    expertise: ["Robotique Arduino", "Micro:bit & Raspberry Pi", "Circuits électroniques", "Programmation C++"],
  },
  {
    name: "Salma B.",
    role: "Scratch & Créativité",
    image: null,
    tint: "bg-violet/15 text-violet",
    initials: "SB",
    bio: "Professeure en technologies de l'information avec une spécialisation dans l'apprentissage créatif pour les jeunes.",
    certifications: ["Certifiée Scratch Trainer", "MIT App Inventor Academy", "Pédagogie Montessori Numérique"],
    expertise: ["Scratch & ScratchJr", "Animation numérique", "Pensée computational", "Création de jeux vidéo"],
  },
  {
    name: "Yassine K.",
    role: "Développement Web",
    image: null,
    tint: "bg-sky/15 text-sky",
    initials: "YK",
    bio: "Développeur full-stack avec 8 ans d'expérience. Amateur de transmission et de pédagogie interactive.",
    certifications: ["AWS Certified Developer", "Meta Front-End Developer", "Formateur React.js"],
    expertise: ["HTML, CSS, JavaScript", "React & Next.js", "Python & Django", "Bases de données"],
  },
  {
    name: "Nadia R.",
    role: "Intelligence artificielle",
    image: null,
    tint: "bg-amber/15 text-amber",
    initials: "NR",
    bio: "Chercheuse en IA diplômée de l'UM5, spécialisée dans la vulgarisation de l'intelligence artificielle pour les jeunes.",
    certifications: ["Google AI Essentials", "IBM Watson Certified", "Enseignante IA certifiée"],
    expertise: ["Machine Learning", "Traitement du langage naturel", "Vision par ordinateur", "Éthique de l'IA"],
  },
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "Robotique Arduino": Wrench,
  "Micro:bit & Raspberry Pi": Cpu,
  "Circuits électroniques": Cpu,
  "Programmation C++": Code,
  "Scratch & ScratchJr": Code,
  "Animation numérique": Code,
  "Pensée computational": Brain,
  "Création de jeux vidéo": Code,
  "HTML, CSS, JavaScript": Code,
  "React & Next.js": Code,
  "Python & Django": Code,
  "Bases de données": Code,
  "Machine Learning": Brain,
  "Traitement du langage naturel": Brain,
  "Vision par ordinateur": Brain,
  "Éthique de l'IA": Brain,
};

export function TeamSection() {
  const [selected, setSelected] = useState<(typeof team)[number] | null>(null);

  return (
    <>
      <section className="bg-white py-16 sm:py-24 dark:bg-body">
        <div className="container-shell">
          <div className="mb-10 text-center sm:mb-14">
            <span className="inline-flex rounded-full bg-brand/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-brand">Notre équipe</span>
            <h2 className="mx-auto mt-4 max-w-3xl font-display text-3xl font-semibold tracking-[-0.02em] text-ink dark:text-ink md:text-5xl">Nos formateurs</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-7 text-ink-soft sm:mt-4 sm:text-base sm:leading-8 dark:text-ink-soft">
              Des professionnels de la tech qui aiment transmettre — et qui savent parler aux enfants comme aux ados.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <button
                key={member.name}
                onClick={() => setSelected(member)}
                className="group text-center transition duration-300 ease-out hover:-translate-y-1"
              >
                {member.image ? (
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={300}
                    height={300}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 180px"
                    className="mx-auto size-36 rounded-full object-cover ring-4 ring-border transition group-hover:ring-brand dark:ring-white/10"
                  />
                ) : (
                  <span className={`mx-auto flex size-36 items-center justify-center rounded-full font-display text-3xl font-semibold ring-4 ring-border transition group-hover:ring-brand dark:ring-white/10 ${member.tint}`}>
                    {member.initials}
                  </span>
                )}
                <h3 className="mt-5 font-display text-lg font-semibold text-ink dark:text-ink">{member.name}</h3>
                <p className="mt-1 text-sm font-medium text-ink-soft dark:text-ink-soft">{member.role}</p>
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-brand opacity-0 transition group-hover:opacity-100">
                  Voir le profil →
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={!!selected} onOpenChange={(v) => { if (!v) setSelected(null); }}>
        <DialogContent className="max-w-xl">
          {selected && (
            <>
              <div className="flex items-center gap-5">
                {selected.image ? (
                  <Image
                    src={selected.image}
                    alt={selected.name}
                    width={120}
                    height={120}
                    className="size-20 rounded-full object-cover"
                  />
                ) : (
                  <span className={`flex size-20 items-center justify-center rounded-full font-display text-2xl font-semibold ${selected.tint}`}>
                    {selected.initials}
                  </span>
                )}
                <div>
                  <DialogTitle>{selected.name}</DialogTitle>
                  <DialogDescription>{selected.role}</DialogDescription>
                </div>
              </div>

              <div className="mt-4 space-y-5">
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-bold text-ink dark:text-ink">
                    <BookOpen className="size-4 text-brand" /> Parcours
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft dark:text-ink-soft">{selected.bio}</p>
                </div>

                <div>
                  <h4 className="flex items-center gap-2 text-sm font-bold text-ink dark:text-ink">
                    <Medal className="size-4 text-brand" /> Certifications
                  </h4>
                  <ul className="mt-2 space-y-1.5">
                    {selected.certifications.map((cert) => (
                      <li key={cert} className="flex items-center gap-2 text-sm text-ink-soft dark:text-ink-soft">
                        <span className="size-1.5 shrink-0 rounded-full bg-brand" />
                        {cert}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="flex items-center gap-2 text-sm font-bold text-ink dark:text-ink">
                    <Code className="size-4 text-brand" /> Expertise
                  </h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selected.expertise.map((skill) => {
                      const Icon = iconMap[skill] || Code;
                      return (
                        <span key={skill} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-ink-soft dark:border-white/10 dark:bg-[#1e293b] dark:text-slate-300">
                          <Icon className="size-3" />
                          {skill}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
