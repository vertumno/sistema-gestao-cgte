"use client";

import { useDashboardStore } from "@/stores/dashboard-store";
import type { PeriodType } from "@/types/dashboard";
import { cn } from "@/lib/utils";

const OPTIONS: { label: string; value: PeriodType }[] = [
  { label: "Mes", value: "mes" },
  { label: "Bimestre", value: "bimestre" },
  { label: "Trimestre", value: "trimestre" }
];

export function PeriodSelector() {
  const period = useDashboardStore((state) => state.period);
  const setPeriod = useDashboardStore((state) => state.setPeriod);

  return (
    <section aria-label="Filtro de periodo" className="rounded-lg border border-slate-200 bg-white p-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Periodo</p>
      <div className="flex flex-wrap gap-2">
        {OPTIONS.map((option) => {
          const active = period === option.value;
          return (
            <button
              key={option.value}
              type="button"
              aria-label={`Selecionar periodo ${option.label}`}
              aria-pressed={active}
              onClick={() => setPeriod(option.value)}
              className={cn(
                "rounded-md border px-3 py-2 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-emerald-600",
                active
                  ? "border-emerald-700 bg-emerald-700 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}