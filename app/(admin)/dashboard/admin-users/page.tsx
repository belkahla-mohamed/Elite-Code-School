"use client";

import { useEffect, useState } from "react";
import { Plus, Trash, Shield, ShieldWarning, X, EnvelopeSimple, Pencil, Eye } from "@phosphor-icons/react";
import { showToast } from "@/components/ui/toast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ViewToggle, useViewMode } from "@/components/ui/view-toggle";
import { GridFour, ListDashes } from "@phosphor-icons/react";

interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "super_admin" | "admin";
  permissions: string[];
  createdAt: string;
  lastLogin?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deletingAdmin, setDeletingAdmin] = useState(false);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [editForm, setEditForm] = useState<{ firstName: string; lastName: string; email: string; permissions: string[] }>({ firstName: "", lastName: "", email: "", permissions: [] });
  const [form, setForm] = useState<{ email: string; firstName: string; lastName: string; password: string; permissions: string[] }>({ email: "", firstName: "", lastName: "", password: "", permissions: [] });
  const [viewMode, setViewMode] = useViewMode("admin-users-view");
  const [cardColumns, setCardColumns] = useState<1 | 2>(2);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin-users");
    if (!res.ok) { showToast("Erreur chargement", "error"); setLoading(false); return; }
    const data = await res.json();
    setUsers(data.adminUsers ?? []);
    setLoading(false);
  }

  async function createUser(e: React.FormEvent) {
    e.preventDefault();
    if (!form.email || !form.firstName || !form.lastName || !form.password) return;
    setSaving(true);
    const res = await fetch("/api/admin-users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) { showToast(data.error ?? "Erreur", "error"); setSaving(false); return; }
    showToast("Administrateur créé avec succès", "success");
    setShowForm(false);
    setForm({ email: "", firstName: "", lastName: "", password: "", permissions: [] });
    await load();
    setSaving(false);
  }

  function openEdit(user: AdminUser) {
    setEditForm({ firstName: user.firstName, lastName: user.lastName, email: user.email, permissions: user.permissions || [] });
    setEditUser(user);
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editUser) return;
    setSaving(true);
    const res = await fetch(`/api/admin-users/${editUser.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    if (!res.ok) { showToast("Erreur lors de la modification", "error"); setSaving(false); return; }
    showToast("Administrateur modifié", "success");
    setEditUser(null);
    await load();
    setSaving(false);
  }

  async function deleteUser(id: string) {
    setDeletingAdmin(true);
    setDeleteId(null);
    const res = await fetch(`/api/admin-users/${id}`, { method: "DELETE" });
    if (!res.ok) { showToast("Erreur lors de la suppression", "error"); setDeletingAdmin(false); return; }
    showToast("Administrateur supprimé", "info");
    await load();
    setDeletingAdmin(false);
  }

  function renderTable() {
    return (
      <div className="overflow-x-auto rounded-brand border-2 border-border bg-white dark:bg-surface">
        <table className="w-full min-w-[540px] text-sm">
          <thead>
            <tr className="border-b-2 border-border bg-surface text-left">
              <th className="px-5 py-3.5 font-black text-xs uppercase tracking-wider text-ink-soft">Admin</th>
              <th className="px-5 py-3.5 font-black text-xs uppercase tracking-wider text-ink-soft hidden md:table-cell">Email</th>
              <th className="px-5 py-3.5 font-black text-xs uppercase tracking-wider text-ink-soft">Rôle</th>
              <th className="px-5 py-3.5 font-black text-xs uppercase tracking-wider text-ink-soft hidden lg:table-cell">Créé le</th>
              <th className="px-5 py-3.5 font-black text-xs uppercase tracking-wider text-ink-soft hidden lg:table-cell">Dernière connexion</th>
              <th className="px-5 py-3.5 font-black text-xs uppercase tracking-wider text-ink-soft text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-border">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-surface/50 transition">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex size-9 items-center justify-center rounded-full font-display text-xs font-black text-white ${
                      user.role === "super_admin" ? "bg-amber" : "bg-sky"
                    }`}>
                      {user.firstName[0]}{user.lastName[0]}
                    </div>
                    <span className="font-bold text-ink">{user.firstName} {user.lastName}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-ink-soft hidden md:table-cell">
                  <div className="flex items-center gap-1.5">
                    <EnvelopeSimple className="size-3" />
                    {user.email}
                  </div>
                </td>
                <td className="px-5 py-4">
                  {user.role === "super_admin" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber/10 px-3 py-1 text-xs font-bold text-amber">
                      <ShieldWarning className="size-3" /> Super Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-sky/10 px-3 py-1 text-xs font-bold text-sky">
                      <Shield className="size-3" /> Admin
                    </span>
                  )}
                </td>
                <td className="px-5 py-4 text-ink-soft hidden lg:table-cell">
                  {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                </td>
                <td className="px-5 py-4 text-ink-soft hidden lg:table-cell">
                  {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString("fr-FR") : "—"}
                </td>
                <td className="px-5 py-4 text-right">
                  <button onClick={() => openEdit(user)}
                    className="rounded-full bg-ink-soft/10 p-2 text-ink-soft hover:bg-ink-soft/20 transition mr-1"
                    title="Voir">
                    <Eye className="size-4" />
                  </button>
                  <button onClick={() => openEdit(user)}
                    className="rounded-full bg-sky/10 p-2 text-sky hover:bg-sky/20 transition mr-1">
                    <Pencil className="size-4" />
                  </button>
                  {user.role !== "super_admin" && (
                    <button onClick={() => setDeleteId(user.id)}
                      className="rounded-full bg-coral/10 p-2 text-coral hover:bg-coral/20 transition">
                      <Trash className="size-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  function renderCards() {
    return (
      <div className={cardColumns === 2 ? "grid grid-cols-1 md:grid-cols-2 gap-3" : "space-y-3"}>
        {users.map((user) => (
          <div key={user.id} className="rounded-brand border-2 border-border bg-white dark:bg-surface px-5 py-4 transition hover:shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <div className={`flex size-12 shrink-0 items-center justify-center rounded-full font-display text-lg font-black text-white ${
                  user.role === "super_admin" ? "bg-amber" : "bg-sky"
                }`}>
                  {user.firstName[0]}{user.lastName[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate font-bold text-ink">{user.firstName} {user.lastName}</h3>
                    {user.role === "super_admin" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber/10 px-3 py-0.5 text-xs font-bold text-amber">
                        <ShieldWarning className="size-3" /> Super Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-sky/10 px-3 py-0.5 text-xs font-bold text-sky">
                        <Shield className="size-3" /> Admin
                      </span>
                    )}
                  </div>
                  <p className="truncate break-all text-sm text-ink-soft">{user.email}</p>
                  <p className="text-xs text-ink-soft/60">
                    Créé le {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                    {user.lastLogin && ` · Dernière connexion ${new Date(user.lastLogin).toLocaleDateString("fr-FR")}`}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button onClick={() => openEdit(user)}
                  className="rounded-full bg-ink-soft/10 p-2 text-ink-soft hover:bg-ink-soft/20 transition"
                  title="Voir">
                  <Eye className="size-4" />
                </button>
                <button onClick={() => openEdit(user)}
                  className="rounded-full bg-sky/10 p-2 text-sky hover:bg-sky/20 transition"
                  title="Modifier">
                  <Pencil className="size-4" />
                </button>
                {user.role !== "super_admin" && (
                  <button onClick={() => setDeleteId(user.id)}
                    className="rounded-full bg-coral/10 p-2 text-coral hover:bg-coral/20 transition"
                    title="Supprimer">
                    <Trash className="size-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-black text-ink">Administrateurs</h1>
          <p className="text-sm text-ink-soft">Gérez les comptes administrateurs</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={() => setShowForm(true)} className="btn-primary py-2">
            <Plus className="mr-1 inline size-4" /> Ajouter
          </button>
          {viewMode === "cards" && (
            <div className="flex items-center rounded-full border-2 border-border bg-white dark:bg-surface p-0.5">
              <button onClick={() => setCardColumns(1)}
                className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold transition ${cardColumns === 1 ? "bg-sky text-white shadow-sm" : "text-ink-soft hover:text-ink"}`}>
                <ListDashes className="size-3.5" /> 1
              </button>
              <button onClick={() => setCardColumns(2)}
                className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold transition ${cardColumns === 2 ? "bg-sky text-white shadow-sm" : "text-ink-soft hover:text-ink"}`}>
                <GridFour className="size-3.5" /> 2
              </button>
            </div>
          )}
          <ViewToggle mode={viewMode} onChange={setViewMode} />
        </div>
      </div>

      {/* Create Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={() => setShowForm(false)}>
          <div className="w-full max-w-md rounded-brand bg-white dark:bg-surface p-6 shadow-card" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-ink">Nouvel administrateur</h2>
              <button onClick={() => setShowForm(false)}><X className="size-5 text-ink-soft" /></button>
            </div>
            <form onSubmit={createUser} className="space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  placeholder="Prénom" required className="rounded-brand-sm border-2 border-border bg-body px-3 py-2 text-sm text-ink focus:border-sky focus:outline-none" />
                <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  placeholder="Nom" required className="rounded-brand-sm border-2 border-border bg-body px-3 py-2 text-sm text-ink focus:border-sky focus:outline-none" />
              </div>
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                type="email" placeholder="Email" required className="rounded-brand-sm border-2 border-border bg-body px-3 py-2 text-sm text-ink focus:border-sky focus:outline-none w-full" />
              <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                type="password" placeholder="Mot de passe (min 6 car.)" required minLength={6}
                className="rounded-brand-sm border-2 border-border bg-body px-3 py-2 text-sm text-ink focus:border-sky focus:outline-none w-full" />
              
              <div className="space-y-2 pt-2">
                <p className="text-sm font-bold text-ink">Permissions</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "inscriptions", label: "Inscriptions" },
                    { id: "students", label: "Étudiants" },
                    { id: "programs", label: "Programmes" },
                    { id: "categories", label: "Catégories" },
                    { id: "cms", label: "CMS / Pages publiques" },
                    { id: "certificates", label: "Certificats" },
                    { id: "admins", label: "Administrateurs" },
                  ].map((p) => (
                    <label key={p.id} className="flex items-center gap-2 text-sm text-ink-soft">
                      <input type="checkbox"
                        checked={form.permissions.includes(p.id)}
                        onChange={(e) => {
                          const newPerms = e.target.checked 
                            ? [...form.permissions, p.id] 
                            : form.permissions.filter((id) => id !== p.id);
                          setForm({ ...form, permissions: newPerms });
                        }}
                        className="rounded border-border text-sky focus:ring-sky"
                      />
                      {p.label}
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={saving} className="btn-primary w-full py-2 mt-4">
                {saving ? "Création..." : "Créer l'administrateur"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Users List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-brand" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-ink-soft rounded-brand border-2 border-border bg-white dark:bg-surface">
          <Shield className="mb-4 size-12 opacity-40" />
          <p className="font-bold text-lg">Aucun administrateur</p>
          <p className="text-sm mt-1">Créez le premier administrateur.</p>
        </div>
      ) : viewMode === "table" ? renderTable() : renderCards()}

      {/* Edit Modal */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={() => setEditUser(null)}>
          <div className="w-full max-w-md rounded-brand bg-white dark:bg-surface p-6 shadow-card" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-ink">Modifier l&apos;administrateur</h2>
              <button onClick={() => setEditUser(null)}><X className="size-5 text-ink-soft" /></button>
            </div>
            <form onSubmit={saveEdit} className="space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input value={editForm.firstName} onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                  placeholder="Prénom" required className="rounded-brand-sm border-2 border-border bg-body px-3 py-2 text-sm text-ink focus:border-sky focus:outline-none" />
                <input value={editForm.lastName} onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                  placeholder="Nom" required className="rounded-brand-sm border-2 border-border bg-body px-3 py-2 text-sm text-ink focus:border-sky focus:outline-none" />
              </div>
              <input value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                type="email" placeholder="Email" required className="rounded-brand-sm border-2 border-border bg-body px-3 py-2 text-sm text-ink focus:border-sky focus:outline-none w-full" />
              
              <div className="space-y-2 pt-2">
                <p className="text-sm font-bold text-ink">Permissions</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "inscriptions", label: "Inscriptions" },
                    { id: "students", label: "Étudiants" },
                    { id: "programs", label: "Programmes" },
                    { id: "categories", label: "Catégories" },
                    { id: "cms", label: "CMS / Pages publiques" },
                    { id: "certificates", label: "Certificats" },
                    { id: "admins", label: "Administrateurs" },
                  ].map((p) => (
                    <label key={p.id} className="flex items-center gap-2 text-sm text-ink-soft">
                      <input type="checkbox"
                        checked={editForm.permissions.includes(p.id)}
                        onChange={(e) => {
                          const newPerms = e.target.checked 
                            ? [...editForm.permissions, p.id] 
                            : editForm.permissions.filter((id) => id !== p.id);
                          setEditForm({ ...editForm, permissions: newPerms });
                        }}
                        className="rounded border-border text-sky focus:ring-sky"
                      />
                      {p.label}
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={saving} className="btn-primary w-full py-2 mt-4">
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <ConfirmDialog title="Supprimer cet administrateur ?"
          description="Cette action est irréversible. L'administrateur perdra tout accès."
          confirmLabel="Supprimer" variant="danger" loading={deletingAdmin}
          onConfirm={() => deleteUser(deleteId)} onCancel={() => setDeleteId(null)} />
      )}
    </div>
  );
}
