import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PersonChart } from "@/components/dashboard/person-chart";

describe("PersonChart", () => {
  it("renders person rows", () => {
    render(
      <PersonChart
        persons={[
          {
            userId: "3672522",
            userName: "Juliana",
            area: "Design",
            color: "#7c3aed",
            total: 2,
            finalizadas: 1,
            emAndamento: 1
          }
        ]}
      />
    );

    expect(screen.getByText("Juliana")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });
});