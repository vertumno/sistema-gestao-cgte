import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AnnualTables } from "@/components/report/annual-tables";

describe("AnnualTables", () => {
  it("renders annual sections", () => {
    render(
      <AnnualTables
        annual={{
          summary: { ano: 2026, totalTarefas: 10, totalCategorias: 2, totalEntregas: 2 },
          byCategory: [{ categoryName: "Cat A", count: 5 }],
          byPerson: [{ userName: "Juliana", count: 5 }],
          byEntrega: [{ entregaNome: "Entrega A", count: 5 }],
          topCategories: [{ name: "Cat A", count: 5, rank: 1 }],
          topEntregas: [{ name: "Entrega A", count: 5, rank: 1 }],
          resumoTexto: "Resumo"
        }}
      />
    );

    expect(screen.getByText("Por Categoria")).toBeInTheDocument();
    expect(screen.getByText("Cat A")).toBeInTheDocument();
    expect(screen.getByText("Juliana")).toBeInTheDocument();
  });
});