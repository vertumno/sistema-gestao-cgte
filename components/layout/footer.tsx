export function Footer() {
  const version = process.env.NEXT_PUBLIC_APP_VERSION ?? "0.1.0";

  return (
    <footer className="border-t border-border px-4 py-3 text-xs text-text-subtle md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span aria-label={`Versão ${version}`}>v{version}</span>
        <a
          href="/docs/prd.md"
          aria-label="Abrir documentação do sistema"
          className="font-medium text-text-muted transition hover:text-primary focus-glow"
        >
          Documentação
        </a>
      </div>
    </footer>
  );
}
