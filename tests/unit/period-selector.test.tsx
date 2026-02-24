import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { PeriodSelector } from "@/components/dashboard/period-selector";
import { useDashboardStore } from "@/stores/dashboard-store";

describe("PeriodSelector", () => {
  beforeEach(() => {
    useDashboardStore.setState({ period: "trimestre", area: "Todas" });
  });

  it("changes period in store", async () => {
    const user = userEvent.setup();
    render(<PeriodSelector />);

    await user.click(screen.getByRole("button", { name: "Selecionar periodo Mes" }));

    expect(useDashboardStore.getState().period).toBe("mes");
  });
});