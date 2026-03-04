import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { KanboardClient } from "@/lib/kanboard-client";
import { buildMetricsResponse } from "@/lib/metrics";
import type { TeamMember } from "@/lib/metrics";
import { getTaxonomy } from "@/lib/taxonomy";
import teamMembers from "@/config/team-members.json";
import type { AreaFilter, PeriodType } from "@/types/dashboard";

const PERIODS: PeriodType[] = ["mes", "bimestre", "trimestre"];
const AREAS: AreaFilter[] = ["Todas", "Design", "Libras", "Audiovisual", "Gestao"];

function getPeriod(period: string | null): PeriodType {
  return PERIODS.includes(period as PeriodType) ? (period as PeriodType) : "trimestre";
}

function getArea(area: string | null): AreaFilter {
  return AREAS.includes(area as AreaFilter) ? (area as AreaFilter) : "Todas";
}

// Cache o fetch bruto do Kanboard (tasks + categories) por 5 minutos.
// Filtros de período e área são aplicados em memória — não fazem parte da cache key.
const getKanboardData = unstable_cache(
  async () => {
    const client = new KanboardClient();
    const [tasks, categories, taxonomy] = await Promise.all([
      client.getAllTasks(),
      client.getAllCategories(),
      getTaxonomy()
    ]);
    return { tasks, categories, taxonomy };
  },
  ["kanboard-raw-data"],
  { revalidate: 300, tags: ["kanboard"] }
);

export async function GET(request: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const period = getPeriod(searchParams.get("period"));
    const area = getArea(searchParams.get("area"));

    const { tasks, categories, taxonomy } = await getKanboardData();

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
          "Nao foi possivel carregar as metricas do dashboard no momento. Verifique a integracao com o Kanboard."
      },
      { status: 503 }
    );
  }
}
