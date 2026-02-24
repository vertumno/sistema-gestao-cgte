import type { AnnualReportResponse } from "@/types/report";

type AnnualTablesProps = {
  annual: AnnualReportResponse;
};

export function AnnualTables({ annual }: AnnualTablesProps) {
  return (
    <section className="grid gap-4 lg:grid-cols-3">
      <article className="rounded-lg border border-slate-200 bg-white p-4">
        <h4 className="text-sm font-semibold text-slate-900">Por Categoria</h4>
        <ul className="mt-2 space-y-1 text-sm text-slate-700">
          {annual.byCategory.map((item) => (
            <li key={item.categoryName} className="flex justify-between gap-2">
              <span>{item.categoryName}</span>
              <strong>{item.count}</strong>
            </li>
          ))}
        </ul>
      </article>

      <article className="rounded-lg border border-slate-200 bg-white p-4">
        <h4 className="text-sm font-semibold text-slate-900">Por Pessoa</h4>
        <ul className="mt-2 space-y-1 text-sm text-slate-700">
          {annual.byPerson.map((item) => (
            <li key={item.userName} className="flex justify-between gap-2">
              <span>{item.userName}</span>
              <strong>{item.count}</strong>
            </li>
          ))}
        </ul>
      </article>

      <article className="rounded-lg border border-slate-200 bg-white p-4">
        <h4 className="text-sm font-semibold text-slate-900">Por Entrega PGD</h4>
        <ul className="mt-2 space-y-1 text-sm text-slate-700">
          {annual.byEntrega.map((item) => (
            <li key={item.entregaNome} className="flex justify-between gap-2">
              <span>{item.entregaNome}</span>
              <strong>{item.count}</strong>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}