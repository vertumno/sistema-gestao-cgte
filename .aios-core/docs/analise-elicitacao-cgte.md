# Análise de Elicitação — Sistema de Gestão CGTE/Cefor

**Agente:** Atlas (Analyst) | **Data:** 2026-02-23
**Fonte:** Reunião Elton + Marcos, Relatório de Gestão 2025, Plano de Entregas PGD, Plano de Trabalho Petrvs, Tarefas Kanboard 2025

---

## 1. Raio-X da CGTE

### 1.1 Áreas de Atuação (3 núcleos)

| Área | Pessoas Identificadas | Cor no Kanboard |
|------|-----------------------|-----------------|
| **Design** | Juliana, Andréia, Monia, Elton, Marquito | Roxo, Laranja escuro, Vermelho, Azul, Âmbar |
| **Audiovisual** | (equipe separada, ainda não usa o board) | — |
| **Libras** | Andréia (tradução/inserção), intérpretes | Laranja escuro |

### 1.2 Volume de Trabalho em 2025

- **177 cards** no Kanboard (projeto único: "CGTE - Atividades")
- **29 entregas** no Plano de Entregas PGD (trimestral)
- **3 áreas** contribuindo para o relatório de gestão anual
- **~6 pessoas** ativas no Kanboard

---

## 2. Como Funciona Hoje

### 2.1 Kanboard — Estado Atual

**Estrutura:**
- 1 único projeto: "CGTE - Atividades"
- Colunas: `Baú de tarefas` → `Início autorizado` → `Em andamento` → `Finalizado` → `Congelado` → `INFORMAÇÕES FIXAS` → `Recorrentes`

**Categorias existentes (poucas e inconsistentes):**
| Categoria | Qtd Tasks |
|-----------|-----------|
| *(sem categoria)* | **~120 tasks** (68%) |
| Salas virtuais | ~22 |
| CSO do Cefor | ~12 |
| Guias, modelos e tutoriais | ~4 |
| Cooperação institucional | ~3 |
| Recurso educacional | ~3 |
| Ferramenta / Sistema / Serviço | ~3 |
| Demandas da diretoria | ~1 |
| Estudos e aprendizado | ~1 |

**Problema crítico:** 68% das tarefas NÃO TÊM CATEGORIA. Isso torna impossível agrupar dados automaticamente.

**Tags:** Praticamente não usadas (apenas `#mooc` em 1 task).

**Cores:** Usadas informalmente como identificador de pessoa, não de tipo de trabalho.

### 2.2 PGD (Petrvs) — Plano de Entregas

As entregas são **genéricas e recorrentes** a cada trimestre. Exemplos:

| Entrega PGD | Área |
|-------------|------|
| Conteúdo para Comunicação Visual elaborado | Design |
| Recurso didático visual criado | Design |
| Formação ministrada | Design |
| Informação em sistema institucional atualizada | Design |
| Checklist de Curso MOOC realizada | Design |
| Ação relacionada a IA realizada | Design |
| Produção científica desenvolvida | Design |
| Tutorial criado | Design |
| Atualização em Interface digital realizada | Design |
| Sala modelo do Moodle lançada | Design |
| Evento Interpretado em Libras | Libras |
| Evento traduzido para Libras | Libras |
| Edital traduzido para Libras | Libras |
| Curso Mooc traduzido | Libras |
| Material didático traduzido para Libras | Libras |
| Videobook em Libras atualizado | Libras |
| Conselho superior transmitido | Audiovisual |
| Evento transmitido | Audiovisual |
| Material didático docente gravado | Audiovisual |
| PGD trimestral elaborado | Gestão |
| Atividade da Comissão X realizada | Comissões |
| Colaboração técnica em outros campi | Institucional |

**Total: 29 entregas por trimestre** (Design ~17, Libras ~10, Audiovisual ~8, Gestão/Comissões ~5 — há sobreposição)

### 2.3 Plano de Trabalho (registro individual no Petrvs)

O servidor registra no Petrvs:
- **Tipo de detalhamento**: Nome genérico da entrega
- **Descrição**: Texto livre detalhando o que fez, quando, com quem
- **Datas**: Início e fim do período
- **Progresso**: Sempre 100% ao final

**Problemas observados:**
1. Muitas atividades caem em "Atividades extraordinárias" ou "Atividades sem previsão" — categorias "coringa"
2. Descrições são narrativas longas (tipo diário), difíceis de agregar
3. Algumas referências ao Kanboard aparecem nos comentários (links `board.cefor.ifes.edu.br/...task_id=XXXX`)
4. A Juliana registra praticamente TUDO como "Atividades extraordinárias" com descrição detalhada — muito trabalhoso
5. Marcos registra como "Atividades de gestão" em bloco

