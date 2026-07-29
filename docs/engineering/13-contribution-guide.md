# Guia de Contribuição

## Fluxo de branches

Usar branches por funcionalidade.

Exemplos:

```text
feat/promotion-list
feat/fake-login
feat/telegram-ingestion
fix/affiliate-link-validation
docs/update-architecture
```

## Processo

1. Atualizar a branch principal.
2. Criar uma branch pequena e focada.
3. Implementar a alteração.
4. Rodar lint, typecheck, testes e build.
5. Revisar o próprio diff.
6. Fazer merge apenas com o projeto funcional.

## Commits

Preferir Conventional Commits:

```text
feat: add promotion filters
fix: prevent duplicated publication
docs: document telegram flow
refactor: isolate store parsers
test: cover promotion state transitions
```

## Pull requests

Mesmo com uma equipe pequena, mudanças relevantes devem descrever:

- Problema resolvido.
- Solução adotada.
- Como testar.
- Riscos.
- Screenshots quando houver alteração visual.

## Escopo

Evitar misturar refatoração ampla, nova funcionalidade e correção urgente no mesmo conjunto de alterações.
