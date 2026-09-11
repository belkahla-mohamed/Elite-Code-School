"use client";

import { useState, useRef } from "react";
import { SpinnerGap, UploadSimple } from "@phosphor-icons/react";

type FileUploadProps = {
  folder: string;
  onUploaded: (url: string) => void;
  children?: React.ReactNode;
  accept?: string;
};

export function FileUpload({ folder, onUploaded, children, accept = "image/*" }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.set("file", file);
      form.set("folder", folder);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const json = await res.json();
      if (json.url) onUploaded(json.url);
    } finally {
      setUploading(false);
      if (ref.current) ref.current.value = "";
    }
  }

  return (
    <label className="cursor-pointer">
      <input ref={ref} type="file" accept={accept} className="sr-only" onChange={handleFile} />
      {children || (
        <span className="inline-flex items-center gap-2 rounded-brand-sm bg-sky px-4 py-2 text-sm font-bold text-white hover:bg-sky/90 transition">
          {uploading ? <SpinnerGap className="size-4 animate-spin" /> : <UploadSimple className="size-4" />}
          {uploading ? "UploadSimple..." : "UploadSimple"}
        </span>
      )}
    </label>
  );
}
