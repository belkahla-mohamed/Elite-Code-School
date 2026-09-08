"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Check, Facebook, Link2, Linkedin, MessageCircle, Share2, Twitter, X } from "lucide-react";
import { showToast } from "./toast";

interface ShareMenuProps {
  title: string;
  text?: string;
  url?: string;
  label?: ReactNode;
  triggerClassName?: string;
}

export function ShareMenu({ title, text, url, label, triggerClassName }: ShareMenuProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);

  const pageUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const shareText = text ?? title;
  const encodedUrl = encodeURIComponent(pageUrl);
  const encodedText = encodeURIComponent(shareText);
  const canNativeShare = typeof navigator !== "undefined" && "share" in navigator;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    // Keep the panel glued to the trigger (smooth scroll / resize move the
    // button after the click — a one-shot rect goes stale, a rAF loop doesn't).
    let raf = requestAnimationFrame(function tick() {
      computePos();
      raf = requestAnimationFrame(tick);
    });
    return () => {
      document.removeEventListener("keydown", onKey);
      cancelAnimationFrame(raf);
    };
  }, [open]);

  function computePos() {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const panelWidth = 248;
    const panelHeight = 224;
    const headerBottom = document.querySelector("header")?.getBoundingClientRect().bottom ?? 0;
    const minTop = headerBottom + 8;
    let top = rect.bottom + 8;
    if (top + panelHeight > window.innerHeight - 8) {
      top = rect.top - panelHeight - 8;
    }
    top = Math.max(minTop, top);
    const left = Math.max(8, Math.min(rect.right - panelWidth, window.innerWidth - panelWidth - 8));
    setPos((prev) => (prev.top === top && prev.left === left ? prev : { top, left }));
  }

  function openMenu() {
    computePos();
    setOpen(true);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(pageUrl);
    } catch {
      const area = document.createElement("textarea");
      area.value = pageUrl;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      document.body.removeChild(area);
    }
    showToast("Lien copié dans le presse-papier !", "success");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  async function nativeShare() {
    try {
      await navigator.share({ title, text: shareText, url: pageUrl });
      setOpen(false);
    } catch {
      /* dismissed */
    }
  }

  const socials = [
    {
      key: "whatsapp",
      label: "WhatsApp",
      icon: MessageCircle,
      circle: "bg-[#25D366]/10 text-[#25D366]",
      href: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    },
    {
      key: "facebook",
      label: "Facebook",
      icon: Facebook,
      circle: "bg-[#1877F2]/10 text-[#1877F2]",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      key: "x",
      label: "X",
      icon: Twitter,
      circle: "bg-ink/5 text-ink dark:bg-white/10 dark:text-white",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      icon: Linkedin,
      circle: "bg-[#0A66C2]/10 text-[#0A66C2]",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
  ];

  return (
    <div className="relative inline-block">
      <button
        ref={triggerRef}
        type="button"
        onClick={openMenu}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={triggerClassName}
      >
        {label ?? (<><Share2 className="size-4" /> Partager</>)}
      </button>

      {open &&
        createPortal(
          <>
            <div aria-hidden className="fixed inset-0 z-50 cursor-default" onClick={() => setOpen(false)} />

          <div
            role="dialog"
            aria-label={`Partager : ${title}`}
            style={{ top: pos.top, left: pos.left, width: 248 }}
            className="animate-scale-in fixed z-50 rounded-brand border border-border bg-white p-3 shadow-xl dark:border-white/10 dark:bg-[#1e293b]"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-semibold text-ink dark:text-white">Partager</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fermer"
                className="flex size-6 items-center justify-center rounded-full text-ink-soft transition duration-200 ease-out hover:bg-surface hover:text-ink dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
              >
                <X className="size-3.5" />
              </button>
            </div>

            <div className="mt-2 grid grid-cols-4 gap-y-1">
              {socials.map((social) => (
                <a
                  key={social.key}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex flex-col items-center gap-1 rounded-brand-sm p-1.5 transition duration-200 ease-out hover:bg-surface dark:hover:bg-white/5"
                >
                  <span className={`flex size-9 items-center justify-center rounded-full ${social.circle}`}>
                    <social.icon className="size-4" />
                  </span>
                  <span className="text-[9px] font-bold text-ink-soft dark:text-slate-400">{social.label}</span>
                </a>
              ))}

              <button
                type="button"
                onClick={copyLink}
                className="flex flex-col items-center gap-1 rounded-brand-sm p-1.5 transition duration-200 ease-out hover:bg-surface dark:hover:bg-white/5"
              >
                <span className={`flex size-9 items-center justify-center rounded-full transition duration-200 ${copied ? "bg-lime/15 text-lime" : "bg-brand/10 text-brand"}`}>
                  {copied ? <Check className="size-4" /> : <Link2 className="size-4" />}
                </span>
                <span className="text-[9px] font-bold text-ink-soft dark:text-slate-400">{copied ? "Copié !" : "Copier"}</span>
              </button>

              {canNativeShare && (
                <button
                  type="button"
                  onClick={nativeShare}
                  className="flex flex-col items-center gap-1 rounded-brand-sm p-1.5 transition duration-200 ease-out hover:bg-surface dark:hover:bg-white/5"
                >
                  <span className="flex size-9 items-center justify-center rounded-full bg-amber/15 text-amber">
                    <Share2 className="size-4" />
                  </span>
                  <span className="text-[9px] font-bold text-ink-soft dark:text-slate-400">Plus</span>
                </button>
              )}
            </div>

            <div className="mt-2 flex items-center gap-1.5 rounded-full bg-surface px-2.5 py-1.5 dark:bg-white/5">
              <Link2 className="size-3 shrink-0 text-ink-soft dark:text-slate-400" />
              <span className="min-w-0 flex-1 truncate text-[10px] font-semibold text-ink-soft dark:text-slate-400">{pageUrl}</span>
              <button
                type="button"
                onClick={copyLink}
                className="flex shrink-0 items-center gap-1 rounded-full bg-brand px-2.5 py-1 text-[10px] font-bold text-white transition duration-200 ease-out hover:bg-brand-dark"
              >
                {copied ? <Check className="size-2.5" /> : null}
                {copied ? "Copié !" : "Copier"}
              </button>
            </div>
          </div>
          </>,
          document.body
        )}
    </div>
  );
}
