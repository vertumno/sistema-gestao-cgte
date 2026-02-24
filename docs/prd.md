# Sistema de Gestao CGTE/Cefor — Product Requirements Document (PRD)

**Status:** READY FOR ARCHITECT (PRD completo e aprovado para Arquitetura)
**Versão:** 0.3 (Ready for Architect)
**Data:** 23/02/2026
**Autores:** Morgan (PM Agent) / Elton Vinicius Silva
**Base:** Documento de Definição do Projeto + Análise de Elicitação

---

## 1. Goals and Background Context

### 1.1 Goals

- **G1:** Eliminar o retrabalho de transporte manual de dados entre Kanboard e PGD (Petrvs), automatizando a geração de relatórios trimestrais
- **G2:** Garantir dados estruturados e categorizados no Kanboard através de um assistente inteligente que guia o servidor no registro de tarefas
- **G3:** Fornecer visão gerencial contínua e autônoma (mensal/bimestral) via dashboard, permitindo que a coordenação tome decisões baseadas em dados sem suporte técnico
- **G4:** Padronizar a gestão de tarefas da CGTE com taxonomia de 18 categorias mapeadas para as 29 entregas do PGD
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
| 24/02/2026 | 0.2 | Atualização da taxonomia para 18 categorias, remoção de swimlanes, estrutura de 2 boards | Atlas (Analyst) / Elton + Marcos |
| 24/02/2026 | 0.3 | PRD completo: Seções 4-6 (Technical Assumptions, Epic List, Epic Details). Decisão: Vercel. Dashboard prioritário. | Morgan (PM) / Elton |

---

## 2. Requirements

### 2.1 Functional Requirements

- **FR1:** O Assistente Inteligente deve receber descrições em linguagem natural e sugerir título padronizado, categoria (das 18), área, entrega PGD vinculada e status
- **FR2:** O Assistente deve identificar se a tarefa é planejamento (a fazer) ou registro (já feita) e atribuir o status adequado (Backlog/Autorizado vs Finalizado)
- **FR3:** O Assistente deve avaliar granularidade — recusar cards genéricos e orientar o servidor a decompor em tarefas atômicas (1 pessoa, 1 entregável, 1 frase)
- **FR4:** O Assistente deve sugerir subtarefas para projetos grandes e agrupamento via tags para projetos muito grandes
- **FR5:** O Assistente deve permitir refinamento da sugestão antes de publicar no Kanboard
- **FR6:** O Assistente deve publicar cards no Kanboard via API JSON-RPC (createTask, com categoria, descrição estruturada)
- **FR7:** O Assistente deve contextualizar com dados do trimestre atual ("Você já tem X tarefas nessa entrega")
- **FR8:** O Assistente deve orientar o servidor sobre informações úteis para a descrição (demandante, prazo, links)
- **FR9:** O Dashboard deve exibir tarefas por categoria, por pessoa e por período (mensal/bimestral/trimestral)
- **FR10:** O Dashboard deve exibir progresso das entregas PGD (quantidade de cards finalizados por entrega no período)
- **FR11:** O sistema deve gerar texto formatado para cada entrega PGD, pronto para copiar e colar no Petrvs
- **FR12:** O Dashboard deve consolidar dados anuais para o relatório de gestão ("O setor em números")
- **FR13:** O Kanboard deve ser configurado com as 18 categorias padronizadas e colunas simplificadas (Backlog → Autorizado → Em andamento → Finalizado → Congelado), organizados em 2 boards: "CGTE - Atividades" (principal) e "Informações Fixas e Recorrentes" (referência)
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

### 4.1 Repository Structure: Monorepo

Um único repositório contendo frontend (Dashboard) e backend (API intermediária). Justificativa: equipe pequena (1-2 devs), projeto com escopo contido, facilita deploy e manutenção.

### 4.2 Service Architecture

**Frontend:** Next.js 16+ com App Router, React, TypeScript, Tailwind CSS, shadcn/ui
- Dashboard de visualização como aplicação web
- Responsivo (desktop + mobile)
- Identidade visual Cefor/Ifes (verde e branco)

