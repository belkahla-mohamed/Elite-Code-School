"use client";

import { useState, useEffect } from "react";
import { User, Key, Mail, Calendar, Shield, Save, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showToast } from "@/components/ui/toast";
import { useAuth } from "@/lib/auth-context";

type AdminProfile = {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "super_admin" | "admin"
  createdAt: string
  lastLogin?: string
}

export function ProfileContent() {
  const { user, login } = useAuth()
  const [profile, setProfile] = useState<AdminProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [saving, setSaving] = useState(false)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [changingPassword, setChangingPassword] = useState(false)

  useEffect(() => {
    if (!user?.id) return
    fetch(`/api/admin/profile?id=${user.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.profile) {
          setProfile(data.profile)
          setFirstName(data.profile.firstName)
          setLastName(data.profile.lastName)
          setEmail(data.profile.email)
        }
      })
      .catch(() => showToast("Erreur de chargement du profil", "error"))
      .finally(() => setLoading(false))
  }, [user?.id])

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    if (!firstName.trim() || !lastName.trim() || !email.trim()) return
    setSaving(true)
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user?.id, firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        showToast(data.error ?? "Erreur", "error")
        return
      }
      if (data.token) {
        login({ id: user?.id ?? "", name: `${firstName.trim()} ${lastName.trim()}`, role: "admin" }, data.token)
      }
      setProfile(data.profile)
      showToast("Profil mis à jour", "success")
    } catch {
      showToast("Erreur de connexion", "error")
    } finally {
      setSaving(false)
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    if (!currentPassword.trim() || !newPassword.trim()) return
    if (newPassword.length < 6) {
      showToast("Le mot de passe doit contenir au moins 6 caractères", "error")
      return
    }
    setChangingPassword(true)
    try {
      const res = await fetch("/api/auth/admin/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const data = await res.json()
      if (!res.ok) {
        showToast(data.error ?? "Erreur", "error")
        return
      }
      showToast("Mot de passe mis à jour", "success")
      setCurrentPassword("")
      setNewPassword("")
    } catch {
      showToast("Erreur de connexion", "error")
    } finally {
      setChangingPassword(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-8 animate-spin rounded-full border-4 border-sky border-t-transparent" />
      </div>
    )
  }

  const initials = profile
    ? `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase()
    : "A"

  const roleLabel = profile?.role === "super_admin" ? "Super Admin" : "Admin"
  const createdDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })
    : "—"
  const lastLoginDate = profile?.lastLogin
    ? new Date(profile.lastLogin).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })
    : "—"

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-black text-ink">Mon Profil</h2>
        <p className="text-sm text-ink-soft">Informations personnelles et sécurité du compte</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="dash-card">
          <div className="flex items-center gap-5 mb-6">
            <div className="relative">
              <div className="flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-sky to-cyan font-display text-2xl font-black text-white">
                {initials}
              </div>
              <button className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full bg-sky text-white shadow-lg hover:bg-sky/90 transition cursor-pointer">
                <Camera className="size-3.5" />
              </button>
            </div>
            <div>
              <h3 className="font-display text-xl font-black text-ink">{profile?.firstName} {profile?.lastName}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="rounded-full bg-sky/10 px-3 py-0.5 text-xs font-bold text-sky">{roleLabel}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2 text-sm text-ink-soft">
              <Mail className="size-4 shrink-0" />
              <span className="truncate">{profile?.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-ink-soft">
              <Calendar className="size-4 shrink-0" />
              <span>Membre depuis {createdDate}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-ink-soft">
              <Shield className="size-4 shrink-0" />
              <span>Dernière connexion : {lastLoginDate}</span>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <h4 className="font-bold text-ink flex items-center gap-2">
              <User className="size-4" /> Modifier les informations
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-ink-soft uppercase tracking-wider">Prénom</label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-full border-2 border-border bg-body px-5 py-2.5 text-sm text-ink outline-none transition focus:border-sky"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-ink-soft uppercase tracking-wider">Nom</label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-full border-2 border-border bg-body px-5 py-2.5 text-sm text-ink outline-none transition focus:border-sky"
                  required
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-ink-soft uppercase tracking-wider">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="w-full rounded-full border-2 border-border bg-body px-5 py-2.5 text-sm text-ink outline-none transition focus:border-sky"
                required
              />
            </div>
            <Button type="submit" isLoading={saving}>
              <Save className="size-4" />
              {saving ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </form>
        </div>

        <div className="dash-card">
          <div className="flex items-center gap-3 mb-5">
            <span className="flex size-10 items-center justify-center rounded-brand-sm bg-amber/10 text-amber">
              <Key className="size-5" />
            </span>
            <div>
              <h3 className="font-bold text-ink">Mot de passe</h3>
              <p className="text-xs text-ink-soft">Modifier votre mot de passe de connexion</p>
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
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
      </div>
    </div>
  )
}
