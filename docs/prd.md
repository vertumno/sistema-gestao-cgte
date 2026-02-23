# Sistema de Gestao CGTE/Cefor — Product Requirements Document (PRD)

**Status:** Em andamento (Seções 1-3 completas)
**Versão:** 0.1 (Draft)
**Data:** 23/02/2026
**Autores:** Morgan (PM Agent) / Elton Vinicius Silva
**Base:** Documento de Definição do Projeto + Análise de Elicitação

---

## 1. Goals and Background Context

### 1.1 Goals

- **G1:** Eliminar o retrabalho de transporte manual de dados entre Kanboard e PGD (Petrvs), automatizando a geração de relatórios trimestrais
- **G2:** Garantir dados estruturados e categorizados no Kanboard através de um assistente inteligente que guia o servidor no registro de tarefas
- **G3:** Fornecer visão gerencial contínua e autônoma (mensal/bimestral) via dashboard, permitindo que a coordenação tome decisões baseadas em dados sem suporte técnico
- **G4:** Padronizar a gestão de tarefas da CGTE com taxonomia de 12 categorias mapeadas para as 29 entregas do PGD
- **G5:** Facilitar a adoção pela equipe, reduzindo a carga cognitiva do registro (o assistente IA faz o trabalho pesado de categorização)
- **G6:** Gerar automaticamente dados para o relatório de gestão anual da CGTE
- **G7:** Expandir o uso estruturado do Kanboard para a equipe audiovisual com processo de onboarding assistido

### 1.2 Background Context

A CGTE (Coordenadoria Geral de Tecnologias Educacionais) do Cefor/Ifes possui 7 membros distribuídos em 4 áreas (Design, Libras, Audiovisual, Gestão) e mantém 177 tarefas no Kanboard, das quais 68% não possuem categorização. Trimestralmente, a equipe precisa reportar suas atividades no PGD (Programa de Gestão e Desempenho) via sistema Petrvs — um processo 100% manual que depende de memória e cópia entre sistemas.

O projeto nasce da necessidade de criar um ecossistema onde dados entram estruturados no Kanboard (via assistente IA), fluem para dashboards gerenciais e geram automaticamente relatórios formatados para o PGD. A solução prioriza qualidade na entrada de dados e experiência mínima de atrito para o servidor, tratando o PGD como consequência natural de uma boa gestão, não como trabalho extra.

### 1.3 Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 23/02/2026 | 0.1 | Criação inicial do PRD — Seções 1-3 (Goals, Requirements, UI Goals) | Morgan (PM) / Elton |

---

## 2. Requirements

### 2.1 Functional Requirements

- **FR1:** O Assistente Inteligente deve receber descrições em linguagem natural e sugerir título padronizado, categoria (das 12), área, entrega PGD vinculada e status
- **FR2:** O Assistente deve identificar se a tarefa é planejamento (a fazer) ou registro (já feita) e atribuir o status adequado (Backlog/Autorizado vs Finalizado)
- **FR3:** O Assistente deve avaliar granularidade — recusar cards genéricos e orientar o servidor a decompor em tarefas atômicas (1 pessoa, 1 entregável, 1 frase)
- **FR4:** O Assistente deve sugerir subtarefas para projetos grandes e agrupamento via tags para projetos muito grandes
- **FR5:** O Assistente deve permitir refinamento da sugestão antes de publicar no Kanboard
- **FR6:** O Assistente deve publicar cards no Kanboard via API JSON-RPC (createTask, com categoria, swimlane, descrição estruturada)
- **FR7:** O Assistente deve contextualizar com dados do trimestre atual ("Você já tem X tarefas nessa entrega")
- **FR8:** O Assistente deve orientar o servidor sobre informações úteis para a descrição (demandante, prazo, links)
- **FR9:** O Dashboard deve exibir tarefas por categoria, por pessoa e por período (mensal/bimestral/trimestral)
- **FR10:** O Dashboard deve exibir progresso das entregas PGD (quantidade de cards finalizados por entrega no período)
- **FR11:** O sistema deve gerar texto formatado para cada entrega PGD, pronto para copiar e colar no Petrvs
- **FR12:** O Dashboard deve consolidar dados anuais para o relatório de gestão ("O setor em números")
- **FR13:** O Kanboard deve ser configurado com as 12 categorias padronizadas, swimlanes por área e colunas simplificadas (Backlog → Autorizado → Em andamento → Finalizado → Congelado)
- **FR14:** O sistema deve manter tabela de mapeamento configurável entre categorias e entregas PGD (não hardcoded)

