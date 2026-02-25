import { NextRequest, NextResponse } from "next/server";
import { parse } from "csv-parse/sync";

interface CsvRow {
  task_id: string;
  category: string;
  person_assigned: string;
  status: string;
  date_completed?: string;
  effort_hours?: string;
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

const VALID_CATEGORIES = ["Design", "Audiovisual", "Libras", "Gestao"];
const VALID_STATUSES = ["finalizada", "emAndamento", "backlog"];

function normalizeStatus(status: string): "finalizada" | "emAndamento" | "backlog" {
  const normalized = status.toLowerCase().trim();

  if (normalized.includes("finalizada") || normalized.includes("done") || normalized.includes("concluída")) {
    return "finalizada";
  }
  if (normalized.includes("andamento") || normalized.includes("progress") || normalized.includes("em andamento")) {
    return "emAndamento";
  }

  return "backlog";
}

function validateRow(row: CsvRow, rowNumber: number): { valid: boolean; error?: string } {
  if (!row.task_id) {
    return { valid: false, error: `Linha ${rowNumber}: task_id é obrigatório` };
  }

  if (isNaN(parseInt(row.task_id, 10))) {
    return { valid: false, error: `Linha ${rowNumber}: task_id deve ser um número` };
  }

  if (!row.category) {
    return { valid: false, error: `Linha ${rowNumber}: category é obrigatória` };
  }

  if (!VALID_CATEGORIES.includes(row.category)) {
    return {
      valid: false,
      error: `Linha ${rowNumber}: category inválida. Válidas: ${VALID_CATEGORIES.join(", ")}`,
    };
  }

  if (!row.person_assigned) {
    return { valid: false, error: `Linha ${rowNumber}: person_assigned é obrigatório` };
  }

  if (!row.status) {
    return { valid: false, error: `Linha ${rowNumber}: status é obrigatório` };
  }

  const normalizedStatus = normalizeStatus(row.status);
  if (!VALID_STATUSES.includes(normalizedStatus)) {
    return {
      valid: false,
      error: `Linha ${rowNumber}: status "${row.status}" não é válido. Use: finalizada, emAndamento, backlog`,
    };
  }

  return { valid: true };
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

    // Ler arquivo
    const text = await file.text();

    // Parser CSV
    let records: CsvRow[];
    try {
      records = parse(text, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        delimiter: ",",
      });
    } catch {
      return NextResponse.json({ error: "Erro ao fazer parse do CSV" }, { status: 400 });
    }

    if (records.length === 0) {
      return NextResponse.json({ error: "Nenhuma tarefa encontrada no CSV" }, { status: 400 });
    }

    // Validar registros
    const validationErrors: string[] = [];
    const tasks: Task[] = [];

    records.forEach((row: CsvRow, index: number) => {
      const validation = validateRow(row, index + 2); // +2 porque começa na linha 2 (depois do header)

      if (!validation.valid) {
        validationErrors.push(validation.error || "Erro desconhecido");
      } else {
        tasks.push({
          id: parseInt(row.task_id, 10),
          title: row.description,
          category: row.category,
          assignee: row.person_assigned,
          status: normalizeStatus(row.status),
          dateCompleted: row.date_completed ? new Date(row.date_completed) : null,
          effortHours: parseInt(row.effort_hours || "0", 10),
        });
      }
    });

    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          error: "Erros de validação encontrados",
          errors: validationErrors.slice(0, 10), // Primeiros 10 erros
          totalErrors: validationErrors.length,
        },
        { status: 400 }
      );
    }

    if (tasks.length === 0) {
      return NextResponse.json({ error: "Nenhuma tarefa válida encontrada" }, { status: 400 });
    }

    // Aqui você pode salvar as tasks em um banco de dados
    // Por enquanto, apenas retornamos os dados processados
    // TODO: Implementar persistência em banco de dados

    return NextResponse.json(
      {
        success: true,
        message: `${tasks.length} tarefa(s) importada(s) com sucesso`,
        tasksCount: tasks.length,
        tasks: tasks,
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
