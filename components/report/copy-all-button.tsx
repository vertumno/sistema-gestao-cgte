"use client";

import { useCopyFeedback } from "@/hooks/use-copy-feedback";

type CopyAllButtonProps = {
  text: string;
};

export function CopyAllButton({ text }: CopyAllButtonProps) {
  const { copy, copied } = useCopyFeedback();

  return (
    <button
      type="button"
      onClick={() => copy(text)}
      aria-label="Copiar relatorio completo"
      className="min-h-11 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
    >
      {copied ? "? Relatorio copiado" : "Copiar Tudo"}
    </button>
  );
}