import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function RelatorioLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}