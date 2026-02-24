import { describe, expect, it } from "vitest";
import { generateCsv } from "@/lib/csv-exporter";

describe("csv-exporter", () => {
  it("generates utf8 bom csv", () => {
    const csv = generateCsv([
      {
        title: "Categoria",
        rows: [{ Categoria: "Comunicacao", Quantidade: 2 }]
      }
    ]);

    expect(csv.charCodeAt(0)).toBe(65279);
    expect(csv).toContain("Categoria");
    expect(csv).toContain("\"Comunicacao\"");
  });
});