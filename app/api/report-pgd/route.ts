import { NextResponse } from "next/server";
import teamMembers from "@/config/team-members.json";
import { generateAnnualReport } from "@/lib/annual-report";
import { KanboardClient, KanboardClientError } from "@/lib/kanboard-client";
import { type TeamMember } from "@/lib/metrics";
import { getCurrentTrimesterLabel } from "@/lib/pgd-periods";
import { generatePgdReport, resolveServidorNome } from "@/lib/report-generator";
import { getTaxonomy } from "@/lib/taxonomy";

export const revalidate = 300;

export async function GET(request: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const trimestre = searchParams.get("trimestre") ?? getCurrentTrimesterLabel(new Date());
    const servidor = searchParams.get("servidor") ?? "todos";
    const view = searchParams.get("view") ?? "trimestral";
    const ano = Number(searchParams.get("ano") ?? new Date().getFullYear());

    const client = new KanboardClient();
    const [tasks, taxonomy] = await Promise.all([client.getAllTasks(), getTaxonomy()]);

    if (view === "anual") {
      const annual = generateAnnualReport({
        tasks,
        taxonomy,
        teamMembers: teamMembers as TeamMember[],
        ano
      });

      return NextResponse.json(annual);
    }

    const subtasks = await client.getAllSubtasks();
    const entregas = generatePgdReport({
      tasks,
      subtasks,
      taxonomy,
      trimestre,
      servidorId: servidor
    });

    return NextResponse.json({
      trimestre,
      servidor: resolveServidorNome(servidor, teamMembers as TeamMember[]),
      entregas
    });
  } catch (error) {
    if (error instanceof KanboardClientError) {
      return NextResponse.json(
        {
          message: "Erro ao consultar Kanboard para gerar o relatorio PGD.",
          kind: error.kind,
          detail: error.message
        },
        { status: error.kind === "auth" ? 401 : 503 }
      );
    }

    console.error("report-pgd route unexpected error", error);
    return NextResponse.json(
      {
        message: "Nao foi possivel gerar o relatorio PGD no momento.",
        kind: "unknown"
      },
      { status: 503 }
    );
  }
}