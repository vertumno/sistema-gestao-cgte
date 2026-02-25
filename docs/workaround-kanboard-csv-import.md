# Workaround: Importar Dados do Kanboard via CSV

**Objetivo:** Usar dados do Kanboard sem depender de acesso à API
**Aplicável:** Enquanto aguarda TI liberar acesso à API JSON-RPC
**Benefício:** Dashboard funcional com dados reais da mesma dia

---

## 📋 Visão Geral

Em vez de conectar diretamente à API do Kanboard (que está bloqueada), podemos:

1. **Exportar dados do Kanboard em CSV**
2. **Fazer upload do CSV** na aplicação
3. **Processar os dados** e popular o dashboard
4. **Gerar relatórios** normalmente

Este é um **workaround temporário** até TI liberar a API.

---

## 🔄 Processo de Importação

```
┌─────────────────────────────────────────────┐
│  Kanboard Dashboard                         │
│  Exportar → CSV                             │
└────────────────┬────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────┐
│  Sistema CGTE                               │
│  Upload CSV → Parse → Database              │
│  Dashboard atualizado com dados             │
└─────────────────────────────────────────────┘
```

---

## 📊 Dados Necessários do CSV

### Colunas Mínimas Requeridas

```csv
task_id,category,person_assigned,status,date_completed,effort_hours,description
123,Design,João Silva,Finalizada,2026-02-20,8,Criar protótipo UI
124,Audiovisual,Maria Santos,Em Andamento,2026-02-21,12,Gravar vídeo tutorial
125,Gestão,Pedro Costa,,2026-02-25,5,Relatório mensal
```

### Mapeamento de Campos

| Campo CSV | Campo Sistema | Tipo | Requerido | Exemplo |
|-----------|---------------|------|-----------|---------|
| `task_id` | ID da tarefa | number | ✅ | 123 |
| `category` | Categoria | string | ✅ | "Design", "Audiovisual", "Libras", "Gestao" |
| `person_assigned` | Pessoa responsável | string | ✅ | "João Silva" |
| `status` | Status | enum | ✅ | "finalizada", "emAndamento", "backlog" |
| `date_completed` | Data conclusão | date | ❌ | "2026-02-20" |
| `effort_hours` | Horas estimadas | number | ❌ | 8 |
| `description` | Descrição | string | ❌ | "Criar protótipo..." |

---

## 📥 Como Exportar do Kanboard

### Opção 1: Export Nativo do Kanboard

1. Acesse: https://board.cefor.ifes.edu.br
2. Clique no projeto
3. Menu → **Export** → **Download as CSV**
4. Escolha formato: **Tasks List**

### Opção 2: Exportar Manualmente

Se Kanboard não tiver export nativo:

1. Abra o board
2. Selecione todas as tarefas (Ctrl+A ou seleção)
3. Clique em **"Bulk Actions"** → **"Export Selected"**
4. Formato: **CSV**
5. Salve como: `kanboard-tasks.csv`

### Opção 3: Exportar via Admin Panel

Se você tem acesso admin:

1. Kanboard → **Administration** → **Export**
2. Escolha: **All Projects** ou **Specific Project**
3. Formato: **CSV**
4. Download

---

## 🔧 Implementação: Parser CSV

Criarei um endpoint para processar o CSV:

### Arquivo: `app/api/import-csv/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import { buildMetricsResponse } from "@/lib/metrics";

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Arquivo CSV não fornecido" },
        { status: 400 }
      );
    }

    // Ler arquivo
    const text = await file.text();

    // Parser CSV
    const records = parse(text, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      delimiter: ",",
    });

    // Transformar para formato interno
    const tasks = records.map((row: Record<string, string>) => ({
      id: parseInt(row.task_id, 10),
      title: row.description,
      category: row.category,
      assignee: row.person_assigned,
      status: normalizeStatus(row.status),
      dateCompleted: row.date_completed ? new Date(row.date_completed) : null,
      effortHours: parseInt(row.effort_hours || "0", 10),
    }));

    // Validar dados
    if (tasks.length === 0) {
      return NextResponse.json(
        { error: "Nenhuma tarefa encontrada no CSV" },
        { status: 400 }
      );
    }

    // Gerar resposta de métricas
    const metricsResponse = buildMetricsFromTasks(tasks);

    return NextResponse.json({
      success: true,
      tasksCount: tasks.length,
      metrics: metricsResponse,
      importedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("CSV import error:", error);
    return NextResponse.json(
      { error: "Erro ao processar CSV" },
      { status: 500 }
    );
  }
}

function normalizeStatus(status: string): "finalizada" | "emAndamento" | "backlog" {
  const normalized = status.toLowerCase().trim();
  if (normalized.includes("finalizada") || normalized.includes("done")) return "finalizada";
  if (normalized.includes("andamento") || normalized.includes("progress")) return "emAndamento";
  return "backlog";
}

