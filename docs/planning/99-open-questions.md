# Questões em Aberto

## Produto

- Qual será o slogan oficial usado nas imagens?
- A equipe poderá aprovar promoções ou apenas o proprietário?
- Promoções rejeitadas poderão voltar para rascunho?
- Será necessário agendamento de publicação?
- Haverá categorias e tags no MVP completo?

## Afiliados

- Qual formato de identificação de afiliado será usado em cada loja?
  - Amazon: parâmetro `tag`.
  - Mercado Livre: a resposta real de `createLink` mostrou a tag da conta em `matt_word`. `matt_tool` também está presente, mas aparenta identificar a ferramenta/canal e não deve ser tratado sozinho como identidade do afiliado.
  - Shopee: parâmetro de afiliado próprio da loja.
- Links já afiliados devem ser preservados ou regenerados?
  - Preservados. A normalização mantém os parâmetros de afiliado existentes.
- Como tratar links encurtados?
  - Ainda em aberto. No MVP aceitamos os domínios conhecidos (`amzn.to`, `meli.la`), mas não expandimos a URL.
- Como validar que a comissão será atribuída corretamente?
  - Ainda em aberto. A validação inicial será apenas a presença do parâmetro de afiliado correspondente.

## Coleta de dados

- Serão utilizadas APIs oficiais, scraping ou uma combinação?
  - Mercado Livre: leitura da página pública sem login. A prova começa com `fetch`; navegador headless será usado se o HTML válido não estiver disponível no ambiente real. OAuth foi descartado para anúncios de terceiros.
  - Amazon e Shopee: continuam em aberto e fora do EPIC-09A.
- Quais campos são obrigatórios para criar um rascunho?
  - `title`, `priceInCents`, `store`, `sourceUrl`, `affiliateUrl` e `status DRAFT`. Para Mercado Livre, `productImageUrl` também deve ser coletada antes de criar o rascunho.
- O que acontece quando preço ou imagem não puderem ser obtidos?
  - Mercado Livre: a ingestão falha com mensagem clara e nenhum placeholder é persistido. O usuário pode tentar novamente.
- Por quanto tempo os dados coletados serão considerados válidos?
  - No EPIC-09A, `createdAt` representa a coleta inicial. Atualização e validade periódica ficam para um épico posterior.

## Telegram e WhatsApp

- Qual grupo privado receberá os links?
- Qual canal oficial receberá as publicações?
- A mensagem terá formatação diferente entre Telegram e WhatsApp?

## Imagens

- Qual será a proporção padrão da arte inicial?
  - Quadrado 1080x1080 (Instagram feed).
- A imagem simples terá apenas produto e slogan ou também loja e preço?
  - Apenas foto do produto e logo/slogan no canto superior esquerdo. Loja e preço ficam na mensagem, não na arte do MVP.
- Haverá upload manual de imagem no MVP completo?
  - Não no MVP. Para Mercado Livre, a imagem virá da página pública no EPIC-09A. Amazon e Shopee continuam usando o comportamento atual até seus coletores serem definidos.
- Onde os arquivos gerados serão armazenados?
  - No desenvolvimento: `apps/api/public/generated-images/`. Em produção será substituído por S3/R2 quando necessário.

## Infraestrutura

- Railway continuará como primeira opção para backend, banco e Redis?
- Qual serviço será usado para armazenamento de imagens?
- Qual estratégia de backup será adotada?
