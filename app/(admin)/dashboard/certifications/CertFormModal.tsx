"use client";

import { useState, useEffect } from "react";
import { X, Medal, MagnifyingGlass, SpinnerGap } from "@phosphor-icons/react";
import { showToast } from "@/components/ui/toast";
import { OptimizedImage } from "@/components/ui/optimized-image";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
}

interface CertFormModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function CertFormModal({ onClose, onSuccess }: CertFormModalProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [form, setForm] = useState({
    studentId: "",
    title: "",
    mention: "Validé",
    dateLabel: new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" }),
    emoji: "🏅",
    gradient: "linear-gradient(135deg,#f59e0b,#f97316)",
    issueDate: new Date().toISOString().split("T")[0],
    serialCode: "",
  });

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/students")
      .then((r) => r.json())
      .then((data) => {
        setStudents(data.students ?? []);
        setLoadingStudents(false);
      })
      .catch(() => {
        showToast("Erreur lors du chargement des élèves", "error");
        setLoadingStudents(false);
      });
  }, []);

  const generateSerial = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let serial = "ECS-";
    for (let i = 0; i < 8; i++) {
      serial += chars.charAt(Math.floor(Math.random() * chars.length));
      if (i === 3) serial += "-";
    }
    setForm({ ...form, serialCode: serial });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.studentId) {
      showToast("Veuillez sélectionner un élève", "error");
      return;
    }
    if (!form.serialCode) {
      showToast("Veuillez générer un numéro de série", "error");
      return;
    }

    setSaving(true);
    const res = await fetch("/api/certifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const data = await res.json();
      showToast(data.error ?? "Erreur lors de la génération", "error");
      setSaving(false);
      return;
    }

    showToast("Certificat généré avec succès", "success");
    onSuccess();
  }

  const filteredStudents = students.filter(s => 
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={onClose}>
      <div className="w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col rounded-brand bg-white dark:bg-surface shadow-card" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b-2 border-border px-6 py-4 shrink-0">
          <div className="flex items-center gap-2">
            <Medal className="size-5 text-amber" />
            <h2 className="font-display text-lg font-black text-ink">Générer un Certificat</h2>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-ink-soft hover:bg-surface hover:text-ink transition">
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <form id="cert-form" onSubmit={handleSubmit} className="space-y-5">
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-ink">Sélectionner l&apos;élève</label>
              <div className="relative">
                <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-ink-soft" />
                <input
                  type="text"
                  placeholder="Rechercher un élève..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-brand-sm border-2 border-border bg-body py-2 pl-9 pr-3 text-sm focus:border-sky focus:outline-none"
                />
              </div>
              
              <div className="mt-2 grid grid-cols-2 gap-2 max-h-40 overflow-y-auto rounded-brand-sm border-2 border-border p-2">
                {loadingStudents ? (
                  <div className="col-span-2 flex items-center justify-center py-4 text-ink-soft">
                    <SpinnerGap className="size-5 animate-spin" />
                  </div>
                ) : filteredStudents.length === 0 ? (
                  <div className="col-span-2 py-4 text-center text-sm text-ink-soft">Aucun élève trouvé</div>
                ) : (
                  filteredStudents.map((s) => (
                    <label key={s.id} className={`flex items-center gap-3 rounded-lg border-2 p-2 cursor-pointer transition ${form.studentId === s.id ? "border-sky bg-sky/5" : "border-transparent hover:bg-surface"}`}>
                      <input type="radio" name="student" value={s.id} checked={form.studentId === s.id} onChange={() => setForm({ ...form, studentId: s.id })} className="hidden" />
                      {s.avatar ? (
                         <OptimizedImage src={s.avatar} alt="" width={32} height={32} className="size-8 rounded-full object-cover" />
                      ) : (
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface font-bold text-ink-soft text-xs">{s.firstName[0]}</div>
                      )}
                      <span className="text-sm font-semibold truncate">{s.firstName} {s.lastName}</span>
                    </label>
                  ))
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-bold text-ink">Titre du certificat</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Ex: Fondamentaux Python" className="w-full rounded-brand-sm border-2 border-border bg-body px-3 py-2 text-sm focus:border-sky focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold text-ink">Mention</label>
                <input required value={form.mention} onChange={(e) => setForm({ ...form, mention: e.target.value })}
                  placeholder="Ex: Validé avec excellence" className="w-full rounded-brand-sm border-2 border-border bg-body px-3 py-2 text-sm focus:border-sky focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold text-ink">Date (texte libre)</label>
                <input required value={form.dateLabel} onChange={(e) => setForm({ ...form, dateLabel: e.target.value })}
                  placeholder="Ex: Janvier 2024" className="w-full rounded-brand-sm border-2 border-border bg-body px-3 py-2 text-sm focus:border-sky focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold text-ink">Date d&apos;émission</label>
                <input type="date" required value={form.issueDate} onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
                  className="w-full rounded-brand-sm border-2 border-border bg-body px-3 py-2 text-sm focus:border-sky focus:outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 flex items-center justify-between text-sm font-bold text-ink">
                  <span>Numéro de série</span>
                  <button type="button" onClick={generateSerial} className="text-xs text-sky hover:underline">Générer</button>
                </label>
                <input required value={form.serialCode} onChange={(e) => setForm({ ...form, serialCode: e.target.value })}
                  placeholder="Générer ou saisir" className="w-full rounded-brand-sm border-2 border-border bg-body px-3 py-2 text-sm font-mono focus:border-sky focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold text-ink">Personnalisation (Emoji & Couleur)</label>
                <div className="flex items-center gap-2">
                  <input required value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                    className="w-16 rounded-brand-sm border-2 border-border bg-body px-3 py-2 text-center text-xl focus:border-sky focus:outline-none" />
                  <select value={form.gradient} onChange={(e) => setForm({ ...form, gradient: e.target.value })}
                    className="w-full rounded-brand-sm border-2 border-border bg-body px-3 py-2 text-sm focus:border-sky focus:outline-none appearance-none">
                    <option value="linear-gradient(135deg,#f59e0b,#f97316)">Ambre / Orange (Défaut)</option>
                    <option value="linear-gradient(135deg,#06b6d4,#3b82f6)">Cyan / Bleu</option>
                    <option value="linear-gradient(135deg,#10b981,#059669)">Émeraude / Vert</option>
                    <option value="linear-gradient(135deg,#a855f7,#7c3aed)">Violet</option>
                    <option value="linear-gradient(135deg,#ef4444,#dc2626)">Rouge</option>
                  </select>
                </div>
              </div>
            </div>
            
          </form>
        </div>

        <div className="border-t-2 border-border px-6 py-4 shrink-0 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-brand-sm px-4 py-2 text-sm font-bold text-ink-soft hover:bg-surface transition">
            Annuler
          </button>
          <button type="submit" form="cert-form" disabled={saving || !form.studentId} className="btn-primary py-2 px-6">
            {saving ? "Génération..." : "Générer et Assigner"}
          </button>
        </div>
      </div>
    </div>
  );
}
