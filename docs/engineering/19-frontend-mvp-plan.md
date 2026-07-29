# Plano do MVP Frontend

## Objetivo

Construir o frontend completo com dados mockados antes da API real.

## Escopo

- Login simulado.
- Dashboard.
- Listagem de promoções.
- Busca, filtros, ordenação e paginação.
- Edição de promoção.
- Preview da mensagem.
- Preview simples da imagem.
- Aprovação, rejeição e publicação simuladas.
- Histórico.
- Configurações básicas.
- Persistência em `localStorage`.

## Stack

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

Konva.js está planejado para o editor visual pós-MVP.

## Rotas

```text
/login
/dashboard
/promotions
/promotions/:id
/templates
/history
/settings
```

## Critério de conclusão

O frontend estará pronto quando o fluxo de login, listagem, edição, aprovação e publicação simulada puder ser executado de ponta a ponta sem backend.
