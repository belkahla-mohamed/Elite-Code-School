"use client";

import { useCallback, useEffect, useState } from "react";
import { useParentStudent } from "@/hooks/useParentStudent";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { showToast } from "@/components/ui/toast";
import { apiFetch } from "@/lib/api-fetch";
import type { StudentMessage } from "@/lib/types";
import { User, ChatCircle, PaperPlaneRight, SpinnerGap, EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export default function ParentMessagesPage() {
  const { student, loading, error } = useParentStudent();
  const [messages, setMessages] = useState<StudentMessage[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [draft, setDraft] = useState("");

  const loadMessages = useCallback(async () => {
    setPageLoading(true);
    try {
      const res = await fetch("/api/parent/messages");
      if (!res.ok) throw new Error("Erreur de chargement");
      const data = await res.json();
      setMessages(data.messages ?? []);
    } catch {
      showToast("Erreur de chargement des messages", "error");
    } finally {
      setPageLoading(false);
    }
  }, []);

  useEffect(() => {
    if (student) loadMessages();
  }, [student, loadMessages]);

  async function sendMessage() {
    if (!draft.trim()) return;
    setSending(true);
    try {
      const res = await apiFetch("/api/parent/messages", {
        method: "POST",
        body: JSON.stringify({ message: draft.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur lors de l'envoi");
      setMessages((prev) => [data.message, ...prev]);
      setDraft("");
      showToast("Message envoyé à l'administration ✈️", "success");
    } catch (e: any) {
      showToast(e.message ?? "Erreur lors de l'envoi", "error");
    } finally {
      setSending(false);
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
        <Breadcrumb items={[{ label: "Espace parent", href: "/parent" }, { label: "Messages" }]} />
        <div className="mx-auto max-w-md rounded-brand border-2 border-border bg-white dark:bg-surface p-8 text-center">
          <User className="mx-auto size-12 text-ink-soft/40" />
          <h2 className="mt-4 font-display text-xl font-bold text-ink">{error}</h2>
          <Link href="/login" className="btn-primary mt-6 inline-flex">Se connecter</Link>
        </div>
      </div>
    );
  }

  if (!student) return null;

  const unread = messages.filter((m) => m.reply && !m.repliedAt).length;

  return (
    <div>
      <Breadcrumb items={[
        { label: "Espace parent", href: "/parent" },
        { label: `${student.firstName} ${student.lastName}`, href: "/parent" },
        { label: "Messages" }
      ]} />

      <div className="mb-6 overflow-hidden rounded-brand bg-brand p-6 text-white md:p-8">
        <div className="flex items-center gap-4">
          <div className="grid size-14 place-items-center rounded-2xl bg-white/20 text-3xl">
            <EnvelopeSimple className="size-8" weight="fill" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-black tracking-tight">Parler à l&apos;administration</h1>
            <p className="text-sm text-white/85">
              Une question, un suivi, un problème ? Écris-nous, on te répond !
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Compose */}
        <div className="h-fit rounded-brand border-2 border-border bg-white dark:bg-surface p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-pink/10 text-pink">
              <ChatCircle className="size-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-black text-ink">Nouveau message</h2>
              <p className="text-xs font-semibold text-ink-soft">Réponse sous 24 à 48h</p>
            </div>
          </div>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={5}
            placeholder="Bonjour, j'aimerais savoir..."
            className="w-full rounded-xl border-2 border-border bg-white px-4 py-3 text-sm font-semibold outline-none transition focus:border-sky"
          />
          <button
            onClick={sendMessage}
            disabled={sending || !draft.trim()}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-pink px-6 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:opacity-90 disabled:opacity-40"
          >
            {sending ? <SpinnerGap className="size-4 animate-spin" /> : <PaperPlaneRight className="size-4" />}
            Envoyer
          </button>
        </div>

        {/* Thread */}
        <div className="rounded-brand border-2 border-border bg-white dark:bg-surface p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-sky/10 text-sky">
                <ChatCircle className="size-5" />
              </div>
              <div>
                <h2 className="font-display text-lg font-black text-ink">Conversations</h2>
                <p className="text-xs font-semibold text-ink-soft">{messages.length} message(s)</p>
              </div>
            </div>
            {unread > 0 && (
              <span className="rounded-full bg-lime/15 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-lime">
                {unread} nouvelle(s) réponse(s)
              </span>
            )}
          </div>

          {pageLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-2xl" />
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-surface px-6 py-14 text-center">
              <div className="text-5xl">💬</div>
              <p className="mt-3 font-display text-lg font-bold text-ink">Aucune conversation</p>
              <p className="mt-1 text-sm text-ink-soft">Écris-nous, nous te répondrons vite !</p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((message) => (
                <div key={message.id} className="rounded-2xl border-2 border-border bg-surface p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-ink-soft">
                      👨‍👩‍👧 Envoyé le {formatDate(message.createdAt)}
                    </span>
                    {message.reply ? (
                      <span className="rounded-full bg-lime/15 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-lime">
                        ✔ Répondu
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber/15 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber">
                        ⏳ En attente de réponse
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold leading-6 text-ink">{message.message}</p>
                  {message.reply && (
                    <div className="mt-3 rounded-2xl rounded-tl-sm border-2 border-sky/30 bg-sky/5 p-3">
                      <p className="mb-1 text-[10px] font-black uppercase tracking-wider text-sky">
                        🏫 Réponse de l&apos;administration
                      </p>
                      <p className="text-sm font-semibold leading-6 text-ink">{message.reply}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-MA", { day: "numeric", month: "short" });
}