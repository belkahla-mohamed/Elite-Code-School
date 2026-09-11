"use client";

import { useCallback, useEffect, useState } from "react";
import { useParentStudent } from "@/hooks/useParentStudent";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { showToast } from "@/components/ui/toast";
import { apiFetch } from "@/lib/api-fetch";
import { cn } from "@/lib/utils";
import type { CommunityFeedItem, StudentPortfolio } from "@/lib/types";
import { User, Users, Globe, LockKey, Sparkle, Link as LinkIcon, ShareNetwork, Star, Megaphone, Bell, MagnifyingGlass, Lightbulb, Lightning, Briefcase, CheckCircle, Wrench, FolderOpen } from "@phosphor-icons/react/dist/ssr";
import { Check, Copy, Heart } from "@phosphor-icons/react";
import Link from "next/link";

const avatarColors = ["bg-sky", "bg-pink", "bg-amber", "bg-violet", "bg-lime", "bg-mint"];

export default function ParentCommunityPage() {
  const { student, loading, error } = useParentStudent();
  const [feed, setFeed] = useState<CommunityFeedItem[]>([]);
  const [catalog, setCatalog] = useState<StudentPortfolio[]>([]);
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());
  const [pageLoading, setPageLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [processingId, setProcessingId] = useState("");

  const loadData = useCallback(async () => {
    setPageLoading(true);
    try {
      const [feedRes, folRes, catRes] = await Promise.all([
        fetch("/api/parent/feed"),
        fetch("/api/parent/follows"),
        fetch("/api/public/portfolios"),
      ]);
      if (!feedRes.ok || !folRes.ok || !catRes.ok) {
        showToast("Erreur de chargement de la communauté", "error");
        return;
      }
      const feedData = await feedRes.json();
      const folData = await folRes.json();
      const catData = await catRes.json();
      setFeed(feedData.feed ?? []);
      setFollowingIds(new Set(folData.followingIds ?? []));
      setCatalog(Array.isArray(catData) ? catData : catData.portfolios ?? []);
    } catch {
      showToast("Erreur de chargement de la communauté", "error");
    } finally {
      setPageLoading(false);
    }
  }, []);

  useEffect(() => {
    if (student) loadData();
  }, [student, loadData]);

  async function toggleFollow(targetId: string) {
    setProcessingId(targetId);
    try {
      const res = await apiFetch("/api/parent/follows", {
        method: "POST",
        body: JSON.stringify({ targetId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur");
      setFollowingIds((prev) => {
        const next = new Set(prev);
        if (data.following) next.add(targetId);
        else next.delete(targetId);
        return next;
      });
      showToast(data.following ? "Abonnement ajouté 🌟" : "Abonnement annulé", data.following ? "success" : "info");
      await loadData();
    } catch (e: any) {
      showToast(e.message ?? "Action impossible", "error");
    } finally {
      setProcessingId("");
    }
  }

  function copyProfileLink() {
    if (!student) return;
    const url = `${window.location.origin}/portfolios/${student.slug}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      showToast("Lien du portfolio copié 🎉", "success");
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function shareWhatsApp() {
    if (!student) return;
    const url = `${window.location.origin}/portfolios/${student.slug}`;
    const text = `🚀 Découvre les créations technologiques de ${student.firstName} ${student.lastName} !\nElite Code School\n🔗 ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }

  if (loading) {
    return (
      <div>
        <Skeleton className="mb-6 h-4 w-40" />
        <Skeleton className="mb-6 h-24 w-full rounded-brand" />
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full rounded-brand" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Breadcrumb items={[{ label: "Espace parent", href: "/parent" }, { label: "Communauté" }]} />
        <div className="mx-auto max-w-md rounded-brand border-2 border-border bg-white dark:bg-surface p-8 text-center">
          <User className="mx-auto size-12 text-ink-soft/40" />
          <h2 className="mt-4 font-display text-xl font-bold text-ink">{error}</h2>
          <Link href="/login" className="btn-primary mt-6 inline-flex">Se connecter</Link>
        </div>
      </div>
    );
  }

  if (!student) return null;

  const profileUrl = `${window.location.origin}/portfolios/${student.slug}`;

  return (
    <div>
      <Breadcrumb items={[
        { label: "Espace parent", href: "/parent" },
        { label: `${student.firstName} ${student.lastName}`, href: "/parent" },
        { label: "Communauté" }
      ]} />

      {/* Hero playful */}
      <div className="mb-6 overflow-hidden rounded-brand bg-brand p-6 text-white md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="grid size-14 place-items-center rounded-2xl bg-white/20 text-3xl">
              <Star className="size-8" weight="fill" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-black tracking-tight">La Communauté</h1>
              <p className="text-sm text-white/85">
                Abonne-toi aux créateurs, suis leurs nouveaux projets et partage tes exploits !
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-2 text-xs font-black uppercase tracking-wider">
            <Users className="size-4" /> {catalog.length + 1} créateurs
          </span>
        </div>
      </div>

      <div className="mb-8 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Feed of followed creators */}
        <div className="rounded-brand border-2 border-border bg-white dark:bg-surface p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-sky/10 text-sky">
              <Bell className="size-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-black text-ink">Mes abonnements</h2>
              <p className="text-xs font-semibold text-ink-soft">
                Les nouvelles créations des créateurs suivis
              </p>
            </div>
          </div>

          {pageLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full rounded-brand-sm" />
              ))}
            </div>
          ) : feed.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-surface px-6 py-12 text-center">
              <div className="text-ink/20"><Users className="size-16" weight="duotone" /></div>
              <p className="mt-3 font-display text-lg font-bold text-ink">
                Tu n&apos;es abonné à personne
              </p>
              <p className="mt-1 max-w-sm text-sm text-ink-soft">
                Explore les portfolios ci-dessous et abonne-toi pour recevoir une notification à chaque nouveau projet !
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {feed.map(({ student: followed, projects }) => (
                <div key={followed.id} className="rounded-2xl border-2 border-border bg-surface p-4">
                  <div className="mb-3 flex items-center gap-3">
                    <div
                      className="flex size-10 items-center justify-center rounded-xl bg-brand font-display text-sm font-black text-white"
                    >
                      {followed.avatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link href={`/portfolios/${followed.slug}`} className="font-display text-sm font-black text-ink hover:text-sky transition">
                        {followed.firstName} {followed.lastName}
                      </Link>
                      <p className="truncate text-xs text-ink-soft">{followed.levelLabel}</p>
                    </div>
                    <span className="flex items-center gap-1 rounded-full bg-lime/15 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-lime">
                      <Star className="size-3" weight="fill" /> Suivi
                    </span>
                  </div>
                  {projects.length === 0 ? (
                    <p className="px-1 py-2 text-xs text-ink-soft">
                      Aucun projet publié pour le moment.
                    </p>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {projects.map((project) => (
                        <div
                          key={project.id}
                          className="overflow-hidden rounded-2xl border-2 border-border bg-white transition hover:border-sky"
                        >
                          <div
                            className="relative flex h-20 items-center justify-center text-3xl bg-surface"
                          >
                            <FolderOpen className="size-8 text-ink/20" />
                            <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-ink">
                              {project.status === "completed" ? (
                                <><CheckCircle className="size-3 text-lime" weight="fill" /> Fini !</>
                              ) : (
                                <><Wrench className="size-3 text-amber" weight="fill" /> En cours</>
                              )}
                            </span>
                          </div>
                          <div className="p-3">
                            <p className="truncate font-display text-sm font-black text-ink">{project.title}</p>
                            {project.tags.length > 0 && (
                              <div className="mt-1.5 flex flex-wrap gap-1">
                                {project.tags.slice(0, 3).map((tag) => (
                                  <span key={tag} className="rounded-full border border-ink/10 bg-surface px-2 py-0.5 font-mono text-[10px] text-ink-soft">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Share your profile */}
        <div className="h-fit overflow-hidden rounded-brand border-2 border-border bg-white p-6 dark:bg-surface">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-amber/15 text-amber">
              <Megaphone className="size-6" weight="fill" />
            </div>
            <div>
              <h2 className="font-display text-lg font-black text-ink">Partage mon profil</h2>
              <p className="text-xs font-semibold text-ink-soft">
                Ta famille et tes amis peuvent suivre tes exploits en direct !
              </p>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border-2 border-white bg-white p-4">
            <div className="flex items-center gap-3">
              <div
                className="flex size-12 items-center justify-center rounded-xl bg-brand font-display text-base font-black text-white"
              >
                {student.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-sm font-black text-ink">
                  {student.firstName} {student.lastName}
                </p>
                <p className="truncate text-xs text-ink-soft">{profileUrl}</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={copyProfileLink}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-sky px-4 py-2.5 text-xs font-black uppercase tracking-wide text-white transition hover:bg-sky-dark"
              >
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                {copied ? "Copié !" : "Copier le lien"}
              </button>
              <button
                onClick={shareWhatsApp}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-lime px-4 py-2.5 text-xs font-black uppercase tracking-wide text-white transition hover:opacity-90"
              >
                <ShareNetwork className="size-4" /> WhatsApp
              </button>
            </div>
            {!student.isPublic && (
              <Link
                href="/parent/privacy"
                className="mt-3 flex items-center gap-1.5 text-xs font-bold text-amber hover:text-amber/80"
              >
                🔒 Ton portfolio est privé — rends-le public pour le partager
              </Link>
            )}
          </div>
          <div className="mt-4 rounded-2xl border-2 border-white/60 bg-white/50 p-3 text-xs font-semibold text-ink-soft dark:bg-transparent">
            <Lightbulb className="mr-1.5 inline size-4 text-amber" weight="fill" />
            Astuce : plus tu publies de projets, plus tes abonnés reçoivent des notifications !
          </div>
        </div>
      </div>

      {/* Explore creators */}
      <div className="rounded-brand border-2 border-border bg-white dark:bg-surface p-6 md:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-violet/10 text-violet">
            <Sparkle className="size-5" />
          </div>
          <div>
            <h2 className="font-display text-lg font-black text-ink">Explorer les créateurs</h2>
            <p className="text-xs font-semibold text-ink-soft">
              Abonne-toi aux portfolios des autres élèves pour t&apos;inspirer
            </p>
          </div>
        </div>

        {pageLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-2xl" />
            ))}
          </div>
        ) : catalog.filter((p) => p.id !== student.id).length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-surface px-6 py-12 text-center">
            <div className="text-ink/20"><MagnifyingGlass className="size-16" weight="duotone" /></div>
            <p className="mt-3 font-display text-lg font-bold text-ink">Aucun portfolio public</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {catalog
              .filter((p) => p.id !== student.id)
              .map((portfolio, index) => {
                const isFollowing = followingIds.has(portfolio.id);
                return (
                  <div
                    key={portfolio.id}
                    className="group flex flex-col rounded-2xl border-2 border-border bg-surface p-4 transition hover:border-sky"
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <div
                        className={`flex size-12 items-center justify-center rounded-xl font-display text-base font-black text-white ${avatarColors[index % avatarColors.length]}`}
                      >
                        {portfolio.avatar}
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/portfolios/${portfolio.slug}`}
                          className="block truncate font-display text-sm font-black text-ink hover:text-sky transition"
                        >
                          {portfolio.firstName} {portfolio.lastName}
                        </Link>
                        <p className="truncate text-xs text-ink-soft">{portfolio.levelLabel}</p>
                      </div>
                    </div>
                    <div className="mb-4 flex flex-wrap gap-2 text-[11px] font-bold">
                      <span className="rounded-full bg-sky/10 px-2.5 py-1 text-sky">{portfolio.age} ans</span>
                      <span className="flex items-center gap-1 rounded-full bg-lime/15 px-2.5 py-1 text-lime"><Lightning className="size-3" weight="fill" /> {portfolio.hours}h</span>
                      <span className="flex items-center gap-1 rounded-full bg-amber/15 px-2.5 py-1 text-amber"><Briefcase className="size-3" weight="fill" /> {portfolio.projects.length} projets</span>
                    </div>
                    <div className="mt-auto flex gap-2">
                      <Link
                        href={`/portfolios/${portfolio.slug}`}
                        className="flex-1 rounded-full border-2 border-sky px-3 py-2 text-center text-xs font-black uppercase tracking-wide text-sky transition hover:bg-sky hover:text-white"
                      >
                        Voir
                      </Link>
                      <button
                        onClick={() => toggleFollow(portfolio.id)}
                        disabled={processingId === portfolio.id}
                        className={cn(
                          "flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-black uppercase tracking-wide transition",
                          isFollowing
                            ? "bg-lime text-white hover:opacity-85"
                            : "bg-amber text-white hover:bg-amber/85"
                        )}
                      >
                        <Heart className={cn("size-3.5", isFollowing && "fill-white")} />
                        {isFollowing ? "Suivi" : "Suivre"}
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}