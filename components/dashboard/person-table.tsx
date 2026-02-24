"use client";

import { Fragment, useState } from "react";
import { TaskListExpandable } from "@/components/dashboard/task-list-expandable";
import type { DashboardTaskItem, PersonMetric } from "@/types/dashboard";

type PersonTableProps = {
  persons: PersonMetric[];
  tasksByPerson: Record<string, DashboardTaskItem[]>;
};

export function PersonTable({ persons, tasksByPerson }: PersonTableProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section aria-label="Tabela por pessoa" className="rounded-lg border border-slate-200 bg-white p-4">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-slate-600">
            <th className="px-2 py-2 font-medium">Servidor</th>
            <th className="px-2 py-2 font-medium">Area</th>
            <th className="px-2 py-2 font-medium">Total</th>
            <th className="px-2 py-2 font-medium">Finalizadas</th>
            <th className="px-2 py-2 font-medium">Em andamento</th>
          </tr>
        </thead>
        <tbody>
          {persons.map((person) => {
            const isOpen = expanded === person.userId;
            return (
              <Fragment key={person.userId}>
                <tr
                  className="cursor-pointer border-b border-slate-100 hover:bg-slate-50 focus-within:bg-slate-50"
                  onClick={() => setExpanded(isOpen ? null : person.userId)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setExpanded(isOpen ? null : person.userId);
                    }
                  }}
                  tabIndex={0}
                  aria-label={`Expandir tarefas de ${person.userName}`}
                >
                  <td className="px-2 py-2">{person.userName}</td>
                  <td className="px-2 py-2">{person.area}</td>
                  <td className="px-2 py-2">{person.total}</td>
                  <td className="px-2 py-2">{person.finalizadas}</td>
                  <td className="px-2 py-2">{person.emAndamento}</td>
                </tr>
                {isOpen ? (
                  <tr className="bg-slate-50">
                    <td className="px-2 py-3" colSpan={5}>
                      <TaskListExpandable tasks={tasksByPerson[person.userId] ?? []} />
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