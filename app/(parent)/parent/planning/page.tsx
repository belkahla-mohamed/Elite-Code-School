"use client";

import { useState, useEffect } from "react";
import { useParentStudent } from "@/hooks/useParentStudent";
import { Breadcrumb } from "@/components/layout/parent-nav";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar, CheckCircle2, XCircle, Clock, AlertCircle,
  BookOpen, Target, ChevronRight, Award, Zap,
  CalendarDays, ListTodo
} from "lucide-react";
import Link from "next/link";
import type { StudentPlanning, WeeklySlot } from "@/lib/types";

const dayLabels: Record<string, string> = {
  Lundi: "Lun", Mardi: "Mar", Mercredi: "Mer", Jeudi: "Jeu",
  Vendredi: "Ven", Samedi: "Sam", Dimanche: "Dim"
};

const dayFull: Record<string, string> = {
  Lundi: "Lundi", Mardi: "Mardi", Mercredi: "Mercredi",
  Jeudi: "Jeudi", Vendredi: "Vendredi", Samedi: "Samedi", Dimanche: "Dimanche"
};

const todayDayName = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"][new Date().getDay()];

function seanceStatusConfig(status: string) {
  switch (status) {
    case "completed": return { label: "Terminé", class: "bg-lime/15 text-lime", icon: CheckCircle2 };
    case "absent": return { label: "Absent", class: "bg-coral/15 text-coral", icon: XCircle };
    case "scheduled": return { label: "Planifié", class: "bg-sky/15 text-sky", icon: Clock };
    case "cancelled": return { label: "Annulé", class: "bg-amber/15 text-amber", icon: AlertCircle };
    default: return { label: status, class: "bg-surface text-ink-soft", icon: Clock };
  }
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00")
  return new Intl.DateTimeFormat("fr-MA", { day: "numeric", month: "short" }).format(d)
}

function isToday(dateStr: string) {
  const today = new Date()
  const d = new Date(dateStr + "T00:00:00")
  return d.toDateString() === today.toDateString()
}

