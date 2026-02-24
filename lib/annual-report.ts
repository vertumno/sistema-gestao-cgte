import { getCanonicalEntregas } from "@/lib/report-generator";
import type { TeamMember } from "@/lib/metrics";
import type { KanboardTask, TaxonomyConfig } from "@/types/kanboard";
import type {
  AnnualByCategory,
  AnnualByEntrega,
  AnnualByPerson,
  AnnualReportResponse,
  RankingItem
} from "@/types/report";

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

function getAnnualPgdRange(ano: number): { startDate: Date; endDate: Date } {
  return {
    startDate: new Date(ano - 1, 11, 1, 0, 0, 0, 0),
    endDate: new Date(ano, 10, 30, 23, 59, 59, 999)
  };
}

function buildRanking(items: { name: string; count: number }[]): RankingItem[] {
  return items
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "pt-BR"))
    .slice(0, 5)
    .map((item, index) => ({ ...item, rank: index + 1 }));
}

export function generateAnnualReport(args: {
  tasks: KanboardTask[];
  taxonomy: TaxonomyConfig;
  teamMembers: TeamMember[];
  ano: number;
}): AnnualReportResponse {
  const { tasks, taxonomy, teamMembers, ano } = args;
  const { startDate, endDate } = getAnnualPgdRange(ano);

  const categoryById = new Map(taxonomy.categorias.map((category) => [category.categoryId, category]));
  const entregasBase = getCanonicalEntregas(taxonomy);

  const byCategoryMap = new Map<string, number>(taxonomy.categorias.map((c) => [c.categoryName, 0]));
  const byPersonMap = new Map<string, number>(teamMembers.map((member) => [member.userName, 0]));
  const byEntregaMap = new Map<string, number>(entregasBase.map((entrega) => [entrega.entregaNome, 0]));

  const filtered = tasks.filter((task) => {
    const completedAt = parseDate(task.date_completed);
    if (!completedAt || completedAt < startDate || completedAt > endDate) {
      return false;
    }

    const statusName = (task.column_name ?? "").toLowerCase();
    return statusName.includes("finaliz") || parseNumber(task.column_id) === 4;
  });

  for (const task of filtered) {
    const categoryId = parseNumber(task.category_id);
    const category = categoryById.get(categoryId);
    if (category) {
      byCategoryMap.set(category.categoryName, (byCategoryMap.get(category.categoryName) ?? 0) + 1);
      category.entregasPGD.forEach((entregaId) => {
        const entregaName = entregasBase.find((item) => item.entregaId === entregaId)?.entregaNome;
        if (!entregaName) return;
        byEntregaMap.set(entregaName, (byEntregaMap.get(entregaName) ?? 0) + 1);
      });
    }

    const owner = String(task.owner_id ?? task.assignee_id ?? "");
    const member = teamMembers.find((item) => item.userId === owner);
    if (member) {
      byPersonMap.set(member.userName, (byPersonMap.get(member.userName) ?? 0) + 1);
    }
  }

  const byCategory: AnnualByCategory[] = [...byCategoryMap.entries()]
    .map(([categoryName, count]) => ({ categoryName, count }))
    .sort((a, b) => b.count - a.count || a.categoryName.localeCompare(b.categoryName, "pt-BR"));

  const byPerson: AnnualByPerson[] = [...byPersonMap.entries()]
    .map(([userName, count]) => ({ userName, count }))
    .sort((a, b) => b.count - a.count || a.userName.localeCompare(b.userName, "pt-BR"));

  const byEntrega: AnnualByEntrega[] = [...byEntregaMap.entries()]
    .map(([entregaNome, count]) => ({ entregaNome, count }))
    .sort((a, b) => b.count - a.count || a.entregaNome.localeCompare(b.entregaNome, "pt-BR"));

  const topCategories = buildRanking(byCategory.map((item) => ({ name: item.categoryName, count: item.count })));
  const topEntregas = buildRanking(byEntrega.map((item) => ({ name: item.entregaNome, count: item.count })));

  const totalTarefas = filtered.length;
  const totalCategorias = byCategory.filter((item) => item.count > 0).length;
  const totalEntregas = byEntrega.filter((item) => item.count > 0).length;

  const topNames = topCategories.slice(0, 3).map((item) => item.name).join(", ");
  const resumoTexto =
    `Em ${ano}, a CGTE realizou ${totalTarefas} atividades distribuidas em ${totalCategorias} categorias, ` +
    `cobrindo ${totalEntregas} entregas do PGD. As areas mais ativas foram: ${topNames || "sem destaque"}.`;

  return {
    summary: {
      ano,
      totalTarefas,
      totalCategorias,
      totalEntregas
    },
    byCategory,
    byPerson,
    byEntrega,
    topCategories,
    topEntregas,
    resumoTexto
  };
}