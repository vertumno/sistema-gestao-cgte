import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RankingCards } from "@/components/report/ranking-cards";

describe("RankingCards", () => {
  it("renders top 5 rankings", () => {
    render(
      <RankingCards
        annual={{
          summary: { ano: 2026, totalTarefas: 10, totalCategorias: 2, totalEntregas: 2 },
          byCategory: [],
          byPerson: [],
          byEntrega: [],
          topCategories: [{ name: "Cat A", count: 5, rank: 1 }],
          topEntregas: [{ name: "Entrega A", count: 4, rank: 1 }],
          resumoTexto: "Resumo"
        }}
      />
    );

    expect(screen.getByText("Top 5 Categorias")).toBeInTheDocument();
    expect(screen.getByText(/Cat A/)).toBeInTheDocument();
    expect(screen.getByText(/Entrega A/)).toBeInTheDocument();
  });
});