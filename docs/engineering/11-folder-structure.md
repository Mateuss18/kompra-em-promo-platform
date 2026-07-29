# Estrutura de Pastas

## Frontend

```text
src/
├── assets/
├── components/
│   ├── common/
│   ├── layout/
│   └── promotions/
├── composables/
├── layouts/
├── mocks/
├── pages/
├── router/
├── services/
├── stores/
├── types/
├── utils/
├── App.vue
└── main.ts
```

### Responsabilidades

- `components`: componentes reutilizáveis.
- `composables`: lógica reativa compartilhada.
- `layouts`: estruturas de página.
- `mocks`: dados e respostas simuladas.
- `pages`: componentes associados a rotas.
- `router`: rotas e guards.
- `services`: acesso a mocks ou API.
- `stores`: estado global.
- `types`: tipos e contratos.
- `utils`: funções puras e auxiliares.

## Backend

```text
src/
├── app/
├── config/
├── modules/
│   ├── auth/
│   ├── promotions/
│   ├── publications/
│   ├── stores/
│   └── users/
├── integrations/
│   ├── telegram/
│   └── parsers/
├── jobs/
├── plugins/
├── shared/
├── workers/
└── server.ts
```

## Regras

- Páginas não acessam mocks diretamente.
- Componentes não fazem chamadas HTTP diretamente.
- Stores orquestram estado; services acessam dados.
- Tipos de domínio não devem depender de PrimeVue.
- Código específico de loja fica em seu parser.
- Integração com Telegram não deve conter regras centrais de promoção.
