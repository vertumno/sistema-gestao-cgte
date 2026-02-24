"use client";

import { useCopyFeedback } from "@/hooks/use-copy-feedback";

type CopyButtonProps = {
  text: string;
  label: string;
};

export function CopyButton({ text, label }: CopyButtonProps) {
  const { copy, copied } = useCopyFeedback();

  return (
    <button
      type="button"
      onClick={() => copy(text)}
      aria-label={label}
      className="min-h-11 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
    >
      {copied ? "? Copiado" : "Copiar"}
    </button>
  );
}