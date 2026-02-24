import type { KanboardCategory, KanboardTask, TaxonomyConfig } from "@/types/kanboard";
import type {
  AreaFilter,
  CategoryMetric,
  DashboardTaskItem,
  DateRange,
  KpiData,
  MetricsResponse,
  MonthlyMetric,
  PeriodType,
  PersonMetric
} from "@/types/dashboard";

export type TeamMember = {
  userId: string;
  userName: string;
  area: Exclude<AreaFilter, "Todas">;
  color: string;
};

type MonthBucket = {
  key: string;
  label: string;
  start: Date;
  end: Date;
};

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function parseNumeric(value: number | string | undefined): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseUnixDate(value: number | string | undefined): Date | null {
  if (value === undefined || value === null) return null;
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) return null;
  const millis = numeric > 1_000_000_000_000 ? numeric : numeric * 1000;
  const date = new Date(millis);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseIsoDate(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
}

function endOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}

function startOfMonth(year: number, month: number): Date {
  return new Date(year, month, 1, 0, 0, 0, 0);
}

function endOfMonth(year: number, month: number): Date {
  return new Date(year, month + 1, 0, 23, 59, 59, 999);
}

function getPgdQuarterStart(now: Date): { year: number; month: number } {
  const month = now.getMonth();
  const year = now.getFullYear();

  if (month <= 1) {
    return { year: year - 1, month: 11 };
  }
  if (month <= 4) {
    return { year, month: 2 };
  }
  if (month <= 7) {
    return { year, month: 5 };
  }
  if (month <= 10) {
    return { year, month: 8 };
  }
  return { year, month: 11 };
}

function shiftMonth(year: number, month: number, offset: number): { year: number; month: number } {
  const base = new Date(year, month + offset, 1);
  return { year: base.getFullYear(), month: base.getMonth() };
}

function resolveStatus(task: KanboardTask): DashboardTaskItem["status"] {
  const normalizedColumn = normalizeText(task.column_name ?? "");
  const columnId = parseNumeric(task.column_id);

  if (normalizedColumn.includes("finalizado") || columnId === 4) {
    return "finalizada";
  }

  if (
    normalizedColumn.includes("andamento") ||
    normalizedColumn.includes("autorizado") ||
    columnId === 2 ||
    columnId === 3
  ) {
    return "emAndamento";
  }

  return "backlog";
}

function resolveTaskDate(task: KanboardTask): Date | null {
  const completed = parseUnixDate(task.date_completed);
  if (completed) return completed;

  const modified = parseUnixDate(task.date_modification);
  if (modified) return modified;

  return parseUnixDate(task.date_creation);
}

function isWithinRange(date: Date | null, range: DateRange): boolean {
  if (!date) return false;
  const start = startOfDay(parseIsoDate(range.startDate));
  const end = endOfDay(parseIsoDate(range.endDate));
  return date >= start && date <= end;
}

export function getPeriodRange(period: PeriodType, now: Date = new Date()): DateRange {
  const year = now.getFullYear();
  const month = now.getMonth();

  if (period === "mes") {
    return {
      startDate: formatIsoDate(startOfMonth(year, month)),
      endDate: formatIsoDate(endOfMonth(year, month))
    };
  }

  if (period === "bimestre") {
    const startMonth = month - (month % 2);
    return {
      startDate: formatIsoDate(startOfMonth(year, startMonth)),
      endDate: formatIsoDate(endOfMonth(year, startMonth + 1))
    };
  }

  const pgdQuarter = getPgdQuarterStart(now);
  return {
    startDate: formatIsoDate(startOfMonth(pgdQuarter.year, pgdQuarter.month)),
    endDate: formatIsoDate(endOfMonth(pgdQuarter.year, pgdQuarter.month + 2))
  };
}

