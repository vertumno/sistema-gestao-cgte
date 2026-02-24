# Prompt de Vibecoding para Lovable — Dashboard CGTE

> **Contexto:** Frontend-only prototype do dashboard de gestão da CGTE/Cefor. Sem backend, sem API calls. Use dados mock. Foco em interface, interação e visual.

---

## 🎯 Vibe & Tone

**Visual:** Profissional, limpo, institucional. Minimalista mas funcional.
**Tom:** Confiança, clareza, sem frivolidades. Interface que inspira acompanhamento de gestão.
**Referências:** Dashboards de gestão corporativa (não design elaborado, não startup-y)

---

## 🎨 Design System

### Cores Institucionais
- **Verde Cefor/Ifes:** `#1F7D3C` (primary) — usado em headers, botões, destaques
- **Branco:** `#FFFFFF` (background)
- **Cinza claro:** `#F5F5F5` (secondary background, cards)
- **Cinza médio:** `#7A7A7A` (text secondary)
- **Cinza escuro:** `#333333` (text primary)
- **Vermelho (status):** `#E63946` (error, importante)
- **Amarelo (warning):** `#F1A208` (em andamento, atenção)
- **Verde (success):** `#06B6D4` (finalizado)

### Tipografia
- **Font:** Inter ou system-ui (sem serif)
- **Heading 1:** 32px bold, color: #1F7D3C
- **Heading 2:** 24px bold, color: #333333
- **Body:** 14px regular, color: #333333
- **Small:** 12px regular, color: #7A7A7A

### Spacing
- Padding padrão: 16px
- Border radius: 8px
- Shadows leve: `0 2px 8px rgba(0,0,0,0.1)`

---

## 🏗️ Layout Principal

### Header (fixo no topo)
- Logo/título "🏛️ Sistema de Gestão CGTE" alinhado à esquerda
- Cor de fundo: Verde `#1F7D3C`
- Texto branco
- Altura: 64px
- Padding: 16px

### Sidebar (esquerda, responsiva)
- Navegação vertical: "Dashboard", "Relatório PGD", "Configurações"
- Ícones + labels
- Item ativo com fundo verde claro
- Em mobile: hamburger menu que expande
- Largura desktop: 240px
- Largura mobile: full screen overlay

### Main Content (direita)
- Padding: 24px
- Max-width: 1400px
- Responsivo: 1 coluna mobile, 2-3 colunas desktop

### Footer
- Texto pequeno: versão, link "Documentação"
- Cor: #7A7A7A
- Border-top: 1px #F5F5F5

---

## 📊 Componentes Específicos

### 1. Seletor de Período (Story 2.1)
```
[Período: Bimestre ▼] [Fevereiro-Março 2026 ▼] [Aplicar]
```
- Dropdowns combinados
- Período atual pré-selecionado
- Feedback visual: verde quando aplicado

### 2. Cards de KPIs (Story 2.5) — Top da página
Layout de 5 cards em grid responsivo (1 mobile, 2 tablet, 5 desktop):

**Card Template:**
```
┌─────────────────────────┐
│ Total de Tarefas        │
│                         │
│ 47                      │ ← número grande, bold
│                         │
│ ↑ +8 (vs período ant.)  │ ← verde se ↑, vermelho se ↓
└─────────────────────────┘
```

**5 Cards:**
1. Total de Tarefas: `47`
2. Finalizadas: `32` (68%)
3. Em Andamento: `12`
4. Categorias Ativas: `15 de 18`
5. Entregas PGD Cobertas: `18 de 29`

### 3. Gráfico de Barras — Tarefas por Categoria (Story 2.2)
```
Tarefas por Categoria (Fev-Mar 2026)

Comunicação Visual      ██████████ 8
Produção Audiovisual    ████████ 6
Formação e Capacitação  ███████ 5
Conteúdo Educacional    ███ 3
Libras Tradução         ██ 2
[...outras categorias com 0-1 tarefas]

Legenda: Verde = finalizado, Amarelo = em andamento
```
- Tipo: barras horizontais
- Cor: verde para finalizados, amarelo em andamento
- Labels com números
- Altura: ~400px
- Suporta clique em categoria para expandir detalhes (funcionalidade futura)

### 4. Gráfico de Barras — Tarefas por Pessoa (Story 2.3)
```
Tarefas por Pessoa (Fev-Mar 2026)

Juliana         ██████ 12
Monia           █████ 10
Elton           ████ 8
Andréia         ███ 6
Marquito        ██ 4
Raquel          █ 2
```
- Tipo: barras verticais
- Cor: uma cor por pessoa (ou gradiente verde)
- Altura: ~300px
- Filtro "Por Área" acima: [Design] [Libras] [Audiovisual] [Gestão]

### 5. Gráfico de Linha — Evolução Temporal (Story 2.4)
```
Evolução de Tarefas — Últimos 6 Meses

30│                      ╱╲
25│                 ╱╲  ╱  ╲
20│            ╱╲  ╱  ╲╱    ╲
15│       ╱╲  ╱  ╲╱
10│  ╱╲  ╱  ╲╱
 5│ ╱  ╲╱
 0└─────────────────────────
   Set Out Nov Dez Jan Fev

Legenda: Trimestres destacados (Set-Out-Nov | Dez-Jan-Fev)
```
- Tipo: line chart
- Cores: linha verde principal
- Marcadores em fim de trimestre: linhas verticais tracejadas
- Tooltip ao hover com data e quantidade
- Altura: ~300px

