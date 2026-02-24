# Sistema de Gestao CGTE/Cefor

MVP fullstack em Next.js para integracao com Kanboard e geracao de dados de acompanhamento.

## Requisitos

- Node.js 20.x
- npm 10+

## Setup

```bash
npm install
cp .env.example .env
```

Configure no `.env`:

- `KANBOARD_API_URL`
- `KANBOARD_API_TOKEN`

## Executar

```bash
npm run dev
```

Acesse `http://localhost:3000`.

## Quality Gates

```bash
npm run lint
npm run typecheck
npm test
```

## Estrutura

- `app/` - UI e API routes
- `lib/` - Integracao Kanboard, taxonomia e agregacoes
- `components/` - Componentes de interface
- `config/` - Configuracoes editaveis (taxonomy)
- `tests/` - Testes unitarios/integracao/e2e
