import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { PersonTable } from "@/components/dashboard/person-table";

describe("PersonTable", () => {
  it("expands person tasks", async () => {
    const user = userEvent.setup();

    render(
      <PersonTable
        persons={[
          {
            userId: "3672522",
            userName: "Juliana",
            area: "Design",
            color: "#7c3aed",
            total: 1,
            finalizadas: 1,
            emAndamento: 0
          }
        ]}
        tasksByPerson={{
          "3672522": [
            {
              id: 99,
              title: "Design de banner",
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

    await user.click(screen.getByText("Juliana"));

    expect(screen.getByText("Design de banner")).toBeInTheDocument();
  });
});