### 6. Tabela — Detalhes por Categoria (Story 2.2 expandida)
```
╔════════════════════════════════════════════╗
║ Comunicação Visual — 8 tarefas             ║
╠════════════════════════════════════════════╣
║ Tarefa                    │ Status   │ Fim ║
╟────────────────────────────┼──────────┼─────╢
║ Banner Dia das Mães        │ ✓ Fini  │ 5/2 ║
║ Banner Páscoa              │ ✓ Fini  │ 8/3 ║
║ Campanha eleitoral         │ ↻ Anda  │ —   ║
║ Kit divulgação PS          │ ✓ Fini  │ 10/3║
║ [...mais 4 tarefas]        │ —       │ —   ║
╚════════════════════════════════════════════╝
```
- Expandível ao clicar em categoria
- Colunas: Tarefa, Status (ícone + label), Data fim
- Status: ✓ Finalizado (verde), ↻ Em andamento (amarelo), ⊙ Backlog (cinza)

---

## 📱 Responsividade

### Desktop (1400px+)
- Sidebar: 240px fixo
- 2-3 colunas de layout
- Gráficos lado a lado
- Tabelas expandidas

### Tablet (768px-1399px)
- Sidebar colapsável (icon-only ou drawer)
- 1-2 colunas
- Gráficos em full-width stacked
- Tabelas scrolláveis horizontalmente

### Mobile (< 768px)
- Sidebar: hamburger menu overlay
- 1 coluna full
- Gráficos: reduzidos, altura menor
- Cards de KPI: 2 em linha, stacked em telas muito pequenas

---

## 🎬 Interações & Microinterações

### Hover States
- Botões: fundo mais escuro, cursor pointer
- Gráficos: tooltip ao hover
- Linhas de tabela: fundo cinza claro (hover)

### Estados de Carregamento
- Skeleton loaders nos gráficos
- Animação de pulsação nos cards de KPI

### Feedback Visual
- Clique em período: botão "Aplicar" fica verde com ✓
- Clique em categoria: expande a tabela com animação fade-in
- Copy button (futura integração): "Copiar" → "✓ Copiado!" (2s)

---

## 📂 Dados Mock Sugeridos

```javascript
// Período selecionado
period = "Fevereiro-Março 2026"
periodType = "Bimestre"

// KPIs
kpis = [
  { label: "Total de Tarefas", value: 47, variation: "+8", isPositive: true },
  { label: "Finalizadas", value: 32, percentage: "68%", variation: "+5", isPositive: true },
  { label: "Em Andamento", value: 12, variation: "-2", isPositive: false },
  { label: "Categorias Ativas", value: "15 de 18", variation: "−" },
  { label: "Entregas PGD Cobertas", value: "18 de 29", variation: "−" }
]

// Tarefas por categoria (top 6)
categoriesByCount = [
  { name: "Comunicação Visual", count: 8, finalized: 6, inProgress: 2 },
  { name: "Produção Audiovisual", count: 6, finalized: 6, inProgress: 0 },
  { name: "Formação e Capacitação", count: 5, finalized: 4, inProgress: 1 },
  { name: "Conteúdo Educacional", count: 3, finalized: 3, inProgress: 0 },
  { name: "Libras Tradução", count: 2, finalized: 2, inProgress: 0 },
  // ... 13 outras com 0-1
]

// Tarefas por pessoa
peopleByCount = [
  { name: "Juliana", tasks: 12, area: "Design" },
  { name: "Monia", tasks: 10, area: "Design" },
  { name: "Elton", tasks: 8, area: "Gestão" },
  { name: "Andréia", tasks: 6, area: "Libras" },
  { name: "Marquito", tasks: 4, area: "Gestão" },
  { name: "Raquel", tasks: 2, area: "Administrativo" }
]

// Evolução temporal (últimos 6 meses)
evolutionByMonth = [
  { month: "Setembro", value: 12 },
  { month: "Outubro", value: 18 },
  { month: "Novembro", value: 22 },
  { month: "Dezembro", value: 16 },
  { month: "Janeiro", value: 28 },
  { month: "Fevereiro", value: 32 }
]
```

---

## 🚀 Como Usar Este Prompt no Lovable

1. **Copy this entire prompt**
2. **Paste into Lovable's AI code generation input**
3. **Add visual reference:** "Make it look like a professional management dashboard, similar to Tableau or Google Analytics but simpler"
4. **Request:** "Create the frontend for this dashboard. Use React, Tailwind CSS. No backend needed — use mock data. Focus on layout, colors, and interactivity. Make it responsive."

---

## ✅ Checklist de Componentes a Implementar

- [x] Header com branding Cefor/Ifes
- [x] Sidebar com navegação
- [x] Seletor de período
- [x] 5 Cards de KPIs (top)
- [x] Gráfico barras — tarefas por categoria
- [x] Gráfico barras — tarefas por pessoa (com filtro de área)
- [x] Gráfico linha — evolução temporal
- [x] Tabela expansível — detalhes por categoria
- [x] Responsividade (mobile, tablet, desktop)
- [x] Microinterações (hover, expandir, tooltips)
- [x] Cores institucionais aplicadas
- [x] WCAG AA: contraste, navegação por teclado, aria-labels

---

## 📌 Notas Importantes

- **Sem backend:** Todos os dados são mock/hardcoded. Placeholders OK.
- **Sem integração Kanboard:** API calls virão depois. Agora é só visual.
- **Sem autenticação:** Login não é escopo do Lovable. Assume usuário já logado.
- **Foco em acessibilidade:** WCAG AA é obrigatório. Use contraste adequado, labels semânticos.
- **Deploy não é escopo:** Lovable entrega código. Next.js será integrado depois.

---

**Pronto para copiar e colar no Lovable! 🎯**
