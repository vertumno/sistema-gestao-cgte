# Sistema de Gestao CGTE/Cefor - Frontend Architecture Document

**Status:** Draft - Ready for story breakdown  
**Version:** 0.1  
**Date:** 24/02/2026  
**Input Base:** `docs/prd.md`, `docs/architecture.md`

---

## 1. Template and Framework Selection

Projeto greenfield com stack definida no PRD/arquitetura principal:
- Next.js (App Router) + React + TypeScript
- Tailwind CSS + shadcn/ui
- Deploy Vercel

### 1.1 Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 24/02/2026 | 0.1 | Primeira versao da arquitetura de frontend | @architect |

---

## 2. Frontend Tech Stack

Sincronizado com `docs/architecture.md`.

| Category | Technology | Version | Purpose | Rationale |
|----------|------------|---------|---------|-----------|
| Framework | Next.js (App Router) | 16.x | SSR/ISR + rotas UI | Definido no PRD |
| UI Library | React | 19.x | Componentes e hooks | Base do framework |
| State Management | Zustand | 5.x | Estado cliente (filtros/UI) | Preset ativo no PRD |
| Routing | Next.js App Router | 16.x | Roteamento por arquivo | Padrão Next |
| Build Tool | Next.js build | 16.x | Build e otimização | Padrão Next |
| Styling | Tailwind CSS | 3.x | Design system utilitário | Definido no PRD |
| Testing | Vitest + RTL | 2.x + 15.x | Teste de componentes | Simples e rápido |
| Component Library | shadcn/ui | latest compatible | Blocos reutilizáveis | Consistência |
| Form Handling | React Hook Form + Zod | 7.x + 3.x | Validação de formulários | Ergonomia e tipagem |
| Animation | CSS + framer-motion (pontual) | 11.x | Transições de UI | Apenas quando útil |
| Dev Tools | ESLint + Prettier | 9.x + 3.x | Padronização | Gate de qualidade |

---

## 3. Project Structure

```text
app/
|-- layout.tsx
|-- page.tsx
|-- dashboard/page.tsx
|-- relatorio-pgd/page.tsx
|-- assistente/page.tsx
|-- configuracoes/page.tsx
|-- api/
|   |-- metrics/route.ts
|   |-- report-pgd/route.ts
|   |-- assistant/suggest/route.ts
|   |-- assistant/publish/route.ts
components/
|-- layout/
|-- dashboard/
|-- report/
|-- assistant/
|-- taxonomy/
|-- ui/
hooks/
|-- use-period-filter.ts
|-- use-copy-feedback.ts
stores/
|-- dashboard-store.ts
|-- report-store.ts
lib/
|-- api-client.ts
|-- services/
|   |-- metrics-service.ts
|   |-- report-service.ts
|   |-- assistant-service.ts
|-- formatters/
styles/
|-- globals.css
types/
|-- dashboard.ts
|-- report.ts
|-- assistant.ts
tests/
|-- unit/
|-- integration/
|-- e2e/
```

---

## 4. Component Standards

### 4.1 Component Template

```typescript
import { cn } from "@/lib/utils";

type KpiCardProps = {
  label: string;
  value: string | number;
  trend?: string;
  className?: string;
};

export function KpiCard({ label, value, trend, className }: KpiCardProps) {
  return (
    <section className={cn("rounded-lg border bg-card p-4", className)} aria-label={label}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
      {trend ? <p className="mt-1 text-xs text-muted-foreground">{trend}</p> : null}
    </section>
  );
}
```

### 4.2 Naming Conventions

- Componentes: `PascalCase` (`CategoryChart.tsx`)
- Hooks: `camelCase` com prefixo `use` (`usePeriodFilter.ts`)
- Stores Zustand: `kebab-case` arquivo + `camelCase` export (`dashboard-store.ts`, `useDashboardStore`)
- Rotas App Router: `kebab-case` (`relatorio-pgd`)
- Tipos compartilhados: `*.ts` por domínio em `types/`

---

## 5. State Management

### 5.1 Store Structure

```text
stores/
|-- dashboard-store.ts
|-- report-store.ts
|-- assistant-store.ts
```

### 5.2 State Management Template

```typescript
import { create } from "zustand";

type Period = "mes" | "bimestre" | "trimestre";

type DashboardState = {
  period: Period;
  area?: string;
  servidor?: string;
  setPeriod: (period: Period) => void;
  setFilters: (filters: { area?: string; servidor?: string }) => void;
  clearFilters: () => void;
};

export const useDashboardStore = create<DashboardState>((set) => ({
  period: "trimestre",
  area: undefined,
  servidor: undefined,
  setPeriod: (period) => set({ period }),
  setFilters: (filters) => set(filters),
  clearFilters: () => set({ area: undefined, servidor: undefined }),
}));
```

