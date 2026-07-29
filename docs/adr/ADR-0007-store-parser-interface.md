# ADR-0007 — Parsers isolados por loja

## Status

Aceito

## Contexto

Shopee, Amazon e Mercado Livre possuem estruturas e regras diferentes e podem mudar independentemente.

## Opções consideradas

- Um parser único com condicionais.
- Implementações separadas por loja.

## Decisão

Criar uma interface comum e uma implementação por loja.

## Consequências

- Facilita testes e manutenção.
- Permite adicionar lojas sem alterar o fluxo central.
- Exige normalização para um modelo comum.
