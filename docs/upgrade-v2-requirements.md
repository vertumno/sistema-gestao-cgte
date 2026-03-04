# Upgrade v2 — Sistema de Gestão CGTE

**Data:** 2026-03-03
**Origem:** Sessão de elicitação com @analyst (Atlas)
**Status:** Requisitos aprovados — aguardando design e implementação

---

## Contexto

O sistema atual foi entregue como MVP funcional (3 épicos completos). Após uso real em produção com a API Kanboard integrada, o gestor identificou que o dashboard não serve ao propósito diário: os dados são genéricos, sem interpretação, e o design não reflete a identidade de uma área criativa.

Esta documentação registra os requisitos levantados via elicitação estruturada para orientar o upgrade v2.

---

## Problemas Identificados (Voz do Usuário)

> *"Não estou gostando do layout, não estou gostando das métricas, dos dados apresentados, da visualização. Para mim não está servindo de nada as informações apresentadas. Não sei de qual período está sendo exibido as informações. Realmente não está legal nada."*

| Problema | Impacto |
|----------|---------|
| Período atual não é claro na tela | Usuário não sabe o que está vendo |
| Dados sem interpretação | Números soltos sem significado prático |
| Design genérico | Não reflete identidade de área criativa |
| Métricas irrelevantes | KPIs não respondem perguntas reais de gestão |
| Sem visão simultânea de períodos | Impossível comparar mês / trimestre / ano |
| Exposição individual de funcionários | Risco de constrangimento |

---

## Perfil de Uso

| Aspecto | Definição |
|---------|-----------|
| **Usuário primário** | Gestão/coordenação (acesso diário) |
| **Usuário secundário** | Qualquer membro da equipe |
| **Página PGD** | Uso individual por cada servidor |
| **Frequência** | Diária |
| **Dispositivo** | Computador (desktop first) |
| **Contexto de reunião** | Sim — apresentado em projetor para a equipe |

---

## Princípios Fundamentais do Upgrade

| Princípio | Descrição |
|-----------|-----------|
| **Inteligência antes de dados** | Toda informação acompanhada de interpretação em linguagem natural |
| **Design como produto** | Interface de alto padrão — referência, não funcional básico |
| **Privacidade por padrão** | Dados individuais nunca expostos de forma comparativa |
| **Clareza temporal** | Usuário sempre sabe exatamente qual período está visualizando |
| **Uso diário** | Cada acesso deve entregar valor imediato, sem esforço de interpretação |

---

## Nova Estrutura do Dashboard

### Arquitetura de Tela (top → bottom)

```
┌─────────────────────────────────────────────────┐
│  CABEÇALHO DE CONTEXTO TEMPORAL                 │
│  "Você está vendo: Março 2026 · Trimestre 1"    │
│  [Mês] [Trimestre] [Ano] [Personalizado]        │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  RESUMO INTELIGENTE (linguagem natural)         │
│  Texto gerado automaticamente interpretando     │
│  os dados do período selecionado                │
└─────────────────────────────────────────────────┘

┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐
│   MÊS    │ │TRIMESTRE │ │   ANO    │ │TENDÊNCIA│
│ KPIs     │ │ KPIs     │ │ KPIs     │ │  ↑↓→   │
└──────────┘ └──────────┘ └──────────┘ └─────────┘

┌─────────────────────────────────────────────────┐
│  SAÚDE DAS CATEGORIAS                           │
│  Visualização + parágrafo de interpretação      │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  EQUIPE — VISÃO COLETIVA                        │
│  Cards por pessoa (sem ranking/comparação)      │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  EVOLUÇÃO TEMPORAL                              │
│  Gráfico interativo + interpretação             │
└─────────────────────────────────────────────────┘
```

---

## Requisitos de Análise em Linguagem Natural

Cada seção deve ter um bloco de interpretação gerado automaticamente:

| Seção | Exemplo de texto |
|-------|-----------------|
| Resumo geral | *"A equipe acelerou 15% em relação ao mês anterior, com destaque para Produção Audiovisual"* |
| Categorias | *"Comunicação Visual concentra 40% das entregas — maior volume do trimestre"* |
| Backlog | *"Há 8 tarefas paradas há mais de 15 dias — pode indicar bloqueio ou repriorização necessária"* |
| PGD | *"67% das entregas do trimestre já foram cobertas — ritmo compatível com a meta"* |
| Tendência | *"Março manteve o ritmo de fevereiro. Historicamente abril tende a ser mais intenso"* |

---

## Métricas Prioritárias

### Manter e evoluir
| Métrica | Por quê importa |
|---------|----------------|
| Tarefas finalizadas no período | Entrega real da equipe |
| % PGD cumprido no trimestre | Compromisso institucional |
| Categorias com maior backlog | Onde há gargalo |
| Tendência (acelerando/desacelerando) | Saúde do ritmo |
| Tarefas sem responsável | Risco de esquecimento |

### Remover ou desprioritizar
- KPIs genéricos sem contexto
- Gráficos que duplicam informação
- Dados que não geram pergunta nem decisão

