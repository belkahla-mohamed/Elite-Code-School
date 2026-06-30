import Link from "next/link";
import Image from "next/image";
import { Footer } from "@/components/layout/footer";
import PublicNav from "@/components/layout/public-nav";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-40 border-b-2 border-border bg-surface">
        <div className="container-shell flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <Image
              src="/logos/logo-icon.png"
              alt="Elite Code School"
              width={36}
              height={36}
              className="size-9"
            />
            <span className="font-display font-black text-lg text-ink hidden sm:inline">Elite Code School</span>
          </Link>
          <PublicNav />
        </div>
      </header>
      <main className="animate-page-in">{children}</main>
      <Footer />
    </>
  );
}
