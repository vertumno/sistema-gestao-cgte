import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { CategoryChart } from "@/components/dashboard/category-chart";

describe("CategoryChart", () => {
  it("renders accordion header and expands to show categories", async () => {
    const user = userEvent.setup();

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

    expect(screen.getByText("Tarefas Concluidas por Categoria")).toBeInTheDocument();
    expect(screen.getByText(/1 concluida/)).toBeInTheDocument();

    await user.click(screen.getByRole("button"));

    expect(screen.getByText("Comunicacao Visual")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });
});