**Backend/API:** Next.js API Routes (Route Handlers)
- Camada intermediária que consome a API JSON-RPC do Kanboard
- Tabela de mapeamento categoria → entrega PGD (configurável)
- Sem banco de dados próprio no MVP — os dados vivem no Kanboard

**Integração:**
- Kanboard API JSON-RPC 2.0 (leitura de tasks, categorias, projetos)
- Autenticação via token da API do Kanboard
- Sem integração com Petrvs (sem API pública — output é texto para copiar)

**IA (Fase 2 — Lançador de Tarefas):**
- Claude API (Anthropic) para o assistente inteligente de categorização
- *Nota: prioridade menor — implementar apenas após Dashboard validado*

**Hospedagem: Vercel**
- Deploy simplificado com integração nativa Next.js
- Nota: dados do Kanboard trafegam via API externa. Avaliar migração para servidor interno Cefor futuramente se necessário (NFR7)

### 4.3 Testing Requirements

**Unit + Integration** — Testes unitários para lógica de mapeamento e agregação de dados. Testes de integração para consumo da API do Kanboard. Testes E2E opcionais para fluxos críticos do Dashboard.

### 4.4 Additional Technical Assumptions

- A API do Kanboard (board.cefor.ifes.edu.br) está acessível via rede e aceita chamadas JSON-RPC autenticadas
- As 18 categorias serão configuradas manualmente no Kanboard antes do deploy do sistema
- O mapeamento categoria → entrega PGD será armazenado como configuração editável (JSON/YAML), não em banco de dados
- O Petrvs não possui API — o sistema gera texto formatado para copiar/colar manualmente
- WCAG AA é requisito obrigatório (instituição pública federal)
- Preset ativo: `nextjs-react` (Next.js 16+, React, TypeScript, Tailwind, Zustand)

---

## 4.5 Autenticação: Sem Login no MVP

O sistema será acessível sem autenticação formal no MVP (hospedado em URL da Vercel). Rationale: reduz complexidade inicial, o dashboard é para coordenação interna (não público). Autenticação via API token do Kanboard garante dados íntegros. Futura integração com SSO do Ifes fica como fase 2.

---

## 5. Out of Scope (MVP)

**Explicitamente fora do escopo v1.0:**
- Migração/recategorização de dados históricos de 2025 — começamos limpo em 2026
- Integração API com Petrvs — relatório é texto para copiar/colar
- App mobile nativo — web responsivo é suficiente
- Autenticação via SSO/OAuth — acesso direto no MVP
- Sistema de permissões por usuário — todos veem todos os dados
- Exportação em múltiplos formatos — CSV e TXT apenas
- Integração com calendário compartilhada
- Gamificação ou sistema de pontos
- Email/notificações automáticas

**Fase 2+ (após validação MVP):**
- Lançador de Tarefas (Epic 4) com IA
- Autenticação e permissões por função
- Histórico de auditoria
- API pública para terceiros
- Mobile app nativo

---

## 6. Critérios de Sucesso MVP

O MVP é considerado bem-sucedido quando:

1. **Funcionalidade:** Dashboard exibe dados reais do Kanboard (Epicº 1-2 completos em produção)
2. **Usabilidade:** Marcos (coordenador) acessa o dashboard, filtra por período e categoria, compreende os dados sem ajuda
3. **Relatório PGD:** Marcos gera relatório de um trimestre inteiro em menos de 5 minutos (vs. 2-3 horas hoje)
4. **Confiabilidade:** Sistema mantém 99% de uptime por 2 semanas
5. **Adoção:** Pelo menos 1 mês de dados limpos e categorizados no Kanboard (via categorias configuradas)

**Validação:** Após 4 semanas de produção, avaliar com Marcos se as dores D1-D3 foram aliviadas.

---

## 8. Epic List

### Epic 1: Fundação & Integração Kanboard
Estabelecer o projeto, conectar à API do Kanboard e entregar uma prova de conceito funcional que lê e exibe dados reais do board da CGTE.

