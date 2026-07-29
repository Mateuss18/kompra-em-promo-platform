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
- PrimeVue
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

Projeto em planejamento e implementação do MVP frontend com dados mockados.

## Setup do Projeto

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Run Unit Tests with Vitest

```sh
pnpm test:unit
```

### Lint with ESLint

```sh
pnpm lint
```
