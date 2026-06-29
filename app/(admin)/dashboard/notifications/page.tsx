"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff, CheckCheck, Trash2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { showToast } from "@/components/ui/toast";
import type { AppNotification } from "@/lib/types";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/notifications");
    if (res.ok) {
      const data = await res.json();
      setNotifications(data.notifications ?? []);
    }
    setLoading(false);
  }

  async function markRead(id: string) {
    await fetch(`/api/notifications/${id}`, { method: "PATCH" });
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  }

  async function markAllRead() {
    await fetch("/api/notifications", { method: "PATCH" });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast("Toutes les notifications marquées comme lues", "success");
  }

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "À l'instant";
    if (mins < 60) return `Il y a ${mins} min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `Il y a ${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `Il y a ${days}j`;
    return new Date(dateStr).toLocaleDateString("fr-FR");
  }

  const typeEmoji: Record<string, string> = {
    student: "👤", project: "💼", certification: "🏅", request: "📋", contact: "✉️",
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-black text-ink">Notifications</h1>
          <p className="mt-1 text-sm text-ink-soft">Historique des notifications</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="btn-outline py-2">
            <CheckCheck className="mr-1 inline size-4" /> Tout marquer comme lu ({unreadCount})
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Clock className="size-8 animate-spin text-ink-soft" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-brand border-2 border-border bg-white dark:bg-surface py-20 text-ink-soft">
          <BellOff className="mb-4 size-12 opacity-40" />
          <p className="text-lg font-bold">Aucune notification</p>
          <p className="mt-1 text-sm">Les notifications apparaîtront ici.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => { if (!n.read) markRead(n.id); }}
              className={cn(
                "flex items-start gap-4 rounded-brand border-2 bg-white dark:bg-surface px-5 py-4 transition cursor-pointer hover:shadow-sm",
                !n.read ? "border-sky bg-sky/5" : "border-border"
              )}
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface text-lg">
                {typeEmoji[n.type] ?? "🔔"}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className={cn("text-sm", !n.read ? "font-bold text-ink" : "text-ink-soft")}>{n.title}</h3>
                  {!n.read && <span className="size-2 shrink-0 rounded-full bg-sky" />}
                </div>
                <p className="mt-0.5 text-sm text-ink-soft">{n.description}</p>
                <p className="mt-1 text-xs text-ink-soft/50">{timeAgo(n.createdAt)}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {n.read ? (
                  <span className="rounded-full bg-lime/10 px-2.5 py-0.5 text-[10px] font-bold text-lime">Lu</span>
                ) : (
                  <span className="rounded-full bg-sky/10 px-2.5 py-0.5 text-[10px] font-bold text-sky">Nouveau</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
