export function Footer() {
  const version = process.env.NEXT_PUBLIC_APP_VERSION ?? "0.1.0";

  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-3 text-xs text-slate-600 md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span aria-label={`Versao ${version}`}>Versao {version}</span>
        <a
          href="/docs/prd.md"
          aria-label="Abrir documentacao do sistema"
          className="font-medium text-emerald-700 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
        >
          Documentacao
        </a>
      </div>
    </footer>
  );
}