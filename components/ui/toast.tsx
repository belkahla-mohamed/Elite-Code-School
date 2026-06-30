"use client";

import dynamic from "next/dynamic";
import { toast } from "react-hot-toast";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error" | "warning" | "info";

const icons: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle className="size-5 text-lime" />,
  error: <XCircle className="size-5 text-coral" />,
  warning: <AlertTriangle className="size-5 text-amber" />,
  info: <Info className="size-5 text-sky" />,
};

const variants: Record<ToastVariant, string> = {
  success: "border-lime/30 dark:border-lime/50",
  error: "border-coral/30 dark:border-coral/50",
  warning: "border-amber/30 dark:border-amber/50",
  info: "border-sky/30 dark:border-sky/50",
};

function showToast(message: string, variant: ToastVariant = "info") {
  toast.custom(
    (t) => (
      <div
        className={cn(
          "flex items-start gap-3 rounded-brand border-2 bg-white dark:bg-surface px-5 py-4 shadow-lg dark:shadow-2xl dark:shadow-black/50",
          "max-w-md w-full transition-all duration-300",
          variants[variant],
          t.visible ? "animate-in slide-in-from-top-2" : "animate-out slide-out-to-top-2"
        )}
      >
        <span className="mt-0.5 shrink-0">{icons[variant]}</span>
        <p className="flex-1 font-body text-sm text-ink">{message}</p>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="text-ink-soft hover:text-ink transition shrink-0"
          aria-label="Fermer"
        >
          <X className="size-4" />
        </button>
      </div>
    ),
    { duration: variant === "error" ? 6000 : 4000, position: "bottom-right" }
  );
}

const Toaster = dynamic(
  () => import("react-hot-toast").then((m) => m.Toaster),
  { ssr: false }
);

function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      containerClassName="!bottom-4 !right-4"
      toastOptions={{
        className: "!p-0 !m-0 !bg-transparent !shadow-none",
      }}
    />
  );
}

export { ToastProvider, showToast };
export type { ToastVariant };
