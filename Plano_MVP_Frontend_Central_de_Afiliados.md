# MVP Frontend - Central de Afiliados

## Objetivo

Construir um MVP totalmente funcional utilizando dados mockados, sem
depender do backend.

Ao final desta etapa será possível:

-   Visualizar o dashboard
-   Listar promoções
-   Editar uma promoção
-   Visualizar a arte (preview)
-   Visualizar a mensagem
-   Simular a publicação

------------------------------------------------------------------------

# Stack

-   Vue 3
-   TypeScript
-   Vite
-   Tailwind CSS
-   Pinia
-   Vue Router
-   Axios
-   VeeValidate
-   Zod
-   Konva.js
-   Lucide Icons

------------------------------------------------------------------------

# Estrutura

``` text
src/
├── assets/
├── components/
├── composables/
├── layouts/
├── mock/
├── modules/
├── pages/
├── router/
├── stores/
├── types/
└── utils/
```

------------------------------------------------------------------------

# Roadmap

## Fase 0 --- Setup

-   Criar projeto Vue + TS
-   Configurar Tailwind
-   Configurar Pinia
-   Configurar Vue Router
-   Configurar ESLint/Prettier
-   Criar layout base

------------------------------------------------------------------------

## Fase 1 --- Layout

Componentes:

-   Header
-   Sidebar
-   Footer
-   Breadcrumb
-   Card
-   Botões
-   Inputs
-   StatusBadge
-   StoreBadge

------------------------------------------------------------------------

## Fase 2 --- Rotas

-   Dashboard
-   Promoções
-   Promoção
-   Templates
-   Histórico
-   Configurações

------------------------------------------------------------------------

## Fase 3 --- Dashboard

Cards:

-   Promoções do dia
-   Publicadas
-   Rascunhos
-   Erros

Tabela:

-   Últimas promoções

------------------------------------------------------------------------

## Fase 4 --- Promoções

Funcionalidades:

-   Pesquisa
-   Filtro por loja
-   Filtro por status
-   Lista de promoções

Cada item deve possuir:

-   Imagem
-   Loja
-   Título
-   Preço
-   Status
-   Botão Editar

------------------------------------------------------------------------

## Fase 5 --- Editor da Promoção

Abas:

### Informações

-   Título
-   Link
-   Loja
-   Categoria
-   Preço
-   Preço antigo
-   Cupom
-   Tags

### Imagem

-   Preview da arte
-   Botão Atualizar Preview

### Mensagem

-   Preview da mensagem
-   Editor de texto

### Publicação

-   Destino
-   Status
-   Botão Salvar
-   Botão Publicar

------------------------------------------------------------------------

## Fase 6 --- Templates

Lista de templates:

-   Shopee
-   Mercado Livre
-   Amazon

Nesta fase apenas preview.

Editor visual ficará para a próxima versão.

------------------------------------------------------------------------

## Fase 7 --- Histórico

Tabela contendo:

-   Data
-   Loja
-   Produto
-   Status
-   Canal

------------------------------------------------------------------------

## Fase 8 --- Configurações

-   Nome do projeto
-   Tema
-   Telegram
-   Preferências

------------------------------------------------------------------------

# Dados Mockados

Criar:

-   dashboard.ts
-   promotions.ts
-   templates.ts
-   settings.ts

Todas as Stores deverão consumir esses arquivos.

Posteriormente será substituído por chamadas HTTP.

------------------------------------------------------------------------

# Stores

-   authStore
-   dashboardStore
-   promotionStore
-   templateStore
-   settingsStore

------------------------------------------------------------------------

# Tipagens

-   User
-   Product
-   Post
-   Promotion
-   Template
-   Dashboard
-   Store
-   Category

------------------------------------------------------------------------

# Componentes Compartilhados

-   PromotionCard
-   PromotionTable
-   SearchBar
-   PreviewImage
-   PreviewMessage
-   StatusBadge
-   StoreBadge
-   EmptyState
-   LoadingState

------------------------------------------------------------------------

# MVP Final

Ao concluir o MVP o sistema deverá permitir:

1.  Acessar o Dashboard.
2.  Visualizar promoções mockadas.
3.  Editar uma promoção.
4.  Visualizar a arte.
5.  Visualizar a mensagem.
6.  Simular a publicação.

Sem backend, porém com arquitetura preparada para integração futura com
Railway/Fastify.
