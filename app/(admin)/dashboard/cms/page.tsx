"use client";

import { useState, useEffect } from "react";
import { showToast } from "@/components/ui/toast";
import { FloppyDisk, Globe, FileText, Image as ImageIcon } from "@phosphor-icons/react";
import type { ContentBlock } from "@/lib/types";

export default function CmsPage() {
  const [blocks, setBlocks] = useState<Record<string, string>>({
    "home_title": "Apprends à coder. Crée ton avenir.",
    "home_subtitle": "La 1ère école de code pour enfants et ados au Maroc.",
    "home_description": "Des programmes interactifs pour développer la logique, la créativité et les compétences techniques dès 7 ans.",
    "about_text": "Elite Code School est née d'une conviction : la programmation est une compétence fondamentale du 21e siècle.",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/cms")
      .then((r) => r.json())
      .then((data) => {
        if (data.blocks && data.blocks.length > 0) {
          const map: Record<string, string> = { ...blocks };
          data.blocks.forEach((b: ContentBlock) => { map[b.key] = b.value; });
          setBlocks(map);
        }
        setLoading(false);
      })
      .catch(() => {
        showToast("Erreur lors du chargement des contenus", "error");
        setLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (key: string, value: string) => {
    setBlocks(prev => ({ ...prev, [key]: value }));
  };

  const saveChanges = async () => {
    setSaving(true);
    try {
      const payload = Object.entries(blocks).map(([key, value]) => ({ key, value }));
      const res = await fetch("/api/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blocks: payload }),
      });
      if (res.ok) {
        showToast("Contenus mis à jour", "success");
      } else {
        const data = await res.json();
        showToast(data.error || "Erreur lors de la sauvegarde", "error");
      }
    } catch (e) {
      showToast("Erreur serveur", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl font-black text-ink">Site Public (CMS)</h1>
          <p className="text-sm text-ink-soft mt-1">Gérez le contenu textuel et les images du site</p>
        </div>
        <button onClick={saveChanges} disabled={saving || loading} className="btn-primary py-2">
          <FloppyDisk className="mr-2 inline size-4" /> {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-6 rounded-brand border-2 border-border bg-white p-6 opacity-60">
          <div className="h-6 w-1/4 rounded bg-surface" />
          <div className="h-10 w-full rounded bg-surface" />
          <div className="h-20 w-full rounded bg-surface" />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="rounded-brand border-2 border-border bg-white dark:bg-surface p-6 shadow-sm">
              <h2 className="font-display text-lg font-bold text-ink mb-4 flex items-center gap-2">
                <Globe className="size-5 text-sky" /> Accueil
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-ink">Titre principal</label>
                  <input
                    value={blocks.home_title}
                    onChange={(e) => handleChange("home_title", e.target.value)}
                    className="w-full rounded-brand-sm border-2 border-border bg-body px-3 py-2 text-sm text-ink focus:border-sky focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-ink">Sous-titre</label>
                  <input
                    value={blocks.home_subtitle}
                    onChange={(e) => handleChange("home_subtitle", e.target.value)}
                    className="w-full rounded-brand-sm border-2 border-border bg-body px-3 py-2 text-sm text-ink focus:border-sky focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-ink">Description</label>
                  <textarea
                    value={blocks.home_description}
                    onChange={(e) => handleChange("home_description", e.target.value)}
                    rows={3}
                    className="w-full rounded-brand-sm border-2 border-border bg-body px-3 py-2 text-sm text-ink focus:border-sky focus:outline-none resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-brand border-2 border-border bg-white dark:bg-surface p-6 shadow-sm">
              <h2 className="font-display text-lg font-bold text-ink mb-4 flex items-center gap-2">
                <FileText className="size-5 text-violet" /> À propos
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-ink">Texte présentation</label>
                  <textarea
                    value={blocks.about_text}
                    onChange={(e) => handleChange("about_text", e.target.value)}
                    rows={4}
                    className="w-full rounded-brand-sm border-2 border-border bg-body px-3 py-2 text-sm text-ink focus:border-sky focus:outline-none resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-brand border-2 border-border bg-white dark:bg-surface p-6 shadow-sm opacity-50 cursor-not-allowed">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-ink flex items-center gap-2">
                  <ImageIcon className="size-5 text-lime" /> Médias
                </h2>
                <span className="rounded-full bg-surface px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink-soft">Bientôt</span>
              </div>
              <p className="text-sm text-ink-soft mb-4">La gestion des images du site (bannières, logos) sera disponible dans une prochaine mise à jour.</p>
              <div className="h-32 rounded-brand-sm border-2 border-dashed border-border flex items-center justify-center bg-body/50">
                <span className="text-sm font-bold text-ink-soft flex items-center gap-2">
                  <ImageIcon className="size-4" /> Zone d&apos;upload à venir
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
