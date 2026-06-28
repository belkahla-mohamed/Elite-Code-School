"use client";

import { useState } from "react";
import { Settings, Key, Shield, Bell, Palette, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showToast } from "@/components/ui/toast";

export function SettingsContent() {
  const [adminPassword, setAdminPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!adminPassword.trim()) return;
    setChangingPassword(true);
    await new Promise((r) => setTimeout(r, 800));
    showToast("Mot de passe mis à jour (démo)", "success");
    setAdminPassword("");
    setChangingPassword(false);
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="font-display text-2xl font-black text-ink">Paramètres</h2>
        <p className="text-sm text-ink-soft">Configuration de l&apos;application</p>
      </div>

      <div className="dash-card">
        <div className="flex items-center gap-3 mb-5">
          <span className="flex size-10 items-center justify-center rounded-brand-sm bg-sky/10 text-sky">
            <Key className="size-5" />
          </span>
          <div>
            <h3 className="font-bold text-ink">Mot de passe Admin</h3>
            <p className="text-xs text-ink-soft">Modifier le mot de passe d&apos;accès au tableau de bord</p>
          </div>
        </div>
        <form onSubmit={handleChangePassword} className="flex flex-wrap gap-3">
          <input
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            type="password"
            placeholder="Nouveau mot de passe"
            className="min-w-[200px] flex-1 rounded-full border-2 border-border bg-body px-5 py-2.5 text-sm text-ink outline-none transition focus:border-sky"
            minLength={6}
          />
          <Button type="submit" isLoading={changingPassword}>
            <Save className="size-4" />
            {changingPassword ? "Mise à jour..." : "Enregistrer"}
          </Button>
        </form>
      </div>

      <div className="dash-card">
        <div className="flex items-center gap-3 mb-2">
          <span className="flex size-10 items-center justify-center rounded-brand-sm bg-amber/10 text-amber">
            <Shield className="size-5" />
          </span>
          <div>
            <h3 className="font-bold text-ink">Sécurité</h3>
            <p className="text-xs text-ink-soft">Paramètres de sécurité de la plateforme</p>
          </div>
        </div>
        <div className="mt-5 space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="size-4 accent-sky" />
            <span className="text-sm text-ink">Activer la validation des emails</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="size-4 accent-sky" />
            <span className="text-sm text-ink">Notifications par email</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="size-4 accent-sky" />
            <span className="text-sm text-ink">Portfolios publics par défaut</span>
          </label>
        </div>
      </div>

      <div className="dash-card">
        <div className="flex items-center gap-3 mb-2">
          <span className="flex size-10 items-center justify-center rounded-brand-sm bg-mint/10 text-mint">
            <Palette className="size-5" />
          </span>
          <div>
            <h3 className="font-bold text-ink">Apparence</h3>
            <p className="text-xs text-ink-soft">Personnalisation de l&apos;interface</p>
          </div>
        </div>
        <p className="mt-5 text-sm text-ink-soft">
          Utilisez le bouton de thème (lune/soleil) dans l&apos;en-tête pour basculer entre le mode clair et sombre.
        </p>
      </div>
    </div>
  );
}
