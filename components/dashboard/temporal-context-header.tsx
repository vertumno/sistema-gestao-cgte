"use client";

import { useDashboardStore } from "@/stores/dashboard-store";
import type { PeriodType } from "@/types/dashboard";
import { formatDateRange, formatPeriodLabel } from "@/lib/natural-language";
import { cn } from "@/lib/utils";

type TemporalContextHeaderProps = {
  range: { startDate: string; endDate: string };
};

const PERIOD_OPTIONS: { label: string; value: PeriodType }[] = [
  { label: "Mês", value: "mes" },
  { label: "Bimestre", value: "bimestre" },
  { label: "Trimestre", value: "trimestre" }
];

export function TemporalContextHeader({ range }: TemporalContextHeaderProps) {
  const period = useDashboardStore((state) => state.period);
  const setPeriod = useDashboardStore((state) => state.setPeriod);

  const periodLabel = formatPeriodLabel(period, range);
  const dateRange = formatDateRange(range);

  return (
    <header
      className="reveal relative rounded-lg px-5 py-4 glass glow"
      aria-label="Contexto temporal do dashboard"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Context text */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
            Você está vendo
          </p>
          <p className="mt-0.5 text-lg font-semibold text-text">
            {periodLabel}
            <span className="ml-2 text-sm font-normal text-text-muted">
              ({dateRange})
            </span>
          </p>
        </div>

        {/* Period selector tabs */}
        <nav aria-label="Selecionar período" className="flex gap-1">
          {PERIOD_OPTIONS.map((option) => {
            const active = period === option.value;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={active}
                onClick={() => setPeriod(option.value)}
                className={cn(
                  "rounded px-4 py-1.5 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary",
                  active
                    ? "bg-primary text-primary-contrast"
                    : "text-text-muted hover:bg-primary-light hover:text-primary"
                )}
              >
                {option.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
