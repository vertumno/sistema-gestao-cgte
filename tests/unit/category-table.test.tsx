import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { CategoryTable } from "@/components/dashboard/category-table";

describe("CategoryTable", () => {
  it("expands row when clicking a category", async () => {
    const user = userEvent.setup();

    render(
      <CategoryTable
        categories={[
          {
            categoryId: 1,
            categoryName: "Comunicacao Visual",
            total: 1,
            finalizadas: 1,
            emAndamento: 0,
            backlog: 0
          }
        ]}
        tasksByCategory={{
          "1": [
            {
              id: 101,
              title: "Card 1",
              categoryId: 1,
              categoryName: "Comunicacao Visual",
              userId: "3672522",
              userName: "Juliana",
              area: "Design",
              status: "finalizada",
              columnName: "Finalizado",
              completedAt: new Date().toISOString()
            }
          ]
        }}
      />
    );

    await user.click(screen.getByText("Comunicacao Visual"));

    expect(screen.getByText("Card 1")).toBeInTheDocument();
  });
});