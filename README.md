# Kompra Em Promo Platform

Plataforma interna para criação, revisão, padronização e publicação de promoções de afiliados.

O sistema recebe links de produtos da Shopee, Amazon e Mercado Livre, identifica a loja, obtém os dados da oferta, garante o uso do link com identificação de afiliado, gera uma mensagem e uma imagem simples, cria um rascunho para aprovação e publica a promoção no canal oficial do Telegram.

A publicação no WhatsApp será inicialmente manual.

## Público inicial

O sistema será usado inicialmente pelo proprietário do projeto, com expansão prevista para uma equipe pequena de até cinco pessoas.

## Fluxos de entrada

1. Envio de link em um grupo privado do Telegram.
2. Cadastro de link diretamente no painel web.

Nos dois casos, o sistema deverá criar o mesmo tipo de rascunho e seguir o mesmo processo de revisão e aprovação.

## Lojas suportadas no MVP

- Shopee
- Amazon
- Mercado Livre

## Stack planejada

### Frontend

- Vue 3
- TypeScript
- Vite
- Tailwind CSS
- Pinia
- Vue Router
- Axios
- VeeValidate
- Zod
- Lucide Icons

### Backend

- Fastify
- TypeScript
- Prisma
- PostgreSQL
- Redis
- BullMQ
- grammY
- Sharp

## Documentação

- [`docs/planning`](docs/planning): visão, escopo, riscos, marcos, épicos, histórias e tarefas.
- [`docs/engineering`](docs/engineering): arquitetura, estrutura, padrões, testes, CI/CD e releases.
- [`docs/adr`](docs/adr): decisões arquiteturais relevantes.

## Status

MVP frontend com dados mockados e autenticação real integrada à API. As promoções continuam locais até a implementação do CRUD no backend.

## Setup do Projeto

```sh
pnpm install
```

Copie `apps/api/.env.example` para `apps/api/.env` e defina `ACCESS_TOKEN_SECRET`, `ADMIN_EMAIL` e `ADMIN_PASSWORD`. Os valores de exemplo não são aceitos. Para usar outra origem da API no frontend, copie também `apps/web/.env.example` para `apps/web/.env`.

Com o Docker Desktop aberto, inicie o PostgreSQL, gere o Prisma Client e aplique as migrations:

```sh
pnpm db:up
pnpm prisma:generate
pnpm db:migrate
```

Crie ou atualize o administrador com `DATABASE_URL`, `ADMIN_EMAIL` e `ADMIN_PASSWORD` configurados no ambiente:

```sh
pnpm admin:upsert
```

O login usa os valores `ADMIN_EMAIL` e `ADMIN_PASSWORD` de `apps/api/.env`.

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

Para encerrar o PostgreSQL sem apagar os dados:

```sh
pnpm db:down
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Run Unit Tests with Vitest

```sh
pnpm test
```

### Lint with ESLint

```sh
pnpm lint
```

### Typecheck e formatação

```sh
pnpm typecheck
pnpm format:check
```
