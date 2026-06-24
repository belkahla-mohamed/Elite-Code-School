"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "danger" | "default";
}

export function ConfirmDialog({
  title,
  description,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  onConfirm,
  onCancel,
  variant = "danger",
}: ConfirmDialogProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  function handleClose() {
    setVisible(false);
    setTimeout(onCancel, 200);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}>
      <div className={cn("fixed inset-0 bg-black/40 transition-opacity duration-200", visible ? "opacity-100" : "opacity-0")} />
      <div className={cn(
        "relative w-full max-w-sm rounded-brand bg-white border-2 border-[#E8EEF6] shadow-lg p-6",
        "transition-all duration-200",
        visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      )}>
        <button onClick={handleClose} className="absolute right-4 top-4 text-ink-soft hover:text-ink">
          <X className="size-5" />
        </button>
        <h2 className="font-display text-xl font-black text-ink pr-8">{title}</h2>
        <p className="mt-2 text-sm text-ink-soft">{description}</p>
        <div className="mt-6 flex gap-3 justify-end">
          <button onClick={handleClose} className="rounded-full border-2 border-[#E8EEF6] px-4 py-2 text-sm font-bold text-ink-soft hover:border-sky transition">
            {cancelLabel}
          </button>
          <button
            onClick={() => { setVisible(false); setTimeout(onConfirm, 200); }}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-black uppercase tracking-wide text-white transition",
              variant === "danger" ? "bg-coral hover:bg-coral/90" : "bg-sky hover:bg-sky-dark"
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
