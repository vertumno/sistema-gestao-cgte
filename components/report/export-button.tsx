"use client";

type ExportButtonProps = {
  filename: string;
  content: string;
  label?: string;
};

export function ExportButton({ filename, content, label = "Exportar .txt" }: ExportButtonProps) {
  function handleExport() {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      aria-label={label}
      className="min-h-11 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
    >
      {label}
    </button>
  );
}