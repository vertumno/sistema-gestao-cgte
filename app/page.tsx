import { SquareKanban, BarChart3, FileBarChart } from "lucide-react";
import { PathCard } from "@/components/home/path-card";

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-bg">

      {/* ── Mesh gradient background ───────────────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Primary blob — top left */}
        <div
          className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, #6ee7b7 0%, transparent 70%)",
            filter: "blur(80px)"
          }}
        />
        {/* Secondary blob — top right */}
        <div
          className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #34d399 0%, transparent 70%)",
            filter: "blur(100px)"
          }}
        />
        {/* Tertiary blob — bottom center */}
        <div
          className="absolute bottom-0 left-1/2 h-[400px] w-[700px] -translate-x-1/2 rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, #a7f3d0 0%, transparent 70%)",
            filter: "blur(90px)"
          }}
        />
        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "128px 128px"
          }}
        />
      </div>

      {/* ── Header ─────────────────────────────────────────── */}
      <header className="relative z-10 px-8 py-5">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="h-2 w-2 rounded-full bg-primary"
              style={{ boxShadow: "0 0 8px rgba(5,150,105,0.5)" }}
              aria-hidden="true"
            />
            <span className="font-mono text-xs font-medium tracking-widest text-text-subtle uppercase">
              Cefor · IFES · CGTE
            </span>
          </div>
          <span className="font-mono text-xs text-text-subtle">
            v{process.env.NEXT_PUBLIC_APP_VERSION ?? "0.1.0"}
          </span>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────── */}
      <main className="relative z-10 flex flex-1 flex-col justify-center px-8 py-16">
        <div className="mx-auto w-full max-w-5xl">

          {/* Eyebrow */}
          <div className="reveal mb-6 flex items-center gap-3">
            <div className="h-px flex-1 max-w-8 bg-primary opacity-40" aria-hidden="true" />
            <span className="font-mono text-xs font-medium uppercase tracking-widest text-primary">
              Sistema de Gestão
            </span>
          </div>

          {/* Display heading */}
          <div className="reveal mb-6">
            <h1 className="font-display text-5xl font-bold leading-[1.1] tracking-tight text-text sm:text-6xl lg:text-7xl">
              Por onde você{" "}
              <span
                className="gradient-text"
                style={{ display: "inline-block" }}
              >
                quer começar?
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="reveal reveal-delay-1 mb-14 max-w-lg text-base leading-relaxed text-text-muted sm:text-lg">
            Gestão integrada para equipes criativas — do registro de atividades
            às métricas de entrega e metas do PGD.
          </p>

          {/* Cards */}
          <div className="reveal reveal-delay-2 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <PathCard
              index="01"
              icon={SquareKanban}
              title="Kanboard Task Helper"
              description="Use IA para identificar a categoria da tarefa e gerar as informações prontas para cadastrar no Kanboard."
              cta="Ver como funciona"
              href="/kanboard-helper"
              delay={1}
            />
            <PathCard
              index="02"
              icon={BarChart3}
              title="Dashboard de Gestão"
              description="Métricas da equipe, entregas por categoria, visão individual de cada membro e cobertura do PGD."
              cta="Ver dashboard"
              href="/dashboard"
              delay={2}
            />
            <PathCard
              index="03"
              icon={FileBarChart}
              title="PGD Helper"
              description="Gere informações para o seu Plano de trabalho."
              cta="Gerar relatório"
              href="/relatorio-pgd"
              delay={3}
            />
          </div>

        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="relative z-10 px-8 py-5">
        <div className="mx-auto max-w-5xl">
          <p className="font-mono text-xs text-text-subtle">
            Centro de Formação · Instituto Federal do Espírito Santo
          </p>
        </div>
      </footer>

    </div>
  );
}
