import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { TrimesterSelector } from "@/components/report/trimester-selector";
import { useReportStore } from "@/stores/report-store";

describe("TrimesterSelector", () => {
  beforeEach(() => {
    useReportStore.setState({ trimestre: "Mar-Mai/2026", servidorId: "todos", ano: 2026 });
  });

  it("changes trimester", async () => {
    const user = userEvent.setup();
    render(<TrimesterSelector />);

    await user.selectOptions(screen.getByLabelText("Selecionar trimestre"), "Jun-Ago/2026");

    expect(useReportStore.getState().trimestre).toBe("Jun-Ago/2026");
  });
});