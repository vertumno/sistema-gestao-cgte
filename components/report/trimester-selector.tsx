"use client";

import { useMemo } from "react";
import { getAvailableTrimesterLabels } from "@/lib/pgd-periods";
import { useReportStore } from "@/stores/report-store";

export function TrimesterSelector() {
  const trimestre = useReportStore((state) => state.trimestre);
  const setTrimestre = useReportStore((state) => state.setTrimestre);

  const options = useMemo(() => getAvailableTrimesterLabels(new Date()), []);

  return (
    <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
      <span>Trimestre</span>
      <select
        aria-label="Selecionar trimestre"
        value={trimestre}
        onChange={(event) => setTrimestre(event.target.value)}
        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}