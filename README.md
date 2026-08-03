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

MVP frontend com fallback local, autenticação real e promoções integradas à API. Links enviados pelo painel ou pelo webhook do grupo privado do Telegram criam rascunhos persistidos.

## Primeira execução

```powershell
pnpm.cmd install
```

Copie `apps/api/.env.example` para `apps/api/.env` e defina `ACCESS_TOKEN_SECRET`, `ADMIN_EMAIL` e `ADMIN_PASSWORD`. Os valores de exemplo não são aceitos. Para usar outra origem da API no frontend, copie também `apps/web/.env.example` para `apps/web/.env`.

Com o Docker Desktop aberto, inicie o PostgreSQL, gere o Prisma Client e aplique as migrations:

```powershell
pnpm.cmd db:up
pnpm.cmd prisma:generate
pnpm.cmd db:migrate
```

Crie ou atualize o administrador com `DATABASE_URL`, `ADMIN_EMAIL` e `ADMIN_PASSWORD` configurados no ambiente:

```powershell
pnpm.cmd admin:upsert
```

O login usa os valores `ADMIN_EMAIL` e `ADMIN_PASSWORD` de `apps/api/.env`.

Para receber links do grupo privado do Telegram, configure `TELEGRAM_GROUP_ID` e `TELEGRAM_WEBHOOK_SECRET` em `apps/api/.env`. Crie o bot no BotFather e registre pela Bot API um webhook público apontando para `/api/telegram/webhook`, enviando o mesmo segredo no parâmetro `secret_token`. Sem essas duas variáveis, a integração permanece desabilitada.

Com o banco preparado, inicie a API e o painel:

```powershell
pnpm.cmd dev
```

## Uso diário

Com o Docker Desktop aberto, inicie o banco e a aplicação:

```powershell
pnpm.cmd db:up
pnpm.cmd dev
```

Execute `pnpm.cmd prisma:generate` após alterar o schema do Prisma, `pnpm.cmd db:migrate` quando houver uma migration nova e `pnpm.cmd admin:upsert` após alterar as credenciais do administrador.

Para encerrar o PostgreSQL sem apagar os dados:

```powershell
pnpm.cmd db:down
```

### Type-Check, Compile and Minify for Production

```powershell
pnpm.cmd build
```

### Run Unit Tests with Vitest

```powershell
pnpm.cmd test
```

### Lint with ESLint

```powershell
pnpm.cmd lint
```

### Typecheck e formatação

```powershell
pnpm.cmd typecheck
pnpm.cmd format:check
```
