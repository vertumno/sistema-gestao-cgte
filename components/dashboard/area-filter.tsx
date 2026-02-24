"use client";

import { useDashboardStore } from "@/stores/dashboard-store";
import type { AreaFilter } from "@/types/dashboard";

const OPTIONS: AreaFilter[] = ["Todas", "Design", "Libras", "Audiovisual", "Gestao"];

export function AreaFilter() {
  const area = useDashboardStore((state) => state.area);
  const setArea = useDashboardStore((state) => state.setArea);

  return (
    <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
      <span>Area</span>
      <select
        aria-label="Filtrar por area"
        value={area}
        onChange={(event) => setArea(event.target.value as AreaFilter)}
        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
      >
        {OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}