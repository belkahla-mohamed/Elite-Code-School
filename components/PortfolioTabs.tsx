"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import type { IconProps } from "@phosphor-icons/react";
import { FolderOpen } from "@phosphor-icons/react/dist/csr/FolderOpen";
import { Wrench } from "@phosphor-icons/react/dist/csr/Wrench";
import { Medal } from "@phosphor-icons/react/dist/csr/Medal";
import { Lightning } from "@phosphor-icons/react/dist/csr/Lightning";
import { Images } from "@phosphor-icons/react/dist/csr/Images";
import { ShareNetwork } from "@phosphor-icons/react/dist/csr/ShareNetwork";
import { CalendarBlank } from "@phosphor-icons/react/dist/csr/CalendarBlank";
import { CheckCircle } from "@phosphor-icons/react/dist/csr/CheckCircle";
import { Brain } from "@phosphor-icons/react/dist/csr/Brain";
import { GameController } from "@phosphor-icons/react/dist/csr/GameController";
import { Globe } from "@phosphor-icons/react/dist/csr/Globe";
import { DownloadSimple } from "@phosphor-icons/react/dist/csr/DownloadSimple";
import { Cpu } from "@phosphor-icons/react/dist/csr/Cpu";
import { Robot } from "@phosphor-icons/react/dist/csr/Robot";
import { ChartBar } from "@phosphor-icons/react/dist/csr/ChartBar";
import { Code } from "@phosphor-icons/react/dist/csr/Code";
import { Trophy } from "@phosphor-icons/react/dist/csr/Trophy";
import { Sparkle } from "@phosphor-icons/react/dist/csr/Sparkle";
import { Clock } from "@phosphor-icons/react/dist/csr/Clock";
import { Hourglass } from "@phosphor-icons/react/dist/csr/Hourglass";
import { X } from "@phosphor-icons/react/dist/csr/X";
import { ArrowSquareOut } from "@phosphor-icons/react/dist/csr/ArrowSquareOut";
import type { StudentPortfolio } from "@/lib/types";
import { ShareMenu } from "@/components/ui/share-menu";

type Tab = "projects" | "progress" | "certs" | "skills" | "gallery";

const TABS: { id: Tab; label: string; icon: any }[] = [
  { id: "projects", label: "Projets", icon: FolderOpen },
  { id: "progress", label: "En cours", icon: Wrench },
  { id: "certs", label: "Certificats", icon: Medal },
  { id: "skills", label: "Compétences", icon: Lightning },
  { id: "gallery", label: "Galerie", icon: Images },
];

const solidCovers = ["bg-brand", "bg-amber", "bg-violet", "bg-lime", "bg-mint", "bg-coral"];

function projectIcon(tags: string[]): any {
  const t = tags.join(" ").toLowerCase();
  if (/(ia|vision|machine|ml|nlp|chatbot|brain|reconnaisance)/.test(t)) return Brain;
  if (/(game|jeu|scratch|animation|histoire)/.test(t)) return GameController;
  if (/(web|react|html|css|javascript|portfolio|site)/.test(t)) return Globe;
  if (/(arduino|iot|capteur|serre|electronique)/.test(t)) return Cpu;
  if (/(vincibot|robot|robotique|mbot)/.test(t)) return Robot;
  if (/(data|pandas|analys|ventes|dashboard)/.test(t)) return ChartBar;
  if (/(python|code|api)/.test(t)) return Code;
  return Sparkle;
}

