# Padrões de Código

## TypeScript

- TypeScript é obrigatório.
- Evitar `any`.
- Preferir `unknown` quando o tipo não for conhecido.
- Exportar contratos públicos explicitamente.
- Usar unions ou enums para estados finitos.
- Validar dados externos na fronteira do sistema.

## Vue

- Usar Composition API.
- Preferir `<script setup lang="ts">`.
- Componentes em `PascalCase`.
- Props e emits tipados.
- Não concentrar regras de negócio em componentes visuais.
- Componentes de página podem orquestrar stores e services.

## Nomenclatura

- Componentes: `PromotionTable.vue`.
- Páginas: `PromotionsPage.vue`.
- Stores: `promotionStore.ts` ou `usePromotionStore`.
- Services: `promotionService.ts`.
- Composables: `usePromotionFilters.ts`.
- Tipos: nomes no singular e em `PascalCase`.
- Constantes globais: `UPPER_SNAKE_CASE`.

## Dados

- Valores monetários em centavos na camada de domínio.
- Formatação de moeda apenas na apresentação.
- Datas em ISO 8601 na API e persistência.
- IDs opacos; não inferir significado a partir deles.
- URLs devem ser validadas antes do processamento.

## Qualidade

Antes de merge:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Segurança

- Nunca commitar tokens ou senhas.
- Não registrar cookies, tokens ou links secretos.
- Sanitizar conteúdo externo.
- Aplicar rate limit no login e ingestão de links.
- Usar cookies `HttpOnly`, `Secure` e `SameSite` para refresh token quando a autenticação real for implementada.
