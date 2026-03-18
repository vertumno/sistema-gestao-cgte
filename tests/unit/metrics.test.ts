import { describe, expect, it } from "vitest";
import taxonomy from "@/config/taxonomy.json";
import teamMembers from "@/config/team-members.json";
import {
  aggregateByPerson,
  buildMetricsResponse,
  buildTaskItems,
  filterByArea,
  filterByPeriod,
  getLastNMonths,
  getPeriodRange,
  getPreviousPeriodRange
} from "@/lib/metrics";
import type { TeamMember } from "@/lib/metrics";
import type { KanboardTask } from "@/types/kanboard";
import type { TaxonomyConfig } from "@/types/kanboard";

function toUnix(date: string): number {
  return Math.floor(new Date(date).getTime() / 1000);
}

describe("metrics", () => {
  it("calculates current and previous period ranges", () => {
    const now = new Date("2026-04-15T12:00:00Z");

    expect(getPeriodRange("trimestre", now)).toEqual({ startDate: "2026-03-01", endDate: "2026-05-31" });
    expect(getPreviousPeriodRange("trimestre", now)).toEqual({ startDate: "2025-12-01", endDate: "2026-02-28" });
    expect(getLastNMonths(6, now)).toHaveLength(6);
  });

  it("aggregates categories with zero values for empty categories", () => {
    const tasks: KanboardTask[] = [
      {
        id: 1,
        title: "Tarefa Design Finalizada",
        category_id: 151,
        owner_id: "3672522",
        column_name: "Finalizado",
        date_completed: toUnix("2026-04-10")
      },
      {
        id: 2,
        title: "Tarefa Libras Em andamento",
        category_id: 162,
        owner_id: "1163935",
        column_name: "Em andamento",
        date_modification: toUnix("2026-04-11")
      }
    ];

    const categories = taxonomy.categorias.map((category) => ({ id: category.categoryId, name: category.categoryName }));
    const result = buildMetricsResponse({
      tasks,
      categories,
      taxonomy: taxonomy as TaxonomyConfig,
      teamMembers: teamMembers as TeamMember[],
      period: "trimestre",
      area: "Todas",
      now: new Date("2026-04-15T12:00:00Z")
    });

    expect(result.categories).toHaveLength(18);
    expect(result.categories.find((item) => item.categoryId === 151)?.finalizadas).toBe(1);
    expect(result.categories.find((item) => item.categoryId === 152)?.total).toBe(0);
    expect(result.persons.find((item) => item.userName === "Juliana")?.finalizadas).toBe(1);
    expect(result.kpis).toHaveLength(5);
  });

  it("aggregates by person with area filter", () => {
    const tasks: KanboardTask[] = [
      { id: 1, title: "Task Juliana", category_id: 151, owner_id: "3672522", column_name: "Finalizado", date_completed: toUnix("2026-04-10") },
      { id: 2, title: "Task Andreia", category_id: 162, owner_id: "1163935", column_name: "Finalizado", date_completed: toUnix("2026-04-11") },
      { id: 3, title: "Task Marcos", category_id: 166, owner_id: "marquito", column_name: "Em andamento", date_modification: toUnix("2026-04-12") }
    ];

    const categories = taxonomy.categorias.map((c) => ({ id: c.categoryId, name: c.categoryName }));
    const items = buildTaskItems(tasks, categories, taxonomy as TaxonomyConfig, teamMembers as TeamMember[]);
    const range = getPeriodRange("trimestre", new Date("2026-04-15T12:00:00Z"));
    const filtered = filterByPeriod(items, range);

    const allResult = aggregateByPerson(filtered, teamMembers as TeamMember[], "Todas");
    expect(allResult.persons.length).toBeGreaterThanOrEqual(3);
    expect(allResult.persons.find((p) => p.userName === "Juliana")?.finalizadas).toBe(1);
    expect(allResult.persons.find((p) => p.userName === "Marcos")?.emAndamento).toBe(1);

    const designResult = aggregateByPerson(filtered, teamMembers as TeamMember[], "Design");
    expect(designResult.persons).toHaveLength(1);
    expect(designResult.persons[0].userName).toBe("Juliana");
  });

  it("filters tasks by area", () => {
    const input = [
      { categoryId: 151, area: "Design" },
      { categoryId: 162, area: "Libras" }
    ] as const;

    const filtered = filterByArea(
      input.map((item, index) => ({
        id: index,
        title: "x",
        categoryId: item.categoryId,
        categoryName: "x",
        userId: "u",
        userName: "u",
        area: item.area,
        status: "backlog" as const,
        columnName: "Backlog",
        completedAt: new Date().toISOString()
      })),
      taxonomy as TaxonomyConfig,
      "Libras"
    );

    expect(filtered).toHaveLength(1);
    expect(filtered[0].categoryId).toBe(162);
  });
});
