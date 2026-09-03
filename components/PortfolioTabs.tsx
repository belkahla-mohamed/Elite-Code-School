"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  FolderOpen, Wrench, Award, Zap, Images, Share2, CalendarDays,
  CheckCircle2, Brain, Gamepad2, Globe,
  Cpu, Bot, BarChart3, Code2, Trophy, Sparkles, Clock, Hourglass,
} from "lucide-react";
import type { StudentPortfolio } from "@/lib/types";

type Tab = "projects" | "progress" | "certs" | "skills" | "gallery";

const TABS: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: "projects", label: "Projets", icon: FolderOpen },
  { id: "progress", label: "En cours", icon: Wrench },
  { id: "certs", label: "Certificats", icon: Award },
  { id: "skills", label: "Compétences", icon: Zap },
  { id: "gallery", label: "Galerie", icon: Images },
];

function projectIcon(tags: string[]): LucideIcon {
  const t = tags.join(" ").toLowerCase();
  if (/(ia|vision|machine|ml|nlp|chatbot|brain|reconnaisance)/.test(t)) return Brain;
  if (/(game|jeu|scratch|animation|histoire)/.test(t)) return Gamepad2;
  if (/(web|react|html|css|javascript|portfolio|site)/.test(t)) return Globe;
  if (/(arduino|iot|capteur|serre|electronique)/.test(t)) return Cpu;
  if (/(vincibot|robot|robotique|mbot)/.test(t)) return Bot;
  if (/(data|pandas|analys|ventes|dashboard)/.test(t)) return BarChart3;
  if (/(python|code|api)/.test(t)) return Code2;
  return Sparkles;
}

