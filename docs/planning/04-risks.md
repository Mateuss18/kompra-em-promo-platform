# Riscos do Projeto

## Riscos técnicos

| Risco | Impacto | Mitigação inicial |
|---|---|---|
| Alteração no HTML ou nas páginas das lojas | Alto | Isolar cada loja em um parser próprio e adicionar testes com páginas de referência |
| Bloqueio de scraping | Alto | Priorizar APIs oficiais quando disponíveis, aplicar limites e manter fallback manual |
| Dados incompletos ou incorretos | Alto | Permitir edição antes da aprovação |
| Preço mudar após a coleta | Alto | Exibir horário da coleta e exigir revisão |
| Link sem tag de afiliado | Alto | Validar e normalizar o link antes de aprovar |
| Link encurtado ou redirecionado | Médio | Resolver redirecionamentos de forma controlada |
| Imagem remota indisponível | Médio | Permitir substituição manual e registrar erro |
| Texto cortado na imagem | Médio | Limitar tamanho e validar layout antes da geração |
| Publicação duplicada | Alto | Usar idempotência e travas por promoção |
| Falha no Telegram | Médio | Registrar tentativa, erro e permitir reenvio |
| Fila indisponível | Médio | Persistir jobs e permitir recuperação |
| Vazamento de tokens | Alto | Usar variáveis de ambiente e rotação de segredos |

## Riscos de produto

- O fluxo continuar exigindo edição manual excessiva.
- A imagem simples não entregar qualidade visual suficiente.
- Aprovação se tornar um gargalo.
- Usuários confundirem rascunho, aprovado e publicado.
- A equipe copiar uma mensagem desatualizada para o WhatsApp.
- O sistema ficar complexo demais para uma equipe pequena.

## Riscos operacionais

- Dependência de uma única pessoa para manutenção.
- Falta de backups.
- Ausência de monitoramento de erros.
- Custos de infraestrutura crescerem sem acompanhamento.

## Revisão

Este documento deve ser revisado a cada milestone e sempre que uma integração externa for adicionada.