export function getPreviousPeriodRange(period: PeriodType, now: Date = new Date()): DateRange {
  if (period === "mes") {
    const current = getPeriodRange(period, now);
    const start = parseIsoDate(current.startDate);
    const shifted = shiftMonth(start.getFullYear(), start.getMonth(), -1);
    return {
      startDate: formatIsoDate(startOfMonth(shifted.year, shifted.month)),
      endDate: formatIsoDate(endOfMonth(shifted.year, shifted.month))
    };
  }

  if (period === "bimestre") {
    const current = getPeriodRange(period, now);
    const start = parseIsoDate(current.startDate);
    const shifted = shiftMonth(start.getFullYear(), start.getMonth(), -2);
    return {
      startDate: formatIsoDate(startOfMonth(shifted.year, shifted.month)),
      endDate: formatIsoDate(endOfMonth(shifted.year, shifted.month + 1))
    };
  }

  const current = getPeriodRange(period, now);
  const start = parseIsoDate(current.startDate);
  const shifted = shiftMonth(start.getFullYear(), start.getMonth(), -3);
  return {
    startDate: formatIsoDate(startOfMonth(shifted.year, shifted.month)),
    endDate: formatIsoDate(endOfMonth(shifted.year, shifted.month + 2))
  };
}

export function getLastNMonths(n: number, now: Date = new Date()): MonthBucket[] {
  const buckets: MonthBucket[] = [];
  for (let i = n - 1; i >= 0; i -= 1) {
    const reference = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = reference.getFullYear();
    const month = reference.getMonth();
    buckets.push({
      key: `${year}-${String(month + 1).padStart(2, "0")}`,
      label: reference.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" }),
      start: startOfMonth(year, month),
      end: endOfMonth(year, month)
    });
  }
  return buckets;
}

function resolveMember(ownerRaw: number | string | undefined, membersById: Map<string, TeamMember>): TeamMember | null {
  if (ownerRaw === undefined || ownerRaw === null) return null;
  const ownerKey = String(ownerRaw).trim().toLowerCase();
  return membersById.get(ownerKey) ?? null;
}

export function buildTaskItems(
  tasks: KanboardTask[],
  categories: KanboardCategory[],
  taxonomy: TaxonomyConfig,
  teamMembers: TeamMember[]
): DashboardTaskItem[] {
  const taxonomyById = new Map(taxonomy.categorias.map((category) => [category.categoryId, category]));
  const categoryNameById = new Map(categories.map((category) => [parseNumeric(category.id), category.name]));
  const membersById = new Map(teamMembers.map((member) => [member.userId.toLowerCase(), member]));

  return tasks.map((task) => {
    const categoryId = parseNumeric(task.category_id);
    const taxonomyCategory = taxonomyById.get(categoryId);
    const categoryName =
      taxonomyCategory?.categoryName ?? categoryNameById.get(categoryId) ?? `Categoria ${categoryId || "N/A"}`;

    const member = resolveMember(task.owner_id ?? task.assignee_id, membersById);
    const status = resolveStatus(task);
    const date = status === "finalizada" ? parseUnixDate(task.date_completed) : resolveTaskDate(task);

    return {
      id: parseNumeric(task.id),
      title: task.title,
      categoryId,
      categoryName,
      userId: member?.userId ?? "sem-responsavel",
      userName: member?.userName ?? "Sem responsavel",
      area: (taxonomyCategory?.area ?? "Sem area") as DashboardTaskItem["area"],
      status,
      completedAt: date ? date.toISOString() : null
    };
  });
}

export function filterByPeriod(tasks: DashboardTaskItem[], range: DateRange): DashboardTaskItem[] {
  return tasks.filter((task) => {
    const date = task.completedAt ? new Date(task.completedAt) : null;
    return isWithinRange(date, range);
  });
}

export function filterByArea(
  tasks: DashboardTaskItem[],
  taxonomy: TaxonomyConfig,
  area: AreaFilter
): DashboardTaskItem[] {
  if (area === "Todas") return tasks;
  const allowedCategoryIds = new Set(
    taxonomy.categorias.filter((category) => category.area === area).map((category) => category.categoryId)
  );
  return tasks.filter((task) => allowedCategoryIds.has(task.categoryId));
}

