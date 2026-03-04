import { PersonCard } from "@/components/dashboard/person-card";
import type { DashboardTaskItem, PersonMetric } from "@/types/dashboard";

type PersonCardGridProps = {
  persons: PersonMetric[];
  tasksByPerson: Record<string, DashboardTaskItem[]>;
};

export function PersonCardGrid({ persons, tasksByPerson }: PersonCardGridProps) {
  if (persons.length === 0) return null;

  return (
    <section aria-label="Equipe — visão individual">
      <div className="mb-3 flex items-center gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-text-muted">
          Equipe
        </h2>
        <span className="text-xs text-text-subtle">
          — situação individual no período
        </span>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {persons.map((person) => (
          <PersonCard
            key={person.userId}
            person={person}
            tasks={tasksByPerson[person.userId] ?? []}
          />
        ))}
      </div>
    </section>
  );
}
