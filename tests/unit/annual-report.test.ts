import { describe, expect, it } from "vitest";
import { generateAnnualReport } from "@/lib/annual-report";
import taxonomy from "@/config/taxonomy.json";
import teamMembers from "@/config/team-members.json";
import type { TaxonomyConfig } from "@/types/kanboard";
import type { TeamMember } from "@/lib/metrics";

function toUnix(value: string): number {
  return Math.floor(new Date(value).getTime() / 1000);
}

describe("annual-report", () => {
  it("builds annual summary and ranking", () => {
    const result = generateAnnualReport({
      tasks: [
        {
          id: 1,
          title: "T1",
          category_id: 151,
          owner_id: "3672522",
          column_name: "Finalizado",
          date_completed: toUnix("2026-03-10")
        },
        {
          id: 2,
          title: "T2",
          category_id: 160,
          owner_id: "1896405",
          column_name: "Finalizado",
          date_completed: toUnix("2026-06-10")
        }
      ],
      taxonomy: taxonomy as TaxonomyConfig,
      teamMembers: teamMembers as TeamMember[],
      ano: 2026
    });

    expect(result.summary.ano).toBe(2026);
    expect(result.summary.totalTarefas).toBe(2);
    expect(result.topCategories.length).toBeGreaterThan(0);
    expect(result.resumoTexto).toContain("Em 2026");
  });
});