### Epic 2: Dashboard de Visualização Gerencial
Entregar o dashboard completo com visões por categoria, por pessoa e por período, permitindo à coordenação acompanhar o trabalho da equipe sem depender de relatórios manuais.

### Epic 3: Gerador de Relatório PGD
Automatizar a geração de texto formatado por entrega PGD, pronto para copiar e colar no Petrvs, eliminando o retrabalho trimestral.

### Epic 4: Assistente Inteligente de Tarefas (Lançador)
Criar interface conversacional com IA que guia o servidor no registro de tarefas, garantindo dados estruturados e categorizados no Kanboard. *(Prioridade menor — só após validação do Dashboard)*

---

## 9. Epic Details

### Epic 1: Fundação & Integração Kanboard

**Goal:** Criar a base técnica do projeto com Next.js no Vercel, implementar o serviço de integração com a API JSON-RPC do Kanboard, definir a tabela de mapeamento categoria→entrega PGD, e entregar uma página funcional que exibe dados reais — provando que o pipeline ponta a ponta funciona.

#### Story 1.1: Setup do Projeto e Deploy Inicial

> Como desenvolvedor,
> quero ter o projeto Next.js configurado com TypeScript, Tailwind, shadcn/ui e deploy no Vercel,
> para que tenhamos a infraestrutura base pronta para desenvolvimento.

**Acceptance Criteria:**
1. Projeto Next.js 16+ criado com App Router, TypeScript strict, Tailwind CSS e shadcn/ui
2. ESLint e Prettier configurados com regras do projeto
3. Repositório Git inicializado com `.gitignore`, `.env.example` e README
4. Deploy funcional no Vercel exibindo página de health-check ("Sistema de Gestão CGTE — Online")
5. Variáveis de ambiente configuradas no Vercel para `KANBOARD_API_URL` e `KANBOARD_API_TOKEN`
6. Estrutura de pastas definida: `app/`, `lib/`, `components/`, `config/`

#### Story 1.2: Serviço de Integração com API do Kanboard

> Como desenvolvedor,
> quero um serviço que consome a API JSON-RPC do Kanboard,
> para que o sistema possa ler tarefas, categorias e projetos do board da CGTE.

**Acceptance Criteria:**
1. Módulo `lib/kanboard-client.ts` implementado com client JSON-RPC 2.0 tipado
2. Métodos implementados: `getAllTasks()`, `getTasksByProject()`, `getAllCategories()`, `getProjectById()`, `getAllSubtasks()`
3. Autenticação via API token configurada por variável de ambiente
4. Tratamento de erros com mensagens claras (timeout, auth failure, connection refused)
5. Testes unitários com mocks para todos os métodos
6. Rate limiting básico para não sobrecarregar o Kanboard (max 10 req/s)

#### Story 1.3: Tabela de Mapeamento Categoria → Entrega PGD

> Como coordenador da CGTE,
> quero que o mapeamento entre categorias do Kanboard e entregas do PGD seja configurável,
> para que eu possa ajustar sem precisar de suporte técnico.

**Acceptance Criteria:**
1. Arquivo de configuração `config/taxonomy.json` com as 18 categorias e suas entregas PGD vinculadas
2. Tipo TypeScript `TaxonomyConfig` definido com validação de schema
3. Função `getTaxonomy()` que carrega e valida a configuração
4. Função `getEntregasPGD(categoriaId)` que retorna as entregas vinculadas a uma categoria
5. Função `getCategoriasByEntrega(entregaId)` que retorna as categorias que alimentam uma entrega
6. Testes unitários cobrindo mapeamento correto, categoria inexistente e configuração inválida

#### Story 1.4: Página de Prova de Conceito — Dados Reais do Kanboard

> Como coordenador da CGTE,
> quero ver uma página web que exibe dados reais do Kanboard (total de tarefas, tarefas por categoria),
> para que eu tenha confiança de que o sistema funciona antes de investir no dashboard completo.

