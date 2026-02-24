import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { KpiGrid } from "@/components/dashboard/kpi-grid";

describe("KpiGrid", () => {
  it("renders five KPI cards", () => {
    render(
      <KpiGrid
        kpis={[
          { id: "total", label: "Total", value: 1, previousValue: 1, trend: "0%", trendDirection: "neutral" },
          { id: "finalizadas", label: "Finalizadas", value: 1, previousValue: 1, trend: "0%", trendDirection: "neutral" },
          { id: "emAndamento", label: "Em andamento", value: 1, previousValue: 1, trend: "0%", trendDirection: "neutral" },
          { id: "categoriasAtivas", label: "Categorias", value: 1, previousValue: 1, trend: "0%", trendDirection: "neutral" },
          { id: "entregasPgdCobertas", label: "Entregas", value: 1, previousValue: 1, trend: "0%", trendDirection: "neutral" }
        ]}
      />
    );

    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("Finalizadas")).toBeInTheDocument();
    expect(screen.getByText("Em andamento")).toBeInTheDocument();
    expect(screen.getByText("Categorias")).toBeInTheDocument();
    expect(screen.getByText("Entregas")).toBeInTheDocument();
  });
});