### 2.2 Non-Functional Requirements

- **NFR1:** O Assistente deve responder em menos de 10 segundos para manter fluidez conversacional
- **NFR2:** O sistema deve funcionar em dispositivos desktop e mobile (web responsivo) — servidores acessam de diferentes dispositivos
- **NFR3:** O sistema deve suportar os 7 membros atuais da CGTE com possibilidade de expansão para ~15 usuários
- **NFR4:** A interface do Assistente deve ser em português brasileiro
- **NFR5:** O mapeamento categoria→entrega PGD deve ser editável pela coordenação sem intervenção técnica (governança da taxonomia)
- **NFR6:** O sistema deve utilizar autenticação compatível com as credenciais existentes do Kanboard
- **NFR7:** Os dados devem permanecer em infraestrutura acessível ao Cefor/Ifes (requisito institucional de órgão público federal)
- **NFR8:** O sistema deve ser tolerante a indisponibilidade temporária do Kanboard (modo offline ou fila de publicação)

---

## 3. User Interface Design Goals

### 3.1 Overall UX Vision

Interface minimalista e conversacional que prioriza simplicidade. O servidor não deve sentir que está aprendendo um sistema novo — deve sentir que está conversando com um colega que entende de gestão de tarefas. O dashboard deve ser autoexplicativo para a coordenação, sem necessidade de treinamento.

### 3.2 Key Interaction Paradigms

- **Assistente:** Interface conversacional (chat) — o servidor descreve o que fez/precisa fazer, o assistente responde com card estruturado e botões de ação (Refinar / Publicar)
- **Dashboard:** Visualização com filtros — seleciona período, área, pessoa e vê os dados. Ação principal: gerar relatório PGD com um clique
- **Kanboard:** Mantém a interface nativa existente — drag-and-drop de cards entre colunas. Sem alteração na UX do Kanboard

### 3.3 Core Screens and Views

1. **Tela do Assistente (Chat)** — Interface conversacional principal para criar/registrar tarefas. Campo de texto + histórico de conversa + card preview
2. **Preview do Card** — Visualização do card estruturado antes de publicar (título, categoria, área, entrega PGD, subtarefas). Botões: Refinar / Publicar
3. **Dashboard Principal** — Visão geral: tarefas por categoria no período, progresso das entregas PGD, filtros por área/pessoa/período
4. **Gerador de Relatório PGD** — Seleciona trimestre → visualiza texto por entrega PGD → botão copiar para cada entrega
5. **Configuração de Taxonomia** — Tela administrativa para editar categorias e mapeamento categoria→entrega PGD (NFR5)

### 3.4 Accessibility

**WCAG AA** — Requisito de acessibilidade nível AA. Contexto de instituição pública federal com obrigações legais de acessibilidade digital. A equipe inclui profissionais de Libras e acessibilidade.

### 3.5 Branding

- Seguir identidade visual institucional do Cefor/Ifes
- Cores institucionais do Ifes (verde e branco como base)
- Sem necessidade de branding elaborado — foco em funcionalidade e clareza
- Tom visual: profissional, limpo, institucional

### 3.6 Target Device and Platforms

**Web Responsive** — Acesso primário via desktop (computadores de trabalho do Cefor), com suporte funcional em mobile para registros rápidos via assistente.

---

## 4. Technical Assumptions

> *Seção pendente — será preenchida na próxima sessão*

---

## 5. Epic List

> *Seção pendente — será preenchida na próxima sessão*

---

## 6. Epic Details

> *Seção pendente — será preenchida na próxima sessão*

---

## 7. Checklist Results Report

> *Seção pendente — será preenchida após conclusão de todas as seções*

---

## 8. Next Steps

> *Seção pendente — será preenchida após conclusão de todas as seções*

---

*Documento gerado com Morgan (PM Agent — Synkra AIOS)*
*Próxima sessão: Continuar a partir da Seção 4 (Technical Assumptions)*
