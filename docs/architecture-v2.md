# Arquitetura v2 — Sistema de Gestão CGTE

**Versão:** 2.0
**Data:** 2026-03-04
**Agente:** @architect (Aria)

---

## Stack

| Camada | Tecnologia |
|--------|------------|
| Framework | Next.js 16.1.6 (App Router) |
| UI | React 19, TypeScript |
| Estilo | Tailwind CSS + CSS Custom Properties |
| Estado | Zustand |
| Fonte de dados | Kanboard API (JSON-RPC) |
| Deploy | Vercel (auto-deploy em push main) |

---

## Estrutura de Pastas

```
app/
├── api/
│   ├── metrics/route.ts       ← Endpoint principal do dashboard
│   └── import-csv/route.ts    ← Fallback CSV
├── dashboard/page.tsx          ← Dashboard (usa useDashboardData hook)
├── kanboard-helper/page.tsx    ← Página explicativa Kanboard + Gemini
├── relatorio-pgd/              ← PGD Helper
├── globals.css                 ← Design tokens (CSS vars) + utilities
└── layout.tsx                  ← Fontes (Inter, Space Grotesk, JetBrains Mono)

components/
├── dashboard/
│   ├── area-filter.tsx
│   ├── category-chart.tsx
│   ├── category-table.tsx
│   ├── csv-import-card.tsx
│   ├── kpi-card.tsx / kpi-grid.tsx
│   ├── natural-language-summary.tsx  ← v2
│   ├── person-card.tsx               ← v2
│   ├── person-card-grid.tsx          ← v2
│   ├── task-list-expandable.tsx
│   ├── temporal-chart.tsx
│   └── temporal-context-header.tsx   ← v2
├── home/
│   └── path-card.tsx
└── layout/
    ├── dashboard-shell.tsx
    ├── footer.tsx
    ├── header.tsx
    ├── mobile-nav.tsx
    └── sidebar.tsx

hooks/
└── use-dashboard-data.ts    ← Estado + fetch do dashboard (novo em v2)

lib/
├── kanboard-client.ts       ← Client API Kanboard
├── metrics.ts               ← buildMetricsResponse
├── natural-language.ts      ← generateSummaryLines (lógica estática)
├── taxonomy.ts              ← getTaxonomy
└── utils.ts

stores/
└── dashboard-store.ts       ← Zustand: period, area

config/
├── taxonomy.json            ← 18 categorias CGTE → PGD
└── team-members.json        ← 6 pessoas com cores e áreas

types/
└── dashboard.ts             ← MetricsResponse, DashboardTaskItem, etc.
```

---

## Fluxo de Dados

### API Route — `/api/metrics`

```
GET /api/metrics?period=trimestre&area=Todas
│
├─ unstable_cache (TTL 5min, tag "kanboard")   ← NOVO v2
│   ├─ KanboardClient.getAllTasks()
│   │   ├─ getAllTasks(project_id=47, status_id=1) → abertas
│   │   └─ getAllTasks(project_id=47, status_id=0) → fechadas
│   ├─ KanboardClient.getAllCategories(project_id=47)
│   └─ getTaxonomy() → config/taxonomy.json
│
├─ buildMetricsResponse({ tasks, categories, taxonomy, teamMembers, period, area })
│   ├─ filterByPeriod   ← usa completedAt para tarefas fechadas
│   ├─ filterByArea
│   ├─ aggregateByCategory / aggregateByPerson / aggregateByMonth
│   └─ calculateKpis
│
└─ Return MetricsResponse (200) | { message } (503)
```

### Dashboard Page

```
DashboardPage
├─ useDashboardData()           ← hook extraído em v2
│   ├─ useDashboardStore()      ← Zustand: period, area
│   ├─ fetch /api/metrics
│   └─ returns: data, loading, error, source, handleCsvImport
│
├─ Loading state
├─ Error state → CsvImportCard (fallback)
├─ Empty state (totalTasks === 0)
└─ Dashboard principal
    ├─ TemporalContextHeader    ← sempre
    ├─ AreaFilter               ← sempre
    ├─ NaturalLanguageSummary   ← sempre (se data)
    ├─ KpiGrid                  ← guard: kpis.length > 0
    ├─ CategoryChart + Table    ← guard: categories.length > 0
    ├─ PersonCardGrid           ← guard: persons.length > 0
    └─ TemporalChart            ← guard: months.length > 0
```

---

## Cache Strategy

| Layer | Mecanismo | TTL |
|-------|-----------|-----|
| Kanboard raw fetch | `unstable_cache` (Next.js) | 5 min |
| Filtros period/area | Aplicados em memória | — |
| CSV data | Estado local React | Sessão |

**Regra:** filtros nunca entram na cache key — evita explosão combinatorial.
**Invalidação manual:** `revalidateTag("kanboard")` se necessário.

---

## Estado Global (Zustand)

| Campo | Tipo | Default |
|-------|------|---------|
| `period` | `PeriodType` | `"trimestre"` |
| `area` | `AreaFilter` | `"Todas"` |

---

## Tipos Críticos

```typescript
PeriodType = "mes" | "bimestre" | "trimestre"
AreaFilter  = "Todas" | "Design" | "Libras" | "Audiovisual" | "Gestao"

MetricsResponse {
  kpis: KpiData[]
  categories: CategoryMetric[]
  persons: PersonMetric[]
  months: MonthMetric[]
  tasksByCategory: Record<string, DashboardTaskItem[]>
  tasksByPerson: Record<string, DashboardTaskItem[]>
  range: { startDate: string; endDate: string }
  totalTasks: number
}
```

---

## Decisões Arquiteturais

| Decisão | Motivo |
|---------|--------|
| `unstable_cache` no fetch bruto | `revalidate` não funciona em route handlers dinâmicos com searchParams |
| Filtros em memória, fora da cache key | Evita N entradas de cache por combinação period×area |
| Hook `useDashboardData` | Separação de concerns — page faz só JSX |
| Section guards | Seção vazia não derruba o dashboard inteiro |
| LLM descartado (NaturalLanguageSummary) | Fora de escopo neste momento — lógica estática mantida |
| CSV como fallback permanente | Degradação graciosa quando API Kanboard indisponível |

---

## Variáveis de Ambiente

```
KANBOARD_API_URL=https://board.cefor.ifes.edu.br/jsonrpc.php
KANBOARD_API_TOKEN=<token>
KANBOARD_API_USER=api.cgte
KANBOARD_API_PASSWORD=<token>
KANBOARD_PROJECT_ID=47
```

---

## Pendências Técnicas

| Item | Prioridade |
|------|------------|
| Verificar mapeamento categoryId Kanboard → taxonomy (IDs project 47 vs CSV) | Média |
| Persistir CSV data em localStorage como backup offline | Baixa |

---

**Mantido por:** @architect (Aria)
**Última atualização:** 2026-03-04
