"use client";

type HeaderProps = {
  onToggleMobileNav: () => void;
};

export function Header({ onToggleMobileNav }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">Cefor / Ifes</p>
        <h1 className="text-lg font-semibold text-slate-900">Sistema de Gestao CGTE</h1>
      </div>
      <button
        type="button"
        onClick={onToggleMobileNav}
        aria-label="Abrir menu de navegacao"
        className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 outline-none transition hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-emerald-600 md:hidden"
      >
        Menu
      </button>
    </header>
  );
}