**Acceptance Criteria:**
1. Route `/` exibe painel simples com dados reais do Kanboard
2. Mostra: total de tarefas, total por coluna (Backlog, Autorizado, Em andamento, Finalizado, Congelado)
3. Mostra: contagem de tarefas por categoria (as 18 categorias)
4. Dados carregados via Server Components (SSR) com revalidação a cada 5 minutos
5. Estado de loading e tratamento de erro visíveis (se Kanboard indisponível, mostra mensagem amigável)
6. Layout básico com cores institucionais Cefor/Ifes (verde e branco) usando Tailwind

### Epic 2: Dashboard de Visualização Gerencial

**Goal:** Entregar o dashboard completo que permite à coordenação da CGTE visualizar tarefas por categoria, por pessoa e por período, com filtros intuitivos e gráficos claros. O dashboard deve ser autoexplicativo — a coordenação consulta e toma decisões sem suporte técnico.

#### Story 2.1: Layout Base e Navegação do Dashboard

> Como coordenador da CGTE,
> quero um layout de dashboard profissional com navegação clara,
> para que eu consiga acessar rapidamente as diferentes visões dos dados.

**Acceptance Criteria:**
1. Layout responsivo com sidebar de navegação (desktop) e menu hamburger (mobile)
2. Navegação com itens: Dashboard, Relatório PGD, Configurações
3. Header com título "Sistema de Gestão CGTE" e identidade visual Cefor/Ifes
4. Componente de seleção de período (mês, bimestre, trimestre) com período atual pré-selecionado
5. Footer com versão do sistema e link para documentação
6. Conformidade WCAG AA: contraste adequado, navegação por teclado, aria-labels

#### Story 2.2: Visão de Tarefas por Categoria

> Como coordenador da CGTE,
> quero visualizar a quantidade de tarefas por categoria no período selecionado,
> para entender como o trabalho da equipe está distribuído entre os tipos de atividade.

**Acceptance Criteria:**
1. Gráfico de barras horizontais mostrando as 18 categorias com contagem de tarefas finalizadas no período
2. Tabela complementar abaixo do gráfico com: categoria, total, finalizadas, em andamento, backlog
3. Filtro por período (mês/bimestre/trimestre) aplica-se ao gráfico e tabela
4. Categorias sem tarefas no período aparecem com valor 0 (não omitidas)
5. Cores do gráfico distinguem claramente cada categoria
6. Click na categoria expande a lista de tarefas individuais dessa categoria no período

#### Story 2.3: Visão de Tarefas por Pessoa

> Como coordenador da CGTE,
> quero visualizar a quantidade de tarefas por servidor no período selecionado,
> para acompanhar a distribuição de carga e produtividade individual.

**Acceptance Criteria:**
1. Gráfico de barras mostrando cada servidor com contagem de tarefas finalizadas no período
2. Tabela complementar com: nome do servidor, total de tarefas, finalizadas, em andamento
3. Filtro por período funciona em conjunto com a visão por categoria (filtros cumulativos)
4. Identificação do servidor via campo `assignee` ou cor do card no Kanboard
5. Click no servidor expande a lista de tarefas individuais com categoria e status
6. Opção de filtrar por área (Design, Libras, Audiovisual, Gestão)

#### Story 2.4: Visão Temporal — Evolução por Período

> Como coordenador da CGTE,
> quero ver a evolução do número de tarefas finalizadas ao longo dos meses,
> para identificar tendências e sazonalidades no trabalho da equipe.

**Acceptance Criteria:**
1. Gráfico de linha mostrando tarefas finalizadas por mês nos últimos 6 meses
2. Possibilidade de sobrepor linhas por categoria ou por pessoa
3. Tooltip com detalhes ao passar o mouse sobre cada ponto do gráfico
4. Indicador visual de trimestres PGD (separadores verticais ou fundo alternado)
5. Opção de download do gráfico como imagem PNG

#### Story 2.5: Cards de KPIs e Resumo Executivo

