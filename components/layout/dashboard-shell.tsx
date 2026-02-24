"use client";

import { useState } from "react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Sidebar } from "@/components/layout/sidebar";

type DashboardShellProps = {
  children: React.ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex min-h-screen">
        <aside className="hidden md:block">
          <Sidebar />
        </aside>
        <div className="flex min-h-screen flex-1 flex-col">
          <Header onToggleMobileNav={() => setMobileOpen(true)} />
          <main className="flex-1 px-4 py-6 md:px-6">{children}</main>
          <Footer />
        </div>
      </div>
    </div>
  );
}