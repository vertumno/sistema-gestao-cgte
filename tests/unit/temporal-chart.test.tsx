import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { TemporalChart } from "@/components/dashboard/temporal-chart";

describe("TemporalChart", () => {
  it("allows switching chart mode", async () => {
    const user = userEvent.setup();

    render(
      <TemporalChart
        months={[
          {
            month: "2026-01",
            label: "jan/26",
            total: 1,
            finalizadas: 1,
            byCategory: { "1": 1 },
            byPerson: { "3672522": 1 }
          },
          {
            month: "2026-02",
            label: "fev/26",
            total: 2,
            finalizadas: 2,
            byCategory: { "1": 2 },
            byPerson: { "3672522": 2 }
          }
        ]}
        categoryLabels={{ "1": "Comunicacao Visual" }}
        persons={[
          {
            userId: "3672522",
            userName: "Juliana",
            area: "Design",
            color: "#7c3aed",
            total: 3,
            finalizadas: 3,
            emAndamento: 0
          }
        ]}
      />
    );

    await user.selectOptions(screen.getByLabelText("Modo do grafico temporal"), "categoria");

    expect(screen.getByText("Comunicacao Visual")).toBeInTheDocument();
  });
});