> Como coordenador da CGTE,
> quero ver indicadores-chave resumidos no topo do dashboard,
> para ter uma visão rápida do estado atual sem precisar analisar gráficos.

**Acceptance Criteria:**
1. Card "Total de Tarefas" — quantidade total no período selecionado
2. Card "Finalizadas" — quantidade finalizadas com percentual do total
3. Card "Em Andamento" — quantidade em andamento
4. Card "Categorias Ativas" — quantas das 18 categorias têm tarefas no período
5. Card "Entregas PGD Cobertas" — quantas entregas PGD têm ao menos 1 tarefa finalizada
6. Cada card mostra variação em relação ao período anterior (↑ ou ↓ com percentual)
7. Cards responsivos: 5 em linha no desktop, 2 colunas no mobile

### Epic 3: Gerador de Relatório PGD

**Goal:** Automatizar a geração de texto formatado para cada entrega do PGD, agrupando tarefas finalizadas do Kanboard por entrega, produzindo descrições prontas para copiar e colar no Petrvs. Elimina a dor D1 (transporte manual) e transforma o PGD em consequência natural da gestão.

#### Story 3.1: Tela de Geração de Relatório PGD

> Como coordenador da CGTE,
> quero selecionar um trimestre e ver o relatório PGD gerado automaticamente,
> para não precisar montar manualmente o texto de cada entrega.

**Acceptance Criteria:**
1. Route `/relatorio-pgd` acessível pela navegação principal
2. Seletor de trimestre (ex: "Mar-Mai/2026", "Jun-Ago/2026") com trimestre atual pré-selecionado
3. Seletor de servidor (individual ou "todos") para gerar relatório por pessoa ou consolidado
4. Ao selecionar, exibe lista de todas as 29 entregas PGD com seus textos gerados
5. Entregas sem tarefas no período aparecem com indicador visual "Sem atividades registradas"
6. Loading state enquanto os dados são processados

#### Story 3.2: Motor de Agregação e Geração de Texto por Entrega

> Como coordenador da CGTE,
> quero que o sistema agrupe tarefas finalizadas por entrega PGD e gere texto descritivo,
> para que o relatório reflita fielmente o trabalho realizado no trimestre.

**Acceptance Criteria:**
1. Motor de agregação: consulta tarefas finalizadas no período → agrupa por categoria → mapeia para entregas PGD via `taxonomy.json`
2. Para cada entrega, gera texto no formato: "[Quantidade] atividades realizadas: [lista dos títulos das tarefas]"
3. Exemplo de output: "5 atividades realizadas: Banner Dia das Mães, Banner Páscoa, Campanha eleitoral, Banner Dia Internacional da Mulher, Kit divulgação processo seletivo"
4. Entregas com subtarefas incluem contagem de subtarefas finalizadas
5. Texto gerado respeita o padrão observado nos registros existentes do Petrvs
6. Testes unitários para lógica de agregação com cenários: trimestre cheio, trimestre vazio, categoria com múltiplas entregas

#### Story 3.3: Copiar Texto por Entrega e Exportação

> Como servidor da CGTE,
> quero copiar o texto de cada entrega PGD individualmente com um clique,
> para colar diretamente no campo correspondente do Petrvs.

**Acceptance Criteria:**
1. Botão "Copiar" ao lado de cada entrega PGD que copia o texto para a área de transferência
2. Feedback visual ao copiar (ícone muda para ✓ por 2 segundos)
3. Botão "Copiar Tudo" que copia o relatório completo formatado
4. Opção de exportar relatório como arquivo texto (.txt) com todas as entregas
5. Texto copiado formatado de forma limpa (sem HTML, sem markdown — texto puro)
6. Funciona em desktop e mobile

#### Story 3.4: Dados Anuais Consolidados — "O Setor em Números"

> Como coordenador da CGTE,
> quero visualizar dados acumulados de todos os trimestres do ano,
> para alimentar o relatório de gestão anual sem retrabalho.

