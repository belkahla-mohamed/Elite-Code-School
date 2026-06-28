"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/admin/Sidebar";
import { AdminHeader } from "@/components/layout/admin-header";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        onToggle={() => setCollapsed(!collapsed)}
      />
      <div className={`flex flex-1 flex-col transition-all duration-300 ${collapsed ? "md:ml-20" : "md:ml-64"}`}>
        <AdminHeader
          collapsed={collapsed}
          onToggleSidebar={() => setCollapsed(!collapsed)}
          onOpenMobile={() => setMobileOpen(true)}
        />
        <main className="flex-1 bg-body p-6">{children}</main>
      </div>
    </div>
  );
}
