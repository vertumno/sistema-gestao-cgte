"use client";

import type { MonthlyMetric } from "@/types/dashboard";

type ChartDownloadButtonProps = {
  months: MonthlyMetric[];
  periodLabel: string;
};

export function ChartDownloadButton({ months, periodLabel }: ChartDownloadButtonProps) {
  function handleDownload() {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 600;
    const context = canvas.getContext("2d");
    if (!context) return;

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "#0f172a";
    context.font = "bold 28px Arial";
    context.fillText("Evolucao de Tarefas Finalizadas", 40, 50);

    context.font = "18px Arial";
    context.fillStyle = "#475569";
    context.fillText(`Periodo: ${periodLabel}`, 40, 82);

    const max = Math.max(...months.map((item) => item.finalizadas), 1);
    const chartLeft = 80;
    const chartTop = 120;
    const chartWidth = 1040;
    const chartHeight = 380;

    context.strokeStyle = "#cbd5e1";
    context.lineWidth = 1;
    context.strokeRect(chartLeft, chartTop, chartWidth, chartHeight);

    const points = months.map((month, index) => ({
      x: chartLeft + (index / Math.max(months.length - 1, 1)) * chartWidth,
      y: chartTop + chartHeight - (month.finalizadas / max) * chartHeight,
      label: month.label,
      value: month.finalizadas
    }));

    context.strokeStyle = "#0f766e";
    context.lineWidth = 3;
    context.beginPath();
    points.forEach((point, index) => {
      if (index === 0) context.moveTo(point.x, point.y);
      else context.lineTo(point.x, point.y);
    });
    context.stroke();

    points.forEach((point) => {
      context.fillStyle = "#0f766e";
      context.beginPath();
      context.arc(point.x, point.y, 5, 0, Math.PI * 2);
      context.fill();

      context.fillStyle = "#334155";
      context.font = "14px Arial";
      context.fillText(point.label, point.x - 20, chartTop + chartHeight + 24);
      context.fillText(String(point.value), point.x - 8, point.y - 10);
    });

    const link = document.createElement("a");
    link.download = `cgte-evolucao-${periodLabel.toLowerCase()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      aria-label="Baixar grafico em PNG"
      className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
    >
      Baixar PNG
    </button>
  );
}