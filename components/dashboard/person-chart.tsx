import type { PersonMetric } from "@/types/dashboard";

type PersonChartProps = {
  persons: PersonMetric[];
};

export function PersonChart({ persons }: PersonChartProps) {
  const maxValue = Math.max(...persons.map((person) => person.finalizadas), 1);

  return (
    <section aria-label="Grafico de tarefas por pessoa" className="rounded-lg border border-slate-200 bg-white p-4">
      <h2 className="text-base font-semibold text-slate-900">Por Pessoa</h2>
      <div className="mt-4 space-y-2">
        {persons.map((person) => (
          <div key={person.userId} className="grid grid-cols-[minmax(130px,1fr),4fr,40px] items-center gap-2 text-sm">
            <span className="truncate text-slate-700">{person.userName}</span>
            <div className="h-5 rounded bg-slate-100">
              <div
                className="h-5 rounded"
                style={{
                  width: `${(person.finalizadas / maxValue) * 100}%`,
                  backgroundColor: person.color
                }}
              />
            </div>
            <span className="text-right font-semibold text-slate-800">{person.finalizadas}</span>
          </div>
        ))}
      </div>
    </section>
  );
}