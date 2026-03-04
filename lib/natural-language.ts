import type { MetricsResponse, PeriodType } from "@/types/dashboard";

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export function formatPeriodLabel(
  period: PeriodType,
  range: { startDate: string; endDate: string }
): string {
  const start = new Date(range.startDate + "T00:00:00");
  const year = start.getFullYear();
  const month = MONTH_NAMES[start.getMonth()];

  if (period === "mes") return `${month} ${year}`;

  if (period === "bimestre") {
    const bimestre = Math.ceil((start.getMonth() + 1) / 2);
    return `${bimestre}º Bimestre ${year}`;
  }

  if (period === "trimestre") {
    const trimestre = Math.ceil((start.getMonth() + 1) / 3);
    return `${trimestre}º Trimestre ${year}`;
  }

  return `${month} ${year}`;
}

export function formatDateRange(range: { startDate: string; endDate: string }): string {
  const fmt = (d: Date) =>
    d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  const start = new Date(range.startDate + "T00:00:00");
  const end = new Date(range.endDate + "T00:00:00");
  return `${fmt(start)} – ${fmt(end)}`;
}

export type SummaryLine = {
  text: string;
  type: "highlight" | "category" | "pgd" | "alert";
};

export function generateSummaryLines(data: MetricsResponse): SummaryLine[] {
  const lines: SummaryLine[] = [];
  const { kpis, categories, period } = data;

  const periodLabel: Record<PeriodType, string> = {
    mes: "mês",
    bimestre: "bimestre",
    trimestre: "trimestre"
  };

  const finalizadasKpi = kpis.find((k) => k.id === "finalizadas");
  const totalKpi = kpis.find((k) => k.id === "total");
  const emAndamentoKpi = kpis.find((k) => k.id === "emAndamento");
  const pgdKpi = kpis.find((k) => k.id === "entregasPgdCobertas");

  // Line 1 — volume + trend
  if (finalizadasKpi && totalKpi) {
    const trend = finalizadasKpi.trendDirection;
    const trendText =
      trend === "up"
        ? `aceleração em relação ao período anterior (${finalizadasKpi.trend})`
        : trend === "down"
          ? `redução em relação ao período anterior (${finalizadasKpi.trend})`
          : "ritmo estável em relação ao período anterior";

    lines.push({
      text: `No ${periodLabel[period]}, a equipe finalizou ${finalizadasKpi.value} tarefas — ${trendText}.`,
      type: "highlight"
    });
  }

  // Line 2 — top category
  const sorted = [...categories].sort((a, b) => b.finalizadas - a.finalizadas);
  const topCategory = sorted[0];
  const finalizadasTotal = Number(finalizadasKpi?.value ?? 0);

  if (topCategory && topCategory.finalizadas > 0 && finalizadasTotal > 0) {
    const pct = Math.round((topCategory.finalizadas / finalizadasTotal) * 100);
    lines.push({
      text: `${topCategory.categoryName} concentrou o maior volume de entregas (${pct}% do total no ${periodLabel[period]}).`,
      type: "category"
    });
  }

  // Line 3 — PGD
  if (pgdKpi) {
    lines.push({
      text: `Cobertura do PGD no ${periodLabel[period]}: ${pgdKpi.value}.`,
      type: "pgd"
    });
  }

  // Line 4 — alert: tasks in progress stalled
  const emAndamento = Number(emAndamentoKpi?.value ?? 0);
  if (emAndamento > 5) {
    lines.push({
      text: `Há ${emAndamento} tarefas em andamento — verifique se alguma está bloqueada ou precisa de repriorização.`,
      type: "alert"
    });
  }

  return lines;
}
