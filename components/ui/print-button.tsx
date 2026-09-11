"use client";

import { DownloadSimple } from "@phosphor-icons/react";

export function PrintButton() {
  return (
    <button className="btn-primary" onClick={() => window.print()} type="button">
      <DownloadSimple className="mr-2 size-4" /> Imprimer / PDF
    </button>
  );
}