---

## 6. API Integration

### 6.1 Service Template

```typescript
import { apiClient } from "@/lib/api-client";
import type { MetricsResponse } from "@/types/dashboard";

export async function getDashboardMetrics(params: {
  period: "mes" | "bimestre" | "trimestre";
  area?: string;
  servidor?: string;
}): Promise<MetricsResponse> {
  const query = new URLSearchParams({
    period: params.period,
    ...(params.area ? { area: params.area } : {}),
    ...(params.servidor ? { servidor: params.servidor } : {}),
  });

  return apiClient<MetricsResponse>(`/api/metrics?${query.toString()}`);
}
```

### 6.2 API Client Configuration

```typescript
export async function apiClient<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const requestId = response.headers.get("x-request-id") ?? "n/a";
    throw new Error(`API_ERROR:${response.status}:requestId=${requestId}`);
  }

  return (await response.json()) as T;
}
```

---

## 7. Routing

### 7.1 Route Configuration

```typescript
// App Router by file-system:
// /                 -> app/page.tsx (PoC inicial)
// /dashboard        -> app/dashboard/page.tsx
// /relatorio-pgd    -> app/relatorio-pgd/page.tsx
// /assistente       -> app/assistente/page.tsx
// /configuracoes    -> app/configuracoes/page.tsx
//
// MVP sem autenticação formal.
// Fase futura com auth: usar middleware.ts para proteger rotas administrativas.
```

---

## 8. Styling Guidelines

### 8.1 Styling Approach

- Tailwind como base.
- Tokens visuais em CSS variables.
- Componentes shadcn/ui para blocos comuns.
- Paleta alinhada à identidade Ifes (verde/branco).
- Acessibilidade obrigatória: contraste WCAG AA, foco visível, navegação por teclado.

### 8.2 Global Theme Variables

```css
:root {
  --color-bg: #f8faf9;
  --color-surface: #ffffff;
  --color-text: #0f172a;
  --color-muted: #475569;
  --color-primary: #0f766e;
  --color-primary-contrast: #ffffff;
  --color-border: #d1d5db;
  --color-danger: #b91c1c;

  --radius-md: 0.5rem;
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.08);
}
```

---

## 9. Testing Requirements

### 9.1 Component Test Template

```typescript
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { KpiCard } from "@/components/dashboard/kpi-card";

describe("KpiCard", () => {
  it("renderiza label e valor", () => {
    render(<KpiCard label="Finalizadas" value={12} />);
    expect(screen.getByText("Finalizadas")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("exibe trend quando informado", async () => {
    const user = userEvent.setup();
    render(<KpiCard label="Total" value={40} trend="+10%" />);
    await user.tab();
    expect(screen.getByText("+10%")).toBeInTheDocument();
  });
});
```

### 9.2 Testing Best Practices

1. Unit tests para componentes críticos (filtros, KPIs, tabelas, cópia de relatório).
2. Integration tests para rotas de UI com serviços mockados.
3. E2E para fluxos centrais: dashboard e relatório PGD.
4. Cobertura alvo mínima: 80% em componentes de domínio.
5. Incluir cenários de acessibilidade (foco, aria-label, teclado).

---

## 10. Environment Configuration

- `NEXT_PUBLIC_APP_NAME="Sistema de Gestao CGTE"`
- `NEXT_PUBLIC_DEFAULT_PERIOD="trimestre"`
- `KANBOARD_API_URL` (server-only)
- `KANBOARD_API_TOKEN` (server-only)
- `ANTHROPIC_API_KEY` (server-only, Epic 4)

---

## 11. Frontend Developer Standards

### 11.1 Critical Coding Rules

1. Nunca chamar Kanboard direto no client; usar apenas `/api/*`.
2. Todo componente interativo deve ter suporte a teclado e `aria-*` quando aplicável.
3. Evitar lógica de negócio em componente de apresentação; mover para `lib/services` ou hooks.
4. Não usar estado global para dados que podem ficar em URL/search params.
5. Toda tela deve tratar estados: loading, empty e error.

### 11.2 Quick Reference

- `npm run dev` - iniciar ambiente local
- `npm run lint` - validar lint
- `npm run typecheck` - validar tipos
- `npm test` - executar testes
- Imports:
  - `@/components/*`
  - `@/lib/*`
  - `@/stores/*`
  - `@/types/*`
