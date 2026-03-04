# Design System — Sistema de Gestão CGTE

**Tema:** Emerald Light — IFES Premium Light
**Versão:** 2.0
**Data:** 2026-03-04
**Referências:** Linear, Vercel Dashboard, Notion

---

## Princípios

- **Institucional mas moderno** — identidade IFES/verde preservada, visual elevado
- **Light mode** — fundo claro, cards brancos, tipografia escura legível
- **Zero hardcoded values** — todo styling via CSS custom properties
- **Acessibilidade WCAG AA** — contraste mínimo 4.5:1, focus ring visível

---

## Paleta de Cores

### Tokens Principais (`app/globals.css`)

```css
/* Backgrounds */
--bg: #F2F7F5              /* Fundo geral — verde claríssimo com personalidade */
--surface: #FFFFFF          /* Cards, painéis */
--surface-elevated: #FFFFFF /* Elementos elevados */

/* Tipografia */
--text: #111827             /* Texto principal */
--text-muted: #4B7A63       /* Texto secundário — verde escuro suave */
--text-subtle: #9CB8AC      /* Labels, captions */

/* Marca — Esmeralda IFES */
--primary: #059669          /* Accent principal */
--primary-light: rgba(5,150,105,0.08)  /* Fundo de hover/active */
--primary-contrast: #FFFFFF /* Texto sobre primary */

/* Bordas */
--border: rgba(5,150,105,0.14)        /* Borda padrão */
--border-strong: rgba(5,150,105,0.30) /* Borda em hover/focus */

/* Semântico */
--success: #059669   --success-light: rgba(5,150,105,0.08)
--warning: #D97706   --warning-light: rgba(217,119,6,0.08)
--danger:  #DC2626   --danger-light:  rgba(220,38,38,0.08)
--info:    #2563EB   --info-light:    rgba(37,99,235,0.08)

/* Sombras */
--shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)
--shadow:    0 4px 16px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)

/* Glow — anel verde */
--glow-accent:        0 0 0 3px rgba(5,150,105,0.12), 0 4px 16px rgba(5,150,105,0.10)
--glow-accent-strong: 0 0 0 3px rgba(5,150,105,0.20), 0 8px 24px rgba(5,150,105,0.15)
```

### Mapeamento Tailwind (`tailwind.config.ts`)

Todos os tokens CSS mapeados como classes Tailwind:

| Classe | Token |
|--------|-------|
| `bg-bg` | `--bg` |
| `bg-surface` | `--surface` |
| `text-text` | `--text` |
| `text-text-muted` | `--text-muted` |
| `text-text-subtle` | `--text-subtle` |
| `bg-primary` / `text-primary` | `--primary` |
| `bg-primary-light` | `--primary-light` |
| `border-border` | `--border` |
| `border-border-strong` | `--border-strong` |
| `bg-success` / `bg-success-light` | semântico |
| `bg-warning` / `bg-warning-light` | semântico |
| `bg-danger` / `bg-danger-light` | semântico |
| `bg-info` / `bg-info-light` | semântico |

---

## Tipografia

| Família | Variável | Uso |
|---------|----------|-----|
| Inter | `--font-inter` | Texto corrido, UI (padrão) |
| Space Grotesk | `--font-space-grotesk` | Display, headings (`font-display`) |
| JetBrains Mono | `--font-mono` | Labels mono, versão, código (`font-mono`) |

### Hierarquia

```
text-7xl font-display font-bold  → Hero heading (home)
text-4xl font-display font-bold  → Page headings
text-xl font-display font-semibold → Section headings
text-base                        → Corpo
text-sm                          → Suporte, descrições
text-xs font-mono tracking-widest → Labels, eyebrows
```

---

## Utilities Premium (`globals.css`)

### `.glass`
Card no light mode — branco, borda sutil, sombra suave.
```css
background: #FFFFFF;
border: 1px solid var(--glass-border);
box-shadow: var(--shadow-sm);
```
**Uso:** KpiCard, NaturalLanguageSummary, TemporalContextHeader, PersonCard

### `.glow`
Anel verde sutil — usado em hover de cards e elementos interativos.
```css
box-shadow: var(--glow-accent);
```

