"use client";

import { useCallback, useEffect, useState } from "react";
import { Chat, SpinnerGap, PaperPlaneRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { showToast } from "@/components/ui/toast";
import { apiFetch } from "@/lib/api-fetch";
import { Skeleton } from "@/components/ui/skeleton";
import type { StudentMessage, StudentPortfolio } from "@/lib/types";

export default function StudentMessagesPage() {
  const [messages, setMessages] = useState<StudentMessage[]>([]);
  const [students, setStudents] = useState<StudentPortfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/student-messages");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur");
      setMessages(data.messages ?? []);
      setStudents(data.students ?? []);
    } catch (e: any) {
      showToast(e.message ?? "Erreur de chargement", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function studentOf(message: StudentMessage) {
    return students.find((s) => s.id === message.studentId);
  }

  async function sendReply() {
    if (!replyingId || !draft.trim()) return;
    setSending(true);
    try {
      const res = await apiFetch(`/api/admin/student-messages/${replyingId}`, {
        method: "PATCH",
        body: JSON.stringify({ reply: draft.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur");
      setMessages((prev) => prev.map((m) => (m.id === replyingId ? data.message : m)));
      setReplyingId(null);
      setDraft("");
      showToast("Réponse envoyée à la famille ✈️", "success");
    } catch (e: any) {
      showToast(e.message ?? "Action impossible", "error");
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-brand" />
        ))}
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="font-display text-2xl font-black text-ink">Messages des familles</h1>
          <p className="mt-1 text-sm text-ink-soft">Questions et demandes de suivi envoyées depuis l&apos;espace parent.</p>
        </div>
        <div className="flex flex-col items-center justify-center rounded-brand border-2 border-border bg-white dark:bg-surface py-20 text-ink-soft">
          <Chat className="mb-4 size-12 opacity-40" />
          <p className="text-lg font-bold">Aucun message</p>
          <p className="mt-1 text-sm">Les messages des parents apparaîtront ici.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-black text-ink">Messages des familles</h1>
        <p className="mt-1 text-sm text-ink-soft">
          {messages.filter((m) => !m.reply).length} message(s) en attente de réponse
        </p>
      </div>

      <div className="space-y-3">
        {messages.map((message) => {
          const student = studentOf(message);
          return (
            <div key={message.id} className={cn("rounded-brand border-2 bg-white dark:bg-surface p-5", !message.reply ? "border-sky" : "border-border")}>
              <div className="flex items-start gap-3">
                <div
                  className="flex size-10 shrink-0 items-center justify-center rounded-xl font-display text-xs font-black text-white"
                  style={{ background: student?.avatarGradient ?? "linear-gradient(135deg,#0284c7,#38bdf8)" }}
                >
                  {student?.avatar ?? "?"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold text-ink">
                      {student ? `${student.firstName} ${student.lastName}` : "Élève inconnu"}
                    </p>
                    <span className="text-xs text-ink-soft/50">
                      {new Date(message.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                    {message.reply ? (
                      <span className="rounded-full bg-lime/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-lime">
                        Répondu
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-amber">
                        À répondre
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 break-words rounded-xl bg-surface p-3 text-sm font-semibold text-ink">{message.message}</p>
                  {message.reply && (
                    <div className="mt-2 rounded-xl rounded-tl-sm border-2 border-sky/20 bg-sky/5 p-3">
                      <p className="mb-1 text-[10px] font-black uppercase tracking-wide text-sky">Votre réponse</p>
                      <p className="break-words text-sm font-semibold text-ink">{message.reply}</p>
                    </div>
                  )}
                  {!message.reply && (
                    <div className="mt-3">
                      <textarea
                        value={replyingId === message.id ? draft : ""}
                        onChange={(e) => { setReplyingId(message.id); setDraft(e.target.value); }}
                        rows={2}
                        placeholder="Écrire une réponse..."
                        className="w-full rounded-xl border-2 border-border bg-white px-4 py-2.5 text-sm font-semibold outline-none transition focus:border-sky"
                      />
                      <div className="mt-2 flex justify-end">
                        <button
                          onClick={sendReply}
                          disabled={sending || replyingId !== message.id || !draft.trim()}
                          className="inline-flex items-center gap-2 rounded-full bg-sky px-5 py-2 text-xs font-black uppercase tracking-wide text-white transition hover:bg-sky-dark disabled:opacity-40"
                        >
                          {sending && replyingId === message.id ? <SpinnerGap className="size-4 animate-spin" /> : <PaperPlaneRight className="size-4" />}
                          Envoyer la réponse
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}