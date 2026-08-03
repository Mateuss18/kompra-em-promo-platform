# ADR-0012 — Credenciais de afiliado por loja

## Status

Proposto (para definição futura)

## Contexto

Cada loja parceira (Shopee, Amazon, Mercado Livre) pode exigir credenciais
específicas para gerar ou validar links de afiliado. Inspirado em outras
plataformas de afiliados, o modelo provável é:

- **Mercado Livre**: nome de usuário, token e cookie.
- **Shopee**: Shopee credential e Shopee secret key.
- **Amazon**: versão da credencial, ID da credencial, segredo e partner tag.

## Decisão

Ainda não definida. No MVP atual o usuário informa o link de afiliado pronto e
o sistema apenas identifica a loja. A geração/assinatura real de links de
afiliado usando credenciais de loja será tratada em épico posterior.

## Questões em aberto

- As credenciais pertencem ao admin/afiliado único ou a cada usuário da
  plataforma?
- Onde são armazenadas: configuração geral, tabela `storeCredentials`, variáveis
  de ambiente ou cofre de secrets?
- O frontend precisa editar essas credenciais ou elas vêm apenas do backend?
- Quais operações reais exigirão essas credenciais (apenas assinatura de link,
  ou também consulta de dados do produto)?

## Consequências

- O MVP atual continua simples: detecção de loja + link de afiliado fornecido
  pelo usuário.
- Quando esse ADR for aceito, será necessário criar um cadastro de credenciais
  por loja e integrá-lo ao parser/gerador de links de afiliado.
