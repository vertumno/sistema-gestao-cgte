import type { AnnualReportResponse } from "@/types/report";

type RankingCardsProps = {
  annual: AnnualReportResponse;
};

export function RankingCards({ annual }: RankingCardsProps) {
  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <article className="rounded-lg border border-slate-200 bg-white p-4">
        <h4 className="text-sm font-semibold text-slate-900">Top 5 Categorias</h4>
        <ol className="mt-2 space-y-1 text-sm text-slate-700">
          {annual.topCategories.map((item) => (
            <li key={item.name} className="flex justify-between">
              <span>
                {item.rank}o {item.name}
              </span>
              <strong>{item.count}</strong>
            </li>
          ))}
        </ol>
      </article>

      <article className="rounded-lg border border-slate-200 bg-white p-4">
        <h4 className="text-sm font-semibold text-slate-900">Top 5 Entregas PGD</h4>
        <ol className="mt-2 space-y-1 text-sm text-slate-700">
          {annual.topEntregas.map((item) => (
            <li key={item.name} className="flex justify-between">
              <span>
                {item.rank}o {item.name}
              </span>
              <strong>{item.count}</strong>
            </li>
          ))}
        </ol>
      </article>
    </section>
  );
}