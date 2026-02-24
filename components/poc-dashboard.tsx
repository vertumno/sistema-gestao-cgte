import type { PocDashboardData } from "@/lib/poc-dashboard";

type PocDashboardProps = {
  data: PocDashboardData;
};

export function PocDashboard({ data }: PocDashboardProps) {
  return (
    <section className="space-y-8">
      <div className="rounded-xl border border-emerald-100 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-emerald-900">Sistema de Gestao CGTE - Online</h2>
        <p className="mt-2 text-sm text-slate-600">
          Prova de conceito da integracao com dados reais do Kanboard.
        </p>
        <p className="mt-4 text-3xl font-bold text-emerald-800">{data.totalTasks}</p>
        <p className="text-sm text-slate-500">Total de tarefas</p>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        {data.columns.map((column) => (
          <article
            key={column.name}
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
          >
            <h3 className="text-sm font-medium text-slate-600">{column.name}</h3>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{column.total}</p>
          </article>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Tarefas por categoria (18)</h3>
        <ul className="mt-4 grid gap-2 md:grid-cols-2">
          {data.categories.map((category) => (
            <li
              key={category.categoryId}
              className="flex items-center justify-between rounded-md border border-slate-100 bg-slate-50 px-3 py-2"
            >
              <span className="text-sm text-slate-700">{category.categoryName}</span>
              <span className="rounded bg-emerald-700 px-2 py-1 text-xs font-semibold text-white">
                {category.total}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
