"use client";

import { useCallback, useEffect, useState } from "react";
import { useParentStudent } from "@/hooks/useParentStudent";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { showToast } from "@/components/ui/toast";
import { apiFetch } from "@/lib/api-fetch";
import type { StudentAlert } from "@/lib/types";
import { User, BellRinging, Checks, RocketLaunch, Moon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export default function ParentNotificationsPage() {
  const { student, loading, error } = useParentStudent();
  const [alerts, setAlerts] = useState<StudentAlert[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  const loadAlerts = useCallback(async () => {
    setPageLoading(true);
    try {
      const res = await fetch("/api/parent/alerts");
      if (!res.ok) throw new Error("Erreur de chargement");
      const data = await res.json();
      setAlerts(data.alerts ?? []);
    } catch {
      showToast("Erreur de chargement des notifications", "error");
    } finally {
      setPageLoading(false);
    }
  }, []);

  useEffect(() => {
    if (student) loadAlerts();
  }, [student, loadAlerts]);

  async function markAllRead() {
    setMarking(true);
    try {
      const res = await apiFetch("/api/parent/alerts", { method: "PATCH" });
      if (!res.ok) throw new Error("Erreur");
      setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
      showToast("Toutes les notifications sont lues", "success");
    } catch {
      showToast("Action impossible", "error");
    } finally {
      setMarking(false);
    }
  }

  if (loading) {
    return (
      <div>
        <Skeleton className="mb-6 h-4 w-40" />
        <Skeleton className="mb-6 h-24 w-full rounded-brand" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Breadcrumb items={[{ label: "Espace parent", href: "/parent" }, { label: "Notifications" }]} />
        <div className="mx-auto max-w-md rounded-brand border-2 border-border bg-white dark:bg-surface p-8 text-center">
          <User className="mx-auto size-12 text-ink-soft/40" />
          <h2 className="mt-4 font-display text-xl font-bold text-ink">{error}</h2>
          <Link href="/login" className="btn-primary mt-6 inline-flex">Se connecter</Link>
        </div>
      </div>
    );
  }

  if (!student) return null;

  const unreadCount = alerts.filter((a) => !a.read).length;

  return (
    <div>
      <Breadcrumb items={[
        { label: "Espace parent", href: "/parent" },
        { label: `${student.firstName} ${student.lastName}`, href: "/parent" },
        { label: "Notifications" }
      ]} />

      <div className="mb-6 overflow-hidden rounded-brand bg-brand p-6 text-white md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="grid size-14 place-items-center rounded-2xl bg-white/20 text-3xl">
              <BellRinging className="size-8" weight="fill" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-black tracking-tight">Notifications</h1>
              <p className="text-sm text-white/85">
                Les alertes importantes, nouveaux projets de tes créateurs et événements spéciaux
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              disabled={marking}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-black uppercase tracking-wide text-sky-dark transition hover:opacity-90 disabled:opacity-50"
            >
              <Checks className="size-4" />
              Tout marquer comme lu
            </button>
          )}
        </div>
      </div>

      <div className="mb-6 overflow-hidden rounded-brand border-2 border-border bg-white p-6 dark:bg-surface">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-amber/10 text-amber">
            <RocketLaunch className="size-8" weight="fill" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-lg font-black text-ink">Mission Planète Mars</h2>
            <p className="text-sm font-semibold text-ink-soft">
              La grande compétition annuelle arrive ! Stratégie, robotique, présentation… Prépare ton portfolio !
            </p>
          </div>
          <Link href="/inscription" className="rounded-full bg-amber px-5 py-2.5 text-xs font-black uppercase tracking-wide text-white transition hover:opacity-90">
            En savoir plus
          </Link>
        </div>
      </div>

      <div className="rounded-brand border-2 border-border bg-white dark:bg-surface p-6 md:p-8">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-coral/10 text-coral">
              <BellRinging className="size-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-black text-ink">Mes alertes</h2>
              <p className="text-xs font-semibold text-ink-soft">
                {unreadCount > 0 ? `${unreadCount} non lue(s)` : "Tout est à jour ✓"}
              </p>
            </div>
          </div>
        </div>

        {pageLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-2xl" />
            ))}
          </div>
        ) : alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-surface px-6 py-14 text-center">
            <div className="mb-3 text-ink-soft/40">
              <Moon className="size-16" weight="fill" />
            </div>
            <p className="font-display text-lg font-bold text-ink">Aucune notification</p>
            <p className="mt-1 text-sm text-ink-soft">On te préviendra dès qu&apos;il y a du nouveau !</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-start gap-4 rounded-2xl border-2 p-4 transition ${
                  alert.read
                    ? "border-border bg-surface"
                    : "border-sky bg-sky/5"
                }`}
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                  <BellRinging className="size-6 text-brand" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-base font-black text-ink">{alert.title}</h3>
                    {!alert.read && (
                      <span className="rounded-full bg-coral px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                        Nouveau
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm font-semibold leading-6 text-ink-soft">{alert.description}</p>
                  <p className="mt-1.5 text-[11px] font-semibold text-ink-soft/70">
                    {formatDate(alert.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function formatDate(iso: string) {
  const date = new Date(iso);
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours} h`;
  return date.toLocaleDateString("fr-MA", { day: "numeric", month: "short", year: "numeric" });
}