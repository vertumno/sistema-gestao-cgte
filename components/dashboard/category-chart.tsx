import type { CategoryMetric } from "@/types/dashboard";

type CategoryChartProps = {
  categories: CategoryMetric[];
};

export function CategoryChart({ categories }: CategoryChartProps) {
  const maxValue = Math.max(...categories.map((category) => category.finalizadas), 1);

  return (
    <section aria-label="Grafico de tarefas por categoria" className="rounded-lg border border-slate-200 bg-white p-4">
      <h2 className="text-base font-semibold text-slate-900">Por Categoria</h2>
      <div className="mt-4 space-y-2">
        {categories.map((category, index) => (
          <div key={category.categoryId} className="grid grid-cols-[minmax(180px,1fr),4fr,40px] items-center gap-2 text-sm">
            <span className="truncate text-slate-700" title={category.categoryName}>
              {category.categoryName}
            </span>
            <div className="h-5 rounded bg-slate-100">
              <div
                className="h-5 rounded"
                style={{
                  width: `${(category.finalizadas / maxValue) * 100}%`,
                  backgroundColor: `hsl(${(index * 35) % 360} 65% 42%)`
                }}
              />
            </div>
            <span className="text-right font-semibold text-slate-800">{category.finalizadas}</span>
          </div>
        ))}
      </div>
    </section>
  );
}