---

## 3. Mapeamento Kanboard → PGD (o coração do problema)

### 3.1 Relação Descoberta: N tarefas → 1 Entrega

Após análise cruzada dos dados, a relação é claramente **N:1**:

```
KANBOARD                                    PGD ENTREGA
────────────────────────────────           ──────────────────────────
Criar banner Dia das Mães         ─┐
Criar banner Páscoa                ├──→  "Conteúdo para Comunicação
Campanha eleitoral                 │       Visual elaborado"
Banner Dia Internacional Mulher   ─┘

Inserir vídeos Libras MOOC X     ─┐
Inserir vídeos Libras MOOC Y      ├──→  "Curso MOOC traduzido"
Inserir vídeos Libras MOOC Z     ─┘

Criar site NTE                   ─┐
Atualizar página AVA              ├──→  "Atualização em Interface
Nova página cursos IfesAds        │       digital realizada"
Banner site                      ─┘
```

### 3.2 Taxonomia Proposta para Categorização

Baseado na análise cruzada entre as tarefas do Kanboard, entregas do PGD e o relatório de gestão, proponho uma **taxonomia de 2 níveis**:

#### Nível 1: ÁREA (obrigatório — identifica o núcleo)

| Código | Área |
|--------|------|
| `DES` | Design |
| `AV` | Audiovisual |
| `LIB` | Libras |
| `GES` | Gestão / Administrativo |

#### Nível 2: TIPO DE TRABALHO (obrigatório — mapeia para entregas PGD)

| Tipo de Trabalho | Entregas PGD Relacionadas | Exemplos de Tasks |
|------------------|---------------------------|-------------------|
| **Comunicação Visual** | Conteúdo para Comunicação Visual elaborado | Banner, card, campanha, peça gráfica |
| **Identidade Visual** | Recurso didático visual criado | ID de curso, padrões visuais, layouts |
| **Interface Digital** | Atualização em Interface digital realizada | Site, Moodle, página, sistema |
| **Formação** | Formação ministrada | Oficina, palestra, trilha, workshop |
| **MOOC** | Checklist de Curso MOOC realizada / Curso MOOC atualizado | Checklist, lançamento, atualização |
| **Conteúdo Educacional** | Tutorial criado / Podcast / Artigo base de conhecimento | Tutorial, artigo, guia, manual |
| **Inteligência Artificial** | Ação relacionada a IA realizada | Papo com IAIÁ, GPTs, formação IA |
| **Produção Científica** | Produção científica desenvolvida | Artigo, relato, congresso |
| **Produção Audiovisual** | Material didático gravado/editado/publicado | Gravação, edição, transmissão |
| **Evento/Transmissão** | Evento transmitido / Conselho transmitido | Live, consup, webconferência |
| **Tradução Libras** | Curso MOOC traduzido / Material traduzido / Edital traduzido | Inserção vídeos Libras |
| **Interpretação Libras** | Evento interpretado / Interpretação externa | Interpretação evento, aula |
| **Acessibilidade** | Videobook / Atividade Napne | Videobook, audiodescrição |
| **Comissão/Colegiado** | Atividade da Comissão X realizada | Reunião comissão, NTE, NAC, MOOC |
| **Gestão/PGD** | PGD trimestral elaborado | PGD, relatório, ponto, SIGRH |
| **Colaboração Institucional** | Colaboração técnica em campi/instituições | Apoio externo, cooperação |
| **Demanda Extraordinária** | *(sem entrega fixa)* | Demanda urgente não planejada |

### 3.3 Campos Mínimos para Criar Tarefa no Kanboard

Para o MVP, cada card deve ter obrigatoriamente:

| Campo | Como | Exemplo |
|-------|------|---------|
| **Título** | Texto livre descritivo | "Criar banner Dia das Mães 2026" |
| **Categoria** | Dropdown (Tipo de Trabalho) | "Comunicação Visual" |
| **Cor** | Mapeada automaticamente por área/pessoa | Azul (Elton) |
| **Tag** | ID da entrega PGD vinculada (opcional se já mapeado via categoria) | `#pgd-comunicacao-visual` |

**Nada mais.** O restante (datas, descrição detalhada) é opcional.

---

## 4. Modelo de Dados Proposto

