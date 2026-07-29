# ADR-0009 — Geração de imagem com Sharp

## Status

Aceito

## Contexto

A primeira versão precisa gerar uma arte simples no backend e, depois, suportar templates mais elaborados.

## Opções consideradas

- Canvas no navegador apenas.
- Serviço externo.
- SVG e Sharp no backend.

## Decisão

Usar Sharp, preferencialmente renderizando SVG para PNG.

## Consequências

- Resultado reproduzível no servidor.
- Não depende do navegador do usuário.
- Templates devem respeitar limites de texto e imagem.
