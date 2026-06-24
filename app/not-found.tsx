import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center px-6">
      <span className="text-8xl font-display font-black text-sky/20">404</span>
      <h1 className="font-display font-black text-3xl text-ink mt-4">Page introuvable</h1>
      <p className="text-ink-soft mt-2 max-w-sm">
        Désolé, cette page n&apos;existe pas ou a été déplacée.
      </p>
      <div className="flex gap-3 mt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-sky px-6 py-3 text-sm font-black uppercase tracking-wide text-white hover:bg-sky-dark transition"
        >
          <Home className="size-4" />
          Accueil
        </Link>
      </div>
    </div>
  );
}
