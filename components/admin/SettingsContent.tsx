"use client";

import { useState, useEffect } from "react";
import { Settings, Shield, Bell, Eye, FileText, Save, Mail, Clock, Key, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showToast } from "@/components/ui/toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type AppSettings = {
  autoAcceptInscriptions: boolean
  emailValidation: boolean
  publicPortfoliosDefault: boolean
  maintenanceMode: boolean
  emailNotifications: boolean
  sessionDurationHours: number
  minPasswordLength: number
  contactEmail: string
}

const defaultSettings: AppSettings = {
  autoAcceptInscriptions: false,
  emailValidation: true,
  publicPortfoliosDefault: true,
  maintenanceMode: false,
  emailNotifications: true,
  sessionDurationHours: 8,
  minPasswordLength: 6,
  contactEmail: "contact@elitecode.ma",
}

export function SettingsContent() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings)
      })
      .catch(() => showToast("Erreur de chargement", "error"))
      .finally(() => setLoading(false))
  }, [])

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })
      const data = await res.json()
      if (!res.ok) {
        showToast(data.error ?? "Erreur", "error")
        return
      }
      showToast("Paramètres enregistrés", "success")
    } catch {
      showToast("Erreur de connexion", "error")
    } finally {
      setSaving(false)
    }
  }

  function update<K extends keyof AppSettings>(key: K, value: AppSettings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-8 animate-spin rounded-full border-4 border-sky border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-black text-ink">Paramètres</h2>
          <p className="text-sm text-ink-soft">Configuration générale de l&apos;application</p>
        </div>
        <Button onClick={handleSave} isLoading={saving}>
          <Save className="size-4" />
          {saving ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="dash-card">
          <div className="flex items-center gap-3 mb-2">
            <span className="flex size-10 items-center justify-center rounded-brand-sm bg-sky/10 text-sky">
              <FileText className="size-5" />
            </span>
            <div>
              <h3 className="font-bold text-ink">Inscriptions</h3>
              <p className="text-xs text-ink-soft">Gestion des demandes d&apos;inscription</p>
            </div>
          </div>
          <div className="mt-5 space-y-4">
            <div className="flex items-center gap-3">
              <Switch id="auto-accept" checked={settings.autoAcceptInscriptions} onCheckedChange={(v) => update("autoAcceptInscriptions", v)} />
              <Label htmlFor="auto-accept" className="text-sm text-ink cursor-pointer">Accepter automatiquement les inscriptions</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch id="email-validation" checked={settings.emailValidation} onCheckedChange={(v) => update("emailValidation", v)} />
              <Label htmlFor="email-validation" className="text-sm text-ink cursor-pointer">Validation des emails requise</Label>
            </div>
          </div>
        </div>

        <div className="dash-card">
          <div className="flex items-center gap-3 mb-2">
            <span className="flex size-10 items-center justify-center rounded-brand-sm bg-amber/10 text-amber">
              <Eye className="size-5" />
            </span>
            <div>
              <h3 className="font-bold text-ink">Visibilité</h3>
              <p className="text-xs text-ink-soft">Contrôle de l&apos;affichage public</p>
            </div>
          </div>
          <div className="mt-5 space-y-4">
            <div className="flex items-center gap-3">
              <Switch id="public-default" checked={settings.publicPortfoliosDefault} onCheckedChange={(v) => update("publicPortfoliosDefault", v)} />
              <Label htmlFor="public-default" className="text-sm text-ink cursor-pointer">Portfolios publics par défaut</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="maintenance"
                checked={settings.maintenanceMode}
                onCheckedChange={(v) => update("maintenanceMode", v)}
              />
              <Label htmlFor="maintenance" className="flex items-center gap-2 text-sm text-ink cursor-pointer">
                {settings.maintenanceMode && <AlertTriangle className="size-4 text-coral" />}
                Mode maintenance
              </Label>
            </div>
          </div>
        </div>

        <div className="dash-card">
          <div className="flex items-center gap-3 mb-2">
            <span className="flex size-10 items-center justify-center rounded-brand-sm bg-mint/10 text-mint">
              <Bell className="size-5" />
            </span>
            <div>
              <h3 className="font-bold text-ink">Notifications</h3>
              <p className="text-xs text-ink-soft">Configuration des notifications</p>
            </div>
          </div>
          <div className="mt-5 space-y-4">
            <div className="flex items-center gap-3">
              <Switch id="email-notifs" checked={settings.emailNotifications} onCheckedChange={(v) => update("emailNotifications", v)} />
              <Label htmlFor="email-notifs" className="text-sm text-ink cursor-pointer">Notifications par email</Label>
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-ink-soft uppercase tracking-wider">
                <Mail className="mr-1 inline size-3" /> Email de contact
              </label>
              <input
                value={settings.contactEmail}
                onChange={(e) => update("contactEmail", e.target.value)}
                type="email"
                className="w-full rounded-full border-2 border-border bg-body px-5 py-2.5 text-sm text-ink outline-none transition focus:border-sky"
              />
            </div>
          </div>
        </div>

        <div className="dash-card">
          <div className="flex items-center gap-3 mb-2">
            <span className="flex size-10 items-center justify-center rounded-brand-sm bg-purple/10 text-purple">
              <Shield className="size-5" />
            </span>
            <div>
              <h3 className="font-bold text-ink">Sécurité</h3>
              <p className="text-xs text-ink-soft">Paramètres de sécurité de la plateforme</p>
            </div>
          </div>
          <div className="mt-5 space-y-4">
            <div>
              <label className="mb-1 block text-xs font-bold text-ink-soft uppercase tracking-wider">
                <Clock className="mr-1 inline size-3" /> Durée de session (heures)
              </label>
              <input
                value={settings.sessionDurationHours}
                onChange={(e) => update("sessionDurationHours", Math.max(1, parseInt(e.target.value) || 1))}
                type="number"
                min={1}
                max={168}
                className="w-32 rounded-full border-2 border-border bg-body px-5 py-2.5 text-sm text-ink outline-none transition focus:border-sky"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-ink-soft uppercase tracking-wider">
                <Key className="mr-1 inline size-3" /> Longueur minimale du mot de passe
              </label>
              <input
                value={settings.minPasswordLength}
                onChange={(e) => update("minPasswordLength", Math.max(4, parseInt(e.target.value) || 4))}
                type="number"
                min={4}
                max={128}
                className="w-32 rounded-full border-2 border-border bg-body px-5 py-2.5 text-sm text-ink outline-none transition focus:border-sky"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
