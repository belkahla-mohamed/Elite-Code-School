"use client";

import { useState } from "react";
import type { StudentPortfolio } from "@/lib/types";

type Tab = "projects" | "progress" | "certs" | "skills" | "gallery";

export function PortfolioTabs({ student }: { student: StudentPortfolio }) {
  const [tab, setTab] = useState<Tab>("projects");
  const done = student.projects.filter((project) => project.status === "done");
  const progress = student.projects.filter((project) => project.status !== "done");

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2 rounded-brand bg-surface p-1">
        {[
          ["projects", "💼 Projets"],
          ["progress", "🔧 En cours"],
          ["certs", "🏅 Certificats"],
          ["skills", "⚡ Compétences"],
          ["gallery", "🖼 Galerie"]
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id as Tab)}
            className={`rounded-brand-sm px-4 py-2 text-sm font-semibold transition ${tab === id ? "bg-white dark:bg-surface text-accent shadow" : "text-ink-soft hover:text-accent"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "projects" && <ProjectGrid projects={done} empty="Aucun projet terminé pour le moment." />}
      {tab === "progress" && <ProjectGrid projects={progress} empty="Aucun projet en cours pour le moment." />}
      {tab === "certs" && (
        <div className="grid gap-5 md:grid-cols-2">
          {student.certifications.map((certification) => (
            <article key={certification.id} className="overflow-hidden rounded-brand border border-ink/10 bg-white dark:bg-surface">
              <div className="p-8 text-white" style={{ background: certification.gradient }}>
                <div className="mb-5 text-5xl">{certification.emoji}</div>
                <h3 className="font-display text-2xl font-bold">{certification.title}</h3>
                <p className="mt-2 text-white/80">Elite Code School · Marrakech</p>
                <span className="mt-4 inline-flex rounded-full bg-white/15 px-3 py-1 font-mono text-xs">{certification.mention}</span>
              </div>
              <div className="flex items-center justify-between p-5 text-sm">
                <span className="text-ink-soft">{certification.dateLabel}</span>
                <a className="font-semibold text-accent" href={`/portfolio/${student.slug}`}>
                  Partager →
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
      {tab === "skills" && (
        <div className="grid gap-5 md:grid-cols-2">
          {["Logique algorithmique", "Créativité", "Robotique", "Collaboration"].map((skill, index) => (
            <div key={skill} className="rounded-brand border border-ink/10 bg-white dark:bg-surface p-5">
              <div className="mb-2 flex justify-between text-sm font-semibold">
                <span>{skill}</span>
                <span>{[82, 94, 76, 88][index]}%</span>
              </div>
              <div className="h-2 rounded-full bg-surface">
                <div className="h-2 rounded-full bg-gradient-to-r from-accent to-cyan" style={{ width: `${[82, 94, 76, 88][index]}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}
      {tab === "gallery" && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {student.gallery.map((item) => (
            <div key={item.id} className="flex min-h-44 flex-col items-center justify-center rounded-brand text-center text-white shadow-card" style={{ background: item.gradient }}>
              <div className="text-6xl">{item.emoji}</div>
              <div className="mt-4 font-semibold">{item.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectGrid({ projects, empty }: { projects: StudentPortfolio["projects"]; empty: string }) {
  if (!projects.length) return <p className="rounded-brand bg-surface p-6 text-ink-soft">{empty}</p>;

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <article key={project.id} className="overflow-hidden rounded-brand border border-ink/10 bg-white dark:bg-surface shadow-sm">
          <div className="relative flex min-h-40 items-center justify-center text-6xl text-white" style={{ background: project.gradient }}>
            {project.emoji}
            <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink">
              {project.status === "done" ? "Terminé" : "En cours"}
            </span>
          </div>
          <div className="p-5">
            <h3 className="font-display text-xl font-bold">{project.title}</h3>
            <p className="mt-2 text-sm leading-6 text-ink-soft">{project.description}</p>
            {project.status !== "done" && (
              <div className="mt-4">
                <div className="mb-1 flex justify-between text-xs text-ink-soft">
                  <span>Avancement</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-surface">
                  <div className="h-2 rounded-full bg-gradient-to-r from-accent to-cyan" style={{ width: `${project.progress}%` }} />
                </div>
              </div>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-ink/10 bg-surface px-3 py-1 font-mono text-xs text-ink-soft">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
