"use client";

import { useEffect, useRef, useState } from "react";
import { Eye } from "@phosphor-icons/react";

let cachedViews: Record<string, number> | null = null;
let inflight: Promise<Record<string, number>> | null = null;

async function loadViews(): Promise<Record<string, number>> {
  try {
    const r = await fetch("/api/blog/views");
    const d = r.ok ? await r.json() : null;
    cachedViews = (d?.views as Record<string, number> | undefined) ?? {};
  } catch {
    cachedViews = {};
  } finally {
    inflight = null;
  }
  return cachedViews;
}

function fetchAllViews(): Promise<Record<string, number>> {
  if (cachedViews) return Promise.resolve(cachedViews);
  if (!inflight) {
    inflight = loadViews();
  }
  return inflight;
}

interface ViewCounterProps {
  slug: string;
  increment?: boolean;
  className?: string;
}

export function ViewCounter({ slug, increment = false, className }: ViewCounterProps) {
  const [views, setViews] = useState<number | null>(null);
  const incremented = useRef(false);
  const currentSlug = useRef(slug);
  currentSlug.current = slug;

  useEffect(() => {
    const slugAtStart = slug;

    if (increment) {
      if (incremented.current) return;
      incremented.current = true;
      fetch("/api/blog/views", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: slugAtStart }),
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (d && typeof d.views === "number" && currentSlug.current === slugAtStart) {
            cachedViews = { ...(cachedViews ?? {}), [slugAtStart]: d.views };
            setViews(d.views);
          }
        })
        .catch(() => {});
    } else {
      fetchAllViews().then((counts) => {
        if (currentSlug.current === slugAtStart) setViews(counts[slugAtStart] ?? 0);
      });
    }
  }, [slug, increment]);

  if (views === null) return null;

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-bold text-ink-soft ${className ?? ""}`}
      suppressHydrationWarning
    >
      <Eye className="size-3.5" /> {views} vues
    </span>
  );
}
