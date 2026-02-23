# Sistema de Gestão da CGTE/Cefor

## Documento de Definição do Projeto

**Versão:** 1.0
**Data:** 23/02/2026
**Autores:** Elton Vinicius Silva, Marcos Vinícius Forecchi Accioly
**Facilitação:** Atlas (Analyst Agent — Synkra AIOS)
**Status:** Em definição — Fase de Compreensão da Solução

---

## Sumário

1. [Contexto Organizacional](#1-contexto-organizacional)
2. [Diagnóstico da Situação Atual](#2-diagnóstico-da-situação-atual)
3. [Dores e Necessidades](#3-dores-e-necessidades)
4. [Visão da Solução](#4-visão-da-solução)
5. [Arquitetura dos Componentes](#5-arquitetura-dos-componentes)
6. [Taxonomia e Categorização](#6-taxonomia-e-categorização)
7. [Assistente Inteligente de Tarefas](#7-assistente-inteligente-de-tarefas)
8. [Modelo de Dados](#8-modelo-de-dados)
9. [Fluxos de Uso](#9-fluxos-de-uso)
10. [Roadmap e Priorização](#10-roadmap-e-priorização)
11. [Riscos e Mitigações](#11-riscos-e-mitigações)
12. [Decisões Pendentes](#12-decisões-pendentes)
13. [Anexos e Referências](#13-anexos-e-referências)

---

## 1. Contexto Organizacional

### 1.1 A CGTE

A **Coordenadoria Geral de Tecnologias Educacionais (CGTE)** é um setor do **Cefor (Centro de Referência em Formação e em Educação a Distância)** do **Ifes (Instituto Federal do Espírito Santo)**.

A CGTE é responsável por design educacional, produção audiovisual, acessibilidade em Libras, gestão de ambientes virtuais de aprendizagem (Moodle), comunicação visual, cursos MOOC e ações de Inteligência Artificial aplicada à educação.

### 1.2 Equipe

| Membro | Área Principal | Usuário Kanboard |
|--------|---------------|------------------|
| Marcos Vinícius F. Accioly | Coordenação / Gestão | marquito |
| Elton Vinicius Silva | Tecnologia / Moodle / IA | 1627042 |
| Juliana Cristina da S. Cassaro | Design / Identidade Visual | 3672522 |
| Andréia Cristina C. Cáo | Design / Libras / Salas Virtuais | 1163935 |
| Monia Lavra Vignati | Comunicação Visual / Campanhas | 1896405 |
| Raquel Alves Fortunato | Administrativo | raquelfortunato |
| Equipe Audiovisual | Produção Audiovisual | *(ainda não usa o Kanboard)* |

### 1.3 Sistemas Atuais

| Sistema | Função | URL |
|---------|--------|-----|
| **Kanboard** | Gestão de tarefas (Kanban) | board.cefor.ifes.edu.br |
| **Petrvs (PGD)** | Programa de Gestão e Desempenho do Governo Federal | Sistema interno Ifes |
| **Moodle** | Ambientes Virtuais de Aprendizagem | ava3.cefor.ifes.edu.br |

---

## 2. Diagnóstico da Situação Atual

### 2.1 Kanboard — Estado em 2025

**Estrutura atual:**
- 1 projeto único: "CGTE - Atividades"
- 177 cards criados ao longo de 2025
- 7 colunas: Baú de tarefas, Início autorizado, Em andamento, Finalizado, Congelado, INFORMAÇÕES FIXAS, Recorrentes

**Categorização — problema central:**

| Situação | Quantidade | Percentual |
|----------|-----------|------------|
| Cards SEM categoria | ~120 | **68%** |
| Cards COM categoria | ~57 | 32% |

Categorias existentes (usadas de forma inconsistente):

| Categoria | Uso |
|-----------|-----|
| Salas virtuais | ~22 cards |
| CSO do Cefor | ~12 cards |
| Guias, modelos e tutoriais | ~4 cards |
| Cooperação institucional | ~3 cards |
| Recurso educacional | ~3 cards |
| Ferramenta / Sistema / Serviço | ~3 cards |
| Demandas da diretoria | ~1 card |
| Estudos e aprendizado | ~1 card |

**Problemas de granularidade identificados:**

| Tipo de Card | Exemplo | Problema |
|-------------|---------|----------|
| Tarefa atômica | "Criar banner Dia das Mães" | Funciona bem |
| Projeto inteiro | "Vídeo institucional do Cefor" | Fica meses aberto, sem visibilidade das etapas |
| Card recorrente | "Publicação de banner no site" | Nunca fecha, acumula tudo dentro |
| Card-lixeira | "Atividades EXTRAORDINÁRIAS Jun-Ago/25" | Agrupamento genérico, dado inútil para relatórios |

**Cores:** Usadas informalmente como identificador de pessoa:

| Cor | Pessoa |
|-----|--------|
| Azul | Elton |
| Roxo | Juliana |
| Vermelho | Monia |
| Laranja escuro | Andréia |
| Âmbar | Marquito |
| Amarelo | Raquel |

**Tags:** Praticamente não usadas (apenas `#mooc` em 1 card).

### 2.2 PGD (Petrvs) — Estado Atual

O PGD é o Programa de Gestão e Desempenho, obrigatório para servidores federais. O sistema Petrvs é a plataforma eletrônica onde os planos são registrados.

**Estrutura do PGD da CGTE:**
- **Plano de Entregas da Unidade:** Define entregas trimestrais genéricas com metas percentuais
- **Plano de Trabalho do Participante:** Cada servidor registra suas atividades vinculadas às entregas

**Características das entregas:**
- 29 entregas por trimestre
- Todas genéricas e recorrentes (ex: "Conteúdo para Comunicação Visual elaborado")
- Meta sempre 100%
- Organizadas por área: Design (~17), Libras (~10), Audiovisual (~8)

**Registro no Petrvs:**
- 100% manual via interface web
- Sem API pública disponível
- Descrições em texto livre (narrativas longas)
- Progresso geralmente marcado como 100% apenas no final
- Muitas atividades caem em categorias genéricas ("Atividades extraordinárias", "Atividades sem previsão")

### 2.3 Fluxo Atual (AS-IS)

```
Servidor executa tarefa
    │
    ├──→ Às vezes registra no Kanboard (sem padronização)
    │
    └──→ No fim do trimestre: abre Petrvs manualmente
              │
              ├──→ Tenta lembrar o que fez
              ├──→ Copia/cola informações do Kanboard ou memória
              ├──→ Escreve descrição narrativa longa
              └──→ Marca tudo como 100%
                        │
                        └──→ 1x/ano: monta relatório de gestão
                             buscando dados retroativamente
```

---

## 3. Dores e Necessidades

### 3.1 Mapa de Dores

| # | Dor | Quem sofre | Impacto |
|---|-----|-----------|---------|
| D1 | **Transporte manual Kanboard → PGD**: Retrabalho de copiar informações entre sistemas | Todos os servidores | Alto — horas perdidas por trimestre |
| D2 | **Subutilização do Kanboard**: Dados pobres, sem categorização, sem visão gerencial | Marcos (gestão), equipe | Alto — decisões sem dados |
| D3 | **Relatório de gestão feito 1x/ano**: Sem acompanhamento contínuo de metas | Marcos (coordenador) | Alto — planejamento reativo |
| D4 | **Entregas no PGD sem progresso real**: Sempre 100% no fim, sem acompanhamento | Gestão, servidores | Médio — gestão cega |
| D5 | **Informações espalhadas em vários lugares**: Sobrecarga cognitiva | Todos | Médio — decisões lentas |
| D6 | **Resistência potencial da equipe audiovisual**: Adoção incerta | Equipe audiovisual | Médio — dados incompletos |
| D7 | **Cards-lixeira e falta de padrão**: Dados inconsistentes impossibilitam automação | Gestão, futuro sistema | Crítico — garbage in, garbage out |

### 3.2 Necessidades Identificadas

| # | Necessidade | Prioridade |
|---|------------|------------|
| N1 | Dados categorizados e limpos saindo do Kanboard | Crítica |
| N2 | Processo simples que não adicione trabalho ao servidor | Crítica |
| N3 | Mapeamento automático entre tarefas e entregas do PGD | Alta |
| N4 | Dashboard com visão gerencial mensal/bimestral | Alta |
| N5 | Relatório formatado para copiar no Petrvs | Alta |
| N6 | Suporte para múltiplas áreas (Design, Libras, Audiovisual) | Média |
| N7 | Orientação ao servidor sobre como registrar corretamente | Média |

---

## 4. Visão da Solução

### 4.1 Declaração de Visão

> Criar um ecossistema de gestão para a CGTE onde um **assistente inteligente** guia o servidor no planejamento e registro de tarefas, garantindo dados estruturados no Kanboard que alimentam automaticamente dashboards gerenciais e relatórios para o PGD.

### 4.2 Princípios de Design

1. **Qualidade na entrada, não na saída.** O esforço vai para garantir que o dado entre limpo no sistema. O resto flui naturalmente.
2. **Menos trabalho, não mais.** O servidor não pode ter mais um sistema para alimentar. O assistente substitui o ato de "abrir o Kanboard e preencher campos".
3. **Inteligência que educa.** O assistente não apenas categoriza — ensina o servidor a pensar em gestão de tarefas.
4. **Kanboard como banco de dados vivo.** O card não é um registro histórico. É uma unidade de trabalho que nasce no planejamento, recebe arquivos e links durante a execução, e morre quando finalizado.
5. **PGD como consequência, não como destino.** O relatório do PGD deve ser um subproduto natural de uma gestão bem feita, não um trabalho extra.

### 4.3 Diagrama Geral

```
                    ┌─────────────────────────────────┐
                    │   ASSISTENTE INTELIGENTE CGTE    │
                    │   (Lançador + Consultor IA)      │
                    │                                  │
                    │   • Conversa com o servidor      │
                    │   • Avalia e estrutura tarefas   │
                    │   • Categoriza automaticamente   │
                    │   • Educa sobre gestão           │
                    │   • Permite refinamento          │
                    └──────────────┬──────────────────┘
                                  │
                            API JSON-RPC
                            (createTask)
                                  │
                                  ▼
                    ┌─────────────────────────────────┐
                    │          KANBOARD                │
                    │   (Gestão diária de tarefas)     │
                    │                                  │
                    │   • Boards organizados por área  │
                    │   • Categorias padronizadas      │
                    │   • Cards com arquivos e links   │
                    │   • Drag-and-drop de colunas     │
                    │   • Subtarefas para projetos     │
                    └──────────────┬──────────────────┘
                                  │
                         API JSON-RPC (leitura)
                                  │
                                  ▼
                    ┌─────────────────────────────────┐
                    │    DASHBOARD + RELATÓRIO PGD     │
                    │                                  │
                    │   • Visão por categoria/período  │
                    │   • Progresso das entregas PGD   │
                    │   • Relatório formatado p/ Petrvs│
                    │   • Dados para relatório anual   │
                    └─────────────────────────────────┘
```

---

## 5. Arquitetura dos Componentes

### 5.1 Componente 1: Assistente Inteligente de Tarefas

**O que é:** Aplicação web com interface conversacional, alimentada por IA (LLM), que funciona como ponto de entrada principal para criação de tarefas no Kanboard.

**Responsabilidades:**
- Receber descrição em linguagem natural do servidor
- Analisar contexto: é planejamento (a fazer) ou registro (já feito)?
- Avaliar granularidade: tarefa atômica, projeto ou recorrente?
- Sugerir categorização, área, entrega PGD vinculada
- Estruturar título padronizado e descrição útil
- Sugerir subtarefas para projetos grandes
- Recusar cards genéricos e orientar o servidor
- Permitir refinamento antes da publicação
- Publicar no Kanboard via API JSON-RPC

**Características do comportamento IA:**
- Especialista em gestão de projetos e tarefas
- Conhece a taxonomia da CGTE, as entregas do PGD e as categorias
- Educa o servidor sobre boas práticas
- Sugere informações úteis para incluir na descrição (links, demandante, prazo)
- Contextualiza com dados do trimestre ("Você já tem 4 tarefas nessa entrega")

### 5.2 Componente 2: Kanboard (Configurado)

**O que é:** Instância existente do Kanboard (board.cefor.ifes.edu.br), configurada com a nova taxonomia.

**Configurações necessárias:**
- Categorias padronizadas (12 categorias — ver seção 6)
- Swimlanes por área (a definir: swimlanes vs boards separados)
- Colunas simplificadas: Backlog → Autorizado → Em andamento → Finalizado → Congelado
- Tags para vinculação de projetos grandes

**Papel no fluxo:** Armazenamento e gestão diária. O servidor usa o Kanboard normalmente para:
- Arrastar cards entre colunas
- Adicionar arquivos, links e comentários durante a execução
- Gerenciar subtarefas
- Visualizar o board do seu trabalho

### 5.3 Componente 3: Dashboard + Relatório PGD

**O que é:** Painel web que extrai dados do Kanboard via API e apresenta visões gerenciais.

**Funcionalidades:**
- Tarefas por categoria no período (mensal/bimestral/trimestral)
- Tarefas por pessoa
- Progresso das entregas PGD (quantidade de cards por entrega)
- Geração de texto formatado para copiar no Petrvs
- Dados consolidados para o relatório de gestão anual

---

## 6. Taxonomia e Categorização

### 6.1 Modelo de Categorização em 2 Níveis

#### Nível 1: Área (via Swimlane ou Board)

| Área | Descrição |
|------|-----------|
| **Design** | Design educacional, comunicação visual, identidade visual, site, base de conhecimento |
| **Libras** | Tradução, interpretação, acessibilidade, Videobook |
| **Audiovisual** | Gravação, edição, transmissão, produção de vídeo |
| **Gestão** | Administrativo, PGD, comissões, planejamento |

#### Nível 2: Tipo de Trabalho (via Categoria do Kanboard)

| # | Categoria | Descrição | Entregas PGD Relacionadas |
|---|-----------|-----------|---------------------------|
| 1 | **Comunicação Visual** | Banner, card, campanha, peça gráfica, material para redes sociais, datas comemorativas | Conteúdo para Comunicação Visual elaborado |
| 2 | **Design de Curso / ID Visual** | Identidade visual de curso, padrões visuais, layout de sala Moodle, separadores | Recurso didático visual criado; Design educacional institucional implementado |
| 3 | **Site e Sistemas** | Site do Cefor, base de conhecimento, interface Moodle, páginas web, sistemas digitais | Atualização em Interface digital realizada; Informação em sistema institucional atualizada |
| 4 | **MOOC** | Checklist técnico de cursos, lançamento, atualização de cursos na vitrine, configurações | Checklist de Curso MOOC realizada; Curso MOOC atualizado |
| 5 | **Formação e Capacitação** | Oficina, palestra, workshop, trilha, SOS Moodle, capacitação interna ou externa | Formação ministrada |
| 6 | **Conteúdo e Publicação** | Tutorial, artigo para base de conhecimento, manual, podcast, guia prático | Tutorial criado; Podcast publicado |
| 7 | **Inteligência Artificial** | Papo com IAIÁ, GPTs pedagógicos, formações de IA, prototipagem, Portal IA | Ação relacionada a Inteligência Artificial realizada |
| 8 | **Produção Audiovisual** | Gravação de vídeo, edição, pós-produção, transmissão ao vivo, produção de vídeo institucional | Material didático gravado/editado/publicado; Evento transmitido; Conselho Superior transmitido |
| 9 | **Tradução e Interpretação Libras** | Inserção de vídeos em Libras em cursos, tradução de editais, interpretação em eventos, tradução de materiais | Curso MOOC traduzido; Edital traduzido; Evento interpretado/traduzido; Material didático traduzido |
| 10 | **Acessibilidade** | Videobook, audiodescrição, atendimento Napne, materiais acessíveis | Videobook em Libras atualizado; Atividade da comissão Napne realizada |
| 11 | **Comissão e Colegiado** | Reunião de comissão (NTE, NAC, MOOC, Nepgens, Comunicação, Material Didático), atividades colegiadas | Atividade da Comissão X realizada |
| 12 | **Produção Científica e Pesquisa** | Artigo acadêmico, relato de experiência, PICIT, congressos, cooperação institucional | Produção científica desenvolvida; Colaboração técnica em outros campi |

### 6.2 Mapeamento Completo: Categoria → Entregas PGD

| Categoria | Entregas PGD |
|-----------|-------------|
| Comunicação Visual | Conteúdo para Comunicação Visual elaborado |
| Design de Curso / ID Visual | Recurso didático visual criado; Design educacional institucional implementado; Repositório de Vídeos implementado |
| Site e Sistemas | Atualização em Interface digital realizada; Informação em sistema institucional atualizada; Repositório de Livros atualizado |
| MOOC | Checklist de Curso MOOC realizada; Curso MOOC atualizado |
| Formação e Capacitação | Formação ministrada |
| Conteúdo e Publicação | Tutorial criado; Podcast publicado |
| Inteligência Artificial | Ação relacionada a Inteligência Artificial realizada |
| Produção Audiovisual | Material didático docente gravado; Material didático editado/renderizado/publicado; Evento transmitido; Conselho Superior transmitido; Vídeo institucional do Cefor produzido |
| Tradução e Interpretação Libras | Curso MOOC traduzido; Edital traduzido para Libras; Evento interpretado em Libras; Evento traduzido para Libras; Material didático traduzido para Libras; Interpretação em evento externo realizada |
| Acessibilidade | Videobook em Libras atualizado; Atividade da comissão Napne realizada; Atividades da comissão do repositório de vídeos em Libras realizada |
| Comissão e Colegiado | Atividade da Comissão NTE realizada; Atividade da Comissão MOOC realizada; Atividade da Comissão de Comunicação realizada; Atividade da Comissão NAC realizada; Atividade da Comissão Nepgens realizada; Atividade da comissão de Política de Material Didático realizada |
| Produção Científica e Pesquisa | Produção científica desenvolvida; Colaboração técnica realizada em outros campi ou instituições |

### 6.3 Entregas PGD Transversais (não vinculadas a uma categoria)

| Entrega PGD | Tratamento |
|-------------|-----------|
| PGD trimestral elaborado | Gerado automaticamente como atividade de gestão |
| Sala modelo do Moodle lançada | Categoria "Site e Sistemas" ou "MOOC" conforme contexto |

### 6.4 Regra de Granularidade: O que é um Card?

**Regra: 1 card = 1 unidade de trabalho descritível em 1 frase, executável por 1 pessoa.**

| Situação | O que fazer | Exemplo |
|----------|-------------|---------|
| Tarefa atômica | 1 card simples | "Criar banner Dia das Mães 2026" |
| Projeto com etapas | 1 card + subtarefas dentro | "Identidade Visual Pós-Graduação Docência EaD" com subtarefas: briefing, referências, proposta, revisão, aplicação |
| Projeto muito grande | Cards separados + tag de agrupamento | Tag `#video-institucional`: "Roteiro vídeo institucional", "Gravação vídeo institucional", "Edição vídeo institucional" |
| Atividade recorrente | 1 card por ocorrência | "Interpretação CONSUP #1 - Jan/2026", "Interpretação CONSUP #2 - Fev/2026" |
| Atividade já feita | 1 card com status Finalizado | "Banner matrícula TMD 2026" na coluna Finalizado |

**Proibido:**
- Cards genéricos de período ("Atividades extraordinárias Mar-Mai")
- Cards abertos indefinidamente como lixeira
- Cards sem categoria

---

## 7. Assistente Inteligente de Tarefas

### 7.1 Comportamentos Esperados

#### Cenário 1: Tarefa simples a fazer

```
Servidor: "Preciso criar um banner para divulgar o processo
seletivo de professor substituto. O Tiago pediu."

Assistente:
  Título sugerido: "Banner de divulgação - PS Professor Substituto Cefor"
  Categoria: Comunicação Visual
  Área: Design
  Status: Backlog
  Entrega PGD: Conteúdo para Comunicação Visual elaborado

  Sugestão para a descrição:
  - Demandante: Tiago
  - Incluir link do Drive/Canva quando iniciar
  - Definir prazo de entrega com o demandante

  [REFINAR]  [PUBLICAR NO KANBOARD]
```

#### Cenário 2: Projeto grande

```
Servidor: "Preciso criar a identidade visual do novo curso de
pós-graduação em Docência EaD. A Mariella pediu e tenho que
alinhar com a Andréia."

Assistente:
  Esse é um projeto com várias etapas. Sugiro:

  Card principal: "Identidade Visual - Pós-Graduação Docência EaD"
  Categoria: Design de Curso / ID Visual
  Área: Design
  Entrega PGD: Recurso didático visual criado

  Subtarefas sugeridas:
  □ Reunião de alinhamento com Mariella (briefing)
  □ Busca de referências visuais
  □ Criação da proposta inicial
  □ Revisão com Andréia
  □ Ajustes e aprovação final
  □ Aplicação no Moodle

  Dica: Como envolve alinhamento com Mariella e Andréia,
  recomendo definir um prazo estimado.

  [REFINAR]  [PUBLICAR NO KANBOARD]
```

#### Cenário 3: Recusa de card-lixeira

```
Servidor: "Atividades extraordinárias de março"

Assistente:
  Esse tipo de card genérico dificulta a gestão e não pode
  ser contabilizado corretamente no relatório.

  Vamos fazer diferente: descreva cada atividade separadamente
  e eu crio 1 card para cada uma.

  Qual foi a primeira atividade extraordinária de março?
```

#### Cenário 4: Registro de atividade já realizada

```
Servidor: "Ontem interpretei o CONSUP de fevereiro"

Assistente:
  Registrado como tarefa finalizada.

  Card: "Interpretação CONSUP #2 - Fev/2026"
  Categoria: Tradução e Interpretação Libras
  Área: Libras
  Status: Finalizado
  Entrega PGD: Conselho Superior transmitido

  [REFINAR]  [PUBLICAR NO KANBOARD]
```

#### Cenário 5: Orientação sobre informações úteis

```
Servidor: "Banner de matrícula TMD 2026"

Assistente:
  Título: "Banner de Matrícula - TMD 2026/1"
  Categoria: Comunicação Visual

  Para facilitar a execução, considere incluir na descrição:
  - Quem aprova a arte final?
  - Onde entregar as artes? (e-mail, Drive, site)
  - Link do arquivo editável (Canva/Figma)
  - Data limite para publicação

  Quer que eu adicione esses campos como template na descrição?

  [REFINAR]  [PUBLICAR NO KANBOARD]
```

#### Cenário 6: Contextualização com dados do trimestre

```
Servidor: "Criar arte para divulgar evento do Neabi"

Assistente:
  Título: "Arte de divulgação - Evento Neabi 2026"
  Categoria: Comunicação Visual
  Entrega PGD: Conteúdo para Comunicação Visual elaborado

  Contexto do trimestre: Você já tem 6 tarefas na entrega
  "Comunicação Visual" neste período (Mar-Mai/2026).

  [REFINAR]  [PUBLICAR NO KANBOARD]
```

### 7.2 Prompt de Sistema (Núcleo da IA)

```
Você é o Assistente de Gestão da CGTE/Cefor — um especialista em gestão
de projetos e tarefas no contexto de uma coordenadoria de tecnologias
educacionais do serviço público federal.

SEU PAPEL:
- Ajudar servidores a PLANEJAR e registrar trabalho no Kanboard
- Garantir que cada card seja útil para gestão e relatórios
- Educar sobre boas práticas de gestão de tarefas
- Ser o ponto de entrada para todas as tarefas da CGTE

REGRAS DE CATEGORIZAÇÃO:
1. Cada card = 1 unidade de trabalho (1 pessoa, 1 entregável, 1 frase)
2. NUNCA aceite cards genéricos ("atividades extraordinárias de março")
3. Projetos grandes → sugira subtarefas ou cards separados com tag
4. SEMPRE sugira a categoria correta (das 12 disponíveis)
5. SEMPRE vincule à entrega PGD correspondente
6. Identifique se é algo A FAZER ou algo JÁ FEITO

REGRAS DE ESTRUTURAÇÃO:
7. Títulos devem ser claros e padronizados (máx 80 caracteres)
8. Sugira informações úteis para a descrição (links, demandante, prazo)
9. Para atividades já feitas → status "Finalizado"
10. Para atividades a fazer → status "Backlog" ou "Autorizado"
11. Para projetos → sugira subtarefas ordenadas

CONTEXTO DISPONÍVEL:
- 12 categorias com mapeamento para entregas PGD
- Lista de entregas PGD por área
- Pessoas da equipe e suas áreas
- Dados do trimestre atual (tarefas por categoria)

CATEGORIAS: [lista das 12 categorias]
ENTREGAS PGD: [lista das 29 entregas com mapeamento]
ÁREAS: Design, Libras, Audiovisual, Gestão
PESSOAS: [lista de servidores da CGTE com áreas]
```

---

## 8. Modelo de Dados

### 8.1 Entidades e Relacionamentos

```
ÁREA (Swimlane/Board)
  │
  ├── Design
  ├── Libras
  ├── Audiovisual
  └── Gestão

CATEGORIA (12 tipos)
  │
  └──→ mapeada para 1..N ENTREGAS PGD

ENTREGA PGD (29 entregas por trimestre)
  │
  └──→ contabiliza N CARDS do Kanboard

CARD (Tarefa no Kanboard)
  │
  ├── título (texto padronizado)
  ├── categoria (1 das 12)
  ├── área (swimlane)
  ├── responsável (pessoa)
  ├── status (coluna)
  ├── tags (projeto, extras)
  ├── subtarefas (para projetos)
  ├── descrição (com links, arquivos, demandante)
  └── datas (criação, início, prazo, conclusão)

PROJETO (agrupamento via tag)
  │
  └──→ agrupa N CARDS relacionados
       ex: tag #video-institucional
```

### 8.2 Relação Quantitativa (N:1)

```
N cards Kanboard  ──→  1 Categoria  ──→  1..N Entregas PGD
     │                                        │
     │            Exemplo:                     │
     │                                         │
     ├─ "Banner Dia das Mães"                  │
     ├─ "Banner Páscoa"          ──→ Comunicação ──→ "Conteúdo para
     ├─ "Campanha eleitoral"         Visual          Comunicação Visual
     └─ "Banner Dia da Mulher"                        elaborado"
```

---

## 9. Fluxos de Uso

### 9.1 Fluxo do Servidor (dia a dia)

```
┌──────────────────────────────────────────────────────────┐
│ PLANEJAMENTO (algo a fazer)                              │
│                                                          │
│ 1. Abre o Assistente Inteligente                         │
│ 2. Descreve o que precisa fazer em linguagem natural     │
│ 3. Revisa a sugestão do assistente                       │
│ 4. Refina se necessário                                  │
│ 5. Publica no Kanboard                                   │
│                                                          │
│ EXECUÇÃO (durante o trabalho)                            │
│                                                          │
│ 6. Abre o Kanboard diretamente                           │
│ 7. Move o card para "Em andamento"                       │
│ 8. Adiciona arquivos, links, comentários no card         │
│ 9. Move para "Finalizado" quando concluir                │
│                                                          │
│ REGISTRO PÓS-FATO (algo já feito)                        │
│                                                          │
│ 1. Abre o Assistente Inteligente                         │
│ 2. Descreve o que fez                                    │
│ 3. Assistente cria card já como "Finalizado"             │
└──────────────────────────────────────────────────────────┘
```

### 9.2 Fluxo da Gestão (mensal/bimestral)

```
┌──────────────────────────────────────────────────────────┐
│ ACOMPANHAMENTO                                           │
│                                                          │
│ 1. Acessa o Dashboard                                    │
│ 2. Visualiza tarefas por categoria e período             │
│ 3. Verifica progresso das entregas PGD                   │
│ 4. Identifica áreas com baixa produtividade ou sobrecarga│
│                                                          │
│ RELATÓRIO PGD                                            │
│                                                          │
│ 5. Seleciona o trimestre no Dashboard                    │
│ 6. Sistema agrupa tarefas por entrega PGD                │
│ 7. Gera texto formatado para cada entrega                │
│ 8. Gestão copia e cola no Petrvs                         │
│                                                          │
│ RELATÓRIO DE GESTÃO ANUAL                                │
│                                                          │
│ 9. Dashboard acumula dados de todos os trimestres        │
│ 10. Gera "O setor em números" automaticamente            │
│ 11. Cruza com categorias do relatório de gestão          │
└──────────────────────────────────────────────────────────┘
```

---

## 10. Roadmap e Priorização

### 10.1 MVP (Meta: até metade de Março/2026)

| # | Entregável | Descrição | Prioridade |
|---|-----------|-----------|------------|
| 1 | Kanboard configurado | 12 categorias, swimlanes por área, colunas padronizadas | P0 |
| 2 | Assistente Inteligente v1 | Interface web + IA para criação de cards guiada | P0 |
| 3 | Teste piloto com Design | Elton e Marcos testam o fluxo por 2 semanas | P0 |

### 10.2 Fase 2 (Abril-Maio/2026)

| # | Entregável | Descrição |
|---|-----------|-----------|
| 4 | Dashboard básico | Visão de tarefas por categoria e período |
| 5 | Relatório PGD formatado | Texto pronto para copiar no Petrvs |
| 6 | Expansão para Audiovisual | Board/swimlane para equipe audiovisual |

### 10.3 Fase 3 (Junho+/2026)

| # | Entregável | Descrição |
|---|-----------|-----------|
| 7 | Dashboard avançado | Métricas de produtividade, tendências, metas |
| 8 | Relatório de gestão automatizado | "O setor em números" gerado automaticamente |
| 9 | Integração com calendário | Vinculação com agenda compartilhada da CGTE |

---

## 11. Riscos e Mitigações

| # | Risco | Probabilidade | Impacto | Mitigação |
|---|-------|--------------|---------|-----------|
| R1 | Equipe audiovisual resistir à adoção | Alta | Médio | Diretriz da coordenação: "só conta o que está no Kanboard". Gamificação/desafio inicial. |
| R2 | 12 categorias serem complexas demais | Média | Alto | Começar com as mais usadas. Assistente IA reduz a carga cognitiva. |
| R3 | Servidores continuarem usando cards genéricos | Média | Alto | Assistente recusa cards genéricos e orienta. Revisão periódica pela gestão. |
| R4 | API do Kanboard ser limitada | Baixa | Alto | API JSON-RPC é robusta (13 endpoints de tasks). Testar no início. |
| R5 | IA categorizar errado | Média | Médio | Etapa de refinamento antes de publicar. Prompt bem definido com exemplos. |
| R6 | Mapeamento categoria→entrega PGD mudar | Baixa | Médio | Tabela de mapeamento configurável, não hardcoded. |
| R7 | Escopo crescer demais | Alta | Alto | MVP mínimo definido. Fase 2 e 3 só após validação. |

---

## 12. Decisões Pendentes

| # | Decisão | Opções | Responsável | Prazo |
|---|---------|--------|-------------|-------|
| DP1 | Swimlanes vs boards separados para Audiovisual | A) Swimlanes no mesmo board; B) Board separado com mesmas categorias | Marcos + Elton | Antes do MVP |
| DP2 | Validação final das 12 categorias | Revisar se cobrem tudo ou precisam ajustes | Marcos + Elton | Antes do MVP |
| DP3 | Stack técnica do Assistente | Frontend, backend, modelo de IA, hospedagem | @architect | Próxima fase |
| DP4 | Hospedagem da solução | Servidor interno Cefor vs cloud (Vercel, etc.) | @architect + Elton | Próxima fase |
| DP5 | Como lidar com dados históricos de 2025 | A) Ignorar; B) Migrar/recategorizar | Marcos + Elton | Antes do MVP |
| DP6 | Quem faz a gestão das categorias (adicionar/remover) | Marcos, Elton, ou ambos | Marcos + Elton | Antes do MVP |

---

## 13. Anexos e Referências

### 13.1 Documentos de Referência

| Documento | Localização |
|-----------|------------|
| Transcrição da reunião Elton + Marcos | `.aios-core/docs/reuniao1.txt` |
| Relatório de Gestão 2025 da CGTE | `.aios-core/docs/atualmente-na-cgte/Relatório de gestão 2025 - CGTE.md` |
| Plano de Entregas PGD | `.aios-core/docs/atualmente-na-cgte/Planos de Entregas cgte.txt` |
| Registros do Plano de Trabalho (Petrvs) | `.aios-core/docs/atualmente-na-cgte/Plano de trabalho - Registros existentes.txt` |
| Tarefas Kanboard 2025 (CSV) | `.aios-core/docs/atualmente-na-cgte/Tarefas do kanboard da cgte em 2025.csv` |
| Plano de Entregas + Trabalho (CSV) | `.aios-core/docs/atualmente-na-cgte/CGTE - Plano de Entregas e Plano de Trabalho - 4) Nov-Dez-Jan-2026.csv` |
| Análise detalhada de elicitação | `.aios-core/docs/analise-elicitacao-cgte.md` |

### 13.2 APIs e Sistemas

| Sistema | API | Documentação |
|---------|-----|-------------|
| Kanboard | JSON-RPC 2.0 | https://docs.kanboard.org/v1/api/ |
| Petrvs (PGD) | Sem API pública | Registro 100% manual |

### 13.3 Kanboard — Endpoints Relevantes

| Endpoint | Uso |
|----------|-----|
| `createTask` | Criar card via Assistente |
| `updateTask` | Atualizar card |
| `getAllTasks` | Extrair tarefas para Dashboard |
| `searchTasks` | Buscar tarefas por filtro |
| `getAllCategories` | Listar categorias |
| `createCategory` | Criar categoria na configuração inicial |
| `getActiveSwimlanes` | Listar áreas |
| `getAllSubtasks` | Extrair subtarefas de projetos |

---

*Documento gerado com facilitação do Atlas (Analyst Agent — Synkra AIOS)*
*Próximo passo: Revisão com @architect para definição técnica e @pm para PRD formal*
