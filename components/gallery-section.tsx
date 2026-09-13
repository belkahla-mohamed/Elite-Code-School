"use client";

import Image from "next/image";
import { ArrowUpRight, X, ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";

const gallery = [
  { src: "/images/hero-mentoring.jpg", alt: "Accompagnement personnalise sur un projet", label: "Atelier mentorat" },
  { src: "/images/kid-elearning.jpg", alt: "Eleve en session de code", label: "Session de code" },
  { src: "/images/kids-stem.jpg", alt: "Experience STEM en atelier", label: "Atelier STEM" },
  { src: "/images/girl-writing.jpg", alt: "Eleve en train de documenter son projet", label: "Documentation de projet" },
  { src: "/images/hero-family.jpg", alt: "Parent et enfant devant l'ordinateur", label: "Moment famille" },
  { src: "/images/teacher-board.jpg", alt: "Explication devant le tableau", label: "Cours magistral" },
];

export function GallerySection() {
  const [idx, setIdx] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const open = useCallback((i: number) => setIdx(i), []);
  const close = useCallback(() => setIdx(null), []);
  const prev = useCallback(() => setIdx((p) => (p !== null ? (p - 1 + gallery.length) % gallery.length : null)), []);
  const next = useCallback(() => setIdx((p) => (p !== null ? (p + 1) % gallery.length : null)), []);

  useEffect(() => {
    if (idx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [idx, close, prev, next]);

  const current = idx !== null ? gallery[idx] : null;

  const lightbox = current ? (
    <div style={{ position: "fixed", inset: 0, zIndex: 99999 }}>
      {/* Backdrop */}
      <div
        onClick={close}
        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(4px)" }}
      />

      {/* Close */}
      <button
        onClick={close}
        aria-label="Fermer"
        style={{ position: "absolute", top: 16, right: 16, zIndex: 10, width: 44, height: 44, borderRadius: "50%", background: "white", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}
      >
        <X className="size-5" style={{ color: "#333" }} />
      </button>

      {/* Prev */}
      <button
        onClick={prev}
        aria-label="Precedent"
        style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", zIndex: 10, width: 44, height: 44, borderRadius: "50%", background: "white", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}
      >
        <ArrowLeft className="size-5" style={{ color: "#333" }} />
      </button>

      {/* Next */}
      <button
        onClick={next}
        aria-label="Suivant"
        style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", zIndex: 10, width: 44, height: 44, borderRadius: "50%", background: "white", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}
      >
        <ArrowRight className="size-5" style={{ color: "#333" }} />
      </button>

      {/* Image + label */}
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px 24px" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current.src}
          alt={current.alt}
          style={{ maxWidth: "100%", maxHeight: "80vh", borderRadius: 12, objectFit: "contain", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}
        />
        <div style={{ marginTop: 16, borderRadius: 999, background: "rgba(255,255,255,0.95)", padding: "8px 20px", fontSize: 14, fontWeight: 700, color: "#1a1a2e", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
          {current.label} — {idx! + 1} / {gallery.length}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <section className="bg-white py-16 sm:py-24 dark:bg-body">
        <div className="container-shell">
          <div className="mb-10 text-center sm:mb-14">
            <span className="inline-flex rounded-full bg-brand/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-brand">
              Galerie
            </span>
            <h2 className="mx-auto mt-4 max-w-3xl font-display text-3xl font-semibold tracking-[-0.02em] text-ink dark:text-ink md:text-5xl">
              La vie à l&apos;ecole
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-7 text-ink-soft sm:mt-4 sm:text-base sm:leading-8 dark:text-ink-soft">
              Un apercu des ateliers, des projets et des moments de partage a Elite Code School.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {gallery.map((item, i) => (
              <button
                key={item.src}
                onClick={() => open(i)}
                className="group relative cursor-pointer overflow-hidden rounded-brand border border-border dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={600}
                  height={450}
                  className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-105"
                />
                <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-ink/85 via-ink/40 to-transparent p-4 pt-12 text-xs font-bold text-white">
                  <span>{item.label}</span>
                  <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/25 transition group-hover:bg-white/40">
                    <ArrowUpRight className="size-4" />
                  </span>
                </figcaption>
              </button>
            ))}
          </div>
        </div>
      </section>

      {mounted && createPortal(lightbox, document.body)}
    </>
  );
}