export function PortfolioTabs({ student }: { student: StudentPortfolio }) {
  const [tab, setTab] = useState<Tab>("projects");
  const done = student.projects.filter((project) => project.status === "completed");
  const progress = student.projects.filter((project) => project.status !== "completed");

  return (
    <div>
      <div
      role="tablist"
      aria-label="Sections du portfolio"
      className="mb-8 flex flex-wrap gap-2 rounded-brand bg-surface p-1.5"
    >
      {TABS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          role="tab"
          aria-selected={tab === id}
          onClick={() => setTab(id)}
          className={`flex items-center gap-2 rounded-brand-sm px-4 py-2 text-sm font-bold transition ${tab === id ? "bg-white text-sky" : "text-ink-soft hover:text-sky"}`}
        >
          <Icon className="size-4" />
          {label}
        </button>
      ))}
    </div>

      {tab === "projects" && <ProjectGrid projects={done} empty="Aucun projet terminé pour le moment." />}
      {tab === "progress" && <ProjectGrid projects={progress} empty="Aucun projet en cours pour le moment." />}
      {tab === "certs" && (
        <div className="grid gap-5 md:grid-cols-2">
          {student.certifications.map((certification) => (
            <article key={certification.id} className="overflow-hidden rounded-brand border-2 border-border bg-white transition hover:border-sky dark:bg-surface">
              <div className="p-8 text-white" style={{ background: certification.gradient }}>
                <div className="mb-5 grid size-14 place-items-center rounded-brand-sm bg-white/20">
                  <Award className="size-7" />
                </div>
                <h3 className="font-display text-2xl font-black">{certification.title}</h3>
                <p className="mt-2 text-white/80">Elite Code School · Marrakech</p>
                <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 font-mono text-xs">
                  <Trophy className="size-3.5" /> {certification.mention}
                </span>
              </div>
              <div className="flex items-center justify-between p-5 text-sm">
                <span className="flex items-center gap-1.5 text-ink-soft">
                  <CalendarDays className="size-4" /> {certification.dateLabel}
                </span>
                <a className="flex items-center gap-1 font-semibold text-sky" href={`/portfolios/${student.slug}`}>
                  Partager <Share2 className="size-4" />
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
      {tab === "skills" && <SkillsSection student={student} />}
      {tab === "gallery" && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {student.gallery.map((item) => (
            item.imageUrl ? (
              <div key={item.id} className="group relative overflow-hidden rounded-brand border-2 border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.imageUrl} alt={item.label} className="h-44 w-full object-cover transition group-hover:scale-105" />
                <div className="absolute bottom-0 left-0 right-0 bg-ink/50 p-4">
                  <p className="flex items-center gap-2 font-semibold text-white">
                    <Images className="size-4" /> {item.label}
                  </p>
                </div>
              </div>
            ) : (
              <div key={item.id} className="flex min-h-44 flex-col items-center justify-center rounded-brand border-2 border-border text-center text-white" style={{ background: item.gradient }}>
                <Images className="size-10" />
                <div className="mt-4 font-semibold">{item.label}</div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
}

function SkillsSection({ student }: { student: StudentPortfolio }) {
  const totalProjects = student.projects.length;
  const completedProjects = student.projects.filter((p) => p.status === "completed").length;
  const inProgress = student.projects.filter((p) => p.status !== "completed").length;

  const skills = [
    {
      name: "Projets complétés",
      percent: totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0,
      color: "from-lime to-emerald",
      icon: CheckCircle2,
    },
    {
      name: "Projets en cours",
      percent: totalProjects > 0 ? Math.round((inProgress / totalProjects) * 100) : 0,
      color: "from-sky to-cyan",
      icon: Wrench,
    },
    {
      name: "Heures de code",
      percent: Math.min(100, Math.round((student.hours / 40) * 100)),
      display: `${student.hours}h / 40h`,
      color: "from-amber to-orange",
      icon: Clock,
    },
    {
      name: "Certifications",
      percent: Math.min(100, student.certifications.length * 25),
      color: "from-violet to-purple",
      icon: Award,
    },
  ];

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {skills.map((skill) => (
        <div key={skill.name} className="rounded-brand border-2 border-border bg-white p-5 dark:bg-surface">
          <div className="mb-2 flex items-center justify-between gap-2 text-sm font-semibold">
            <span className="flex items-center gap-2 text-ink">
              <skill.icon className="size-4 text-sky" /> {skill.name}
            </span>
            <span className="text-ink-soft">{skill.display ?? `${skill.percent}%`}</span>
          </div>
          <div className="h-2.5 rounded-full bg-surface">
            <div
              className={`h-2.5 rounded-full bg-gradient-to-r ${skill.color}`}
              style={{ width: `${skill.percent}%`, transition: "width 0.6s ease-out" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function ProjectGrid({ projects, empty }: { projects: StudentPortfolio["projects"]; empty: string }) {
  if (!projects.length) return <p className="rounded-brand bg-surface p-6 text-ink-soft">{empty}</p>;

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => {
        const Icon = projectIcon(project.tags);
        return (
          <article key={project.id} className="overflow-hidden rounded-brand border-2 border-border bg-white transition hover:border-sky dark:bg-surface">
            <div className="relative flex min-h-40 items-center justify-center" style={{ background: project.gradient }}>
              <Icon className="size-14 text-white" />
              <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-black uppercase tracking-wide text-ink">
                {project.status === "completed" ? <><CheckCircle2 className="size-3.5 text-lime" /> Terminé</> : <><Hourglass className="size-3.5" /> En cours</>}
              </span>
            </div>
            <div className="p-5">
              <h3 className="font-display text-xl font-bold text-ink">{project.title}</h3>
              <p className="mt-2 text-sm leading-6 text-ink-soft">{project.description}</p>
              {project.status !== "completed" && (
                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-xs font-semibold text-ink-soft">
                    <span>Avancement</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-surface">
                    <div className="h-2 rounded-full bg-gradient-to-r from-sky to-cyan" style={{ width: `${project.progress}%` }} />
                  </div>
                </div>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="rounded-full border-2 border-border bg-surface px-3 py-1 font-mono text-xs text-ink-soft">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}