**Acceptance Criteria:**
1. Seção "Dados Anuais" na tela de relatório PGD com seletor de ano
2. Exibe totais anuais: tarefas por categoria, por pessoa, por entrega PGD
3. Exibe ranking: top 5 categorias com mais tarefas, top 5 entregas PGD mais ativas
4. Texto resumo gerado automaticamente: "Em [ano], a CGTE realizou [N] atividades distribuídas em [N] categorias..."
5. Dados exportáveis como texto ou tabela CSV

### Epic 4: Assistente Inteligente de Tarefas (Lançador)

**Goal:** Criar uma interface conversacional alimentada por IA (Claude) que guia o servidor no registro e planejamento de tarefas, garantindo dados estruturados, categorizados e com granularidade adequada no Kanboard. O assistente substitui o ato de "abrir o Kanboard e preencher campos", educando o servidor sobre boas práticas de gestão. *(Prioridade menor — implementar somente após Epics 1-3 validados)*

#### Story 4.1: Interface Conversacional do Assistente

> Como servidor da CGTE,
> quero uma interface de chat onde descrevo meu trabalho em linguagem natural,
> para que o assistente me ajude a criar cards estruturados sem precisar preencher formulários.

**Acceptance Criteria:**
1. Route `/assistente` acessível pela navegação principal
2. Interface de chat com campo de texto e histórico de conversa
3. Mensagem de boas-vindas contextualizada: "Olá! Descreva o que você fez ou precisa fazer e eu ajudo a registrar no Kanboard."
4. Suporte a envio via Enter e botão de enviar
5. Histórico da conversa persiste durante a sessão (não entre sessões)
6. Layout responsivo: funcional em desktop e mobile
7. Indicador de "digitando..." enquanto a IA processa

#### Story 4.2: Motor de IA — Categorização e Estruturação

> Como servidor da CGTE,
> quero que a IA analise minha descrição e sugira título, categoria, entrega PGD e status,
> para que eu não precise conhecer a taxonomia de cor.

**Acceptance Criteria:**
1. Integração com Claude API (Anthropic) via API Route do Next.js
2. System prompt carregado com: 18 categorias, 29 entregas PGD, regras de granularidade, pessoas da equipe
3. IA identifica se é planejamento (a fazer → Backlog) ou registro (já feito → Finalizado)
4. IA sugere: título padronizado, categoria, área, entrega PGD vinculada, status
5. IA recusa cards genéricos e orienta o servidor a decompor ("Descreva cada atividade separadamente")
6. IA sugere subtarefas para projetos grandes
7. IA sugere informações úteis para a descrição (demandante, prazo, links)
8. Resposta em menos de 10 segundos (NFR1)

#### Story 4.3: Preview e Refinamento do Card

> Como servidor da CGTE,
> quero visualizar o card sugerido pela IA antes de publicar,
> para poder corrigir ou ajustar antes de ir para o Kanboard.

**Acceptance Criteria:**
1. Componente de preview do card exibido após sugestão da IA
2. Preview mostra: título, categoria, área, entrega PGD, status, subtarefas (se houver)
3. Botão "Refinar" que permite o servidor dar feedback e a IA ajustar
4. Botão "Publicar no Kanboard" que envia o card
5. Campos editáveis inline no preview (título, categoria via dropdown)
6. Confirmação visual após publicação bem-sucedida ("Card criado com sucesso!")

#### Story 4.4: Publicação no Kanboard via API

> Como servidor da CGTE,
> quero que o card aprovado seja publicado automaticamente no Kanboard,
> para não precisar abrir o Kanboard manualmente.

**Acceptance Criteria:**
1. Chamada `createTask` via API JSON-RPC do Kanboard com todos os campos estruturados
2. Categoria atribuída automaticamente conforme sugestão aprovada
3. Subtarefas criadas via `createSubtask` se o card incluir subtarefas
4. Cor atribuída automaticamente com base no servidor logado
5. Tratamento de erro: se Kanboard indisponível, mostra mensagem e oferece opção de salvar como rascunho
6. Após publicação, exibe link direto para o card no Kanboard

