export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-surface"><main className="container-shell py-8">{children}</main></div>;
}
