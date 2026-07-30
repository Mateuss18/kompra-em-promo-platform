# ADR-0004 — Tailwind CSS com bibliotecas focadas

## Status

Aceito

## Contexto

O painel precisa manter liberdade visual e oferecer tabelas e gráficos sem depender de licenças comerciais ou chaves renováveis.

## Opções consideradas

- PrimeVue 5.
- PrimeVue 4.
- Outra suíte completa de componentes.
- Tailwind CSS com bibliotecas focadas por necessidade.

## Decisão

Usar Tailwind CSS para a interface. Adicionar uma biblioteca de gráficos e uma de tabelas somente quando as respectivas funcionalidades forem implementadas.

## Consequências

- Não há chave de licença nem suíte visual concorrendo com o design do produto.
- Componentes simples usam HTML semântico e Vue.
- Gráficos e tabelas avançadas terão dependências próprias quando forem necessários.
