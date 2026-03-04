import { generateSummaryLines } from "@/lib/natural-language";
import type { MetricsResponse } from "@/types/dashboard";
import { cn } from "@/lib/utils";

type NaturalLanguageSummaryProps = {
  data: MetricsResponse;
};

const TYPE_STYLES = {
  highlight: "border-l-primary bg-primary-light text-text",
  category: "border-l-info bg-info-light text-text",
  pgd: "border-l-success bg-success-light text-text",
  alert: "border-l-warning bg-warning-light text-text"
} as const;

const TYPE_LABELS = {
  highlight: "Resumo",
  category: "Destaque",
  pgd: "PGD",
  alert: "Atenção"
} as const;

export function NaturalLanguageSummary({ data }: NaturalLanguageSummaryProps) {
  const lines = generateSummaryLines(data);

  if (lines.length === 0) return null;

  return (
    <section
      aria-label="Resumo interpretativo do período"
      className="reveal reveal-delay-1 rounded-lg p-5 glass"
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-text-muted">
        Interpretação do período
      </p>
      <div className="flex flex-col gap-3">
        {lines.map((line, index) => (
          <div
            key={index}
            className={cn(
              "flex items-start gap-3 rounded-r border-l-4 px-4 py-3",
              TYPE_STYLES[line.type]
            )}
          >
            <span className="mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-xs font-semibold">
              {TYPE_LABELS[line.type]}
            </span>
            <p className="text-sm leading-relaxed">{line.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
