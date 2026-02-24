import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { KpiCard } from "@/components/dashboard/kpi-card";

describe("KpiCard", () => {
  it("renders trend and value", () => {
    render(
      <KpiCard
        id="total"
        label="Total de Tarefas"
        value={42}
        previousValue={30}
        trend="+40%"
        trendDirection="up"
      />
    );

    expect(screen.getByText("Total de Tarefas")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText(/\+40%/)).toBeInTheDocument();
  });
});