export function PortfolioTabs({ student }: { student: StudentPortfolio }) {
  const [tab, setTab] = useState<Tab>("projects");
  const [lightbox, setLightbox] = useState<{ src: string; label: string } | null>(null);
  const [selectedProject, setSelectedProject] = useState<StudentPortfolio["projects"][number] | null>(null);

  useEffect(() => {
    if (!lightbox && !selectedProject) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightbox(null);
        setSelectedProject(null);
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, selectedProject]);

  const done = student.projects.filter((project) => project.status === "completed");
  const progress = student.projects.filter((project) => project.status !== "completed");

  return (
    <div>
      <div
        role="tablist"
        aria-label="Sections du portfolio"
        className="mb-8 flex flex-wrap gap-2 print:hidden"
      >
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wide transition duration-200 ease-out ${
              tab === id
                ? "bg-brand text-white"
                : "border border-border bg-white text-ink-soft hover:border-brand/30 hover:text-ink dark:border-white/10 dark:bg-[#1e293b] dark:text-slate-400"
            }`}
          >
            <Icon className="size-4" />
            {label}
          </button>
        ))}
      </div>

      <div key={tab} className="animate-fade-up">
      {tab === "projects" && <ProjectGrid projects={done} empty="Aucun projet terminé pour le moment." onOpen={setSelectedProject} />}
      {tab === "progress" && <ProjectGrid projects={progress} empty="Aucun projet en cours pour le moment." onOpen={setSelectedProject} />}
      {tab === "certs" && (
        <div className="grid gap-6 md:grid-cols-2">
          {student.certifications.map((certification, ci) => (
            <article key={certification.id} className="overflow-hidden rounded-brand border border-border bg-white dark:border-white/10 dark:bg-[#1e293b]">
              <div className={`p-8 text-white ${solidCovers[ci % solidCovers.length]}`}>
                <div className="mb-5 grid size-14 place-items-center rounded-brand-sm bg-white/20">
                  <Medal className="size-7" />
                </div>
                <h3 className="font-display text-2xl font-semibold">{certification.title}</h3>
                <p className="mt-2 text-sm font-medium text-white/80">Elite Code School · Marrakech</p>
                <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 font-mono text-xs">
                  <Trophy className="size-3.5" /> {certification.mention}
                </span>
              </div>
              <div className="flex items-center justify-between p-5 text-sm">
                <span className="flex items-center gap-1.5 text-xs font-medium text-ink-soft dark:text-slate-400">
                  <CalendarBlank className="size-4" /> {certification.dateLabel}
                </span>
                <div className="flex items-center gap-4">
                  <a href={`/verify-certificate?id=${certification.id}`} className="flex items-center gap-1.5 text-xs font-bold text-ink-soft hover:text-ink dark:text-slate-400 dark:hover:text-white transition">
                    <DownloadSimple className="size-4" /> PDF
                  </a>
                  <ShareMenu
                    title={`${certification.title} — ${student.firstName} ${student.lastName}`}
                    triggerClassName="flex items-center gap-1.5 text-xs font-bold text-brand"
                    label={<>Partager <ShareNetwork className="size-4" /></>}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
      {tab === "skills" && <SkillsSection student={student} />}
      {tab === "gallery" && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 print:hidden">
          {student.gallery.map((item, gi) => (
            item.imageUrl ? (
              <button
                key={item.id}
                type="button"
                onClick={() => item.imageUrl && setLightbox({ src: item.imageUrl, label: item.label })}
                aria-label={`Agrandir : ${item.label}`}
                className="group relative block w-full cursor-zoom-in overflow-hidden rounded-brand border border-border text-left dark:border-white/10"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.imageUrl} alt={item.label} className="h-44 w-full object-cover transition duration-500 ease-out group-hover:scale-105" />
                <div className="absolute inset-x-0 bottom-0 bg-ink/60 p-4">
                  <p className="flex items-center gap-2 text-sm font-bold text-white">
                    <Images className="size-4" /> {item.label}
                  </p>
                </div>
              </button>
            ) : (
              <div key={item.id} className={`flex min-h-44 flex-col items-center justify-center rounded-brand border border-border p-6 text-center text-white dark:border-white/10 ${solidCovers[gi % solidCovers.length]}`}>
                <Images className="size-10" />
                <div className="mt-4 text-sm font-bold">{item.label}</div>
              </div>
            )
          ))}
        </div>
      )}
      </div>

      {lightbox &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm sm:p-8"
            onClick={() => setLightbox(null)}
            role="dialog"
            aria-modal="true"
            aria-label={lightbox.label}
          >
            <div className="animate-scale-in w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={lightbox.src} alt={lightbox.label} className="max-h-[80vh] w-full rounded-brand object-contain" />
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="min-w-0 truncate text-sm font-bold text-white">{lightbox.label}</p>
                <button
                  type="button"
                  onClick={() => setLightbox(null)}
                  aria-label="Fermer"
                  className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-white transition duration-200 ease-out hover:bg-white/25"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {selectedProject &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm sm:p-8"
            onClick={() => setSelectedProject(null)}
            role="dialog"
            aria-modal="true"
            aria-label={selectedProject.title}
          >
            <div
              className="animate-scale-in w-full max-w-2xl overflow-hidden rounded-brand bg-white shadow-xl dark:bg-[#1e293b]"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="relative flex min-h-32 items-center justify-center p-6 text-white"
                style={{ background: selectedProject.gradient }}
              >
                {(() => {
                  const Icon = projectIcon(selectedProject.tags);
                  return <Icon className="size-12" />;
                })()}
                <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-ink">
                  {selectedProject.status === "completed" ? <><CheckCircle className="size-3.5 text-lime" /> Terminé</> : <><Hourglass className="size-3.5 text-amber" /> En cours</>}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  aria-label="Fermer"
                  className="absolute left-4 top-4 flex size-9 items-center justify-center rounded-full bg-white/20 text-white transition duration-200 ease-out hover:bg-white/35"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="max-h-[55vh] overflow-y-auto p-6">
                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-ink-soft dark:text-slate-400">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarBlank className="size-4" /> {selectedProject.dateLabel}
                  </span>
                  {selectedProject.status !== "completed" && (
                    <span className="inline-flex items-center gap-1.5">
                      <ChartBar className="size-4" /> Avancement {selectedProject.progress}%
                    </span>
                  )}
                </div>

                <h3 className="mt-2 font-display text-2xl font-semibold text-ink dark:text-white">
                  {selectedProject.title}
                </h3>

                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-ink-soft dark:text-slate-300">
                  {selectedProject.description}
                </p>

                {selectedProject.coverImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selectedProject.coverImage}
                    alt={selectedProject.title}
                    className="mt-4 w-full rounded-brand border border-border object-cover dark:border-white/10"
                  />
                )}

                {selectedProject.status !== "completed" && (
                  <div className="mt-5">
                    <div className="mb-1.5 flex justify-between text-xs font-semibold text-ink-soft dark:text-slate-400">
                      <span>Avancement</span>
                      <span>{selectedProject.progress}%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-surface dark:bg-white/10">
                      <div className="h-2.5 rounded-full bg-brand" style={{ width: `${selectedProject.progress}%` }} />
                    </div>
                  </div>
                )}

                <div className="mt-5">
                  <p className="mb-2 text-[11px] font-black uppercase tracking-wider text-ink-soft dark:text-slate-400">
                    Outils &amp; technologies
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.length > 0 ? (
                      selectedProject.tags.map((tag) => (
                        <span key={tag} className="rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-ink-soft dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-ink-soft dark:text-slate-400">Non renseignés</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border p-5 dark:border-white/10">
                {selectedProject.demoUrl ? (
                  <a
                    href={selectedProject.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-xs font-black uppercase tracking-wide text-white transition duration-200 ease-out hover:bg-brand-dark"
                  >
                    <Globe className="size-4" /> Voir la démo <ArrowSquareOut className="size-3.5" />
                  </a>
                ) : (
                  <span className="text-xs font-semibold text-ink-soft dark:text-slate-400">
                    Aucune démo en ligne pour ce projet
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="rounded-full border-2 border-border px-5 py-2 text-xs font-black uppercase tracking-wide text-ink-soft transition duration-200 ease-out hover:border-brand hover:text-brand dark:border-white/10 dark:text-slate-400"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>,
          document.body
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
      color: "bg-lime",
      icon: CheckCircle,
    },
    {
      name: "Projets en cours",
      percent: totalProjects > 0 ? Math.round((inProgress / totalProjects) * 100) : 0,
      color: "bg-brand",
      icon: Wrench,
    },
    {
      name: "Heures de code",
      percent: Math.min(100, Math.round((student.hours / 40) * 100)),
      display: `${student.hours}h / 40h`,
      color: "bg-amber",
      icon: Clock,
    },
    {
      name: "Certifications",
      percent: Math.min(100, student.certifications.length * 25),
      color: "bg-violet",
      icon: Medal,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {skills.map((skill) => (
        <div key={skill.name} className="rounded-brand border border-border bg-white p-5 dark:border-white/10 dark:bg-[#1e293b]">
          <div className="mb-2 flex items-center justify-between gap-2 text-sm font-semibold">
            <span className="flex items-center gap-2 text-ink dark:text-white">
              <skill.icon className="size-4 text-brand" /> {skill.name}
            </span>
            <span className="text-ink-soft dark:text-slate-400">{skill.display ?? `${skill.percent}%`}</span>
          </div>
          <div className="h-2.5 rounded-full bg-surface dark:bg-white/10">
            <div
              className={`h-2.5 rounded-full ${skill.color}`}
              style={{ width: `${skill.percent}%`, transition: "width 0.6s ease-out" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function ProjectGrid({ projects, empty, onOpen }: { projects: StudentPortfolio["projects"]; empty: string; onOpen: (project: StudentPortfolio["projects"][number]) => void }) {
  if (!projects.length) return <p className="rounded-brand border border-border bg-white p-6 text-center text-sm font-medium text-ink-soft dark:border-white/10 dark:bg-[#1e293b] dark:text-slate-400">{empty}</p>;

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project, pi) => {
        const Icon = projectIcon(project.tags);
        return (
          <button
            key={project.id}
            type="button"
            onClick={() => onOpen(project)}
            aria-label={`Voir les détails de ${project.title}`}
            className="group flex h-full w-full flex-col overflow-hidden rounded-brand border border-border bg-white text-left transition duration-300 ease-out hover:-translate-y-0.5 hover:border-brand hover:shadow-md dark:border-white/10 dark:bg-[#1e293b]"
          >
            <div className={`relative flex h-32 items-center justify-center ${solidCovers[pi % solidCovers.length]}`}>
              <Icon className="size-12 text-white" />
              <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-ink">
                {project.status === "completed" ? <><CheckCircle className="size-3.5 text-lime" /> Terminé</> : <><Hourglass className="size-3.5 text-amber" /> En cours</>}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="font-display text-lg font-semibold text-ink dark:text-white">{project.title}</h3>
              <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-ink-soft dark:text-slate-300">{project.description}</p>
              {project.status !== "completed" && (
                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-xs font-semibold text-ink-soft dark:text-slate-400">
                    <span>Avancement</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-surface dark:bg-white/10">
                    <div className="h-2 rounded-full bg-brand" style={{ width: `${project.progress}%` }} />
                  </div>
                </div>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-ink-soft dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
                    {tag}
                  </span>
                ))}
              </div>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-brand transition duration-300 ease-out group-hover:gap-2.5">
                Voir les détails <ArrowSquareOut className="size-3.5" />
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
