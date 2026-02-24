"use client";

import { useMemo, useState } from "react";
import { ChartDownloadButton } from "@/components/dashboard/chart-download-button";
import type { MonthlyMetric, PersonMetric } from "@/types/dashboard";

type TemporalMode = "total" | "categoria" | "pessoa";

type TemporalChartProps = {
  months: MonthlyMetric[];
  categoryLabels: Record<string, string>;
  persons: PersonMetric[];
};

function linePath(values: number[], width: number, height: number, maxValue: number): string {
  if (values.length === 0) return "";

  return values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * width;
      const y = height - (value / Math.max(maxValue, 1)) * height;
      return `${index === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");
}

export function TemporalChart({ months, categoryLabels, persons }: TemporalChartProps) {
  const [mode, setMode] = useState<TemporalMode>("total");

  const topCategories = useMemo(() => {
    const totals: Record<string, number> = {};
    months.forEach((month) => {
      Object.entries(month.byCategory).forEach(([id, value]) => {
        totals[id] = (totals[id] ?? 0) + value;
      });
    });
    return Object.entries(totals)
      .filter(([, total]) => total > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([id]) => id);
  }, [months]);

  const topPersons = useMemo(() => {
    const totals: Record<string, number> = {};
    months.forEach((month) => {
      Object.entries(month.byPerson).forEach(([id, value]) => {
        totals[id] = (totals[id] ?? 0) + value;
      });
    });
    return Object.entries(totals)
      .filter(([, total]) => total > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([id]) => id);
  }, [months]);

  const lines = useMemo(() => {
    if (mode === "total") {
      return [{ key: "total", label: "Total", values: months.map((month) => month.finalizadas), color: "#0f766e" }];
    }

    if (mode === "categoria") {
      const palette = ["#0f766e", "#2563eb", "#7c3aed", "#ea580c"];
      return topCategories.map((categoryId, index) => ({
        key: categoryId,
        label: categoryLabels[categoryId] ?? `Categoria ${categoryId}`,
        values: months.map((month) => month.byCategory[categoryId] ?? 0),
        color: palette[index % palette.length]
      }));
    }

    return topPersons.map((personId, index) => ({
      key: personId,
      label: persons.find((person) => person.userId === personId)?.userName ?? personId,
      values: months.map((month) => month.byPerson[personId] ?? 0),
      color: persons.find((person) => person.userId === personId)?.color ?? ["#0f766e", "#2563eb", "#7c3aed", "#ea580c"][index % 4]
    }));
  }, [mode, months, topCategories, topPersons, categoryLabels, persons]);

  const maxValue = Math.max(...lines.flatMap((line) => line.values), 1);

  return (
    <section aria-label="Evolucao temporal" className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-slate-900">Evolucao Temporal (ultimos 6 meses)</h2>
        <div className="flex items-center gap-2">
          <select
            value={mode}
            onChange={(event) => setMode(event.target.value as TemporalMode)}
            aria-label="Modo do grafico temporal"
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            <option value="total">Total</option>
            <option value="categoria">Por Categoria</option>
            <option value="pessoa">Por Pessoa</option>
          </select>
          <ChartDownloadButton months={months} periodLabel="dashboard" />
        </div>
      </div>

      <div className="mt-4 rounded-md border border-slate-200 p-3">
        <svg viewBox="0 0 700 280" className="h-[280px] w-full" role="img" aria-label="Grafico de linhas">
          <rect x="0" y="0" width="700" height="280" fill="#ffffff" />

          {[0, 3].map((index) => (
            <line
              key={index}
              x1={index * 116.7}
              y1="0"
              x2={index * 116.7}
              y2="230"
              stroke="#e2e8f0"
              strokeDasharray="4 4"
            />
          ))}

          {lines.map((line) => (
            <path
              key={line.key}
              d={linePath(line.values, 650, 210, maxValue)}
              transform="translate(25,10)"
              fill="none"
              stroke={line.color}
              strokeWidth="3"
              strokeLinecap="round"
            />
          ))}

          {months.map((month, index) => (
            <text
              key={month.month}
              x={25 + (index / Math.max(months.length - 1, 1)) * 650}
              y="255"
              textAnchor="middle"
              className="fill-slate-500 text-[11px]"
            >
              {month.label}
            </text>
          ))}
        </svg>
      </div>

      <ul className="mt-3 flex flex-wrap gap-3 text-xs text-slate-600">
        {lines.map((line) => (
          <li key={line.key} className="inline-flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: line.color }} />
            {line.label}
          </li>
        ))}
      </ul>
    </section>
  );
}