import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import PublicNav from "@/components/layout/public-nav";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-40 border-b-2 border-border bg-surface">
        <div className="container-shell flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <span className="flex size-9 items-center justify-center rounded-lg bg-sky font-display font-black text-sm text-white">EC</span>
            <span className="font-display font-black text-lg text-ink hidden sm:inline">Elite Code School</span>
          </Link>
          <PublicNav />
        </div>
      </header>
      <main>{children}</main>
      <Footer />
    </>
  );
}
