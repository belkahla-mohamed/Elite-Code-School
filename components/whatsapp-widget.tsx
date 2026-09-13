"use client";

import { useState } from "react";
import { X, PaperPlaneRight } from "@phosphor-icons/react";

const WHATSAPP_NUMBER = "212600000000";

export function WhatsAppWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating button */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Chattez avec nous sur WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition duration-300 ease-out hover:scale-110 hover:shadow-xl"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-7">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>

      {/* Expandable chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[320px] overflow-hidden rounded-2xl border border-white/20 bg-white shadow-2xl dark:bg-[#1e293b]">
          {/* Header */}
          <div className="flex items-center justify-between bg-[#075E54] px-5 py-4 text-white">
            <div>
              <p className="text-sm font-bold">Elite Code School</p>
              <p className="text-[11px] font-medium text-white/80">En ligne</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Fermer"
              className="flex size-8 items-center justify-center rounded-full transition hover:bg-white/15"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Chat bubble */}
          <div className="bg-[#DCF8C6] px-5 py-3 dark:bg-[#065E4F]">
            <p className="text-sm leading-relaxed text-ink dark:text-white">
              Bonjour ! Comment pouvons-nous vous aider ? 👋
            </p>
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 border-t border-border bg-surface px-4 py-3 dark:border-white/10 dark:bg-[#0f172a]">
            <input
              type="text"
              placeholder="Écrire un message..."
              className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-soft/60 dark:text-white"
            />
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              aria-label="Envoyer"
              className="flex size-9 items-center justify-center rounded-full bg-[#25D366] text-white transition hover:brightness-110"
            >
              <PaperPlaneRight className="size-4" />
            </a>
          </div>
        </div>
      )}
    </>
  );
}
