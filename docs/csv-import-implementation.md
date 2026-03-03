# Implementação: CSV Import Workaround para Kanboard

**Data:** 2026-02-25
**Status:** ✅ Completo e deployado
**Prioridade:** P0 (Bloqueador resolvido)
**Responsável:** @devops

---

## 📋 Contexto

O acesso à API JSON-RPC do Kanboard está bloqueado por restrições de firewall/WAF. A solução foi implementar um **workaround via CSV import** que permite ao dashboard funcionar imediatamente com dados reais, enquanto aguarda liberação de TI.

**Problema original:**
```
Kanboard API indisponível (HTTP 400/401)
    ↓
Dashboard tenta /api/metrics → falha
    ↓
Usuário vê erro "Não foi possível carregar os dados"
```

**Solução implementada:**
```
Usuário faz upload de CSV
    ↓
Servidor processa e mapeia para MetricsResponse
    ↓
Dashboard renderiza com dados reais (SEM recarregar)
```

---

## 🔧 O que foi implementado

### 1. **Endpoint API: POST /api/import-csv**
- **Arquivo:** `app/api/import-csv/route.ts`
- **Tamanho:** ~270 linhas
- **Funcionalidade:**

```
CSV Row (Kanboard) → Parse → Map Taxonomy → Map TeamMembers → Aggregations → MetricsResponse
```

**Mapeamentos automáticos:**

| Entrada | Saída |
|---------|-------|
| `Kanboard userId` | Team member → color, area |
| `Kanboard category name` | Taxonomy categoryId |
| `Kanboard status + coluna` | normalizada para (finalizada\|emAndamento\|backlog) |
| `Data "DD/MM/YYYY HH:MM"` | ISO date string |

**Tratamento de dados:**
- ✅ Campos obrigatórios: ID, Título, Status, Pessoa
- ✅ Categoria é opcional (fallback: "Demanda Extraordinaria")
- ✅ Importação parcial: tarefas válidas prosseguem mesmo com erros em outras
- ✅ Avisos detalhados sobre linhas com problemas

**Retorno:** `MetricsResponse` (mesmo formato de `/api/metrics`)

---

### 2. **Componente: CsvImportCard**
- **Arquivo:** `components/dashboard/csv-import-card.tsx`
- **Props:**
  ```typescript
  {
    period: string,          // "mes" | "bimestre" | "trimestre"
    area: string,            // "Todas" | "Design" | "Libras" | ...
    onImportSuccess: (data: MetricsResponse) => void
  }
  ```

**Funcionalidades:**
- Upload de arquivo com progress visual
- Feedback de sucesso/erro com detalhes
- Instruções passo-a-passo integradas
- **Crítico:** NÃO recarrega a página (usa callback)

---

### 3. **Dashboard Page: Refatorado**
- **Arquivo:** `app/dashboard/page.tsx`
- **Mudanças principais:**

```typescript
// Estado para rastrear fonte dos dados
const [source, setSource] = useState<"api" | "csv">("api");
const [data, setData] = useState<MetricsResponse | null>(null);

// Callback quando CSV é importado
const handleCsvImport = useCallback((metricsData: MetricsResponse) => {
  setData(metricsData);      // Use data directly
  setError(null);             // Clear error
  setSource("csv");           // Mark as CSV source
  setLoading(false);          // No loading state
}, []);

// Quando há erro → mostrar CsvImportCard como alternativa
if (error || !data) {
  return (
    <section>
      <ErrorAlert />
      <CsvImportCard
        period={period}
        area={area}
        onImportSuccess={handleCsvImport}
      />
    </section>
  );
}
```

**Fluxo de estado:**
```
1. Dashboard carrega → Tenta /api/metrics
2. Se sucesso → renderiza (source="api")
3. Se erro → mostra card de import
4. Usuário faz upload → handleCsvImport é chamado
5. setData() → renderiza dashboard (source="csv")
6. Banner indica "Dados importados via CSV"
```

---

## 📊 Mapeamento de Dados

### Kanboard → Taxonomy (Categorias)

O arquivo `/config/taxonomy.json` tem 18 categorias. O CSV import mapeia:

```typescript
// Busca exata primeiro
if (normalizeText(categoryName) === normalizeText(taxonomyName)) → use categoryId

// Partial match
if (normalized.includes(taxonomyNorm)) → use categoryId

// Known mappings para categorias com "x_" prefix
{
  "x_cso do cefor": 1,         // Comunicacao Visual
  "x_salas virtuais": 6,       // MOOC
  "x_recurso educacional": 7,  // Conteudo Educacional
}

// Fallback
"Sem categoria" ou não encontrado → categoryId 18 (Demanda Extraordinaria)
```

### Kanboard Users → Team Members

`/config/team-members.json` mapeia 6 people:

