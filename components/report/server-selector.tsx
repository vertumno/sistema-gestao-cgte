"use client";

import teamMembers from "@/config/team-members.json";
import { useReportStore } from "@/stores/report-store";

export function ServerSelector() {
  const servidorId = useReportStore((state) => state.servidorId);
  const setServidor = useReportStore((state) => state.setServidor);

  return (
    <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
      <span>Servidor</span>
      <select
        aria-label="Selecionar servidor"
        value={servidorId}
        onChange={(event) => setServidor(event.target.value)}
        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
      >
        <option value="todos">Todos</option>
        {teamMembers.map((member) => (
          <option key={member.userId} value={member.userId}>
            {member.userName}
          </option>
        ))}
      </select>
    </label>
  );
}