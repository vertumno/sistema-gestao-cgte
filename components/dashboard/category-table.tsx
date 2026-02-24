"use client";

import { Fragment, useState } from "react";
import { TaskListExpandable } from "@/components/dashboard/task-list-expandable";
import type { CategoryMetric, DashboardTaskItem } from "@/types/dashboard";

type CategoryTableProps = {
  categories: CategoryMetric[];
  tasksByCategory: Record<string, DashboardTaskItem[]>;
};

export function CategoryTable({ categories, tasksByCategory }: CategoryTableProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section aria-label="Tabela por categoria" className="rounded-lg border border-slate-200 bg-white p-4">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-slate-600">
            <th className="px-2 py-2 font-medium">Categoria</th>
            <th className="px-2 py-2 font-medium">Total</th>
            <th className="px-2 py-2 font-medium">Finalizadas</th>
            <th className="px-2 py-2 font-medium">Em andamento</th>
            <th className="px-2 py-2 font-medium">Backlog</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => {
            const rowKey = String(category.categoryId);
            const isOpen = expanded === rowKey;
            return (
              <Fragment key={rowKey}>
                <tr
                  className="cursor-pointer border-b border-slate-100 hover:bg-slate-50 focus-within:bg-slate-50"
                  onClick={() => setExpanded(isOpen ? null : rowKey)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setExpanded(isOpen ? null : rowKey);
                    }
                  }}
                  tabIndex={0}
                  aria-label={`Expandir tarefas da categoria ${category.categoryName}`}
                >
                  <td className="px-2 py-2">{category.categoryName}</td>
                  <td className="px-2 py-2">{category.total}</td>
                  <td className="px-2 py-2">{category.finalizadas}</td>
                  <td className="px-2 py-2">{category.emAndamento}</td>
                  <td className="px-2 py-2">{category.backlog}</td>
                </tr>
                {isOpen ? (
                  <tr className="bg-slate-50">
                    <td className="px-2 py-3" colSpan={5}>
                      <TaskListExpandable tasks={tasksByCategory[rowKey] ?? []} />
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}