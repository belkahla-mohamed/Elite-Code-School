"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { EnvelopeSimple, Phone, User, Clock, ChatsCircle } from "@phosphor-icons/react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose,
} from "@/components/ui/dialog";

interface ContactLead {
  id: string;
  name: string;
  phone: string;
  message: string;
  createdAt: string;
}

export default function ContactMessagesPage() {
  const [leads, setLeads] = useState<ContactLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<ContactLead | null>(null);

  useEffect(() => {
    fetch("/api/contact")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setLeads(data.leads ?? []);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message ?? "Erreur de chargement");
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-black text-ink">Messages contact</h1>
        <p className="mt-1 text-sm text-ink-soft">Messages reçus depuis le formulaire de contact du site</p>
      </div>

      {/* Détail du message */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Message de {selected?.name}</DialogTitle>
            <DialogDescription>Reçu depuis le formulaire de contact du site</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 py-2">
              <div className="grid gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <User className="size-4 shrink-0 text-ink-soft" />
                  <span className="text-ink-soft">Nom:</span>
                  <span className="font-bold text-ink">{selected.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="size-4 shrink-0 text-ink-soft" />
                  <span className="text-ink-soft">Téléphone:</span>
                  <a href={`tel:${selected.phone}`} className="font-bold text-sky hover:underline">{selected.phone}</a>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="size-4 shrink-0 text-ink-soft" />
                  <span className="text-ink-soft">Reçu le:</span>
                  <span className="font-semibold text-ink">
                    {new Date(selected.createdAt).toLocaleDateString("fr-FR")} à{" "}
                    {new Date(selected.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
              <div className="rounded-brand border-2 border-border bg-surface p-4">
                <p className="mb-2 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-ink-soft">
                  <ChatsCircle className="size-3.5" /> Message complet
                </p>
                <p className="whitespace-pre-wrap text-sm leading-6 text-ink">
                  {selected.message || "(message vide)"}
                </p>
              </div>
              <div className="flex justify-end gap-3">
                <a
                  href={`sms:${selected.phone}`}
                  className="rounded-full border-2 border-border px-4 py-2 text-sm font-bold text-ink-soft transition hover:border-sky hover:text-sky"
                >
                  Répondre par SMS
                </a>
                <DialogClose asChild>
                  <button className="rounded-full bg-sky px-5 py-2 text-sm font-bold text-white transition hover:bg-sky/90">
                    Fermer
                  </button>
                </DialogClose>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-brand" />
          ))}
        </div>
      ) : error ? (
        <p className="rounded-brand border-2 border-coral/30 bg-coral/5 p-4 text-sm font-bold text-coral">{error}</p>
      ) : leads.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-ink-soft">
          <EnvelopeSimple className="mb-3 size-12 opacity-40" />
          <p className="text-lg font-bold">Aucun message</p>
          <p className="mt-1 text-sm">Les messages du formulaire de contact apparaîtront ici.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-brand border-2 border-border bg-white dark:bg-surface">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b-2 border-border bg-surface text-left">
                <th className="px-4 py-3 font-black text-xs uppercase tracking-wider text-ink-soft">Nom</th>
                <th className="px-4 py-3 font-black text-xs uppercase tracking-wider text-ink-soft">Téléphone</th>
                <th className="px-4 py-3 font-black text-xs uppercase tracking-wider text-ink-soft">Message</th>
                <th className="px-4 py-3 font-black text-xs uppercase tracking-wider text-ink-soft">Date</th>
                <th className="px-4 py-3 text-right font-black text-xs uppercase tracking-wider text-ink-soft">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-border">
              {leads.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => setSelected(lead)}
                  className="cursor-pointer transition hover:bg-surface/50"
                >
                  <td className="px-4 py-3 font-bold text-ink">{lead.name}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-ink-soft">{lead.phone}</td>
                  <td className="max-w-[320px] truncate px-4 py-3 text-ink-soft">{lead.message || "—"}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-ink-soft">
                    {new Date(lead.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelected(lead); }}
                      className="rounded-full bg-sky/10 px-3 py-1.5 text-xs font-bold text-sky transition hover:bg-sky/20"
                    >
                      Voir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
