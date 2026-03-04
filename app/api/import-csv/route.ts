import { NextRequest, NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import type { TeamMember } from "@/lib/metrics";
import {
  getPeriodRange,
  getPreviousPeriodRange,
  getLastNMonths,
  aggregateByCategory,
  aggregateByPerson,
  aggregateByMonth,
  calculateKpis,
  filterByPeriod,
  filterByArea
} from "@/lib/metrics";
import { getTaxonomy } from "@/lib/taxonomy";
import teamMembers from "@/config/team-members.json";
import type { DashboardTaskItem, AreaFilter, PeriodType } from "@/types/dashboard";
import type { TaxonomyConfig } from "@/types/kanboard";

interface CsvRow {
  [key: string]: string | undefined;
}

// ---------------------------------------------------------------------------
// CSV Column Mapping
// ---------------------------------------------------------------------------

function getField(row: CsvRow, ...keys: string[]): string {
  for (const key of keys) {
    const value = row[key];
    if (value !== undefined && value !== null && value.trim() !== "") return value.trim();
  }
  return "";
}

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * Map Kanboard status + column to our internal status.
 */
function resolveStatus(status: string, column: string): DashboardTaskItem["status"] {
  const s = normalizeText(status);
  const c = normalizeText(column);

  if (s.includes("finalizado") || c.includes("finalizado")) return "finalizada";
  if (c.includes("andamento") || c.includes("aprovacao") || c.includes("autorizado")) return "emAndamento";
  if (s === "abrir") return "emAndamento";
  return "backlog";
}

/**
 * Parse Kanboard date format "DD/MM/YYYY HH:MM" to ISO string.
 */
function parseDate(dateStr: string): string | null {
  if (!dateStr) return null;
  const m = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})$/);
  if (!m) return null;
  const [, day, month, year, hours, minutes] = m;
  return new Date(
    parseInt(year, 10),
    parseInt(month, 10) - 1,
    parseInt(day, 10),
    parseInt(hours, 10),
    parseInt(minutes, 10)
  ).toISOString();
}

/**
 * Map Kanboard category name to the taxonomy categoryId.
 * Falls back to id 18 (Demanda Extraordinaria) if no match.
 */
function resolveCategoryId(categoryName: string, taxonomy: TaxonomyConfig): number {
  if (!categoryName) return 18;

  const normalized = normalizeText(categoryName);

  for (const cat of taxonomy.categorias) {
    if (normalizeText(cat.categoryName) === normalized) return cat.categoryId;
  }

  // Partial match: check if taxonomy name is contained in CSV name or vice-versa
  for (const cat of taxonomy.categorias) {
    const catNorm = normalizeText(cat.categoryName);
    if (normalized.includes(catNorm) || catNorm.includes(normalized)) return cat.categoryId;
  }

  // Map known Kanboard prefixed categories
  const knownMappings: Record<string, number> = {
    "x_cso do cefor": 1,         // Comunicacao Visual → CSO
    "x_salas virtuais": 6,        // MOOC (salas virtuais)
    "x_recurso educacional": 7,   // Conteudo Educacional
  };

  for (const [key, id] of Object.entries(knownMappings)) {
    if (normalized.includes(normalizeText(key))) return id;
  }

  return 18; // Demanda Extraordinaria
}

/**
 * Map Kanboard user ID to team member.
 */
function resolveTeamMember(
  userId: string,
  userName: string,
  members: TeamMember[]
): { userId: string; userName: string; area: DashboardTaskItem["area"]; color: string } {
  const normalized = userId.toLowerCase().trim();
  const member = members.find((m) => m.userId.toLowerCase() === normalized);

  if (member) {
    return { userId: member.userId, userName: member.userName, area: member.area, color: member.color };
  }

  // Try matching by name
  const nameNorm = normalizeText(userName);
  const byName = members.find((m) => normalizeText(m.userName) === nameNorm || nameNorm.includes(normalizeText(m.userName)));

  if (byName) {
    return { userId: byName.userId, userName: byName.userName, area: byName.area, color: byName.color };
  }

  return { userId: normalized || "desconhecido", userName: userName || "Desconhecido", area: "Sem area", color: "#94a3b8" };
}

// ---------------------------------------------------------------------------
// Main Handler
// ---------------------------------------------------------------------------

