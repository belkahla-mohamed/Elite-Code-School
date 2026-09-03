"use client";

import { useCallback, useEffect, useState } from "react";
import { Megaphone, Loader2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { showToast } from "@/components/ui/toast";
import { apiFetch } from "@/lib/api-fetch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import type { StudentAlert } from "@/lib/types";

const alertEmojis = ["📣", "🚀", "📅", "🎉", "❗", "🏆", "⚠️", "💡", "🎨", "🤖"];

export default function AnnouncementsPage() {
  const [alerts, setAlerts] = useState<StudentAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [emoji, setEmoji] = useState(alertEmojis[0]);
  const [sending, setSending] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/student-alerts");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur");
      setAlerts(data.alerts ?? []);
    } catch (e: any) {
      showToast(e.message ?? "Erreur de chargement", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function createAlert() {
    if (!title.trim() || !description.trim()) return;
    setSending(true);
    try {
      const res = await apiFetch("/api/admin/student-alerts", {
        method: "POST",
        body: JSON.stringify({ title: title.trim(), description: description.trim(), emoji }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur");
      setAlerts((prev) => [data.alert, ...prev]);
      setOpen(false);
      setTitle("");
      setDescription("");
      setEmoji(alertEmojis[0]);
      showToast("Annonce envoyée à tous les élèves 🚀", "success");
    } catch (e: any) {
      showToast(e.message ?? "Erreur lors de l'envoi", "error");
    } finally {
      setSending(false);
    }
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

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-black text-ink">Annonces aux familles</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Alertes importantes : prochains cours, événements spéciaux, Mission Planète Mars...
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-full bg-sky px-5 py-2.5 text-xs font-black uppercase tracking-wide text-white transition hover:bg-sky-dark"
        >
          <Plus className="size-4" /> Nouvelle annonce
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-brand" />
          ))}
        </div>
      ) : alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-brand border-2 border-border bg-white dark:bg-surface py-20 text-ink-soft">
          <Megaphone className="mb-4 size-12 opacity-40" />
          <p className="text-lg font-bold">Aucune annonce</p>
          <p className="mt-1 text-sm">Crée ta première annonce pour prévenir les familles.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={cn(
                "flex items-start gap-4 rounded-brand border-2 bg-white dark:bg-surface px-5 py-4",
                alert.read ? "border-border" : "border-sky bg-sky/5"
              )}
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface text-lg">
                {alert.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-ink">{alert.title}</h3>
                  {!alert.read && <span className="size-2 shrink-0 rounded-full bg-sky" />}
                </div>
                <p className="mt-0.5 text-sm text-ink-soft">{alert.description}</p>
                <p className="mt-1 text-xs text-ink-soft/50">
                  {alert.studentId === "all" ? "Tous les élèves · " : "Élève ciblé · "}
                  {timeAgo(alert.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base">Nouvelle annonce</DialogTitle>
            <DialogDescription>
              Envoyée à toutes les familles — idéal pour les prochains cours ou les événements spéciaux.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <label htmlFor="alert-emoji" className="mb-1.5 block text-xs font-black uppercase tracking-wide text-ink-soft">
                Emoji
              </label>
              <div className="flex flex-wrap gap-1.5">
                {alertEmojis.map((e) => (
                  <button
                    key={e}
                    onClick={() => setEmoji(e)}
                    className={cn(
                      "grid size-10 place-items-center rounded-xl border-2 text-lg transition",
                      emoji === e ? "border-sky bg-sky/10" : "border-border bg-surface hover:border-sky"
                    )}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="alert-title" className="mb-1.5 block text-xs font-black uppercase tracking-wide text-ink-soft">
                Titre
              </label>
              <input
                id="alert-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex : Préparation Mission Planète Mars"
                className="w-full rounded-xl border-2 border-border bg-white px-4 py-2.5 text-sm font-semibold outline-none transition focus:border-sky"
              />
            </div>
            <div>
              <label htmlFor="alert-desc" className="mb-1.5 block text-xs font-black uppercase tracking-wide text-ink-soft">
                Message
              </label>
              <Textarea
                id="alert-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Explique l'information importante aux familles..."
              />
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => setOpen(false)}
              disabled={sending}
              className="rounded-full border-2 border-border px-5 py-2 text-sm font-bold text-ink-soft transition hover:bg-surface"
            >
              Annuler
            </button>
            <button
              onClick={createAlert}
              disabled={sending || !title.trim() || !description.trim()}
              className="inline-flex items-center gap-2 rounded-full bg-sky px-5 py-2 text-sm font-black uppercase tracking-wide text-white transition hover:bg-sky-dark disabled:opacity-50"
            >
              {sending && <Loader2 className="size-4 animate-spin" />}
              Envoyer
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}