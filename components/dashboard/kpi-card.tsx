"use client";

import type { KpiData } from "@/types/dashboard";
import { cn } from "@/lib/utils";

type KpiCardProps = KpiData & {
  className?: string;
};

export function KpiCard({ label, value, trend, trendDirection, className }: KpiCardProps) {
  const trendIcon = trendDirection === "up" ? "?" : trendDirection === "down" ? "?" : "?";

  return (
    <section
      className={cn("rounded-lg border border-slate-200 bg-white p-4", className)}
      aria-label={`${label}: ${value}. Variacao ${trend}.`}
    >
      <p className="text-sm text-slate-600">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
      <p
        className={cn(
          "mt-2 text-xs font-medium",
          trendDirection === "up" && "text-emerald-700",
          trendDirection === "down" && "text-red-700",
          trendDirection === "neutral" && "text-slate-500"
        )}
      >
        {trendIcon} {trend}
      </p>
    </section>
  );
}