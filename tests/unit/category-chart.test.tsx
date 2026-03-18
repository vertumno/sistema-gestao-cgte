import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CategoryChart } from "@/components/dashboard/category-chart";

describe("CategoryChart", () => {
  it("renders category labels and values", () => {
    render(
      <CategoryChart
        categories={[
          {
            categoryId: 151,
            categoryName: "Comunicacao Visual",
            total: 2,
            finalizadas: 1,
            emAndamento: 1,
            backlog: 0
          }
        ]}
      />
    );

    expect(screen.getByText("Comunicacao Visual")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });
});