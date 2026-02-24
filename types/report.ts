export type TaskSummary = {
  id: number;
  title: string;
  dateCompleted: string;
  category: string;
  subtaskCompletedCount: number;
};

export type PgdEntrega = {
  entregaId: string;
  entregaNome: string;
  tasks: TaskSummary[];
  summaryText: string | null;
  empty: boolean;
};

export type PgdReportResponse = {
  trimestre: string;
  servidor: string;
  entregas: PgdEntrega[];
};

export type AnnualSummary = {
  ano: number;
  totalTarefas: number;
  totalCategorias: number;
  totalEntregas: number;
};

export type AnnualByCategory = {
  categoryName: string;
  count: number;
};

export type AnnualByPerson = {
  userName: string;
  count: number;
};

export type AnnualByEntrega = {
  entregaNome: string;
  count: number;
};

export type RankingItem = {
  name: string;
  count: number;
  rank: number;
};

export type AnnualReportResponse = {
  summary: AnnualSummary;
  byCategory: AnnualByCategory[];
  byPerson: AnnualByPerson[];
  byEntrega: AnnualByEntrega[];
  topCategories: RankingItem[];
  topEntregas: RankingItem[];
  resumoTexto: string;
};