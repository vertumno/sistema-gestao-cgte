import { NextRequest, NextResponse } from "next/server";
import { parse } from "csv-parse/sync";

interface CsvRow {
  [key: string]: string | undefined;
}

interface NormalizedTask {
  taskId: string;
  category: string;
  personAssigned: string;
  status: string;
  column: string;
  dateCompleted?: string;
  description: string;
}

interface Task {
  id: number;
  title: string;
  category: string;
  assignee: string;
  status: "finalizada" | "emAndamento" | "backlog";
  dateCompleted: Date | null;
  effortHours: number;
}

/**
 * Mapeia colunas do CSV exportado pelo Kanboard para campos internos.
 * Campos obrigatórios: ID da Tarefa, Nome do designado, Status, Título.
 * Categoria é opcional (usa "Sem categoria" como fallback).
 */
function mapKanboardColumns(row: CsvRow): NormalizedTask | null {
  const taskId =
    row["ID da Tarefa"] ||
    row["id da tarefa"] ||
    row["task_id"] ||
    row["Task ID"] ||
    row["ID"];

  const category =
    row["Categoria"] ||
    row["categoria"] ||
    row["category"] ||
    row["Category"] ||
    "";

  const personAssigned =
    row["Nome do designado"] ||
    row["nome do designado"] ||
    row["person_assigned"] ||
    row["Pessoa Atribuída"] ||
    row["Assigned To"] ||
    row["Usuário designado"];

  const status =
    row["Status"] ||
    row["status"] ||
    row["Status da Tarefa"];

  const column =
    row["Coluna"] ||
    row["coluna"] ||
    row["Column"] ||
    "";

  const dateCompleted =
    row["Data da finalização"] ||
    row["data da finalização"] ||
    row["Date Completed"] ||
    row["date_completed"];

  const description =
    row["Título"] ||
    row["título"] ||
    row["description"] ||
    row["Description"] ||
    row["Task Title"];

  // Apenas taskId, personAssigned, status e description são obrigatórios
  if (!taskId || !personAssigned || !status || !description) {
    return null;
  }

  return {
    taskId,
    category: category || "Sem categoria",
    personAssigned,
    status,
    column,
    dateCompleted,
    description,
  };
}

/**
 * Normaliza o status da tarefa combinando a coluna "Status" e "Coluna" do Kanboard.
 *
 * Kanboard usa dois campos:
 * - "Status": Finalizado | Abrir
 * - "Coluna": Finalizado | Em andamento | Início autorizado | Em aprovação | Backlog
 *
 * Mapeamento:
 *   Status="Finalizado" → finalizada
 *   Coluna="Finalizado" → finalizada
 *   Coluna="Em andamento" ou "Em aprovação" ou "Início autorizado" → emAndamento
 *   Tudo mais → backlog
 */
function normalizeStatus(status: string, column: string): "finalizada" | "emAndamento" | "backlog" {
  const s = status.toLowerCase().trim();
  const c = column.toLowerCase().trim();

  // Status "Finalizado" é definitivo
  if (s === "finalizado" || s.includes("finalizado") || s.includes("done")) {
    return "finalizada";
  }

  // Coluna "Finalizado" também indica tarefa concluída
  if (c === "finalizado" || c.includes("finalizado")) {
    return "finalizada";
  }

  // Colunas que indicam trabalho em progresso
  if (
    c.includes("andamento") ||
    c.includes("aprovação") ||
    c.includes("autorizado") ||
    c.includes("progress")
  ) {
    return "emAndamento";
  }

  // Status "Abrir" com coluna de trabalho ativo
  if (s === "abrir" || s === "open") {
    return "emAndamento";
  }

  return "backlog";
}

function validateRow(row: NormalizedTask, rowNumber: number): { valid: boolean; error?: string } {
  if (!row.taskId) {
    return { valid: false, error: `Linha ${rowNumber}: ID da Tarefa é obrigatório` };
  }

  if (isNaN(parseInt(row.taskId, 10))) {
    return { valid: false, error: `Linha ${rowNumber}: ID da Tarefa deve ser um número` };
  }

  if (!row.personAssigned) {
    return { valid: false, error: `Linha ${rowNumber}: Nome do designado é obrigatório` };
  }

  if (!row.status) {
    return { valid: false, error: `Linha ${rowNumber}: Status é obrigatório` };
  }

  if (!row.description) {
    return { valid: false, error: `Linha ${rowNumber}: Título é obrigatório` };
  }

  return { valid: true };
}

/**
 * Converte data no formato Kanboard "DD/MM/YYYY HH:MM" para Date.
 */
function parseKanboardDate(dateStr: string | undefined): Date | null {
  if (!dateStr || dateStr.trim() === "") return null;

  // Formato: "24/02/2026 10:57"
  const match = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})$/);
  if (match) {
    const [, day, month, year, hours, minutes] = match;
    return new Date(
      parseInt(year, 10),
      parseInt(month, 10) - 1,
      parseInt(day, 10),
      parseInt(hours, 10),
      parseInt(minutes, 10)
    );
  }

  // Fallback: tentar parse nativo
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? null : parsed;
}

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

    const maxSize = 10 * 1024 * 1024; // 10 MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "Arquivo muito grande (máximo 10 MB)" }, { status: 400 });
    }

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

    const validationErrors: string[] = [];
    const tasks: Task[] = [];

    records.forEach((row: CsvRow, index: number) => {
      const normalized = mapKanboardColumns(row);

      if (!normalized) {
        validationErrors.push(
          `Linha ${index + 2}: Campos obrigatórios ausentes (ID da Tarefa, Nome do designado, Status, Título)`
        );
        return;
      }

      const validation = validateRow(normalized, index + 2);

      if (!validation.valid) {
        validationErrors.push(validation.error || "Erro desconhecido");
      } else {
        tasks.push({
          id: parseInt(normalized.taskId, 10),
          title: normalized.description,
          category: normalized.category,
          assignee: normalized.personAssigned,
          status: normalizeStatus(normalized.status, normalized.column),
          dateCompleted: parseKanboardDate(normalized.dateCompleted),
          effortHours: 0,
        });
      }
    });

    // Permitir importação parcial: se há tarefas válidas, importar mesmo com erros
    if (tasks.length === 0) {
      return NextResponse.json(
        {
          error: "Nenhuma tarefa válida encontrada",
          errors: validationErrors.slice(0, 10),
          totalErrors: validationErrors.length,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `${tasks.length} tarefa(s) importada(s) com sucesso`,
        tasksCount: tasks.length,
        tasks,
        warnings: validationErrors.length > 0 ? validationErrors : undefined,
        warningCount: validationErrors.length > 0 ? validationErrors.length : undefined,
        importedAt: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("CSV import error:", error);
    return NextResponse.json(
      { error: "Erro interno ao processar CSV", details: String(error) },
      { status: 500 }
    );
  }
}
