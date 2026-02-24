import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { PgdEntregaList } from "@/components/report/pgd-entrega-list";

describe("PgdEntregaList", () => {
  it("renders empty and filled entregas", async () => {
    const user = userEvent.setup();

    render(
      <PgdEntregaList
        entregas={[
          {
            entregaId: "a",
            entregaNome: "Entrega A",
            tasks: [
              {
                id: 1,
                title: "Task 1",
                dateCompleted: new Date().toISOString(),
                category: "Cat",
                subtaskCompletedCount: 0
              }
            ],
            summaryText: "1 atividade realizada em Entrega A: Task 1",
            empty: false
          },
          {
            entregaId: "b",
            entregaNome: "Entrega B",
            tasks: [],
            summaryText: null,
            empty: true
          }
        ]}
      />
    );

    expect(screen.getByText("Entrega A")).toBeInTheDocument();
    expect(screen.getByText("Sem atividades registradas")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Expandir tarefas da entrega Entrega A/ }));
    expect(screen.getByText(/Task 1 - Cat/)).toBeInTheDocument();
  });
});