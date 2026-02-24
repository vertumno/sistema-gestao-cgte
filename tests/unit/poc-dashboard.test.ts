import { describe, expect, it } from "vitest";
import { buildPocDashboardData } from "@/lib/poc-dashboard";
import type { TaxonomyConfig } from "@/types/kanboard";

describe("buildPocDashboardData", () => {
  it("aggregates totals by column and category", () => {
    const tasks = [
      { id: 1, title: "T1", category_id: 1, column_name: "Backlog" },
      { id: 2, title: "T2", category_id: 1, column_name: "Finalizado" },
      { id: 3, title: "T3", category_id: 2, column_name: "Em andamento" }
    ];

    const taxonomy: TaxonomyConfig = {
      categorias: [
        { categoryId: 1, categoryName: "Comunicacao Visual", area: "Design", entregasPGD: ["a"] },
        {
          categoryId: 2,
          categoryName: "Programacao Visual Educacional",
          area: "Design",
          entregasPGD: ["b"]
        },
        { categoryId: 3, categoryName: "Conteudo Digital", area: "Transversal", entregasPGD: ["c"] },
        { categoryId: 4, categoryName: "Interface Digital", area: "Design", entregasPGD: ["d"] },
        { categoryId: 5, categoryName: "Formacao e Capacitacao", area: "Transversal", entregasPGD: ["e"] },
        { categoryId: 6, categoryName: "MOOC", area: "Design", entregasPGD: ["f"] },
        { categoryId: 7, categoryName: "Conteudo Educacional", area: "Transversal", entregasPGD: ["g"] },
        { categoryId: 8, categoryName: "Inteligencia Artificial", area: "Transversal", entregasPGD: ["h"] },
        { categoryId: 9, categoryName: "Producao Cientifica", area: "Transversal", entregasPGD: ["i"] },
        { categoryId: 10, categoryName: "Producao Audiovisual", area: "Audiovisual", entregasPGD: ["j"] },
        { categoryId: 11, categoryName: "Evento / Transmissao", area: "Audiovisual", entregasPGD: ["k"] },
        { categoryId: 12, categoryName: "Libras Traducao", area: "Libras", entregasPGD: ["l"] },
        { categoryId: 13, categoryName: "Libras Interpretacao", area: "Libras", entregasPGD: ["m"] },
        { categoryId: 14, categoryName: "Acessibilidade", area: "Libras", entregasPGD: ["n"] },
        { categoryId: 15, categoryName: "Comissao", area: "Transversal", entregasPGD: ["o"] },
        { categoryId: 16, categoryName: "Gestao / PGD", area: "Gestao", entregasPGD: ["p"] },
        { categoryId: 17, categoryName: "Colaboracao Institucional", area: "Transversal", entregasPGD: ["q"] },
        {
          categoryId: 18,
          categoryName: "Demanda Extraordinaria",
          area: "Uso controlado",
          entregasPGD: ["r"]
        }
      ]
    };

    const result = buildPocDashboardData(tasks, taxonomy);

    expect(result.totalTasks).toBe(3);
    expect(result.columns.find((column) => column.name === "Backlog")?.total).toBe(1);
    expect(result.columns.find((column) => column.name === "Finalizado")?.total).toBe(1);
    expect(result.categories.find((category) => category.categoryId === 1)?.total).toBe(2);
    expect(result.categories).toHaveLength(18);
  });
});
