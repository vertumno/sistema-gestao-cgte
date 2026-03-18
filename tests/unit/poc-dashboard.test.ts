import { describe, expect, it } from "vitest";
import { buildPocDashboardData } from "@/lib/poc-dashboard";
import type { TaxonomyConfig } from "@/types/kanboard";

describe("buildPocDashboardData", () => {
  it("aggregates totals by column and category", () => {
    const tasks = [
      { id: 1, title: "T1", category_id: 151, column_name: "Backlog" },
      { id: 2, title: "T2", category_id: 151, column_name: "Finalizado" },
      { id: 3, title: "T3", category_id: 152, column_name: "Em andamento" }
    ];

    const taxonomy: TaxonomyConfig = {
      categorias: [
        { categoryId: 151, categoryName: "Comunicacao Visual", area: "Design", entregasPGD: ["a"] },
        {
          categoryId: 152,
          categoryName: "Programacao Visual Educacional",
          area: "Design",
          entregasPGD: ["b"]
        },
        { categoryId: 153, categoryName: "Conteudo Digital", area: "Transversal", entregasPGD: ["c"] },
        { categoryId: 154, categoryName: "Interface Digital", area: "Design", entregasPGD: ["d"] },
        { categoryId: 155, categoryName: "Formacao e Capacitacao", area: "Transversal", entregasPGD: ["e"] },
        { categoryId: 156, categoryName: "MOOC", area: "Design", entregasPGD: ["f"] },
        { categoryId: 157, categoryName: "Conteudo Educacional", area: "Transversal", entregasPGD: ["g"] },
        { categoryId: 158, categoryName: "Inteligencia Artificial", area: "Transversal", entregasPGD: ["h"] },
        { categoryId: 159, categoryName: "Producao Cientifica", area: "Transversal", entregasPGD: ["i"] },
        { categoryId: 160, categoryName: "Producao Audiovisual", area: "Audiovisual", entregasPGD: ["j"] },
        { categoryId: 161, categoryName: "Evento / Transmissao", area: "Audiovisual", entregasPGD: ["k"] },
        { categoryId: 162, categoryName: "Libras Traducao", area: "Libras", entregasPGD: ["l"] },
        { categoryId: 163, categoryName: "Libras Interpretacao", area: "Libras", entregasPGD: ["m"] },
        { categoryId: 164, categoryName: "Acessibilidade", area: "Libras", entregasPGD: ["n"] },
        { categoryId: 165, categoryName: "Comissao", area: "Transversal", entregasPGD: ["o"] },
        { categoryId: 166, categoryName: "Gestao / PGD", area: "Gestao", entregasPGD: ["p"] },
        { categoryId: 59, categoryName: "Colaboracao Institucional", area: "Transversal", entregasPGD: ["q"] },
        {
          categoryId: 167,
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
    expect(result.categories.find((category) => category.categoryId === 151)?.total).toBe(2);
    expect(result.categories).toHaveLength(18);
  });
});
