"use client";

import type { KpiData } from "@/types/dashboard";
import { cn } from "@/lib/utils";

type KpiCardProps = KpiData & {
  className?: string;
};

export function KpiCard({ label, value, trend, trendDirection, className }: KpiCardProps) {
  const trendIcon = trendDirection === "up" ? "↑" : trendDirection === "down" ? "↓" : "→";

  return (
    <section
      className={cn(
        "reveal rounded-lg p-4 glass transition-shadow hover:glow",
        className
      )}
      aria-label={`${label}: ${value}. Variação ${trend}.`}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-text-muted">{label}</p>
      <p className="mt-2 font-display text-3xl font-bold tracking-tight text-text">{value}</p>
      <p
        className={cn(
          "mt-2 flex items-center gap-1 text-xs font-semibold",
          trendDirection === "up" && "text-success",
          trendDirection === "down" && "text-danger",
          trendDirection === "neutral" && "text-text-muted"
        )}
      >
        <span aria-hidden="true">{trendIcon}</span>
        <span>{trend}</span>
      </p>
    </section>
  );
}