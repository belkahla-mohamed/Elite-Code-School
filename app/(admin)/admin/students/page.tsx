"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Plus, Eye } from "lucide-react";

interface Student {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  age: number;
  avatar: string;
  programId: string;
  levelLabel: string;
  hours: number;
  isPublic: boolean;
  parentEmail: string;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/students").then((r) => r.json()).then((data) => {
      setStudents(data.students ?? []);
      setLoading(false);
    });
  }, []);

  const filtered = students.filter((s) =>
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-black text-ink">Élèves</h1>
        <span className="rounded-full bg-surface px-4 py-1.5 text-sm font-bold text-ink-soft">
          {students.length} élèves
        </span>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-ink-soft" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un élève..."
          className="w-full rounded-brand-sm border-2 border-[#E8EEF6] bg-white pl-10 pr-4 py-2.5 font-body text-ink transition focus:border-sky focus:outline-none"
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-ink-soft">Chargement...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-ink-soft">Aucun élève trouvé.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((student) => (
            <div key={student.id} className="flex items-center justify-between rounded-brand border-2 border-[#E8EEF6] bg-white px-6 py-4 transition hover:border-sky">
              <div className="flex items-center gap-4">
                <div className="flex size-10 items-center justify-center rounded-full bg-sky font-display font-black text-sm text-white">
                  {student.avatar}
                </div>
                <div>
                  <h3 className="font-bold text-ink">{student.firstName} {student.lastName}</h3>
                  <p className="text-sm text-ink-soft">{student.age} ans · {student.levelLabel}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${student.isPublic ? "bg-lime/15 text-lime" : "bg-ink-soft/10 text-ink-soft"}`}>
                  {student.isPublic ? "Public" : "Privé"}
                </span>
                <Link href={`/admin/students/${student.id}`} className="flex items-center gap-1 rounded-full border-2 border-[#E8EEF6] px-3 py-1.5 text-xs font-bold text-ink-soft hover:border-sky transition">
                  <Eye className="size-3" /> Gérer
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
