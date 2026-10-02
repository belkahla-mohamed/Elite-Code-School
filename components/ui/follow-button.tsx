"use client";

import { useEffect, useState } from "react";
import { Heart } from "@phosphor-icons/react/dist/csr/Heart";
import { apiFetch } from "@/lib/api-fetch";
import { showToast } from "./toast";
import { cn } from "@/lib/utils";

interface FollowButtonProps {
  targetId: string;
  className?: string;
}

export function FollowButton({ targetId, className }: FollowButtonProps) {
  const [following, setFollowing] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/parent/follows")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!active || !d) return;
        setFollowing(Array.isArray(d.followingIds) && d.followingIds.includes(targetId));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [targetId]);

  if (following === null) return null;

  async function toggle() {
    if (busy) return;
    setBusy(true);
    try {
      const res = await apiFetch("/api/parent/follows", {
        method: "POST",
        body: JSON.stringify({ targetId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur");
      setFollowing(data.following);
      showToast(
        data.following ? "Abonnement ajouté 🌟" : "Abonnement annulé",
        data.following ? "success" : "info"
      );
    } catch (e: any) {
      showToast(e.message ?? "Action impossible", "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-pressed={following}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-black uppercase tracking-wide transition duration-200 ease-out disabled:opacity-60",
        following
          ? "border-2 border-white/40 bg-white/15 text-white hover:bg-white/25"
          : "bg-white text-brand hover:bg-white/90",
        className
      )}
    >
      <Heart className={cn("size-4", following && "fill-current")} />
      {following ? "Se désabonner" : "S'abonner"}
    </button>
  );
}