#### Story 4.5: Contextualização com Dados do Trimestre

> Como servidor da CGTE,
> quero que o assistente me informe o contexto do meu trimestre ("Você já tem X tarefas nessa entrega"),
> para ter noção do meu progresso sem precisar consultar o dashboard.

**Acceptance Criteria:**
1. IA consulta dados do trimestre atual antes de responder (tarefas por categoria do usuário logado)
2. Inclui contexto na resposta: "Você já tem [N] tarefas na entrega '[nome]' neste trimestre"
3. Se a entrega PGD já tem muitas tarefas, a IA menciona ("Essa entrega já está bem coberta")
4. Se o servidor não tem tarefas em alguma entrega esperada, a IA pode sugerir ("Você ainda não registrou nada em '[entrega]' este trimestre")
5. Dados de contexto cacheados por 5 minutos para performance

---

## 10. Checklist Results Report

### Executive Summary

- **Completude geral do PRD:** ~90%
- **Escopo MVP:** Adequado (Just Right)
- **Prontidão para fase de arquitetura:** Ready
- **Itens resolvidos:** Autenticação (sem login MVP), Out of Scope definido, Critérios de Sucesso documentados

### Category Statuses

| Categoria | Status |
|-----------|--------|
| 1. Problem Definition & Context | **PASS** |
| 2. MVP Scope Definition | **PASS** |
| 3. User Experience Requirements | **PASS** |
| 4. Functional Requirements | **PASS** |
| 5. Non-Functional Requirements | **PASS** |
| 6. Epic & Story Structure | **PASS** |
| 7. Technical Guidance | **PASS** |
| 8. Cross-Functional Requirements | **PASS** |
| 9. Clarity & Communication | **PASS** |

### Recommendation

**READY FOR ARCHITECT** — PRD v0.3 está completo e pronto para fase de arquitetura. Todos os gaps foram resolvidos. Próximo passo: @architect cria architecture document.

---

## 11. Next Steps

### Para @architect

1. **Criar documento de arquitetura** — Usando PRD como entrada
2. **Detalhar stack técnico** — Estrutura de pastas, patterns, bibliotecas específicas
3. **Definir modelo de dados** — Tabelas, relationships (embora MVP use Kanboard como BD)
4. **Plano de deploy** — CI/CD, ambientes, monitoramento
5. **Identificar riscos técnicos** — Limitações da API do Kanboard, performance, escabilidade

### Para @sm (Scrum Master)

1. **Criar stories em `docs/stories/`** — Uma story por arquivo
2. **Estruturar sprint planning** — Dimensionar épicos para sprints de 2 semanas
3. **Definir DoD (Definition of Done)** — Critérios de aceitação além dos acceptance criteria

### Para @dev

1. **Implementar Epic 1** — Setup + integração Kanboard + prova de conceito
2. **Testes:** Rodar testes unitários, lint, typecheck antes de marcar stories como done
3. **Deploy:** Toda sprint deve ter deploy em produção (Vercel)

### Para @po (Product Owner)

1. **Validar PRD com Marcos** — Reunião de alinhamento final
2. **Recolher feedback** — Marcos testa a prova de conceito do Epic 1 assim que estiver em produção
3. **Priorizar based on feedback** — Ajustar roadmap se necessário

### Timeline Recomendado

- **Semana 1:** @architect cria architecture doc, @dev começa Epic 1
- **Semana 2:** Epic 1 completo, prova de conceito em produção
- **Semanas 3-6:** Epic 2 (Dashboard completo)
- **Semanas 7-8:** Epic 3 (Relatório PGD)
- **Semana 9:** Validação e refinamento com Marcos

---

*Documento finalizado em 24/02/2026 | Morgan (PM Agent — Synkra AIOS)*
*PRD v0.3 — Pronto para Arquitetura*

---

*Documento gerado com Morgan (PM Agent — Synkra AIOS)*
*Próxima sessão: Continuar a partir da Seção 4 (Technical Assumptions)*