const PERIODS: PeriodType[] = ["mes", "bimestre", "trimestre"];
const AREAS: AreaFilter[] = ["Todas", "Design", "Libras", "Audiovisual", "Gestao"];

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Arquivo CSV não fornecido" }, { status: 400 });
    }

    if (!file.name.endsWith(".csv")) {
      return NextResponse.json({ error: "Arquivo deve ser .csv" }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Arquivo muito grande (máximo 10 MB)" }, { status: 400 });
    }

    // Read query params for period/area
    const url = new URL(request.url);
    const period: PeriodType = PERIODS.includes(url.searchParams.get("period") as PeriodType)
      ? (url.searchParams.get("period") as PeriodType)
      : "trimestre";
    const area: AreaFilter = AREAS.includes(url.searchParams.get("area") as AreaFilter)
      ? (url.searchParams.get("area") as AreaFilter)
      : "Todas";

    const text = await file.text();

    let records: CsvRow[];
    try {
      records = parse(text, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        delimiter: ",",
      });
    } catch {
      return NextResponse.json({ error: "Erro ao fazer parse do CSV. Verifique o formato do arquivo." }, { status: 400 });
    }

    if (records.length === 0) {
      return NextResponse.json({ error: "Nenhuma tarefa encontrada no CSV" }, { status: 400 });
    }

    // Load taxonomy
    const taxonomy = await getTaxonomy();
    const members = teamMembers as TeamMember[];
    const taxonomyById = new Map(taxonomy.categorias.map((c) => [c.categoryId, c]));

    // Convert CSV rows → DashboardTaskItem[]
    const warnings: string[] = [];
    const allItems: DashboardTaskItem[] = [];

    records.forEach((row, index) => {
      const taskId = getField(row, "ID da Tarefa", "id da tarefa", "task_id", "Task ID", "ID");
      const category = getField(row, "Categoria", "categoria", "category", "Category");
      const userId = getField(row, "Usuário designado", "usuario designado", "person_assigned", "Assigned To");
      const userName = getField(row, "Nome do designado", "nome do designado", "Assigned Name");
      const status = getField(row, "Status", "status");
      const column = getField(row, "Coluna", "coluna", "Column");
      const dateCompleted = getField(row, "Data da finalização", "data da finalização", "Date Completed", "date_completed");
      const title = getField(row, "Título", "titulo", "description", "Description", "Task Title");

      if (!taskId || !title || !status) {
        warnings.push(`Linha ${index + 2}: campos obrigatórios ausentes (ID, Título, Status)`);
        return;
      }

      const categoryId = resolveCategoryId(category, taxonomy);
      const taxCat = taxonomyById.get(categoryId);
      const member = resolveTeamMember(userId, userName, members);
      const resolvedStatus = resolveStatus(status, column);
      const completedAt = resolvedStatus === "finalizada" ? parseDate(dateCompleted) : null;

      allItems.push({
        id: parseInt(taskId, 10),
        title,
        categoryId,
        categoryName: taxCat?.categoryName ?? (category || "Sem categoria"),
        userId: member.userId,
        userName: member.userName,
        area: (taxCat?.area ?? member.area ?? "Sem area") as DashboardTaskItem["area"],
        status: resolvedStatus,
        columnName: column || "",
        completedAt,
      });
    });

    if (allItems.length === 0) {
      return NextResponse.json(
        { error: "Nenhuma tarefa válida encontrada", warnings },
        { status: 400 }
      );
    }

    // Build MetricsResponse using existing aggregation functions
    const now = new Date();
    const currentRange = getPeriodRange(period, now);
    const previousRange = getPreviousPeriodRange(period, now);

    const currentTasks = filterByArea(filterByPeriod(allItems, currentRange), taxonomy, area);
    const previousTasks = filterByArea(filterByPeriod(allItems, previousRange), taxonomy, area);

    const { categories: categoryMetrics, tasksByCategory } = aggregateByCategory(currentTasks, taxonomy, area);
    const { persons, tasksByPerson } = aggregateByPerson(currentTasks, members, area);
    const months = aggregateByMonth(currentTasks, getLastNMonths(6, now), taxonomy, members);
    const kpis = calculateKpis(currentTasks, previousTasks, categoryMetrics, taxonomy, area);

    return NextResponse.json({
      period,
      area,
      range: currentRange,
      categories: categoryMetrics,
      persons,
      months,
      kpis,
      tasksByCategory,
      tasksByPerson,
      totalTasks: currentTasks.length,
      _csv: {
        totalParsed: records.length,
        totalValid: allItems.length,
        totalInPeriod: currentTasks.length,
        warnings: warnings.length > 0 ? warnings : undefined,
        importedAt: now.toISOString(),
      },
    });
  } catch (error) {
    console.error("CSV import error:", error);
    return NextResponse.json(
      { error: "Erro interno ao processar CSV", details: String(error) },
      { status: 500 }
    );
  }
}
