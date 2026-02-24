import { describe, expect, it } from "vitest";
import { formatReportAsPlainText } from "@/lib/report-formatter";

describe("report-formatter", () => {
  it("formats plain text without markdown", () => {
    const text = formatReportAsPlainText({
      trimestre: "Mar-Mai/2026",
      servidor: "Todos",
      entregas: [
        {
          entregaId: "a",
          entregaNome: "Entrega A",
          tasks: [],
          summaryText: "1 atividade realizada em Entrega A: Task 1",
          empty: false
        },
        {
          entregaId: "b",
          entregaNome: "Entrega B",
          tasks: [],
          summaryText: null,
          empty: true
        }
      ]
    });

    expect(text).toContain("RELATORIO PGD - Mar-Mai/2026");
    expect(text).toContain("Entrega: Entrega A");
    expect(text).toContain("Sem atividades registradas");
    expect(text).not.toContain("<");
  });
});