### `.glow-strong`
Anel verde intenso — hover de CTAs principais.

### `.gradient-text`
Texto com gradiente esmeralda.
```css
background: linear-gradient(135deg, #059669, #047857);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```
**Uso:** Heading da home, destaques

### `.reveal` + `.reveal-delay-{1-5}`
Animação de entrada: fade + translateY(10px) → translateY(0).
- Duração: 0.45s ease
- Delays: 0.08s, 0.16s, 0.24s, 0.32s, 0.40s

### `.focus-glow`
Ring de foco acessível WCAG.
```css
box-shadow: 0 0 0 2px var(--primary), 0 0 0 4px rgba(5,150,105,0.15);
```

### `.hero-glow::before`
Radial gradient verde sutil no topo — usado na home e kanboard-helper.

---

## Componentes

### Atoms

#### `KpiCard` — `components/dashboard/kpi-card.tsx`
```
Props: label, value, trend, trendDirection
Classes: glass, reveal, hover:glow
Tamanho número: text-3xl font-display font-bold
```

#### `PathCard` — `components/home/path-card.tsx`
```
Props: index, icon, title, description, cta, href, external?, delay?
Ícone: h-14 w-14 rounded-xl, size=28
Sem badge de status (removido em v2)
Hover: border-primary/30, shadow verde, -translate-y-1
```

### Molecules

#### `TemporalContextHeader` — `components/dashboard/temporal-context-header.tsx`
```
Props: range { startDate, endDate }
Consome: useDashboardStore (period, setPeriod)
Classes: glass, glow, reveal
Period options: Mês | Bimestre | Trimestre
```

#### `NaturalLanguageSummary` — `components/dashboard/natural-language-summary.tsx`
```
Props: data (MetricsResponse)
Types: highlight (primary) | category (info) | pgd (success) | alert (warning)
Classes: glass, reveal-delay-1
```

#### `PersonCard` — `components/dashboard/person-card.tsx`
```
Props: person (PersonMetric), tasks (DashboardTaskItem[])
Avatar: inicial do nome, cor da pessoa
Progress bar: finalizadas/total
Expandable task list
Classes: glass, hover:glow
```

### Organisms

#### `PersonCardGrid` — `components/dashboard/person-card-grid.tsx`
```
Grid: 1 col → sm:2 cols → lg:3 cols
Sem ranking, sem comparação entre pessoas
```

---

## Páginas

### Home (`app/page.tsx`)

Layout: full-height, fundo mesh gradient + noise texture

**Background técnico:**
```jsx
/* 3 blobs radiais absolutos com blur 80-100px */
/* Opacity: 30%, 20%, 15% */
/* Noise SVG overlay opacity 2.5% */
```

**Heading:** "Por onde você **quer começar?**" (gradient text no destaque)
**Cards:** 3 PathCards em grid sm:3

### Kanboard Helper (`app/kanboard-helper/page.tsx`)

Layout: standalone (sem DashboardShell)

**Estrutura:**
1. Header com back link
2. Hero com SquareKanban icon + heading
3. 3 steps (ol) explicando o fluxo IA → Kanboard
4. CTA primário: Gemini Gem (bg-primary, shine on hover)
5. CTA secundário: Kanboard board (border card)

**Gemini Gem URL:** `https://gemini.google.com/gem/1BARvEhHg2-eo6-9ryzxqlJUx_bjD2fAY?usp=sharing`
**Kanboard URL:** `https://board.cefor.ifes.edu.br`

---

## Decisões Fixas (não reverter sem alinhamento)

| Decisão | Motivo |
|---------|--------|
| Light mode (não dark) | Solicitação explícita do gestor |
| Verde IFES como accent (#059669) | Identidade institucional |
| PathCard sem badge "Disponível" | Removido por solicitação |
| Home sem subtítulo "Ferramentas para quem cria." | Removido por solicitação |
| Kanboard Task Helper → rota interna `/kanboard-helper` | Página explicativa antes do link externo |
| PGD Helper description curta | "Gere informações para o seu Plano de trabalho." |
| PersonCard sem ranking | Privacidade ética — People Analytics guidelines |

---

**Mantido por:** @ux-design-expert (Uma)
**Última atualização:** 2026-03-04
