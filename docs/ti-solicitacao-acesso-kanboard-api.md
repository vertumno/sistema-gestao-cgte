# Solicitação TI: Liberar Acesso à API do Kanboard

**PARA:** Departamento de TI / Administrador de Infraestrutura
**ASSUNTO:** [URGENTE] Liberar acesso à API do Kanboard para integração com Sistema CGTE
**DATA:** 2026-02-25
**PRIORIDADE:** Alta

---

## 📋 Situação

Estamos desenvolvendo um **Sistema de Gestão CGTE** (Gestão de Tarefas e Entregas) que depende de integração com o Kanboard através de sua **API JSON-RPC** para:
- Sincronizar tarefas em tempo real
- Gerar relatórios automatizados
- Agregação de dados para dashboard executivo

**Status:** Desenvolvimento concluído, **bloqueado por erro de autenticação API**.

---

## 🔍 Diagnóstico Técnico Realizado

### Testes Executados

```
✅ Servidor Kanboard acessível: https://board.cefor.ifes.edu.br
   → HTTP Status: 200/302 (responde)

✅ Endpoint JSONRPC acessível: https://board.cefor.ifes.edu.br/jsonrpc.php
   → Retorna erro RPC (esperado sem autenticação)

❌ Autenticação via HTTP Basic Auth + Token
   → Erro: HTTP 400 Bad Request (problema no servidor/firewall)

❌ Autenticação via Query String
   → Erro: 401 Unauthorized

❌ Autenticação via JSON params
   → Erro: 401 Unauthorized
```

### Possíveis Causas Identificadas

| Causa | Indicador | Solução |
|-------|-----------|---------|
| **WAF/Firewall** bloqueando Authorization header | HTTP 400 ao enviar header Auth | Liberar requisições POST com `Authorization: Basic` para `board.cefor.ifes.edu.br/jsonrpc.php` |
| **Proxy reverso** rejeitando requisição | HTTP 400 em formato válido | Revisar regras de proxy; liberar métodos POST com auth |
| **CORS/Política de origem** muito restritiva | Erro mesmo com credenciais | Configurar CORS para origem da aplicação CGTE |
| **Usuário LDAP sem permissão API** | Erro 401 persistente | Habilitar API Access no Kanboard para usuários remotos LDAP |
| **TLS/SSL requerendo config especial** | Erro durante handshake | Validar certificado e compatibilidade TLS 1.2+ |

---

## 💡 Solução Recomendada

### Opção A: Liberar API do Kanboard (RECOMENDADO)

**Ações de TI necessárias:**

#### 1. Revisar Regras de Firewall/WAF

Liberar requisições POST para:
```
https://board.cefor.ifes.edu.br/jsonrpc.php
```

Com headers:
```
- Authorization: Basic [credentials]
- Content-Type: application/json
```

#### 2. Habilitar API para Usuários LDAP no Kanboard

- Admin → Users → [seu-usuario]
- Ativar: ☑️ "API Access" / "Allow API"
- Gerar novo token de API

#### 3. Testar com curl

```bash
curl -X POST https://board.cefor.ifes.edu.br/jsonrpc.php \
  -H "Authorization: Basic $(echo -n "1627042:TOKEN_AQUI" | base64)" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"getVersion","id":1}'
```

Deve retornar:
```json
{"jsonrpc":"2.0","result":"X.X.X","id":1}
```

---

### Opção B: Criar Usuário Local API (Alternativa)

Se usuário LDAP continuar com restrições:

1. Criar usuário **local** no Kanboard:
   - Username: `api-cgte`
   - Tipo: Local (não LDAP)
   - Role: Administrador

2. Gerar token de API para este usuário
3. Usar este token na aplicação

---

## 🎯 Por Quê Fazer Isto?

### Impacto nos Objetivos do Projeto

| Benefício | Impacto |
|-----------|---------|
| **Automatizar relatórios PGD** | Economiza ~4h/semana de trabalho manual |
| **Dashboard em tempo real** | Visibilidade imediata do progresso das tarefas |
| **Sincronização de dados** | Elimina duplicação de entrada de dados |
| **Auditoria e rastreabilidade** | Histórico automático de todas as ações |
| **Escalabilidade** | Suporta crescimento sem retrabalho |

### Risco de Não Fazer

```
❌ Projeto fica bloqueado indefinidamente
❌ Usuários retornam a processos manuais (ineficiente)
❌ Relatórios continuam sendo feitos manualmente
❌ Perda de investimento em desenvolvimento
```

---

## 📞 Próximos Passos

**Solicitamos que TI:**

1. ✅ **Revise** as regras de firewall/WAF para `board.cefor.ifes.edu.br`
2. ✅ **Teste** curl command acima após liberações
3. ✅ **Confirme** via email quando API estiver acessível
4. ✅ **Gere** token de API (Opção A) OU crie usuário local (Opção B)

**Timeline sugerida:** 24-48 horas para liberar API

---

## 📎 Informações Técnicas para TI

**Aplicação:** Sistema de Gestão CGTE
**Repositório:** https://github.com/vertumno/sistema-gestao-cgte
**Deploy:** https://sistema-gestao-cgte.vercel.app
**Endpoint Kanboard:** https://board.cefor.ifes.edu.br/jsonrpc.php
**Tipo de Requisição:** JSON-RPC 2.0 via HTTP POST
**Autenticação:** HTTP Basic Auth (RFC 2617)

### Stack Técnico da Aplicação

- **Framework:** Next.js 16.1.6
- **Runtime:** Node.js 18+
- **Linguagem:** TypeScript
- **UI Components:** React 19, shadcn/ui, Tailwind CSS
- **Estado:** Zustand
- **Testes:** Vitest

### Ambiente de Produção

- **Plataforma:** Vercel
- **Branch:** main (https://github.com/vertumno/sistema-gestao-cgte)
- **URL:** https://sistema-gestao-cgte.vercel.app
- **Health Check:** https://sistema-gestao-cgte.vercel.app/api/health

---

## ✉️ Instruções para Enviar

1. Copie o conteúdo deste documento
2. Envie para TI com:
   - Seu nome e email
   - Referência ao projeto CGTE
   - Descrição breve do bloqueio

3. Solicite confirmação de recebimento
4. Acompanhe o progresso

---

## 📝 Histórico

| Data | Ação | Status |
|------|------|--------|
| 2026-02-25 | Documento criado | Pendente envio |
| | Diagnóstico completado | ✅ Concluído |
| | Solicitação a TI | ⏳ Aguardando |

---

**Última atualização:** 2026-02-25
**Responsável:** @devops
**Contato:** [seu-email-aqui]
