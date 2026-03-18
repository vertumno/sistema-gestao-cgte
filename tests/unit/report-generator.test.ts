import { describe, expect, it } from "vitest";
import taxonomy from "@/config/taxonomy.json";
import { getTrimesterDates } from "@/lib/pgd-periods";
import { generatePgdReport } from "@/lib/report-generator";
import type { KanboardSubtask, KanboardTask, TaxonomyConfig } from "@/types/kanboard";

function toUnix(value: string): number {
  return Math.floor(new Date(value).getTime() / 1000);
}

describe("report-generator", () => {
  it("returns empty entregas for empty trimester", () => {
    const result = generatePgdReport({
      tasks: [],
      subtasks: [],
      taxonomy: taxonomy as TaxonomyConfig,
      trimestre: "Mar-Mai/2026"
    });

    expect(result).toHaveLength(29);
    expect(result.every((entrega) => entrega.empty)).toBe(true);
  });

  it("aggregates tasks and supports multiple entregas per category", () => {
    const tasks: KanboardTask[] = [
      {
        id: 1,
        title: "Atualizar MOOC",
        category_id: 156,
        owner_id: "3672522",
        column_name: "Finalizado",
        date_completed: toUnix("2026-04-10")
      }
    ];

    const subtasks: KanboardSubtask[] = [{ id: 10, title: "Sub", task_id: 1, status: 1 }];

    const result = generatePgdReport({
      tasks,
      subtasks,
      taxonomy: taxonomy as TaxonomyConfig,
      trimestre: "Mar-Mai/2026"
    });

    const moocEntregas = result.filter((item) => item.tasks.some((task) => task.id === 1));
    expect(moocEntregas.length).toBeGreaterThan(1);
    expect(moocEntregas[0].summaryText).toContain("1 atividade realizada");
    expect(moocEntregas[0].tasks[0].subtaskCompletedCount).toBe(1);
  });

  it("filters by server", () => {
    const tasks: KanboardTask[] = [
      {
        id: 1,
        title: "Task A",
        category_id: 151,
        owner_id: "3672522",
        column_name: "Finalizado",
        date_completed: toUnix("2026-04-10")
      },
      {
        id: 2,
        title: "Task B",
        category_id: 151,
        owner_id: "1163935",
        column_name: "Finalizado",
        date_completed: toUnix("2026-04-11")
      }
    ];

    const result = generatePgdReport({
      tasks,
      subtasks: [],
      taxonomy: taxonomy as TaxonomyConfig,
      trimestre: "Mar-Mai/2026",
      servidorId: "3672522"
    });

    const allTaskIds = result.flatMap((item) => item.tasks.map((task) => task.id));
    expect(allTaskIds).toContain(1);
    expect(allTaskIds).not.toContain(2);
  });

  it("calculates trimester dates", () => {
    const range = getTrimesterDates("Mar-Mai/2026");
    expect(range.startDate.getFullYear()).toBe(2026);
    expect(range.startDate.getMonth()).toBe(2);
    expect(range.startDate.getDate()).toBe(1);
    expect(range.endDate.getFullYear()).toBe(2026);
    expect(range.endDate.getMonth()).toBe(4);
    expect(range.endDate.getDate()).toBe(31);
  });
});