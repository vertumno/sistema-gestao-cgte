"use client";

import { useState } from "react";
import { TaskListExpandable } from "@/components/dashboard/task-list-expandable";
import type { DashboardTaskItem, PersonMetric } from "@/types/dashboard";
import { cn } from "@/lib/utils";

type PersonCardProps = {
  person: PersonMetric;
  tasks: DashboardTaskItem[];
};

export function PersonCard({ person, tasks }: PersonCardProps) {
  const [expanded, setExpanded] = useState(false);
  const total = person.total > 0 ? person.total : 1;
  const finalizadasPct = Math.round((person.finalizadas / total) * 100);

  return (
    <article
      className="rounded-lg p-4 glass transition-shadow hover:glow"
      aria-label={`Atividades de ${person.userName}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ backgroundColor: person.color }}
            aria-hidden="true"
          >
            {person.userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-text">{person.userName}</p>
            <p className="text-xs text-text-muted">{person.area}</p>
          </div>
        </div>

        {/* Total badge */}
        <span className="rounded-full bg-surface-elevated px-2.5 py-0.5 text-sm font-semibold text-text">
          {person.total} tarefas
        </span>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-xs text-text-muted">Finalizadas</span>
          <span className="text-xs font-semibold text-text">{finalizadasPct}%</span>
        </div>
        <div
          className="h-2 w-full overflow-hidden rounded-full bg-surface-elevated"
          role="progressbar"
          aria-valuenow={person.finalizadas}
          aria-valuemax={person.total}
          aria-label={`${person.finalizadas} de ${person.total} tarefas finalizadas`}
        >
          <div
            className="h-full rounded-full bg-success transition-all"
            style={{ width: `${finalizadasPct}%` }}
          />
        </div>
      </div>

      {/* Status chips */}
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-success-light px-2.5 py-1 text-xs font-medium text-success">
          <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
          {person.finalizadas} finalizadas
        </span>
        {person.emAndamento > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-info-light px-2.5 py-1 text-xs font-medium text-info">
            <span className="h-1.5 w-1.5 rounded-full bg-info" aria-hidden="true" />
            {person.emAndamento} em andamento
          </span>
        )}
      </div>

      {/* Expand tasks */}
      {tasks.length > 0 && (
        <div className="mt-4 border-t border-border pt-3">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className={cn(
              "text-xs font-medium text-text-muted transition-colors hover:text-primary",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            )}
            aria-expanded={expanded}
          >
            {expanded ? "Ocultar tarefas" : `Ver ${tasks.length} tarefas`}
          </button>
          {expanded && (
            <div className="mt-3">
              <TaskListExpandable tasks={tasks} />
            </div>
          )}
        </div>
      )}
    </article>
  );
}
