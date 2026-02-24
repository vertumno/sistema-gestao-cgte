"use client";

import { useState } from "react";
import { CopyButton } from "@/components/report/copy-button";
import type { PgdEntrega } from "@/types/report";

type PgdEntregaListProps = {
  entregas: PgdEntrega[];
};

export function PgdEntregaList({ entregas }: PgdEntregaListProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section aria-label="Entregas PGD" className="space-y-3">
      {entregas.map((entrega) => {
        const isOpen = expanded === entrega.entregaId;
        return (
          <article key={entrega.entregaId} className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">{entrega.entregaNome}</h3>
                <p className="mt-1 text-sm text-slate-600">
                  {entrega.summaryText ?? "Sem atividades registradas"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <CopyButton
                  text={entrega.summaryText ?? "Sem atividades registradas"}
                  label={`Copiar texto da entrega ${entrega.entregaNome}`}
                />
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : entrega.entregaId)}
                  aria-label={`Expandir tarefas da entrega ${entrega.entregaNome}`}
                  className="min-h-11 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
                >
                  {isOpen ? "Ocultar" : "Detalhes"}
                </button>
              </div>
            </div>

            {isOpen ? (
              <ul className="mt-3 space-y-2 border-t border-slate-100 pt-3 text-sm text-slate-700">
                {entrega.tasks.length === 0 ? (
                  <li className="text-slate-500">Sem atividades registradas</li>
                ) : (
                  entrega.tasks.map((task) => (
                    <li key={task.id} className="rounded-md bg-slate-50 px-3 py-2">
                      {task.title} - {task.category} - {new Date(task.dateCompleted).toLocaleDateString("pt-BR")}
                    </li>
                  ))
                )}
              </ul>
            ) : null}
          </article>
        );
      })}
    </section>
  );
}