export function aggregateByCategory(
  tasks: DashboardTaskItem[],
  taxonomy: TaxonomyConfig,
  area: AreaFilter
): { categories: CategoryMetric[]; tasksByCategory: Record<string, DashboardTaskItem[]> } {
  const tasksByCategory: Record<string, DashboardTaskItem[]> = {};

  const categories = taxonomy.categorias.map((category) => {
    const areaMatches = area === "Todas" || category.area === area;
    const scopedTasks = areaMatches
      ? tasks.filter((task) => task.categoryId === category.categoryId)
      : [];

    tasksByCategory[String(category.categoryId)] = scopedTasks.sort((a, b) =>
      a.title.localeCompare(b.title, "pt-BR")
    );

    return {
      categoryId: category.categoryId,
      categoryName: category.categoryName,
      total: scopedTasks.length,
      finalizadas: scopedTasks.filter((task) => task.status === "finalizada").length,
      emAndamento: scopedTasks.filter((task) => task.status === "emAndamento").length,
      backlog: scopedTasks.filter((task) => task.status === "backlog").length
    };
  });

  return { categories, tasksByCategory };
}

export function aggregateByPerson(
  tasks: DashboardTaskItem[],
  teamMembers: TeamMember[],
  area: AreaFilter
): { persons: PersonMetric[]; tasksByPerson: Record<string, DashboardTaskItem[]> } {
  const scopedMembers = teamMembers.filter((member) => area === "Todas" || member.area === area);
  const tasksByPerson: Record<string, DashboardTaskItem[]> = {};

  const persons: PersonMetric[] = scopedMembers.map((member) => {
    const memberTasks = tasks.filter((task) => task.userId.toLowerCase() === member.userId.toLowerCase());
    tasksByPerson[member.userId] = memberTasks.sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));

    return {
      userId: member.userId,
      userName: member.userName,
      area: member.area,
      color: member.color,
      total: memberTasks.length,
      finalizadas: memberTasks.filter((task) => task.status === "finalizada").length,
      emAndamento: memberTasks.filter((task) => task.status === "emAndamento").length
    };
  });

  return {
    persons: persons.sort((a, b) => b.finalizadas - a.finalizadas || a.userName.localeCompare(b.userName, "pt-BR")),
    tasksByPerson
  };
}

export function aggregateByMonth(
  tasks: DashboardTaskItem[],
  months: MonthBucket[],
  taxonomy: TaxonomyConfig,
  teamMembers: TeamMember[]
): MonthlyMetric[] {
  const categories = taxonomy.categorias;

  return months.map((bucket) => {
    const monthTasks = tasks.filter((task) => {
      if (task.status !== "finalizada" || !task.completedAt) return false;
      const date = new Date(task.completedAt);
      return date >= bucket.start && date <= bucket.end;
    });

    const byCategory = Object.fromEntries(categories.map((category) => [String(category.categoryId), 0]));
    const byPerson = Object.fromEntries(teamMembers.map((member) => [member.userId, 0]));

    for (const task of monthTasks) {
      byCategory[String(task.categoryId)] = (byCategory[String(task.categoryId)] ?? 0) + 1;
      byPerson[task.userId] = (byPerson[task.userId] ?? 0) + 1;
    }

    return {
      month: bucket.key,
      label: bucket.label,
      total: monthTasks.length,
      finalizadas: monthTasks.length,
      byCategory,
      byPerson
    };
  });
}

function buildTrend(current: number, previous: number): Pick<KpiData, "trend" | "trendDirection" | "previousValue"> {
  if (!Number.isFinite(previous) || previous < 0) {
    return { trend: "—", trendDirection: "neutral", previousValue: null };
  }

  if (previous === 0) {
    if (current === 0) {
      return { trend: "0%", trendDirection: "neutral", previousValue: 0 };
    }
    return { trend: "+100%", trendDirection: "up", previousValue: 0 };
  }

  const diff = ((current - previous) / previous) * 100;
  const rounded = Math.round(diff);
  if (rounded > 0) {
    return { trend: `+${rounded}%`, trendDirection: "up", previousValue: previous };
  }
  if (rounded < 0) {
    return { trend: `${rounded}%`, trendDirection: "down", previousValue: previous };
  }
  return { trend: "0%", trendDirection: "neutral", previousValue: previous };
}