---

## Requisitos de Privacidade (Não Negociáveis)

### O que NÃO fazer
- Ranking de produtividade entre pessoas
- Comparação direta de desempenho individual
- Destaque negativo ("quem menos produziu")
- Exposição de dados sem contexto

### O que FAZER
- Cards individuais mostram contexto próprio — sem comparação com colegas
- Métricas de equipe sempre agregadas (total do grupo)
- Se houver destaque individual, sempre positivo (reconhecimento)
- Seguir princípios de **People Analytics Ético** (Google re:Work, SHRM guidelines)

---

## Requisitos de Design

| Aspecto | Especificação |
|---------|--------------|
| **Referência visual** | Notion, Linear, Vercel Dashboard |
| **Elementos interativos** | Hover states, animações suaves, transições |
| **Tipografia** | Hierarquia clara, números grandes e legíveis |
| **Paleta** | Coerente com identidade CGTE/Cefor |
| **Modo reunião** | Legível em projetor (contraste alto, fonte grande) |
| **Responsividade** | Desktop first, funcional em mobile |
| **Prioridade** | Design é prioridade — área de design deve ter orgulho do sistema |

---

## Visão de Períodos

O usuário deve poder ver **mês, trimestre e ano simultaneamente** na mesma tela, além de poder selecionar intervalos personalizados.

```
Seletor de período:
[Mês Atual] [Trimestre Atual] [Ano] [Personalizado]
     ↓             ↓             ↓
  KPIs do      KPIs do       KPIs do
    mês        trimestre        ano
```

---

## Cards de Pessoa (Visão de Equipe)

Cada membro tem um card com:
- Nome + avatar/área
- Total de tarefas no período
- Status: finalizadas / em andamento / backlog
- Indicador visual de contexto (sem comparação entre pares)

**Regra de ouro:** o card mostra a situação do membro no seu próprio contexto — não em relação aos outros.

---

## O que Foi Entregue no MVP (v1)

| Entrega | Status |
|---------|--------|
| Integração Kanboard API | ✅ Funcionando (2026-03-03) |
| Dashboard KPIs básicos | ✅ Entregue |
| Filtros período e área | ✅ Entregue |
| Relatório PGD trimestral | ✅ Entregue |
| Relatório anual | ✅ Entregue |
| Exportação .txt e .csv | ✅ Entregue |
| CSV fallback (sem API) | ✅ Entregue |

---

## Entregues no v2 (2026-03-04)

### Design — @ux-design-expert (Uma)
| Entrega | Status |
|---------|--------|
| Tema Emerald Light (light mode IFES) | ✅ Implementado |
| TemporalContextHeader — clareza temporal | ✅ Implementado |
| NaturalLanguageSummary — interpretação automática | ✅ Implementado |
| PersonCard + PersonCardGrid — visão ética individual | ✅ Implementado |
| KpiCard atualizado — glass light mode | ✅ Implementado |
| Página Kanboard Helper com Gemini Gem | ✅ Implementado |
| Home redesenhada — mesh gradient + heading grande | ✅ Implementado |
| Design system documentado | ✅ `docs/design-system.md` |

### Arquitetura — @architect (Aria)
| Entrega | Status |
|---------|--------|
| Cache Kanboard via `unstable_cache` (TTL 5min) | ✅ Implementado |
| Hook `useDashboardData` — separação de concerns | ✅ Implementado |
| Section guards — resiliência por seção | ✅ Implementado |
| LLM para NaturalLanguageSummary | ⏸️ Descartado neste momento |

## Status Atual do Sistema

```
✅ API Kanboard integrada (project_id=47, open+closed tasks)
✅ Cache 5min no fetch bruto Kanboard
✅ Dashboard v2 — todos os componentes novos
✅ Design Emerald Light — light mode IFES premium
✅ Página Kanboard Helper com Gemini Gem
✅ Hook useDashboardData — arquitetura limpa
✅ Section guards — resiliência granular
✅ CSV fallback — degradação graciosa
```

## Próximos Passos

| Passo | Agente Responsável | Prioridade |
|-------|-------------------|------------|
| Definição de épicos e stories do v2 | `@pm` | 🟡 Média |
| Política de privacidade de dados da equipe | `@qa` | 🟡 Média |
| Verificar mapeamento categoryId Kanboard → taxonomy | `@dev` | 🟡 Média |

---

## Frase-Síntese

> *"O sistema deixa de ser um espelho de dados e passa a ser um assistente de gestão — que vê, interpreta e comunica o que está acontecendo com a equipe, com beleza e respeito às pessoas."*

---

**Documento gerado por:** @analyst (Atlas)
**Sessão de elicitação:** 2026-03-03
**Atualizado por:** @ux-design-expert (Uma) — Design v2 — 2026-03-04
**Atualizado por:** @architect (Aria) — Refatoração arquitetural — 2026-03-04
**Status:** Design v2 ✅ | Arquitetura ✅ | Sistema estável
