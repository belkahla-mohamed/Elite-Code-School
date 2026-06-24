import { ParentNav } from "@/components/layout/parent-nav";

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface">
      <ParentNav />
      <main className="container-shell py-8">{children}</main>
    </div>
  );
}
