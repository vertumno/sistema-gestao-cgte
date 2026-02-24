import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { KpiCard } from "@/components/dashboard/kpi-card";

describe("KpiCard", () => {
  afterEach(() => {
    cleanup();
  });

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

  it("renders up arrow for positive trend", () => {
    render(
      <KpiCard id="total" label="Up" value={10} previousValue={5} trend="+100%" trendDirection="up" />
    );
    expect(screen.getByText(/\u2191/)).toBeInTheDocument();
  });

  it("renders down arrow for negative trend", () => {
    render(
      <KpiCard id="total" label="Down" value={3} previousValue={10} trend="-70%" trendDirection="down" />
    );
    expect(screen.getByText(/\u2193/)).toBeInTheDocument();
  });

  it("renders right arrow for neutral trend", () => {
    render(
      <KpiCard id="total" label="Neutral" value={5} previousValue={5} trend="0%" trendDirection="neutral" />
    );
    expect(screen.getByText(/\u2192/)).toBeInTheDocument();
  });
});
