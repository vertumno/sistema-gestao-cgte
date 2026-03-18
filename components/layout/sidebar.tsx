"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SquareKanban, BarChart3, FileBarChart, Settings, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  external?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/kanboard-helper", label: "Kanboard Task Helper", icon: SquareKanban },
  { href: "/dashboard",       label: "Dashboard de Gestão",  icon: BarChart3 },
  { href: "/relatorio-pgd",   label: "PGD Helper",           icon: FileBarChart },
  { href: "/configuracoes",   label: "Configurações",        icon: Settings }
];

type SidebarProps = {
  className?: string;
  onNavigate?: () => void;
};

export function Sidebar({ className, onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegação principal"
      className={cn(
        "flex h-full w-60 flex-col border-r border-border bg-surface",
        className
      )}
    >
      {/* Back to home */}
      <div className="border-b border-border px-4 py-4">
        <Link
          href="/"
          onClick={onNavigate}
          aria-label="Voltar para o início"
          className="group flex items-center gap-2 text-xs font-medium text-text-subtle transition-colors hover:text-text focus-glow rounded outline-none"
        >
          <ArrowLeft
            size={13}
            strokeWidth={1.5}
            className="transition-transform group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
          Início
        </Link>
      </div>

      {/* Nav items */}
      <ul className="flex-1 space-y-0.5 p-3">
        {NAV_ITEMS.map((item) => {
          const isActive = !item.external && pathname === item.href;

          const linkContent = (
            <span
              className={cn(
                "group flex w-full items-center gap-3 rounded px-3 py-2.5 text-sm outline-none transition-all focus-glow",
                isActive
                  ? "bg-primary-light text-primary"
                  : "text-text-muted hover:bg-primary-light/40 hover:text-text"
              )}
            >
              <item.icon
                size={15}
                strokeWidth={1.5}
                className={cn(
                  "shrink-0 transition-colors",
                  isActive ? "text-primary" : "text-text-subtle group-hover:text-text-muted"
                )}
                aria-hidden="true"
              />
              <span className="leading-snug">{item.label}</span>
              {isActive && (
                <span
                  className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-primary glow"
                  aria-hidden="true"
                />
              )}
              {item.external && (
                <span className="ml-auto text-xs text-text-subtle" aria-hidden="true">↗</span>
              )}
            </span>
          );

          return (
            <li key={item.href}>
              {item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${item.label} — abre em nova aba`}
                  className="block rounded outline-none focus-glow"
                >
                  {linkContent}
                </a>
              ) : (
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-label={`Ir para ${item.label}`}
                  aria-current={isActive ? "page" : undefined}
                  className="block rounded outline-none focus-glow"
                >
                  {linkContent}
                </Link>
              )}
            </li>
          );
        })}
      </ul>

      {/* Footer */}
      <div className="border-t border-border px-4 py-3">
        <p className="font-mono text-xs text-text-subtle">Cefor · IFES</p>
      </div>
    </nav>
  );
}
