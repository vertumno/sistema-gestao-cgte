import type { AnnualReportResponse, PgdEntrega } from "@/types/report";

export function formatReportAsPlainText(args: {
  trimestre: string;
  servidor: string;
  entregas: PgdEntrega[];
}): string {
  const header = `RELATORIO PGD - ${args.trimestre}\nServidor: ${args.servidor}`;

  const body = args.entregas
    .map((entrega) => {
      const text = entrega.summaryText ?? "Sem atividades registradas";
      return `Entrega: ${entrega.entregaNome}\n${text}`;
    })
    .join("\n\n");

  return `${header}\n\n${body}`.trim();
}

export function formatAnnualAsPlainText(report: AnnualReportResponse): string {
  const lines: string[] = [];
  lines.push(`DADOS ANUAIS CGTE - ${report.summary.ano}`);
  lines.push("");
  lines.push(report.resumoTexto);
  lines.push("");

  lines.push("Por Categoria:");
  report.byCategory.forEach((item) => lines.push(`- ${item.categoryName}: ${item.count}`));
  lines.push("");

  lines.push("Por Pessoa:");
  report.byPerson.forEach((item) => lines.push(`- ${item.userName}: ${item.count}`));
  lines.push("");

  lines.push("Por Entrega PGD:");
  report.byEntrega.forEach((item) => lines.push(`- ${item.entregaNome}: ${item.count}`));

  return lines.join("\n").trim();
}