export default function ParentPlanningPage() {
  const { student, loading: studentLoading, error: studentError } = useParentStudent();
  const [planning, setPlanning] = useState<StudentPlanning | null>(null);
  const [planningLoading, setPlanningLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"all" | "upcoming">("all");

  useEffect(() => {
    if (!student) return;
    setPlanningLoading(true);
    fetch("/api/parent/planning")
      .then((res) => res.json())
      .then((data) => setPlanning(data.planning ?? null))
      .catch(() => setPlanning(null))
      .finally(() => setPlanningLoading(false));
  }, [student]);

  const loading = studentLoading || planningLoading;

  if (loading) {
    return (
      <div>
        <Skeleton className="mb-6 h-4 w-40" />
        <div className="rounded-brand border-2 border-border bg-white dark:bg-surface p-6 md:p-8">
          <div className="flex items-center gap-4 mb-8">
            <Skeleton className="size-16 rounded-2xl" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-56" />
              <Skeleton className="h-4 w-36" />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-brand-sm" />
            ))}
          </div>
          <Skeleton className="mt-6 h-48 w-full rounded-brand-sm" />
          <Skeleton className="mt-4 h-64 w-full rounded-brand-sm" />
        </div>
      </div>
    );
  }

  if (studentError) {
    return (
      <div>
        <Breadcrumb items={[{ label: "Espace parent", href: "/parent" }, { label: "Planning" }]} />
        <div className="mx-auto max-w-md rounded-brand border-2 border-border bg-white dark:bg-surface p-8 text-center">
          <Calendar className="mx-auto size-12 text-ink-soft/40" />
          <h2 className="mt-4 font-display text-xl font-bold text-ink">{studentError}</h2>
          <p className="mt-2 text-sm text-ink-soft">Veuillez vous reconnecter.</p>
          <Link href="/login" className="btn-primary mt-6 inline-flex">Se connecter</Link>
        </div>
      </div>
    );
  }

  if (!student || !planning) return null;

  const now = new Date()
  const upcomingSessions = planning.sessions
    .filter((s) => s.status === "scheduled" && new Date(s.date + "T23:59:59") >= now)
    .slice(0, 5)

  const recentSessions = planning.sessions
    .filter((s) => s.status === "completed" || s.status === "absent")
    .slice(-5)
    .reverse()

  const displayedSessions = viewMode === "upcoming" ? upcomingSessions : planning.sessions

  return (
    <div>
      <Breadcrumb items={[
        { label: "Espace parent", href: "/parent" },
        { label: `${student.firstName} ${student.lastName}`, href: "/parent" },
        { label: "Planning" }
      ]} />

      <div className="space-y-6">

        {/* ── Profile Banner ── */}
        <div className="rounded-brand border-2 border-border bg-white dark:bg-surface p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="flex items-center gap-4">
              <div
                className="flex size-16 items-center justify-center rounded-2xl font-display text-xl font-bold text-white shadow-md"
                style={{ background: student.avatarGradient }}
              >
                {student.avatar}
              </div>
              <div>
                <span className="tag">Planning</span>
                <h1 className="mt-2 font-display text-3xl font-extrabold text-ink">
                  {student.firstName} {student.lastName}
                </h1>
                <p className="text-ink-soft">{student.levelLabel}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-brand-sm border-2 border-border bg-surface px-4 py-2.5">
              <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-sky to-cyan text-white">
                <BookOpen className="size-4" />
              </div>
              <div>
                <div className="text-xs text-ink-soft">Programme</div>
                <div className="text-sm font-bold text-ink">{planning.programName}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
          <StatCard
            icon={<Calendar className="size-4" />}
            label="Total"
            value={String(planning.totalSeances)}
            sub="séances"
            color="from-sky to-cyan"
          />
          <StatCard
            icon={<CheckCircle2 className="size-4" />}
            label="Terminées"
            value={String(planning.completedSeances)}
            sub={`${planning.progression}% du programme`}
            color="from-lime to-emerald"
          />
          <StatCard
            icon={<XCircle className="size-4" />}
            label="Absences"
            value={String(planning.absentSeances)}
            sub={planning.absentSeances > 0 ? "à rattraper" : "aucune"}
            color="from-coral to-rose"
          />
          <StatCard
            icon={<Clock className="size-4" />}
            label="Planifiées"
            value={String(planning.scheduledSeances)}
            sub={planning.scheduledSeances > 0 ? "à venir" : "aucune"}
            color="from-amber to-orange"
          />
          <StatCard
            icon={<Zap className="size-4" />}
            label="Heures faites"
            value={`${planning.hoursCompleted}h`}
            sub={`sur ${planning.hoursTotal}h`}
            color="from-violet to-purple"
          />
          <StatCard
            icon={<Award className="size-4" />}
            label="Progression"
            value={`${planning.progression}%`}
            sub={planning.progression >= 100 ? "complété !" : "en cours"}
            color="from-pink to-rose"
          />
        </div>

        {/* ── Progress + Weekly Schedule ── */}
        <div className="grid gap-6 lg:grid-cols-5">

          {/* Progress Ring */}
          <div className="rounded-brand border-2 border-border bg-white dark:bg-surface p-6 lg:col-span-2">
            <h2 className="font-display text-lg font-bold text-ink mb-4 flex items-center gap-2">
              <Target className="size-5 text-sky" />
              Progression
            </h2>
            <div className="flex flex-col items-center">
              <div className="relative size-36">
                <svg className="size-36 -rotate-90" viewBox="0 0 144 144">
                  <circle cx="72" cy="72" r="64" fill="none" stroke="var(--border)" strokeWidth="10" />
                  <circle
                    cx="72" cy="72" r="64" fill="none" stroke="currentColor" strokeWidth="10"
                    strokeDasharray={`${2 * Math.PI * 64}`}
                    strokeDashoffset={`${2 * Math.PI * 64 * (1 - planning.progression / 100)}`}
                    className="text-sky transition-all duration-1000 ease-out"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display text-3xl font-extrabold text-ink">{planning.progression}%</span>
                  <span className="text-xs text-ink-soft">complété</span>
                </div>
              </div>
              <div className="mt-6 w-full space-y-3">
                <ProgressRow label="Séances terminées" value={planning.completedSeances} max={planning.totalSeances} color="bg-lime" />
                <ProgressRow label="Absences" value={planning.absentSeances} max={planning.totalSeances} color="bg-coral" />
                <ProgressRow label="Restantes" value={planning.totalSeances - planning.completedSeances - planning.absentSeances} max={planning.totalSeances} color="bg-sky" />
              </div>
            </div>
          </div>

          {/* Weekly Schedule */}
          <div className="rounded-brand border-2 border-border bg-white dark:bg-surface p-6 lg:col-span-3">
            <h2 className="font-display text-lg font-bold text-ink mb-4 flex items-center gap-2">
              <CalendarDays className="size-5 text-sky" />
              Calendrier hebdomadaire
            </h2>
            {planning.weeklySchedule.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {planning.weeklySchedule.map((slot) => (
                  <WeeklySlotCard
                    key={`${slot.day}-${slot.startTime}`}
                    slot={slot}
                    isToday={dayFull[slot.day] === todayDayName}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-ink-soft">
                <Calendar className="size-10 mb-2 opacity-40" />
                <p className="text-sm">Aucun horaire défini pour ce programme</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Sessions List ── */}
        <div className="rounded-brand border-2 border-border bg-white dark:bg-surface p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h2 className="font-display text-lg font-bold text-ink flex items-center gap-2">
              <ListTodo className="size-5 text-sky" />
              Séances
              <span className="text-sm font-normal text-ink-soft">({planning.sessions.length})</span>
            </h2>
            <div className="flex gap-1 rounded-brand-sm border-2 border-border p-1">
              <button
                onClick={() => setViewMode("all")}
                className={`px-3 py-1.5 text-xs font-bold rounded-brand-sm transition ${viewMode === "all" ? "bg-sky text-white" : "text-ink-soft hover:text-ink"}`}
              >
                Toutes
              </button>
              <button
                onClick={() => setViewMode("upcoming")}
                className={`px-3 py-1.5 text-xs font-bold rounded-brand-sm transition ${viewMode === "upcoming" ? "bg-sky text-white" : "text-ink-soft hover:text-ink"}`}
              >
                À venir
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {displayedSessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-ink-soft">
                <Calendar className="size-12 mb-3 opacity-30" />
                <p className="font-semibold">Aucune séance à venir</p>
                <p className="text-sm mt-1">Toutes les séances sont complétées !</p>
              </div>
            ) : (
              displayedSessions.map((seance, idx) => {
                const config = seanceStatusConfig(seance.status)
                const Icon = config.icon
                const today = isToday(seance.date)
                return (
                  <div
                    key={seance.id}
                    className={`flex items-center gap-4 rounded-brand-sm border-2 px-4 py-3.5 transition hover:shadow-sm ${
                      today && seance.status === "scheduled"
                        ? "border-sky bg-sky/5"
                        : "border-border bg-white dark:bg-surface"
                    }`}
                    style={{ animationDelay: `${idx * 30}ms` }}
                  >
                    <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${config.class}`}>
                      <Icon className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
                        <span className="text-sm font-bold text-ink truncate">{seance.title}</span>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${config.class}`}>
                          {config.label}
                        </span>
                        {today && seance.status === "scheduled" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-sky/15 text-sky px-2 py-0.5 text-[10px] font-black uppercase tracking-wider">
                            Aujourd&rsquo;hui
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 mt-0.5 text-xs text-ink-soft">
                        <span>{formatDate(seance.date)}</span>
                        <span>{seance.startTime} – {seance.endTime}</span>
                        {seance.topic && <span className="flex items-center gap-1"><Zap className="size-3" />{seance.topic}</span>}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* ── Program Overview ── */}
        {student.program && (
          <div className="rounded-brand border-2 border-border bg-white dark:bg-surface p-6 md:p-8">
            <h2 className="font-display text-lg font-bold text-ink mb-4 flex items-center gap-2">
              <BookOpen className="size-5 text-sky" />
              Aperçu du programme
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-bold text-ink mb-2">Objectifs</h3>
                <div className="text-sm text-ink-soft leading-relaxed whitespace-pre-line">
                  {student.program.objectives || "Aucun objectif défini"}
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-ink mb-2">Outils utilisés</h3>
                  <div className="flex flex-wrap gap-2">
                    {student.program.tools.map((tool) => (
                      <span key={tool} className="inline-flex items-center rounded-full bg-sky/10 text-sky px-3 py-1 text-xs font-bold">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ink mb-2">Durée</h3>
                  <p className="text-sm text-ink-soft">{student.program.duration || "Non spécifiée"}</p>
                </div>
                {student.program.prerequisites && (
                  <div>
                    <h3 className="text-sm font-bold text-ink mb-2">Prérequis</h3>
                    <p className="text-sm text-ink-soft">{student.program.prerequisites}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-6 pt-4 border-t-2 border-border">
              <Link
                href={`/curricula/${student.program.id}`}
                className="inline-flex items-center gap-1 text-sm font-bold text-sky hover:underline"
              >
                Voir le programme complet <ChevronRight className="size-4" />
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub, color }: {
  icon: React.ReactNode; label: string; value: string; sub: string; color: string;
}) {
  return (
    <div className="rounded-brand-sm border-2 border-border bg-white dark:bg-surface p-3 md:p-4 transition hover:shadow-sm">
      <div className={`inline-flex size-8 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-white mb-2`}>
        {icon}
      </div>
      <div className="font-display text-xl font-extrabold text-ink md:text-2xl">{value}</div>
      <div className="text-[11px] text-ink-soft font-semibold">{label}</div>
      <div className="mt-0.5 text-[10px] text-ink-soft/60 truncate">{sub}</div>
    </div>
  );
}

function ProgressRow({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="font-semibold text-ink">{label}</span>
        <span className="text-ink-soft">{value}/{max}</span>
      </div>
      <div className="h-2 rounded-full bg-surface overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function WeeklySlotCard({ slot, isToday }: { slot: WeeklySlot; isToday: boolean }) {
  return (
    <div className={`rounded-brand-sm border-2 p-4 transition ${
      isToday ? "border-sky bg-sky/5" : "border-border bg-surface/50"
    }`}>
      <div className="flex items-center gap-3 mb-2">
        <div className={`flex size-8 items-center justify-center rounded-lg text-white font-display text-xs font-bold ${
          isToday ? "bg-sky" : "bg-ink-soft/20 text-ink-soft"
        }`}>
          {dayLabels[slot.day] ?? slot.day.slice(0, 3)}
        </div>
        <div>
          <div className="text-sm font-bold text-ink">{slot.day}</div>
          <div className="text-xs text-ink-soft">{slot.startTime} – {slot.endTime}</div>
        </div>
        {isToday && (
          <span className="ml-auto rounded-full bg-sky/15 text-sky px-2 py-0.5 text-[10px] font-black uppercase">Auj</span>
        )}
      </div>
    </div>
  )
}
