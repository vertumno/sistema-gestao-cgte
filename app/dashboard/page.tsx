"use client";

import { useMemo } from "react";
import { AreaFilter } from "@/components/dashboard/area-filter";
import { CategoryChart } from "@/components/dashboard/category-chart";
import { CategoryTable } from "@/components/dashboard/category-table";
import { CsvImportCard } from "@/components/dashboard/csv-import-card";
import { KpiGrid } from "@/components/dashboard/kpi-grid";
import { NaturalLanguageSummary } from "@/components/dashboard/natural-language-summary";
import { PersonCardGrid } from "@/components/dashboard/person-card-grid";
import { TemporalContextHeader } from "@/components/dashboard/temporal-context-header";
import { TemporalChart } from "@/components/dashboard/temporal-chart";
import { useDashboardData } from "@/hooks/use-dashboard-data";

export default function DashboardPage() {
  const { data, loading, error, source, period, area, handleCsvImport } = useDashboardData();

  const categoryLabels = useMemo(
    () =>
      Object.fromEntries(
        (data?.categories ?? []).map((c) => [String(c.categoryId), c.categoryName])
      ),
    [data?.categories]
  );

  // --- Loading ---
  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-border bg-surface p-10">
        <div className="text-center">
          <div
            className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary"
            aria-hidden="true"
          />
          <p className="text-sm text-text-muted">Carregando dashboard…</p>
        </div>
      </div>
    );
  }

  // --- Error total (API indisponível) ---
  if (error || !data) {
    return (
      <section className="space-y-4">
        <div
          className="rounded-lg border border-danger bg-danger-light p-6 text-danger"
          role="alert"
        >
          <p className="font-semibold">Erro ao carregar dados</p>
          <p className="mt-1 text-sm">{error ?? "Erro inesperado."}</p>
        </div>
        <CsvImportCard period={period} area={area} onImportSuccess={handleCsvImport} />
      </section>
    );
  }

  // --- Empty (nenhuma tarefa no período) ---
  if (data.totalTasks === 0) {
    return (
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TemporalContextHeader range={data.range} />
          <AreaFilter />
        </div>
        <p className="rounded-lg border border-border bg-surface p-6 text-text-muted">
          Nenhuma tarefa encontrada para os filtros selecionados.
        </p>
        {source === "csv" && (
          <CsvImportCard period={period} area={area} onImportSuccess={handleCsvImport} />
        )}
      </section>
    );
  }

  // --- Dashboard principal ---
  return (
    <section className="space-y-6">

      {/* Cabeçalho temporal + filtro de área */}
      <div className="flex flex-wrap items-start gap-3">
        <div className="flex-1 min-w-0">
          <TemporalContextHeader range={data.range} />
        </div>
        <div className="shrink-0">
          <AreaFilter />
        </div>
      </div>

      {/* Aviso de dados via CSV */}
      {source === "csv" && (
        <div className="flex items-center gap-3 rounded-lg border border-info bg-info-light px-4 py-3 text-sm text-info">
          <span>Dados importados via CSV.</span>
          <CsvImportCard period={period} area={area} onImportSuccess={handleCsvImport} />
        </div>
      )}

      {/* Resumo interpretativo */}
      <NaturalLanguageSummary data={data} />

      {/* KPIs — só renderiza se houver dados */}
      {data.kpis.length > 0 && <KpiGrid kpis={data.kpis} />}

      {/* Categorias — só renderiza se houver categorias com tarefas */}
      {data.categories.length > 0 && (
        <>
          <CategoryChart categories={data.categories} />
          <CategoryTable
            categories={data.categories}
            tasksByCategory={data.tasksByCategory}
          />
        </>
      )}

      {/* Equipe — só renderiza se houver pessoas com tarefas */}
      {data.persons.length > 0 && (
        <PersonCardGrid
          persons={data.persons}
          tasksByPerson={data.tasksByPerson}
        />
      )}

      {/* Evolução temporal — só renderiza se houver histórico */}
      {data.months.length > 0 && (
        <TemporalChart
          months={data.months}
          categoryLabels={categoryLabels}
          persons={data.persons}
        />
      )}

    </section>
  );
}
