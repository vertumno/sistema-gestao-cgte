"use client";

import { useEffect, useMemo, useState } from "react";
import { AreaFilter } from "@/components/dashboard/area-filter";
import { CategoryChart } from "@/components/dashboard/category-chart";
import { CategoryTable } from "@/components/dashboard/category-table";
import { CsvImportCard } from "@/components/dashboard/csv-import-card";
import { KpiGrid } from "@/components/dashboard/kpi-grid";
import { PeriodSelector } from "@/components/dashboard/period-selector";
import { PersonChart } from "@/components/dashboard/person-chart";
import { PersonTable } from "@/components/dashboard/person-table";
import { TemporalChart } from "@/components/dashboard/temporal-chart";
import { useDashboardStore } from "@/stores/dashboard-store";
import type { MetricsResponse } from "@/types/dashboard";

export default function DashboardPage() {
  const period = useDashboardStore((state) => state.period);
  const area = useDashboardStore((state) => state.area);

  const [data, setData] = useState<MetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadMetrics() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/metrics?period=${period}&area=${encodeURIComponent(area)}`);
        if (!response.ok) {
          throw new Error("Falha ao carregar metricas.");
        }
        const payload = (await response.json()) as MetricsResponse;
        if (mounted) {
          setData(payload);
        }
      } catch {
        if (mounted) {
          setError("Nao foi possivel carregar os dados do dashboard.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadMetrics();
    return () => {
      mounted = false;
    };
  }, [period, area]);

  const categoryLabels = useMemo(
    () =>
      Object.fromEntries(
        (data?.categories ?? []).map((category) => [String(category.categoryId), category.categoryName])
      ),
    [data?.categories]
  );

  if (loading) {
    return <p className="rounded-lg border border-slate-200 bg-white p-6 text-slate-700">Carregando dashboard...</p>;
  }

  if (error || !data) {
    return (
      <section className="space-y-4">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700" role="alert">
          <p className="font-semibold">Erro ao carregar dados</p>
          <p className="text-sm mt-1">{error ?? "Erro inesperado."}</p>
        </div>
        <CsvImportCard />
      </section>
    );
  }

  if (data.totalTasks === 0) {
    return (
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <PeriodSelector />
          <AreaFilter />
        </div>
        <p className="rounded-lg border border-slate-200 bg-white p-6 text-slate-700">
          Nenhuma tarefa encontrada para os filtros selecionados.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PeriodSelector />
        <AreaFilter />
      </div>

      <KpiGrid kpis={data.kpis} />

      <CategoryChart categories={data.categories} />
      <CategoryTable categories={data.categories} tasksByCategory={data.tasksByCategory} />

      <PersonChart persons={data.persons} />
      <PersonTable persons={data.persons} tasksByPerson={data.tasksByPerson} />

      <TemporalChart months={data.months} categoryLabels={categoryLabels} persons={data.persons} />
    </section>
  );
}