```json
[
  { userId: "marquito", userName: "Marcos", area: "Gestao", color: "#d97706" },
  { userId: "1627042", userName: "Elton", area: "Gestao", color: "#2563eb" },
  { userId: "3672522", userName: "Juliana", area: "Design", color: "#7c3aed" },
  { userId: "1163935", userName: "Andreia", area: "Libras", color: "#c2410c" },
  { userId: "1896405", userName: "Monia", area: "Audiovisual", color: "#dc2626" },
  { userId: "raquelfortunato", userName: "Raquel", area: "Gestao", color: "#eab308" }
]
```

**Resolução:**
1. Match exato por userId
2. Match parcial por userName
3. Fallback: `{ userId: "desconhecido", area: "Sem area", color: "#94a3b8" }`

### Status Normalization

Kanboard usa 2 campos: `Status` (Finalizado|Abrir) + `Coluna` (Em andamento|Finalizado|etc)

```typescript
if Status="Finalizado" OR Coluna="Finalizado"
  → "finalizada"
else if Coluna contém "andamento" ou "aprovacao" ou "autorizado"
  → "emAndamento"
else
  → "backlog"
```

---

## 🔄 Fluxo de Uso

### Para o usuário:

```
1. Acessa: https://sistema-gestao-cgte.vercel.app/dashboard
   ↓
2. Vê erro (Kanboard unavailable)
   ↓
3. Card de import aparece com instruções
   ↓
4. Acessa: https://board.cefor.ifes.edu.br
   → Exportar → Tarefas → CSV
   ↓
5. Faz upload do arquivo no dashboard
   ↓
6. Dashboard renderiza com dados (SEM reload)
   ↓
7. Pode usar KPIs, gráficos, relatórios normalmente
```

### Para retomar depois:

1. **Se Kanboard for liberado:**
   - Remover CsvImportCard da página
   - Voltar ao fluxo padrão de /api/metrics
   - Deletar `app/api/import-csv/route.ts` (ou deixar como fallback)

2. **Se precisar melhorar CSV import:**
   - Editar `/app/api/import-csv/route.ts` (processamento)
   - Editar `/components/dashboard/csv-import-card.tsx` (UI)
   - Testar com `Tarefas.csv` real

---

## 🧪 Testes Realizados

### Validação técnica
- ✅ Build: sem erros
- ✅ TypeCheck: limpo
- ✅ Lint: limpo
- ✅ Deploy: Vercel live

### Testes com dados reais
- ✅ Arquivo CSV: `Tarefas.csv` (26 tarefas)
- ✅ Parse: 26 tarefas válidas
- ✅ Mapeamento: categorias, pessoas, status
- ✅ Renderização: dashboard com KPIs e gráficos

---

## 📝 Histórico de Commits

```
ed6f55c  fix: CSV import now feeds dashboard directly without page reload
cae134c  fix: handle Kanboard CSV with optional category and column-based status
fa805a5  fix: support Kanboard CSV format with flexible column mapping
ec62c17  feat: implement CSV import workaround for Kanboard API
```

---

## ⚠️ Limitações Conhecidas

1. **Importação parcial:** Se houver 1000 tarefas e 100 com erro, 900 são importadas (aviso exibido)
2. **Filtros dinâmicos:** Ao mudar período/área, dados CSV não são re-filtrados (user precisa re-upload)
3. **API fallback:** Uma vez em "CSV mode", dashboard não tenta mais /api/metrics (mesmo que volte online)
4. **Sem persistência:** Dados são mantidos apenas na sessão (recarregar limpa)

---

## 🔗 Dependências

### Produção
- `csv-parse@^5` — parsing de CSV
- `@/lib/metrics` — funções de agregação existentes
- `@/lib/taxonomy` — mapeamento de categorias
- `@/config/team-members.json` — mapeamento de pessoas

### Desenvolvimento
- TypeScript
- Tailwind CSS
- Zustand (store)

---

## 🚀 Próximos Passos (quando Kanboard for liberado)

1. **Verificar se TI liberou API:**
   - Testar: `curl -X POST https://board.cefor.ifes.edu.br/jsonrpc.php ...`
   - Se sucesso → remover CSV workaround

2. **Limpar código:**
   - Remover CsvImportCard de dashboard
   - Deletar ou deprecate `/api/import-csv/route.ts`
   - Update documentação

3. **Ativar sincronização automática:**
   - API sync a cada 5 min
   - Real-time data updates

---

## 📞 Suporte & Contato

**Arquivo de solicitação a TI:**
```
docs/ti-solicitacao-acesso-kanboard-api.md
```

**Alternativa (se TI não responder):**
- CSV import continuará funcionando
- Treinar usuário: "exporte CSV toda vez que quiser atualizar"

---

**Última atualização:** 2026-02-25
**Próxima revisão:** Quando TI responder sobre liberação de API
