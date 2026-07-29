# Revisão de Arquitetura

## Frequência

Realizar revisão:

- Ao final de cada milestone.
- Antes de adicionar uma nova loja.
- Antes de adicionar uma nova forma de publicação.
- Quando uma integração externa começar a afetar a estabilidade.
- Quando a equipe crescer.

## Checklist

- As responsabilidades continuam bem separadas?
- Algum componente conhece detalhes demais de outro?
- Os parsers permanecem isolados?
- O fluxo é idempotente?
- Há rastreabilidade de erros?
- Existe risco de exposição de segredos?
- A fila continua necessária e bem utilizada?
- O banco representa corretamente os estados?
- A documentação reflete o sistema real?
- A dívida técnica está sob controle?

## Resultado

Cada revisão deve gerar:

- Decisões confirmadas.
- ADRs novos ou atualizados.
- Dívidas técnicas.
- Riscos.
- Ações com prioridade.
