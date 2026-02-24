import type { DashboardTaskItem } from "@/types/dashboard";

type TaskListExpandableProps = {
  tasks: DashboardTaskItem[];
};

export function TaskListExpandable({ tasks }: TaskListExpandableProps) {
  if (tasks.length === 0) {
    return <p className="text-sm text-slate-500">Sem tarefas para este filtro.</p>;
  }

  return (
    <ul className="space-y-2 text-sm">
      {tasks.map((task) => (
        <li key={task.id} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
          <p className="font-medium text-slate-900">{task.title}</p>
          <p className="mt-1 text-xs text-slate-600">
            {task.categoryName} - {task.status === "finalizada" ? "Finalizada" : task.status === "emAndamento" ? "Em andamento" : task.status === "backlog" ? "Backlog" : task.status} - {task.completedAt ? new Date(task.completedAt).toLocaleDateString("pt-BR") : "sem data"}
          </p>
        </li>
      ))}
    </ul>
  );
}