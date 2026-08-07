# ADR-0012 — Credenciais de afiliado por loja

## Status

Proposto (para definição futura)

## Contexto

Cada loja parceira pode exigir credenciais específicas para gerar links de afiliado. A pesquisa prática separou duas responsabilidades que antes estavam misturadas:

- coleta de dados públicos do produto;
- geração do link afiliado.

Para Mercado Livre, título, imagem e preços estão no HTML inicial da página pública e não exigem credenciais. A geração de links, por outro lado, foi observada no endpoint interno `createLink` usando tag, cookie `ssid` e token CSRF.

O modelo conhecido ou provável por loja é:

- **Mercado Livre**: tag, cookie `ssid` e token CSRF para geração não oficial do link; nenhuma credencial para coleta pública do produto.
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
- Como renovar com segurança uma sessão afiliada expirada?
- O risco operacional do endpoint interno do Mercado Livre será aceito em produção?

## Consequências

- O MVP atual continua simples: detecção de loja + link de afiliado fornecido
  pelo usuário.
- A coleta pública do Mercado Livre pode evoluir independentemente deste ADR e não deve acessar credenciais afiliadas.
- Quando esse ADR for aceito, será necessário criar um cadastro de credenciais
  por loja e integrá-lo ao parser/gerador de links de afiliado.
