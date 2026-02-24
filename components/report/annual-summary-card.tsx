"use client";

import { CopyButton } from "@/components/report/copy-button";

type AnnualSummaryCardProps = {
  resumoTexto: string;
};

export function AnnualSummaryCard({ resumoTexto }: AnnualSummaryCardProps) {
  return (
    <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-emerald-900">Resumo Anual</h3>
          <p className="mt-2 text-sm text-emerald-900">{resumoTexto}</p>
        </div>
        <CopyButton text={resumoTexto} label="Copiar resumo anual" />
      </div>
    </section>
  );
}