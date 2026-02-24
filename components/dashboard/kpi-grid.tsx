import { KpiCard } from "@/components/dashboard/kpi-card";
import type { KpiData } from "@/types/dashboard";

type KpiGridProps = {
  kpis: KpiData[];
};

export function KpiGrid({ kpis }: KpiGridProps) {
  return (
    <section aria-label="Resumo executivo" className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      {kpis.map((kpi) => (
        <KpiCard key={kpi.id} {...kpi} />
      ))}
    </section>
  );
}