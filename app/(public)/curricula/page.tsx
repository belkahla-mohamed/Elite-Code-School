"use client";

import { useState, useEffect } from "react";
import { ProgramCard } from "@/components/ui/program-card";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Skeleton } from "@/components/ui/skeleton";

interface Category {
  id: string; name: string; slug: string; description: string; color: string;
}

interface Program {
  id: string; title: string; ageRange: string; level: string; description: string;
  tools: string[]; priceMonthly?: number; color: string; image: string;
  duration?: string; objectives?: string; prerequisites?: string; schedule?: string;
  categoryId?: string; category?: Category;
}

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
        <section className="container-shell grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-brand border border-border bg-white dark:bg-slate-950 overflow-hidden">
              <Skeleton className="h-40 w-full rounded-none" />
              <div className="p-6 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </section>
      </div>
    );
  }

  return (
    <div className="py-20">
      <ScrollReveal>
        <section className="container-shell text-center mb-12">
          <h1 className="font-display text-5xl font-black tracking-[-0.04em] text-ink">
            Nos programmes
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-ink-soft">
            Du Scratch à l&apos;Intelligence Artificielle, chaque programme est conçu pour un âge et un niveau spécifique.
            Offrez à votre enfant les clés du numérique.
          </p>
        </section>
      </ScrollReveal>

      {categories.length > 0 && (
        <ScrollReveal delay={100}>
          <section className="container-shell mb-10">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => setActiveCategory(null)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                  activeCategory === null
                    ? "bg-ink text-body"
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
                      ? "bg-ink text-body"
                      : "bg-surface text-ink-soft hover:bg-border"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </section>
        </ScrollReveal>
      )}

      <section className="container-shell">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-ink-soft">
            <p className="text-lg font-bold">Aucun programme dans cette catégorie</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((program, i) => (
              <ScrollReveal key={program.id} delay={i * 80}>
                <ProgramCard program={program} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