function countCoveredEntregas(tasks: DashboardTaskItem[], taxonomy: TaxonomyConfig, area: AreaFilter): number {
  const taxonomyById = new Map(taxonomy.categorias.map((category) => [category.categoryId, category]));
  const entregas = new Set<string>();

  for (const task of tasks) {
    if (task.status !== "finalizada") continue;
    const category = taxonomyById.get(task.categoryId);
    if (!category) continue;
    if (area !== "Todas" && category.area !== area) continue;
    category.entregasPGD.forEach((entrega) => entregas.add(entrega));
  }

  return entregas.size;
}

export function calculateKpis(
  currentTasks: DashboardTaskItem[],
  previousTasks: DashboardTaskItem[],
  categoryMetrics: CategoryMetric[],
  taxonomy: TaxonomyConfig,
  area: AreaFilter
): KpiData[] {
  const currentTotal = currentTasks.length;
  const previousTotal = previousTasks.length;

  const currentFinalizadas = currentTasks.filter((task) => task.status === "finalizada").length;
  const previousFinalizadas = previousTasks.filter((task) => task.status === "finalizada").length;

  const currentEmAndamento = currentTasks.filter((task) => task.status === "emAndamento").length;
  const previousEmAndamento = previousTasks.filter((task) => task.status === "emAndamento").length;

  const currentCategoriasAtivas = categoryMetrics.filter((metric) => metric.total > 0).length;
  const previousCategoriasAtivas = (() => {
    const previousByCategory = aggregateByCategory(previousTasks, taxonomy, area);
    return previousByCategory.categories.filter((metric) => metric.total > 0).length;
  })();

  const currentEntregas = countCoveredEntregas(currentTasks, taxonomy, area);
  const previousEntregas = countCoveredEntregas(previousTasks, taxonomy, area);

  const finalizadasPct = currentTotal === 0 ? 0 : Math.round((currentFinalizadas / currentTotal) * 100);

  return [
    {
      id: "total",
      label: "Total de Tarefas",
      value: currentTotal,
      ...buildTrend(currentTotal, previousTotal)
    },
    {
      id: "finalizadas",
      label: "Finalizadas",
      value: `${currentFinalizadas} (${finalizadasPct}%)`,
      ...buildTrend(currentFinalizadas, previousFinalizadas)
    },
    {
      id: "emAndamento",
      label: "Em Andamento",
      value: currentEmAndamento,
      ...buildTrend(currentEmAndamento, previousEmAndamento)
    },
    {
      id: "categoriasAtivas",
      label: "Categorias Ativas",
      value: currentCategoriasAtivas,
      ...buildTrend(currentCategoriasAtivas, previousCategoriasAtivas)
    },
    {
      id: "entregasPgdCobertas",
      label: "Entregas PGD Cobertas",
      value: currentEntregas,
      ...buildTrend(currentEntregas, previousEntregas)
    }
  ];
}

export function buildMetricsResponse(args: {
  tasks: KanboardTask[];
  categories: KanboardCategory[];
  taxonomy: TaxonomyConfig;
  teamMembers: TeamMember[];
  period: PeriodType;
  area: AreaFilter;
  now?: Date;
}): MetricsResponse {
  const { tasks, categories, taxonomy, teamMembers, period, area } = args;
  const now = args.now ?? new Date();

  const currentRange = getPeriodRange(period, now);
  const previousRange = getPreviousPeriodRange(period, now);

  const allItems = buildTaskItems(tasks, categories, taxonomy, teamMembers);
  const currentPeriodTasks = filterByArea(filterByPeriod(allItems, currentRange), taxonomy, area);
  const previousPeriodTasks = filterByArea(filterByPeriod(allItems, previousRange), taxonomy, area);

  const { categories: categoryMetrics, tasksByCategory } = aggregateByCategory(currentPeriodTasks, taxonomy, area);
  const { persons, tasksByPerson } = aggregateByPerson(currentPeriodTasks, teamMembers, area);

  const months = aggregateByMonth(currentPeriodTasks, getLastNMonths(6, now), taxonomy, teamMembers);
  const kpis = calculateKpis(currentPeriodTasks, previousPeriodTasks, categoryMetrics, taxonomy, area);

  return {
    period,
    area,
    range: currentRange,
    categories: categoryMetrics,
    persons,
    months,
    kpis,
    tasksByCategory,
    tasksByPerson,
    totalTasks: currentPeriodTasks.length
  };
}
