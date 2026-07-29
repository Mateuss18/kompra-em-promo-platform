# ADR-0002 — Desenvolver o frontend com mocks antes da API

## Status

Aceito

## Contexto

O fluxo e a experiência precisam ser validados antes da implementação de integrações e backend.

## Opções consideradas

- Criar frontend e backend simultaneamente.
- Criar o backend primeiro.
- Criar o frontend completo com mocks.

## Decisão

Construir o MVP frontend usando mocks acessados por uma camada de services.

## Consequências

- As telas podem ser desenvolvidas rapidamente.
- Services reduzem o acoplamento aos mocks.
- Será necessário validar contratos ao integrar a API real.
