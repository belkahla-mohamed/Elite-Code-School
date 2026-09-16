"use client"

import { useState } from "react"
import { createPortal } from "react-dom"
import { X, Medal } from "@phosphor-icons/react"

interface Props {
  programTitle: string
  customText?: string
}

export function ProgramCertificatePreview({ programTitle, customText }: Props) {
  const [open, setOpen] = useState(false)

  const today = new Date()
  const dateStr = today.toLocaleDateString("fr-MA", { year: "numeric", month: "long", day: "numeric" })

  const certContent = (
    <div className="relative overflow-hidden rounded-xl border-2 border-amber/40 bg-gradient-to-br from-white via-amber/5 to-white p-8 text-center shadow-lg sm:p-12">
      {/* Decorative corners */}
      <div className="absolute left-3 top-3 size-12 border-l-2 border-t-2 border-amber/30" />
      <div className="absolute right-3 top-3 size-12 border-r-2 border-t-2 border-amber/30" />
      <div className="absolute bottom-3 left-3 size-12 border-b-2 border-l-2 border-amber/30" />
      <div className="absolute bottom-3 right-3 size-12 border-b-2 border-r-2 border-amber/30" />

      {/* Seal */}
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-amber to-yellow-400 shadow-md">
        <Medal className="size-8 text-white" weight="fill" />
      </div>

      <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-amber">Certificat de Réussite</p>

      <div className="mx-auto mt-4 h-px w-32 bg-gradient-to-r from-transparent via-amber/40 to-transparent" />

      <p className="mt-6 text-sm text-ink-soft dark:text-slate-400">Ce certificat est délivré à</p>

      <p className="mt-2 font-display text-2xl font-black text-ink dark:text-white sm:text-3xl">
        Karim Benali
      </p>

      <p className="mt-4 text-sm text-ink-soft dark:text-slate-400">pour avoir brillamment complété le programme</p>

      <p className="mt-2 font-display text-lg font-bold text-brand">{programTitle}</p>

      {customText && (
        <p className="mt-3 text-xs italic text-ink-soft/80 dark:text-slate-400">{customText}</p>
      )}

      <div className="mx-auto mt-6 h-px w-32 bg-gradient-to-r from-transparent via-amber/40 to-transparent" />

      <div className="mt-6 flex items-center justify-center gap-8 text-xs text-ink-soft dark:text-slate-400">
        <div>
          <p className="font-bold text-ink dark:text-white">{dateStr}</p>
          <p>Date de délivrance</p>
        </div>
        <div className="h-8 w-px bg-border dark:bg-white/10" />
        <div>
          <p className="font-bold text-ink dark:text-white">ECS-2026-{Math.floor(Math.random() * 9000 + 1000)}</p>
          <p>N° de série</p>
        </div>
      </div>

      <p className="mt-6 text-[10px] uppercase tracking-[0.15em] text-ink-soft/60">Elite Code School · Marrakech</p>
    </div>
  )

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-3 rounded-brand border border-border bg-surface p-5 transition duration-200 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-md dark:border-white/10 dark:bg-[#1e293b]"
      >
        <span className="flex size-12 shrink-0 items-center justify-center rounded-brand-sm bg-amber/15">
          <Medal className="size-6 text-amber" />
        </span>
        <div className="text-left">
          <p className="text-xs font-bold uppercase tracking-wider text-ink-soft dark:text-slate-400">Certificat</p>
          <p className="mt-0.5 text-sm font-semibold text-ink dark:text-white">Aperçu du certificat de réussite</p>
        </div>
      </button>

      {open && typeof window !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <button onClick={() => setOpen(false)} className="absolute -right-2 -top-2 z-10 rounded-full bg-white p-1.5 shadow-md hover:bg-cream">
                <X className="size-4 text-ink" />
              </button>
              {certContent}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