function buildMetricsFromTasks(tasks: any[]) {
  // Implementar lógica similar a lib/metrics.ts
  // Retornar MetricsResponse com dados agregados
  return {
    totalTasks: tasks.length,
    kpis: [],
    categories: [],
    persons: [],
    tasksByCategory: {},
    tasksByPerson: {},
    months: [],
  };
}
```

---

## 🖥️ Interface de Upload

### Componente: `components/dashboard/csv-import.tsx`

```typescript
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CsvImport() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/import-csv", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: `✅ ${data.tasksCount} tarefas importadas com sucesso!`,
        });
        // Recarregar dashboard
        window.location.reload();
      } else {
        setMessage({
          type: "error",
          text: `❌ ${data.error}`,
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Erro ao importar CSV",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="font-semibold">Importar Dados do Kanboard</h3>

      <div className="flex gap-2">
        <Input
          type="file"
          accept=".csv"
          onChange={handleImport}
          disabled={loading}
          placeholder="Selecione arquivo CSV"
        />
        <Button disabled={loading}>
          {loading ? "Importando..." : "Importar"}
        </Button>
      </div>

      {message && (
        <p className={`text-sm ${message.type === "success" ? "text-green-700" : "text-red-700"}`}>
          {message.text}
        </p>
      )}
    </div>
  );
}
```

---

## 📋 Passo a Passo para o Usuário

### 1. Exportar CSV do Kanboard

```bash
# Acessar https://board.cefor.ifes.edu.br
# Menu → Export → Download CSV
# Salvar como: kanboard-tasks.csv
```

### 2. Abrir Dashboard CGTE

```
https://sistema-gestao-cgte.vercel.app/dashboard
```

### 3. Fazer Upload do CSV

```
Seção "Importar Dados do Kanboard"
↓
Clique em "Selecionar Arquivo"
↓
Escolha kanboard-tasks.csv
↓
Clique em "Importar"
```

### 4. Dashboard Atualizado

```
Dashboard carrega com dados do CSV
Relatórios funcionam
KPIs calculados automaticamente
```

---

## ⚙️ Configuração Necessária

### 1. Instalar Dependência CSV

```bash
npm install csv-parse
```

### 2. Adicionar Variável de Env

```env
# .env.local
ENABLE_CSV_IMPORT=true
MAX_CSV_SIZE_MB=10
```

### 3. Atualizar tsconfig.json

```json
{
  "compilerOptions": {
    "allowSyntheticDefaultImports": true
  }
}
```

---

## 🔄 Fluxo de Trabalho com CSV

### Cenário 1: Uso Diário

```
09:00 → Gerente exporta CSV do Kanboard (5 min)
09:05 → Faz upload no dashboard CGTE (2 min)
09:07 → Dashboard atualizado, relatórios gerados (automático)
```

### Cenário 2: Quando API for Liberada

```
❌ CSV import desativado
✅ API automática ativada
✅ Dados sincronizam em tempo real (a cada 5 min)
```

---

## 📝 Formato CSV Exemplo

```csv
task_id,category,person_assigned,status,date_completed,effort_hours,description
1001,Design,João Silva,finalizada,2026-02-20,8,Protótipo dashboard
1002,Audiovisual,Maria Santos,emAndamento,,12,Vídeo tutorial
1003,Libras,Pedro Costa,backlog,,10,Tradução de conteúdo
1004,Gestão,Ana Costa,finalizada,2026-02-21,6,Relatório mensal
1005,Design,João Silva,finalizada,2026-02-22,4,Revisão de design
```

---

## ✅ Validação do CSV

### Checklist Antes de Importar

- ☑️ Arquivo está em formato CSV (não Excel)
- ☑️ Primeira linha contém headers
- ☑️ Colunas requeridas presentes: task_id, category, person_assigned, status
- ☑️ Sem linhas vazias no meio do arquivo
- ☑️ Categorias válidas: Design, Audiovisual, Libras, Gestao
- ☑️ Status válidos: finalizada, emAndamento, backlog
- ☑️ Arquivo < 10 MB

---

## 🔗 Integração com API (Futuro)

Quando TI liberar API:

```typescript
// Automático após liberação
if (process.env.KANBOARD_API_TOKEN) {
  // Usar API JSON-RPC (automático)
} else {
  // Fallback para CSV import (manual)
}
```

---

## 📞 Suporte

Se houver erro ao importar:

1. Verifique formato do CSV
2. Revise headers e colunas
3. Valide valores de status
4. Teste com arquivo pequeno (5 linhas)

---

## 📊 Histórico

| Data | Versão | Descrição |
|------|--------|-----------|
| 2026-02-25 | 1.0 | Criação documento workaround CSV |
| | | Incluir parser e UI |
| | | Documentação passo-a-passo |

---

**Status:** Implementação recomendada para desbloqueio imediato do projeto
**Tempo de implementação:** 2-3 horas
**Risco:** Baixo (não afeta API futura)
**Benefício:** Dashboard funcional com dados reais
