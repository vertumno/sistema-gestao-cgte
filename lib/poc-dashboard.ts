import { KanboardClient } from "@/lib/kanboard-client";
import { getTaxonomy } from "@/lib/taxonomy";
import type { KanboardTask } from "@/types/kanboard";

const COLUMN_NAMES = ["Backlog", "Autorizado", "Em andamento", "Finalizado", "Congelado"] as const;

type ColumnSummary = {
  name: (typeof COLUMN_NAMES)[number];
  total: number;
};

type CategorySummary = {
  categoryId: number;
  categoryName: string;
  total: number;
};

export type PocDashboardData = {
  totalTasks: number;
  columns: ColumnSummary[];
  categories: CategorySummary[];
};

function normalize(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function resolveColumnName(task: KanboardTask): (typeof COLUMN_NAMES)[number] | undefined {
  if (task.column_name) {
    const normalized = normalize(task.column_name);
    if (normalized.includes("backlog")) return "Backlog";
    if (normalized.includes("autorizado")) return "Autorizado";
    if (normalized.includes("andamento")) return "Em andamento";
    if (normalized.includes("finalizado")) return "Finalizado";
    if (normalized.includes("congelado")) return "Congelado";
  }

  const byIndex = Number(task.column_id);
  if (Number.isInteger(byIndex) && byIndex >= 1 && byIndex <= 5) {
    return COLUMN_NAMES[byIndex - 1];
  }

  return undefined;
}

export function buildPocDashboardData(tasks: KanboardTask[], taxonomy: Awaited<ReturnType<typeof getTaxonomy>>): PocDashboardData {
  const columnsMap = new Map<(typeof COLUMN_NAMES)[number], number>(
    COLUMN_NAMES.map((name) => [name, 0])
  );

  const categoriesMap = new Map<number, CategorySummary>(
    taxonomy.categorias.map((category) => [
      category.categoryId,
      {
        categoryId: category.categoryId,
        categoryName: category.categoryName,
        total: 0
      }
    ])
  );

  for (const task of tasks) {
    const column = resolveColumnName(task);
    if (column) {
      columnsMap.set(column, (columnsMap.get(column) ?? 0) + 1);
    }

    const categoryId = Number(task.category_id);
    if (categoriesMap.has(categoryId)) {
      const previous = categoriesMap.get(categoryId)!;
      categoriesMap.set(categoryId, {
        ...previous,
        total: previous.total + 1
      });
    }
  }

  return {
    totalTasks: tasks.length,
    columns: COLUMN_NAMES.map((name) => ({
      name,
      total: columnsMap.get(name) ?? 0
    })),
    categories: taxonomy.categorias.map((category) => categoriesMap.get(category.categoryId)!)
  };
}

export async function getPocDashboardData(): Promise<PocDashboardData> {
  const client = new KanboardClient();
  const [tasks, taxonomy] = await Promise.all([client.getAllTasks(), getTaxonomy()]);
  return buildPocDashboardData(tasks, taxonomy);
}
