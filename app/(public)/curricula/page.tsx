"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Clock, GraduationCap } from "lucide-react";

interface Category {
  id: string; name: string; slug: string; description: string; color: string; icon: string;
}

interface Program {
  id: string; title: string; ageRange: string; level: string; description: string;
  tools: string[]; priceMonthly?: number; color: string; image: string;
  duration?: string; objectives?: string; prerequisites?: string; schedule?: string;
  categoryId?: string; category?: Category;
}

const levelLabels: Record<string, string> = {
  debutant: "Débutant",
  intermediaire: "Intermédiaire",
  avance: "Avancé",
};

export default function CurriculaPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/public/curricula").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ]).then(([programsData, categoriesData]) => {
      setPrograms(Array.isArray(programsData) ? programsData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      setLoading(false);
    });
  }, []);

  const filtered = activeCategory
    ? programs.filter((p) => p.categoryId === activeCategory)
    : programs;

  if (loading) {
    return (
      <div className="py-20">
        <section className="container-shell text-center mb-16">
          <div className="mx-auto h-12 w-64 animate-pulse rounded-lg bg-ink-soft/10" />
          <div className="mx-auto mt-4 h-6 w-96 animate-pulse rounded-lg bg-ink-soft/10" />
        </section>
        <section className="container-shell grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-brand border-2 border-border bg-white dark:bg-surface overflow-hidden">
              <div className="aspect-[16/9] animate-pulse bg-ink-soft/10" />
              <div className="p-6 space-y-3">
                <div className="h-4 w-24 animate-pulse rounded bg-ink-soft/10" />
                <div className="h-6 w-48 animate-pulse rounded bg-ink-soft/10" />
                <div className="h-4 w-full animate-pulse rounded bg-ink-soft/10" />
              </div>
            </div>
          ))}
        </section>
      </div>
    );
  }

  return (
    <div className="py-20">
      <section className="container-shell text-center mb-12">
        <h1 className="font-display text-5xl font-black tracking-[-0.04em] text-ink">
          Nos programmes
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-ink-soft">
          Du Scratch à l&apos;Intelligence Artificielle, chaque programme est conçu pour un âge et un niveau spécifique.
          Offrez à votre enfant les clés du numérique.
        </p>
      </section>

      {/* Categories filter */}
      {categories.length > 0 && (
        <section className="container-shell mb-10">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setActiveCategory(null)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                activeCategory === null
                  ? "bg-ink text-body shadow-sm"
                  : "bg-surface text-ink-soft hover:bg-border"
              }`}
            >
              Tous
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                  activeCategory === c.id
                    ? "bg-ink text-body shadow-sm"
                    : "bg-surface text-ink-soft hover:bg-border"
                }`}
              >
                {c.icon} {c.name}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Programs grid */}
      <section className="container-shell">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-ink-soft">
            <p className="text-lg font-bold">Aucun programme dans cette catégorie</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((program) => {
              const levelLabel = levelLabels[program.level] || program.level;
              return (
                <Link
                  key={program.id}
                  href={`/curricula/${program.id}`}
                  className="group rounded-brand border border-border bg-white dark:bg-surface overflow-hidden transition-all duration-300 hover:shadow-md"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-ink-soft/5">
                    <img
                      src={program.image || ""}
                      alt={program.title}
                      loading="lazy"
                      className="size-full object-cover transition duration-500 group-hover:scale-105"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="rounded-full bg-surface px-3 py-1 text-xs font-bold text-ink-soft">
                        {program.ageRange}
                      </span>
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                        program.level === "debutant" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                        program.level === "intermediaire" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                        "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400"
                      }`}>
                        {levelLabel}
                      </span>
                      {program.category && (
                        <span className="rounded-full bg-sky/10 px-3 py-1 text-xs font-bold text-sky">
                          {program.category.icon} {program.category.name}
                        </span>
                      )}
                    </div>

                    <h3 className="font-display text-2xl font-black text-ink group-hover:text-sky transition-colors">
                      {program.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-ink-soft line-clamp-2">
                      {program.description}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-bold text-ink-soft">
                      {program.duration && (
                        <span className="flex items-center gap-1.5">
                          <Clock className="size-3.5" /> {program.duration}
                        </span>
                      )}
                      {program.priceMonthly && (
                        <span className="flex items-center gap-1.5 text-lime font-black">
                          <GraduationCap className="size-3.5" /> {program.priceMonthly} DH/mois
                        </span>
                      )}
                    </div>

                    <div className="mt-5 flex items-center gap-1.5 text-sm font-bold text-sky group-hover:gap-2 transition-all">
                      Découvrir <ArrowRight className="size-4" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
