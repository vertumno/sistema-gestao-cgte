import Link from "next/link";
import { ArrowLeft, ExternalLink, SquareKanban, Sparkles } from "lucide-react";

const KANBOARD_URL = "https://board.cefor.ifes.edu.br";
const GEMINI_GEM_URL =
  "https://gemini.google.com/gem/1BARvEhHg2-eo6-9ryzxqlJUx_bjD2fAY?usp=sharing";

const STEPS = [
  {
    index: "01",
    title: "Descreva o que você fez",
    description:
      "Conte para a IA com suas palavras a atividade que realizou — sem se preocupar com formato ou terminologia técnica.",
  },
  {
    index: "02",
    title: "A IA identifica a categoria",
    description:
      "O assistente analisa sua descrição e determina automaticamente em qual categoria do CGTE a tarefa se encaixa.",
  },
  {
    index: "03",
    title: "Receba os dados prontos",
    description:
      "A IA gera o título, a categoria e as informações estruturadas para você cadastrar no Kanboard com um clique.",
  },
];

export default function KanboardHelperPage() {
  return (
    <div className="flex min-h-screen flex-col bg-bg">

      {/* Header */}
      <header className="border-b border-border px-8 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link
            href="/"
            aria-label="Voltar para o início"
            className="group flex items-center gap-2 text-xs font-medium text-text-subtle transition-colors hover:text-text"
          >
            <ArrowLeft
              size={13}
              strokeWidth={1.5}
              className="transition-transform group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
            Início
          </Link>
          <span className="font-mono text-xs text-text-subtle">
            Cefor · IFES · CGTE
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="flex flex-1 flex-col justify-center px-8 py-20">
        <div className="mx-auto w-full max-w-3xl">

          {/* Hero */}
          <div className="reveal mb-16">
            <div className="mb-4 flex items-center gap-2">
              <SquareKanban
                size={16}
                className="text-primary"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <p className="font-mono text-xs font-medium uppercase tracking-widest text-text-subtle">
                Kanboard Task Helper
              </p>
            </div>
            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-text">
              Registre tarefas{" "}
              <span className="gradient-text">sem esforço.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-text-muted">
              Use a inteligência artificial para identificar a categoria certa e
              gerar automaticamente as informações para cadastrar sua atividade
              no Kanboard.
            </p>
            <div className="mt-6 h-px w-12 bg-primary" aria-hidden="true" />
          </div>

          {/* Steps */}
          <ol className="reveal reveal-delay-1 mb-14 space-y-4" aria-label="Como funciona">
            {STEPS.map((step) => (
              <li
                key={step.index}
                className="flex gap-5 rounded-xl border border-border bg-surface p-5 transition-all duration-300 hover:border-border-strong hover:glow"
              >
                <span
                  className="mt-0.5 shrink-0 font-mono text-xs font-medium tracking-widest text-text-subtle"
                  aria-hidden="true"
                >
                  {step.index}
                </span>
                <div>
                  <p className="font-semibold text-text">{step.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-text-muted">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          {/* CTAs */}
          <div className="reveal reveal-delay-2 flex flex-col gap-4 sm:flex-row">

            {/* Primary — Gemini Gem */}
            <a
              href={GEMINI_GEM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Abrir assistente de IA no Gemini — abre em nova aba"
              className="group relative flex flex-1 items-center justify-between gap-4 overflow-hidden rounded-xl bg-primary px-6 py-4 text-primary-contrast transition-all duration-300 hover:glow-strong hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {/* Shine on hover */}
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                aria-hidden="true"
              />
              <div className="flex items-center gap-3">
                <Sparkles size={20} strokeWidth={1.5} aria-hidden="true" />
                <div>
                  <p className="font-display text-base font-semibold leading-snug">
                    Abrir assistente de IA
                  </p>
                  <p className="text-xs font-medium opacity-75">
                    Gemini · identifica categoria e gera o cadastro
                  </p>
                </div>
              </div>
              <ExternalLink
                size={16}
                strokeWidth={1.5}
                className="shrink-0 opacity-60 transition-opacity group-hover:opacity-100"
                aria-hidden="true"
              />
            </a>

            {/* Secondary — Kanboard */}
            <a
              href={KANBOARD_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Abrir Kanboard — abre em nova aba"
              className="group flex items-center justify-between gap-4 rounded-xl border border-border bg-surface px-6 py-4 transition-all duration-300 hover:border-border-strong hover:glow hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:flex-none"
            >
              <div className="flex items-center gap-3">
                <SquareKanban
                  size={18}
                  className="shrink-0 text-text-muted transition-colors group-hover:text-primary"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <div>
                  <p className="font-semibold text-text">Kanboard</p>
                  <p className="text-xs text-text-muted">board.cefor.ifes.edu.br</p>
                </div>
              </div>
              <ExternalLink
                size={14}
                strokeWidth={1.5}
                className="shrink-0 text-text-subtle transition-colors group-hover:text-text-muted"
                aria-hidden="true"
              />
            </a>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-8 py-4">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-xs text-text-subtle">
            Centro de Formação · Instituto Federal do Espírito Santo
          </p>
        </div>
      </footer>

    </div>
  );
}
