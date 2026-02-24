import type { TeamMember } from "@/lib/metrics";
import { getTrimesterDates } from "@/lib/pgd-periods";
import type { KanboardSubtask, KanboardTask, TaxonomyConfig } from "@/types/kanboard";
import type { PgdEntrega, TaskSummary } from "@/types/report";

function parseNumber(value: number | string | undefined): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseDate(value: number | string | undefined): Date | null {
  const numeric = Number(value ?? 0);
  if (!Number.isFinite(numeric) || numeric <= 0) return null;
  const millis = numeric > 1_000_000_000_000 ? numeric : numeric * 1000;
  const date = new Date(millis);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isDoneSubtask(subtask: KanboardSubtask): boolean {
  const status = String(subtask.status ?? subtask.state ?? "").toLowerCase();
  return status === "2" || status === "1" || status === "done" || status === "closed";
}

function humanizeEntregaId(entregaId: string): string {
  return entregaId
    .split("-")
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : ""))
    .join(" ");
}

export function getCanonicalEntregas(taxonomy: TaxonomyConfig): { entregaId: string; entregaNome: string }[] {
  const unique = new Set<string>();

  for (const category of taxonomy.categorias) {
    for (const entrega of category.entregasPGD) {
      unique.add(entrega);
    }
  }

  return [...unique].slice(0, 29).map((entregaId) => ({
    entregaId,
    entregaNome: humanizeEntregaId(entregaId)
  }));
}

export function generateEntregaText(entregaNome: string, tasks: TaskSummary[]): string | null {
  if (tasks.length === 0) return null;

  const ordered = [...tasks].sort(
    (a, b) => new Date(a.dateCompleted).getTime() - new Date(b.dateCompleted).getTime()
  );

  const titles = ordered.map((task) =>
    task.subtaskCompletedCount > 0
      ? `${task.title} (com ${task.subtaskCompletedCount} subtarefas finalizadas)`
      : task.title
  );

  if (ordered.length === 1) {
    return `1 atividade realizada em ${entregaNome}: ${titles[0]}`;
  }

  return `${ordered.length} atividades realizadas em ${entregaNome}: ${titles.join(", ")}`;
}

export function generatePgdReport(args: {
  tasks: KanboardTask[];
  subtasks: KanboardSubtask[];
  taxonomy: TaxonomyConfig;
  trimestre: string;
  servidorId?: string;
}): PgdEntrega[] {
  const { tasks, subtasks, taxonomy, trimestre, servidorId } = args;
  const { startDate, endDate } = getTrimesterDates(trimestre);

  const categoryById = new Map(taxonomy.categorias.map((category) => [category.categoryId, category]));
  const subtasksByTaskId = new Map<number, number>();

  for (const subtask of subtasks) {
    if (!isDoneSubtask(subtask)) continue;
    const taskId = parseNumber(subtask.task_id);
    subtasksByTaskId.set(taskId, (subtasksByTaskId.get(taskId) ?? 0) + 1);
  }

  const filtered = tasks.filter((task) => {
    const completedAt = parseDate(task.date_completed);
    if (!completedAt || completedAt < startDate || completedAt > endDate) {
      return false;
    }

    const statusName = (task.column_name ?? "").toLowerCase();
    const finalByColumn = statusName.includes("finaliz") || parseNumber(task.column_id) === 4;
    if (!finalByColumn) return false;

    if (servidorId && servidorId !== "todos") {
      const owner = String(task.owner_id ?? task.assignee_id ?? "");
      return owner === servidorId;
    }

    return true;
  });

  const tasksByEntrega = new Map<string, TaskSummary[]>();

  for (const task of filtered) {
    const categoryId = parseNumber(task.category_id);
    const category = categoryById.get(categoryId);
    if (!category) continue;

    const completedAt = parseDate(task.date_completed);
    if (!completedAt) continue;

    const taskSummary: TaskSummary = {
      id: parseNumber(task.id),
      title: task.title,
      dateCompleted: completedAt.toISOString(),
      category: category.categoryName,
      subtaskCompletedCount: subtasksByTaskId.get(parseNumber(task.id)) ?? 0
    };

    category.entregasPGD.forEach((entregaId) => {
      const list = tasksByEntrega.get(entregaId) ?? [];
      list.push(taskSummary);
      tasksByEntrega.set(entregaId, list);
    });
  }

  const entregas = getCanonicalEntregas(taxonomy);

  return entregas.map((entrega) => {
    const entregaTasks = tasksByEntrega.get(entrega.entregaId) ?? [];
    const summaryText = generateEntregaText(entrega.entregaNome, entregaTasks);

    return {
      entregaId: entrega.entregaId,
      entregaNome: entrega.entregaNome,
      tasks: entregaTasks,
      summaryText,
      empty: entregaTasks.length === 0
    };
  });
}

export function resolveServidorNome(servidorId: string | undefined, teamMembers: TeamMember[]): string {
  if (!servidorId || servidorId === "todos") return "Todos";
  const member = teamMembers.find((item) => item.userId === servidorId);
  return member?.userName ?? servidorId;
}