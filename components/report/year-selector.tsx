"use client";

import { useReportStore } from "@/stores/report-store";

export function YearSelector() {
  const ano = useReportStore((state) => state.ano);
  const setAno = useReportStore((state) => state.setAno);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, index) => currentYear - index);

  return (
    <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
      <span>Ano</span>
      <select
        aria-label="Selecionar ano"
        value={String(ano)}
        onChange={(event) => setAno(Number(event.target.value))}
        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </label>
  );
}