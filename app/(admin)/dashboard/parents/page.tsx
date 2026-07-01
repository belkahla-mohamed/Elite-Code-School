"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Users, Search, Plus, Trash2, X, Loader2, Mail, Phone, User, Shield,
  ExternalLink, Key, Copy, Check,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { showToast } from "@/components/ui/toast";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { cn } from "@/lib/utils";
import type { ParentWithStudent } from "@/lib/types";

export default function ParentsPage() {
  const [parents, setParents] = useState<ParentWithStudent[]>([]);
  const [students, setStudents] = useState<{ id: string; firstName: string; lastName: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ email: "", firstName: "", lastName: "", phone: "", studentId: "" });
  const [creating, setCreating] = useState(false);
  const [createdSecret, setCreatedSecret] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const [parentsRes, studentsRes] = await Promise.all([
      fetch("/api/parents"),
      fetch("/api/students"),
    ]);
    if (parentsRes.ok) {
      const d = await parentsRes.json();
      setParents(d.parents ?? []);
    }
    if (studentsRes.ok) {
      const d = await studentsRes.json();
      const list = Array.isArray(d) ? d : (d as any)?.students ?? [];
      setStudents(list.map((s: any) => ({ id: s.id, firstName: s.firstName ?? s.first_name, lastName: s.lastName ?? s.last_name })));
    }
    setLoading(false);
  }

  const filtered = useMemo(() => {
    if (!search.trim()) return parents;
    const q = search.toLowerCase();
    return parents.filter(
      (p) =>
        p.email.toLowerCase().includes(q) ||
        p.firstName.toLowerCase().includes(q) ||
        p.lastName.toLowerCase().includes(q) ||
        p.studentName.toLowerCase().includes(q)
    );
  }, [parents, search]);

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    const res = await fetch(`/api/parents/${deleteId}`, { method: "DELETE" });
    if (res.ok) {
      setParents((prev) => prev.filter((p) => p.id !== deleteId));
      showToast("Parent supprimé", "success");
    } else {
      showToast("Erreur lors de la suppression", "error");
    }
    setDeleting(false);
    setDeleteId(null);
  }

  function openCreate() {
    setForm({ email: "", firstName: "", lastName: "", phone: "", studentId: "" });
    setCreatedSecret("");
    setCreateOpen(true);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.email.trim() || !form.studentId) {
      showToast("Email et élève requis", "error");
      return;
    }
    setCreating(true);
    const res = await fetch("/api/parents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      setCreatedSecret(data.parentSecret);
      showToast("Parent créé avec succès", "success");
      await load();
    } else {
      showToast(data.error ?? "Erreur création", "error");
    }
    setCreating(false);
  }

  function copySecret(secret: string) {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-black text-ink">Parents</h1>
          <p className="mt-1 text-sm text-ink-soft">Gérer les accès parents</p>
        </div>
        <button onClick={openCreate} className="btn-primary py-2">
          <Plus className="mr-1 inline size-4" /> Ajouter un parent
        </button>
      </div>

      {/* Created Secret Banner */}
      {createdSecret && (
        <div className="mb-6 rounded-brand border-2 border-lime/30 bg-lime/5 p-4">
          <p className="text-sm font-bold text-lime">Parent créé avec succès !</p>
          <div className="mt-2 flex items-center gap-3">
            <code className="rounded bg-body px-4 py-2 font-mono text-lg font-bold text-ink tracking-widest">
              {createdSecret}
            </code>
            <button
              onClick={() => copySecret(createdSecret)}
              className="flex size-9 items-center justify-center rounded-full bg-lime/10 text-lime hover:bg-lime hover:text-white transition"
              title="Copier"
            >
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            </button>
            <button onClick={() => setCreatedSecret("")} className="flex size-9 items-center justify-center rounded-full text-ink-soft hover:bg-ink-soft/10 transition">
              <X className="size-4" />
            </button>
          </div>
          <p className="mt-2 text-xs text-ink-soft">
            Ce secret est affiché une seule fois. Transmettez-le au parent.
          </p>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par email, nom, élève..."
          className="w-full rounded-full border-2 border-border bg-body py-2.5 pl-10 pr-4 text-sm text-ink outline-none transition focus:border-sky"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-brand" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-brand border-2 border-border bg-white dark:bg-surface py-20 text-ink-soft">
          <Users className="mb-3 size-12 opacity-40" />
          <p className="text-lg font-bold">Aucun parent</p>
          <p className="mt-1 text-sm">{search ? "Aucun résultat pour votre recherche." : "Ajoutez un parent pour commencer."}</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-brand border-2 border-border bg-white dark:bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-border bg-surface text-left">
                <th className="px-4 py-3.5 font-black text-xs uppercase tracking-wider text-ink-soft">Parent</th>
                <th className="px-4 py-3.5 font-black text-xs uppercase tracking-wider text-ink-soft hidden md:table-cell">Contact</th>
                <th className="px-4 py-3.5 font-black text-xs uppercase tracking-wider text-ink-soft">Élève lié</th>
                <th className="px-4 py-3.5 font-black text-xs uppercase tracking-wider text-ink-soft hidden sm:table-cell">Créé le</th>
                <th className="px-4 py-3.5 text-right">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-border">
              {filtered.map((parent) => (
                <tr key={parent.id} className="hover:bg-surface/50 transition">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-sky to-cyan font-display text-sm font-black text-white">
                        {parent.firstName[0]}{parent.lastName[0]}
                      </div>
                      <div>
                        <p className="font-bold text-ink">{parent.firstName} {parent.lastName}</p>
                        <p className="text-xs text-ink-soft">{parent.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-ink-soft hidden md:table-cell">
                    <div className="space-y-1">
                      <span className="flex items-center gap-1.5">
                        <Mail className="size-3" /> {parent.email}
                      </span>
                      {parent.phone && (
                        <span className="flex items-center gap-1.5">
                          <Phone className="size-3" /> {parent.phone}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-semibold text-ink">{parent.studentName}</span>
                  </td>
                  <td className="px-4 py-4 text-ink-soft hidden sm:table-cell">
                    {new Date(parent.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric", month: "short", year: "numeric"
                    })}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={() => setDeleteId(parent.id)}
                      className="flex size-8 items-center justify-center rounded-full bg-coral/10 text-coral transition hover:bg-coral hover:text-white"
                      title="Supprimer"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un parent</DialogTitle>
            <DialogDescription>
              Créez un accès parent pour un élève. Un code secret sera généré.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 py-2">
            <div>
              <label className="mb-1 block text-xs font-bold text-ink-soft uppercase tracking-wider">Email *</label>
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                type="email"
                placeholder="parent@email.com"
                className="w-full rounded-full border-2 border-border bg-body px-4 py-2.5 text-sm text-ink outline-none transition focus:border-sky"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-bold text-ink-soft uppercase tracking-wider">Prénom</label>
                <input
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  placeholder="Prénom"
                  className="w-full rounded-full border-2 border-border bg-body px-4 py-2.5 text-sm text-ink outline-none transition focus:border-sky"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-ink-soft uppercase tracking-wider">Nom</label>
                <input
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  placeholder="Nom"
                  className="w-full rounded-full border-2 border-border bg-body px-4 py-2.5 text-sm text-ink outline-none transition focus:border-sky"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-ink-soft uppercase tracking-wider">Téléphone</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+212 6XX XXX XXX"
                className="w-full rounded-full border-2 border-border bg-body px-4 py-2.5 text-sm text-ink outline-none transition focus:border-sky"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-ink-soft uppercase tracking-wider">Élève *</label>
              <select
                value={form.studentId}
                onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                className="w-full rounded-full border-2 border-border bg-body px-4 py-2.5 text-sm text-ink outline-none transition focus:border-sky"
                required
              >
                <option value="">Sélectionner un élève...</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
                ))}
              </select>
            </div>
            <DialogFooter className="pt-2">
              <DialogClose asChild>
                <button type="button" className="rounded-full border-2 border-border px-4 py-2 text-sm font-bold text-ink-soft hover:border-sky transition">
                  Annuler
                </button>
              </DialogClose>
              <button type="submit" disabled={creating || !form.email || !form.studentId}
                className="btn-primary px-6 py-2 disabled:opacity-50">
                {creating ? <><Loader2 className="mr-1 inline size-4 animate-spin" /> Création...</> : "Créer le parent"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      {deleteId && (
        <ConfirmDialog
          title="Supprimer l'accès parent"
          description="L'parent ne pourra plus se connecter. Cette action est irréversible."
          confirmLabel="Supprimer"
          variant="danger"
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
