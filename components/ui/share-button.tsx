"use client";

import { Share2 } from "lucide-react";
import { showToast } from "./toast";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  shareLink: string;
  title?: string;
  className?: string;
}

function ShareButton({ shareLink, title = "Partager", className }: ShareButtonProps) {
  async function handleShare() {
    try {
      await navigator.clipboard.writeText(shareLink);
      showToast("Lien copié dans le presse-papier !", "success");
    } catch {
      showToast("Impossible de copier le lien", "error");
    }
  }

  return (
    <button
      onClick={handleShare}
      className={cn(
        "inline-flex items-center gap-2 font-black uppercase tracking-wide text-sm",
        "rounded-full border-2 border-[#E8EEF6] bg-white px-4 py-2",
        "text-ink-soft hover:text-sky hover:border-sky transition duration-200",
        className
      )}
      aria-label={title}
    >
      <Share2 className="size-4" />
      {title}
    </button>
  );
}

export { ShareButton, type ShareButtonProps };
