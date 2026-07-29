# ADR-0008 — BullMQ para tarefas assíncronas

## Status

Aceito

## Contexto

Coleta, geração de imagem e publicação podem ser lentas, falhar temporariamente ou precisar de repetição.

## Opções consideradas

- Processar tudo na requisição HTTP.
- Cron simples.
- BullMQ com Redis.

## Decisão

Usar BullMQ e Redis quando as integrações reais forem implementadas.

## Consequências

- Suporte a retries e processamento separado.
- Aumenta a complexidade operacional.
- API e worker devem ser implantados de forma independente.
