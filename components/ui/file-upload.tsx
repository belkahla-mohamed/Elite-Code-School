"use client";

import { useRef, useState } from "react";
import { SpinnerGap } from "@phosphor-icons/react/dist/csr/SpinnerGap";
import { UploadSimple } from "@phosphor-icons/react/dist/csr/UploadSimple";
import { Warning } from "@phosphor-icons/react/dist/csr/Warning";

type FileUploadProps = {
  folder: string;
  onUploaded: (url: string) => void;
  /** Called once with all URLs after every selected file finishes uploading. Enables multi-file selection. */
  onUploadedMultiple?: (urls: string[]) => void;
  children?: React.ReactNode;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  label?: string;
  /** Notified when the upload busy state changes (for custom children spinners). */
  onUploadingChange?: (uploading: boolean) => void;
};

async function uploadOne(file: File, folder: string): Promise<string> {
  const form = new FormData();
  form.set("file", file);
  form.set("folder", folder);
  const res = await fetch("/api/upload", { method: "POST", body: form });
  let json: { url?: string; error?: string };
  try {
    json = await res.json();
  } catch {
    throw new Error(`Erreur serveur (${res.status})`);
  }
  if (!res.ok || !json.url) {
    throw new Error(json.error ?? `Échec de l'upload (${res.status})`);
  }
  return json.url;
}

export function FileUpload({
  folder,
  onUploaded,
  onUploadedMultiple,
  children,
  accept = "image/*",
  multiple = false,
  disabled = false,
  className = "",
  label = "Ajouter une image",
  onUploadingChange,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (ref.current) ref.current.value = "";
    if (files.length === 0) return;
    if (multiple && files.length > 1 && !onUploadedMultiple) {
      setError("Un seul fichier à la fois");
      return;
    }

    setError("");
    setUploading(true);
    onUploadingChange?.(true);
    try {
      if (multiple && onUploadedMultiple) {
        const urls: string[] = [];
        for (const file of files) {
          urls.push(await uploadOne(file, folder));
        }
        onUploadedMultiple(urls);
      } else {
        onUploaded(await uploadOne(files[0], folder));
      }
    } catch (err: any) {
      setError(err?.message ?? "Échec de l'upload");
    } finally {
      setUploading(false);
      onUploadingChange?.(false);
    }
  }

  function handleClick() {
    if (disabled || uploading) return;
    ref.current?.click();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  }

  return (
    <span className={`inline-flex flex-col gap-1 ${className}`}>
      <span
        role="button"
        tabIndex={disabled || uploading ? -1 : 0}
        aria-label={label}
        aria-busy={uploading}
        aria-disabled={disabled || uploading}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`inline-flex cursor-pointer items-center gap-2 rounded-brand-sm text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky disabled:cursor-not-allowed disabled:opacity-50 ${
          children
            ? ""
            : "bg-sky px-4 py-2 text-white hover:bg-sky/90"
        } ${disabled || uploading ? "pointer-events-none opacity-50" : ""}`}
      >
        <input ref={ref} type="file" accept={accept} multiple={multiple} className="sr-only" onChange={handleChange} tabIndex={-1} aria-hidden="true" />
        {children ?? (
          <>
            {uploading ? <SpinnerGap className="size-4 animate-spin" /> : <UploadSimple className="size-4" />}
            {uploading ? "Envoi..." : label}
          </>
        )}
      </span>
      {error && (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-coral" role="alert">
          <Warning className="size-3.5 shrink-0" /> {error}
        </span>
      )}
    </span>
  );
}
