import { NextResponse } from "next/server";
import { KanboardClient } from "@/lib/kanboard-client";
import { buildMetricsResponse } from "@/lib/metrics";
import type { TeamMember } from "@/lib/metrics";
import { getTaxonomy } from "@/lib/taxonomy";
import teamMembers from "@/config/team-members.json";
import type { AreaFilter, PeriodType } from "@/types/dashboard";

export const revalidate = 300;

const PERIODS: PeriodType[] = ["mes", "bimestre", "trimestre"];
const AREAS: AreaFilter[] = ["Todas", "Design", "Libras", "Audiovisual", "Gestao"];

function getPeriod(period: string | null): PeriodType {
  return PERIODS.includes(period as PeriodType) ? (period as PeriodType) : "trimestre";
}

function getArea(area: string | null): AreaFilter {
  return AREAS.includes(area as AreaFilter) ? (area as AreaFilter) : "Todas";
}

export async function GET(request: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const period = getPeriod(searchParams.get("period"));
    const area = getArea(searchParams.get("area"));

    const client = new KanboardClient();
    const [tasks, categories, taxonomy] = await Promise.all([
      client.getAllTasks(),
      client.getAllCategories(),
      getTaxonomy()
    ]);

    const payload = buildMetricsResponse({
      tasks,
      categories,
      taxonomy,
      teamMembers: teamMembers as TeamMember[],
      period,
      area
    });

    return NextResponse.json(payload);
  } catch (error) {
    console.error("[api/metrics] error:", error);
    return NextResponse.json(
      {
        message:
          "Nao foi possivel carregar as metricas do dashboard no momento. Verifique a integracao com o Kanboard.",
        debug: String(error)
      },
      { status: 503 }
    );
  }
}
