"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";

interface ConfirmDialogProps {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "danger" | "default";
  loading?: boolean;
}

export function ConfirmDialog({
  title,
  description,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  onConfirm,
  onCancel,
  variant = "danger",
  loading = false,
}: ConfirmDialogProps) {
  const [open, setOpen] = useState(true);

  function handleClose() {
    setOpen(false);
    setTimeout(onCancel, 200);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose() }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <button disabled={loading} className="rounded-full border-2 border-border bg-white dark:bg-surface px-4 py-2 text-sm font-bold text-ink-soft hover:border-sky transition disabled:opacity-50">
              {cancelLabel}
            </button>
          </DialogClose>
          <button
            disabled={loading}
            onClick={() => { if (!loading) { setOpen(false); setTimeout(onConfirm, 200); } }}
            className={`rounded-full px-4 py-2 text-sm font-black uppercase tracking-wide text-white transition disabled:opacity-50 ${variant === "danger" ? "bg-coral hover:bg-coral/90" : "bg-sky hover:bg-sky-dark"}`}
          >
            {loading ? <><Loader2 className="mr-1 inline size-4 animate-spin" /> {confirmLabel}</> : confirmLabel}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
