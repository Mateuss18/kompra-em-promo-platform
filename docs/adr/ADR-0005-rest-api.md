# ADR-0005 — API REST entre frontend e backend

## Status

Aceito

## Contexto

O sistema possui operações orientadas a recursos e não exige inicialmente a flexibilidade de GraphQL.

## Opções consideradas

- REST.
- GraphQL.
- RPC.

## Decisão

Usar API REST em Fastify.

## Consequências

- Contratos simples.
- Integração direta com Axios.
- Endpoints deverão representar ações de domínio com clareza.
