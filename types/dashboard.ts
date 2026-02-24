export type PeriodType = "mes" | "bimestre" | "trimestre";
export type AreaFilter = "Todas" | "Design" | "Libras" | "Audiovisual" | "Gestao";

export type DateRange = {
  startDate: string;
  endDate: string;
};

export type DashboardTaskItem = {
  id: number;
  title: string;
  categoryId: number;
  categoryName: string;
  userId: string;
  userName: string;
  area: AreaFilter | "Transversal" | "Uso controlado" | "Sem area";
  status: "finalizada" | "emAndamento" | "backlog";
  completedAt: string | null;
};

export type CategoryMetric = {
  categoryId: number;
  categoryName: string;
  total: number;
  finalizadas: number;
  emAndamento: number;
  backlog: number;
};

export type PersonMetric = {
  userId: string;
  userName: string;
  area: AreaFilter | "Sem area";
  color: string;
  total: number;
  finalizadas: number;
  emAndamento: number;
};

export type MonthlyMetric = {
  month: string;
  label: string;
  total: number;
  finalizadas: number;
  byCategory: Record<string, number>;
  byPerson: Record<string, number>;
};

export type KpiData = {
  id: "total" | "finalizadas" | "emAndamento" | "categoriasAtivas" | "entregasPgdCobertas";
  label: string;
  value: number | string;
  previousValue: number | null;
  trend: string;
  trendDirection: "up" | "down" | "neutral";
};

export type MetricsResponse = {
  period: PeriodType;
  area: AreaFilter;
  range: DateRange;
  categories: CategoryMetric[];
  persons: PersonMetric[];
  months: MonthlyMetric[];
  kpis: KpiData[];
  tasksByCategory: Record<string, DashboardTaskItem[]>;
  tasksByPerson: Record<string, DashboardTaskItem[]>;
  totalTasks: number;
};