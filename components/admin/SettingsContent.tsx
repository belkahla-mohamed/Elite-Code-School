"use client";

import { useState, useEffect } from "react";
import { Settings, Key, Shield, Bell, Palette, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showToast } from "@/components/ui/toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

function useLocalStorageState(key: string, defaultValue: boolean) {
  const [value, setValue] = useState(() => {
    if (typeof window === "undefined") return defaultValue;
    const stored = localStorage.getItem(key);
    return stored !== null ? stored === "true" : defaultValue;
  });
  useEffect(() => { localStorage.setItem(key, String(value)); }, [key, value]);
  return [value, setValue] as const;
}

export function SettingsContent() {
  const [adminPassword, setAdminPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [emailValidation, setEmailValidation] = useLocalStorageState("ecs_setting_email_validation", true);
  const [emailNotifications, setEmailNotifications] = useLocalStorageState("ecs_setting_email_notifications", true);
  const [publicByDefault, setPublicByDefault] = useLocalStorageState("ecs_setting_public_default", true);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!currentPassword.trim() || !adminPassword.trim()) return;
    if (adminPassword.length < 6) {
      showToast("Le mot de passe doit contenir au moins 6 caractères", "error");
      return;
    }
    setChangingPassword(true);

    try {
      const res = await fetch("/api/auth/admin/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: currentPassword, newPassword: adminPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error ?? "Erreur", "error");
        return;
      }
      showToast("Mot de passe mis à jour", "success");
      setAdminPassword("");
      setCurrentPassword("");
    } catch {
      showToast("Erreur de connexion", "error");
    } finally {
      setChangingPassword(false);
    }
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
        <form onSubmit={handleChangePassword} className="flex flex-col gap-3">
          <input
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            type="password"
            placeholder="Mot de passe actuel"
            className="w-full rounded-full border-2 border-border bg-body px-5 py-2.5 text-sm text-ink outline-none transition focus:border-sky"
            required
          />
          <input
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            type="password"
            placeholder="Nouveau mot de passe (min 6 car.)"
            className="w-full rounded-full border-2 border-border bg-body px-5 py-2.5 text-sm text-ink outline-none transition focus:border-sky"
            minLength={6}
            required
          />
          <Button type="submit" isLoading={changingPassword} className="self-start">
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
          <div className="flex items-center gap-3">
            <Switch id="email-validation" checked={emailValidation} onCheckedChange={setEmailValidation} />
            <Label htmlFor="email-validation" className="text-sm text-ink cursor-pointer">Activer la validation des emails</Label>
          </div>
          <div className="flex items-center gap-3">
            <Switch id="email-notifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
            <Label htmlFor="email-notifications" className="text-sm text-ink cursor-pointer">Notifications par email</Label>
          </div>
          <div className="flex items-center gap-3">
            <Switch id="public-default" checked={publicByDefault} onCheckedChange={setPublicByDefault} />
            <Label htmlFor="public-default" className="text-sm text-ink cursor-pointer">Portfolios publics par défaut</Label>
          </div>
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
