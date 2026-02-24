"use client";

import { useEffect, useMemo, useState } from "react";
import { AnnualSummaryCard } from "@/components/report/annual-summary-card";
import { AnnualTables } from "@/components/report/annual-tables";
import { CopyAllButton } from "@/components/report/copy-all-button";
import { ExportButton } from "@/components/report/export-button";
import { PgdEntregaList } from "@/components/report/pgd-entrega-list";
import { RankingCards } from "@/components/report/ranking-cards";
import { ServerSelector } from "@/components/report/server-selector";
import { TrimesterSelector } from "@/components/report/trimester-selector";
import { YearSelector } from "@/components/report/year-selector";
import { generateCsv } from "@/lib/csv-exporter";
import { getTrimesterSlug } from "@/lib/pgd-periods";
import { formatAnnualAsPlainText, formatReportAsPlainText } from "@/lib/report-formatter";
import { useReportStore } from "@/stores/report-store";
import type { AnnualReportResponse, PgdReportResponse } from "@/types/report";

export function ReportPageClient() {
  const trimestre = useReportStore((state) => state.trimestre);
  const servidorId = useReportStore((state) => state.servidorId);
  const ano = useReportStore((state) => state.ano);

  const [report, setReport] = useState<PgdReportResponse | null>(null);
  const [annual, setAnnual] = useState<AnnualReportResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      setLoading(true);
      setError(null);

      try {
        const [reportResponse, annualResponse] = await Promise.all([
          fetch(`/api/report-pgd?trimestre=${encodeURIComponent(trimestre)}&servidor=${encodeURIComponent(servidorId)}`),
          fetch(`/api/report-pgd?view=anual&ano=${ano}`)
        ]);

        if (!reportResponse.ok || !annualResponse.ok) {
          throw new Error("Falha ao carregar relatorio.");
        }

        const reportPayload = (await reportResponse.json()) as PgdReportResponse;
        const annualPayload = (await annualResponse.json()) as AnnualReportResponse;

        if (mounted) {
          setReport(reportPayload);
          setAnnual(annualPayload);
        }
      } catch {
        if (mounted) {
          setError("Nao foi possivel processar os dados do relatorio PGD.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, [trimestre, servidorId, ano]);

  const fullText = useMemo(() => {
    if (!report) return "";
    return formatReportAsPlainText({
      trimestre: report.trimestre,
      servidor: report.servidor,
      entregas: report.entregas
    });
  }, [report]);

  const annualText = useMemo(() => (annual ? formatAnnualAsPlainText(annual) : ""), [annual]);

  const annualCsv = useMemo(() => {
    if (!annual) return "";

    return generateCsv([
      {
        title: "Categoria",
        rows: annual.byCategory.map((item) => ({ Categoria: item.categoryName, Quantidade: item.count }))
      },
      {
        title: "Pessoa",
        rows: annual.byPerson.map((item) => ({ Pessoa: item.userName, Quantidade: item.count }))
      },
      {
        title: "Entrega PGD",
        rows: annual.byEntrega.map((item) => ({ Entrega: item.entregaNome, Quantidade: item.count }))
      }
    ]);
  }, [annual]);

  if (loading) {
    return (
      <section className="space-y-4">
        <div className="h-20 animate-pulse rounded-lg bg-slate-200" />
        <div className="h-44 animate-pulse rounded-lg bg-slate-200" />
        <div className="h-44 animate-pulse rounded-lg bg-slate-200" />
      </section>
    );
  }

  if (error || !report || !annual) {
    return (
      <section className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-700">
        <p>{error ?? "Erro ao carregar relatorio."}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-3 rounded-md border border-red-300 px-3 py-2 text-sm"
        >
          Tentar novamente
        </button>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <header className="rounded-lg border border-slate-200 bg-white p-4">
        <h1 className="text-xl font-semibold text-slate-900">Relatorio PGD</h1>
        <p className="mt-1 text-sm text-slate-600">
          Gere o texto trimestral para o Petrvs e acompanhe os dados anuais consolidados.
        </p>
      </header>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center gap-3">
          <TrimesterSelector />
          <ServerSelector />
          <CopyAllButton text={fullText} />
          <ExportButton
            filename={`relatorio-pgd-${getTrimesterSlug(report.trimestre)}-${servidorId}.txt`}
            content={fullText}
            label="Exportar .txt"
          />
        </div>
      </section>

      <PgdEntregaList entregas={report.entregas} />

      <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">Dados Anuais - O Setor em Numeros</h2>
          <div className="flex flex-wrap items-center gap-2">
            <YearSelector />
            <ExportButton
              filename={`cgte-dados-anuais-${ano}.txt`}
              content={annualText}
              label="Exportar como Texto"
            />
            <ExportButton
              filename={`cgte-dados-anuais-${ano}.csv`}
              content={annualCsv}
              label="Exportar como CSV"
            />
          </div>
        </div>

        <AnnualSummaryCard resumoTexto={annual.resumoTexto} />
        <RankingCards annual={annual} />
        <AnnualTables annual={annual} />
      </section>
    </section>
  );
}