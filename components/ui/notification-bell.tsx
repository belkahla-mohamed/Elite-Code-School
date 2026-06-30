"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Bell, BellOff, CheckCheck, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type { AppNotification } from "@/lib/types";

export function NotificationBell() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [readingId, setReadingId] = useState<string | null>(null);
  const [readingAll, setReadingAll] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications");
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(data.notifications ?? []);
      setUnreadCount((data.notifications ?? []).filter((n: AppNotification) => !n.read).length);
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => { load(); const iv = setInterval(load, 15000); return () => clearInterval(iv); }, [load]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function markRead(id: string) {
    if (readingId) return;
    setReadingId(id);
    await fetch(`/api/notifications/${id}`, { method: "PATCH" });
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
    setUnreadCount((prev) => Math.max(0, prev - 1));
    setReadingId(null);
  }

  async function markAllRead() {
    if (readingAll) return;
    setReadingAll(true);
    await fetch("/api/notifications", { method: "PATCH" });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
    setReadingAll(false);
  }

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "À l'instant";
    if (mins < 60) return `Il y a ${mins} min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `Il y a ${hours}h`;
    const days = Math.floor(hours / 24);
    return `Il y a ${days}j`;
  }

  const typeEmoji: Record<string, string> = {
    student: "👤", project: "💼", certification: "🏅", request: "📋", contact: "✉️",
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative flex size-10 items-center justify-center rounded-full border-2 border-border bg-surface text-ink-soft transition hover:border-sky hover:text-sky"
        title="Notifications"
      >
        {unreadCount > 0 ? <Bell className="size-4" /> : <BellOff className="size-4" />}
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-coral text-[10px] font-black text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-brand border-2 border-border bg-white dark:bg-surface shadow-card z-50">
          <div className="flex items-center justify-between border-b-2 border-border px-4 py-3">
            <h3 className="font-display text-sm font-bold text-ink">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="flex items-center gap-1 text-xs font-bold text-sky hover:text-sky/80 transition" title="Tout marquer comme lu">
                  <CheckCheck className="size-3" /> Tout lu
                </button>
              )}
              <button onClick={() => { setOpen(false); router.push("/dashboard/notifications"); }} className="text-xs font-bold text-ink-soft hover:text-ink transition">
                Voir tout
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8"><Clock className="size-5 animate-spin text-ink-soft" /></div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-ink-soft">
              <BellOff className="mb-2 size-8 opacity-40" />
              <p className="text-sm font-bold">Aucune notification</p>
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {notifications.slice(0, 10).map((n) => (
                <button
                  key={n.id}
                  onClick={() => { if (!n.read) markRead(n.id); }}
                  className={cn(
                    "flex w-full items-start gap-3 border-b-2 border-border px-4 py-3 text-left transition hover:bg-surface/50",
                    !n.read && "bg-sky/5"
                  )}
                >
                  <span className="text-lg shrink-0">{typeEmoji[n.type] ?? "🔔"}</span>
                  <div className="min-w-0 flex-1">
                    <p className={cn("text-sm", !n.read ? "font-bold text-ink" : "text-ink-soft")}>{n.title}</p>
                    <p className="truncate text-xs text-ink-soft/70">{n.description}</p>
                    <p className="mt-0.5 text-[10px] text-ink-soft/50">{timeAgo(n.createdAt)}</p>
                  </div>
                  {!n.read && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-sky" />}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
