"use client";

type HeaderProps = {
  onToggleMobileNav: () => void;
};

export function Header({ onToggleMobileNav }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-surface px-4 md:px-6">
      {/* Left — brand */}
      <div className="flex items-center gap-3">
        {/* Accent dot */}
        <div className="h-2 w-2 rounded-full bg-primary glow" aria-hidden="true" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-text-subtle">
            Cefor · IFES
          </p>
          <h1
            className="font-display text-base font-semibold leading-tight text-text"
          >
            Gestão CGTE
          </h1>
        </div>
      </div>

      {/* Mobile menu button */}
      <button
        type="button"
        onClick={onToggleMobileNav}
        aria-label="Abrir menu de navegação"
        className="rounded border border-border px-3 py-1.5 text-xs font-medium text-text-muted transition hover:border-border-strong hover:text-text focus-glow md:hidden"
      >
        Menu
      </button>
    </header>
  );
}
