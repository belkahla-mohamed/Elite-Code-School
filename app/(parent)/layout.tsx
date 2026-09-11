"use client";

import { useState } from "react";
import { ParentSidebar } from "@/components/layout/parent-sidebar";
import { ParentHeader } from "@/components/layout/parent-header";

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-body">
      <ParentSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        onToggle={() => setCollapsed(!collapsed)}
      />
      <div className={`flex min-w-0 flex-1 flex-col transition-all duration-300 ${collapsed ? "md:ml-20" : "md:ml-64"}`}>
        <ParentHeader
          collapsed={collapsed}
          onToggleSidebar={() => setCollapsed(!collapsed)}
          onOpenMobile={() => setMobileOpen(true)}
        />
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
