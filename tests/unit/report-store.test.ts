import { beforeEach, describe, expect, it } from "vitest";
import { useReportStore } from "@/stores/report-store";

describe("report-store", () => {
  beforeEach(() => {
    useReportStore.setState({
      trimestre: "Mar-Mai/2026",
      servidorId: "todos",
      ano: 2026
    });
  });

  it("updates trimestre and servidor", () => {
    useReportStore.getState().setTrimestre("Jun-Ago/2026");
    useReportStore.getState().setServidor("3672522");

    expect(useReportStore.getState().trimestre).toBe("Jun-Ago/2026");
    expect(useReportStore.getState().servidorId).toBe("3672522");
  });

  it("updates ano", () => {
    useReportStore.getState().setAno(2025);
    expect(useReportStore.getState().ano).toBe(2025);
  });
});