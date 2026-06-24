"use client";

import { useState, useEffect } from "react";
import { showToast } from "@/components/ui/toast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Trash2 } from "lucide-react";

interface Program {
  id: string;
  title: string;
  ageRange: string;
  level: string;
  priceMonthly: number;
  icon: string;
  color: string;
}

export default function CurriculaAdminPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/public/curricula").then((r) => r.json()).then((data) => {
      setPrograms(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <h1 className="font-display text-3xl font-black text-ink mb-6">Programmes</h1>

      {loading ? (
        <div className="text-center py-12 text-ink-soft">Chargement...</div>
      ) : (
        <div className="space-y-3">
          {programs.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-brand border-2 border-[#E8EEF6] bg-white px-6 py-4">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{p.icon}</span>
                <div>
                  <h3 className="font-bold text-ink">{p.title}</h3>
                  <p className="text-sm text-ink-soft">{p.ageRange} · {p.level} · {p.priceMonthly} DH/mois</p>
                </div>
              </div>
              <button onClick={() => setConfirmDelete(p.id)} className="text-coral hover:text-coral/80">
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {confirmDelete && (
        <ConfirmDialog
          title="Supprimer ce programme ?"
          description="Cette action est irréversible."
          confirmLabel="Supprimer"
          onCancel={() => setConfirmDelete(null)}
          onConfirm={() => { setConfirmDelete(null); showToast("Supprimé", "info"); }}
        />
      )}
    </div>
  );
}