```
┌─────────────────────────────────┐
│         ENTREGA PGD             │
│  (configurada 1x por trimestre) │
│─────────────────────────────────│
│  id: "ent-001"                  │
│  nome: "Conteúdo para           │
│    Comunicação Visual elaborado"│
│  area: "Design"                 │
│  meta: "100%"                   │
│  periodo: "mar-mai/2026"        │
└────────────┬────────────────────┘
             │ 1:N
             ▼
┌─────────────────────────────────┐
│        TIPO DE TRABALHO         │
│  (categoria no Kanboard)        │
│─────────────────────────────────│
│  "Comunicação Visual"           │
│  entrega_pgd: "ent-001"         │
└────────────┬────────────────────┘
             │ 1:N
             ▼
┌─────────────────────────────────┐
│         TAREFA (CARD)           │
│  (card no Kanboard)             │
│─────────────────────────────────│
│  titulo: "Banner Dia das Mães"  │
│  categoria: "Comunicação Visual"│
│  responsavel: "Monia"           │
│  status: "Finalizado"           │
│  data_fim: "2025-05-09"         │
└─────────────────────────────────┘
```

---

## 5. Como Funciona na Prática (Fluxo TO-BE)

### Para o Servidor (dia a dia):

```
1. Recebe/identifica uma tarefa
2. Abre o Kanboard → Cria card
3. Preenche: Título + seleciona Categoria (dropdown)
4. Move o card conforme avança (arrasta)
5. FIM. Não precisa fazer mais nada no Kanboard.
```

**Tempo gasto: ~15 segundos por tarefa**

### Para a Gestão (mensal/bimestral):

```
1. Acessa o Dashboard (camada intermediária)
2. Visualiza: tarefas por categoria, por período, por pessoa
3. Gera relatório PGD formatado:
   - Agrupa tarefas por Entrega PGD
   - Conta quantas foram feitas
   - Lista as principais em texto
4. Copia e cola no Petrvs
```

### Para o Relatório Anual:

```
1. Dashboard acumula dados de todos os trimestres
2. Gera: "O setor em números" automaticamente
3. Cruza com as categorias do relatório de gestão
```

---

## 6. O "Lançador de Tarefas" — Simplificação Máxima

### Opção A: Configurar o próprio Kanboard (recomendado para MVP)

O Kanboard já suporta:
- **Categorias obrigatórias** → Configurar os 17 tipos como categorias do projeto
- **Descrição de categoria** → Cada categoria pode ter instrução embutida
- A API do Kanboard permite extrair tudo por categoria

**Vantagem:** Zero sistema novo. Servidor só precisa escolher a categoria no dropdown.

### Opção B: Formulário externo (fase 2)

Um formulário web simples que:
1. Pergunta: "O que você fez?" (texto livre)
2. Sugere automaticamente a categoria (via IA ou palavras-chave)
3. Cria o card no Kanboard via API

**Vantagem:** Mais guiado. Mas adiciona complexidade.

---

## 7. Gap Analysis — O que falta no Kanboard hoje

| O que falta | Impacto | Solução |
|-------------|---------|---------|
| Categorias padronizadas | Cards sem classificação (68%) | Criar as 17 categorias propostas |
| Tags vinculadas ao PGD | Sem rastreabilidade | Tags opcionais `#pgd-xxx` |
| Board do Audiovisual | Área inteira fora do sistema | Criar board separado com mesmas categorias |
| Convenção de títulos | Títulos inconsistentes | Guia rápido (1 página) |
| Dashboard externo | Sem visão gerencial | Sistema intermediário (MVP) |
| Exportação PGD | Copiar/colar manual | Relatório formatado automático |

---

## 8. Riscos e Recomendações

### Riscos

| Risco | Prob. | Impacto | Mitigação |
|-------|-------|---------|-----------|
| 17 categorias serem "demais" | Média | Servidor erra ou ignora | Começar com ~10 categorias mais usadas |
| Audiovisual não adotar | Alta | Dados incompletos | Gamificação + diretriz da coordenação |
| Mapeamento categoria→entrega mudar | Baixa | Dashboard erra agrupamento | Tabela configurável no sistema |
| Dados históricos perdidos | Certa | Sem comparação com 2025 | Aceitar: dados limpos começam agora |

### Recomendações

1. **Começar SIMPLES**: MVP = categorias no Kanboard + script de extração + dashboard básico
2. **Não criar formulário novo agora**: Usar o Kanboard nativo, só configurar melhor
3. **Pilotar com Design primeiro** (já usam o board), depois expandir para Audiovisual
4. **Meta de março**: Ter as categorias configuradas e pelo menos 1 mês de dados limpos
5. **Mapeamento categoria→entrega PGD** deve ser configurável, não hardcoded

---

## 9. Próximo Passo

Este documento está pronto para alimentar:
1. **@architect** → Definir arquitetura técnica (plugin vs app vs script)
2. **@pm** → Gerar o PRD com escopo, MVP e cronograma

— Atlas, investigando a verdade 🔎
