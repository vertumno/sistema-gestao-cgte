"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { CategoryMetric } from "@/types/dashboard";

type CategoryChartProps = {
  categories: CategoryMetric[];
};

export function CategoryChart({ categories }: CategoryChartProps) {
  const [open, setOpen] = useState(false);
  const maxValue = Math.max(...categories.map((category) => category.finalizadas), 1);
  const totalFinalizadas = categories.reduce((sum, c) => sum + c.finalizadas, 0);

  return (
    <section aria-label="Tarefas concluidas por categoria" className="rounded-lg border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <div>
          <h2 className="text-base font-semibold text-slate-900">Tarefas Concluidas por Categoria</h2>
          <p className="mt-0.5 text-sm text-slate-500">{totalFinalizadas} concluida{totalFinalizadas !== 1 ? "s" : ""} no periodo</p>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="border-t border-slate-100 px-4 pb-4 pt-3 space-y-2">
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
      )}
    </section>
  );
}
