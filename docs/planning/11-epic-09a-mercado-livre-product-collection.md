# EPIC-09A — Coleta automática de produtos do Mercado Livre

## Status

Próximo épico de implementação.

## Objetivo

Ao receber uma URL de produto do Mercado Livre pelo painel ou Telegram, preencher automaticamente o rascunho com:

- título;
- preço atual em centavos;
- preço original em centavos, quando houver desconto;
- URL da imagem principal;
- URL de origem normalizada.

O fluxo não pode exigir login em conta Mercado Livre nem preenchimento manual desses campos.

## Descobertas confirmadas em 2026-08-05

### A geração do link afiliado é uma operação separada

O gerador interno do Mercado Livre usa:

```text
POST https://www.mercadolivre.com.br/affiliate-program/api/v2/affiliates/createLink
```

A resposta contém o link `meli.la`, mas não contém título, imagem ou preços. O Easyfy executa outra operação no backend para coletar os dados do produto e combina os dois resultados em sua própria resposta.

Geração de link afiliado não faz parte deste épico.

### Os dados necessários estão no HTML inicial

O produto de referência foi aberto em navegador real, sem login:

```text
https://www.mercadolivre.com.br/creatina-monohidratada-pura-1kg-dark-lab-unidade-sem-sabor/p/MLB25929487
```

A página entregou no HTML inicial:

- título;
- imagem principal;
- preço original;
- preço atual;
- ID do anúncio vendedor selecionado.

Não houve uma chamada XHR específica para carregar esses quatro campos. A navegação estava deslogada e exibia as ações "Crie a sua conta" e "Entre".

Valores observados durante a pesquisa, apenas como evidência e não como fixture permanente:

```text
Título: Creatina Monohidratada Pura 1kg Dark Lab Unidade Sem sabor
Preço original: R$ 159,90
Preço atual: R$ 69,90
Anúncio vendedor: MLB4812130742
```

### Requisição HTTP simples pode ser bloqueada

Uma leitura HTTP simples da mesma página recebeu `403 Forbidden`, enquanto o navegador real carregou o produto normalmente. Portanto, a implementação deve começar com uma prova curta usando `fetch`, mas precisa ter um critério objetivo para adotar navegador headless caso o ambiente real seja bloqueado.

### Existe implementação aberta de referência

O projeto aberto `caiowirthmann/market2csv` coleta produtos sem login usando HTML e os seletores do Mercado Livre. A implementação confirma a leitura direta de título e preços no DOM.

Referências:

- [market2csv](https://github.com/caiowirthmann/market2csv)
- [Implementação do scraper Mercado Livre](https://github.com/caiowirthmann/market2csv/blob/master/scraper/mercadolivre/mercadolivre.go)

## Decisões

- Não usar OAuth para coletar anúncios de terceiros.
- Não usar conta comum, conta vendedora ou conta afiliada para coletar os dados.
- Não armazenar cookies do Mercado Livre neste épico.
- Ler somente páginas públicas de produtos suportados.
- Começar pelo transporte mais simples que passar na prova real.
- Usar navegador headless somente se `fetch` não carregar o HTML válido de forma consistente.
- Não criar rascunho com título, preço ou imagem fictícios quando a coleta falhar.
- Manter a geração de link afiliado como uma integração posterior e independente.
- Não adicionar proxy, rotação de IP, CAPTCHA bypass, fila ou Redis neste épico.

## Fora de escopo

- Gerar links `meli.la`.
- Capturar ou renovar `ssid` e token CSRF.
- Consultar preços pela API OAuth.
- Coletar Shopee ou Amazon.
- Atualizar automaticamente promoções já salvas.
- Monitorar histórico de preço.
- Contornar CAPTCHA ou bloqueios deliberados.
- Executar coleta massiva ou varrer resultados de busca.

## Modelo de dados normalizado

Atualizar `ParsedProduct` para representar os dados reais:

```ts
type ParsedProduct = {
  title: string;
  priceInCents: number;
  originalPriceInCents: number | null;
  imageUrl: string;
};
```

Regras:

- valores monetários entram no domínio somente como inteiros em centavos;
- `originalPriceInCents` é `null` quando a página não exibir preço anterior;
- `originalPriceInCents`, quando presente, deve ser maior ou igual a `priceInCents`;
- título deve ser não vazio e diferente do placeholder atual;
- imagem deve usar HTTPS e host permitido do Mercado Livre/Mercado Libre;
- dados inválidos causam falha de coleta, não substituição silenciosa por valores fictícios.

## Seletores observados

| Campo          | Seletor principal                                   | Fallback inicial                                                    |
| -------------- | --------------------------------------------------- | ------------------------------------------------------------------- |
| Título         | `.ui-pdp-title`                                     | `meta[property="og:title"]`                                         |
| Preço atual    | `.ui-pdp-price__second-line .andes-money-amount`    | JSON estruturado encontrado na própria página, se validado no spike |
| Preço original | `.ui-pdp-price__original-value .andes-money-amount` | `null`                                                              |
| Imagem         | `.ui-pdp-gallery__figure img`                       | `meta[property="og:image"]`                                         |

Cada preço é composto pelos elementos:

```text
.andes-money-amount__fraction
.andes-money-amount__cents
```

O parser deve remover separadores de milhar, interpretar centavos ausentes como `00` e validar o resultado antes de convertê-lo para centavos.

Não usar texto global da página nem selecionar o primeiro preço genérico, pois recomendações e anúncios relacionados também possuem valores monetários.

## URLs suportadas

### Página de catálogo

```text
https://www.mercadolivre.com.br/.../p/MLB25929487
```

### Página de anúncio

```text
https://produto.mercadolivre.com.br/MLB-1234567890-...-_JM
```

### Link curto

```text
https://meli.la/...
```

Links curtos devem ser resolvidos antes da coleta com:

- no máximo cinco redirecionamentos;
- timeout total;
- validação de cada destino;
- aceitação apenas de hosts Mercado Livre/Mercado Libre já reconhecidos pelo parser;
- rejeição de redirecionamento para domínio externo.

## Fluxo esperado

```text
URL recebida
→ validar domínio inicial
→ resolver redirecionamentos permitidos
→ obter a página pública sem login
→ localizar o bloco principal do produto
→ extrair e validar título, preços e imagem
→ converter valores para centavos
→ criar o rascunho com dados reais
→ continuar geração de mensagem e imagem
```

## Plano de implementação

### Fase 1 — Prova de transporte

Criar uma prova pequena e removível que execute no mesmo ambiente da API:

1. Usar `fetch` nativo com timeout e headers mínimos de navegador.
2. Testar pelo menos:
   - a URL de catálogo usada na pesquisa;
   - uma URL direta de anúncio;
   - um link curto `meli.la` que termine em produto.
3. Confirmar presença do título, dos dois preços quando houver desconto e da imagem.

Critério para manter `fetch`:

- todas as URLs retornam HTML de produto;
- nenhum teste retorna página de bloqueio, CAPTCHA ou corpo vazio;
- os quatro campos são extraídos corretamente na execução local e em um ambiente equivalente ao deploy.

Se o critério falhar, encerrar a tentativa com `fetch` e usar Playwright headless. Não acumular headers falsos, cookies de conta ou mecanismos de evasão.

### Fase 2 — Parser assíncrono

O contrato atual é síncrono e retorna placeholders. Alterar para:

```ts
interface StoreParser {
  readonly store: PromotionStore;
  canHandle(url: string): boolean;
  normalizeAffiliateUrl(url: string): string;
  parse(url: string): Promise<ParsedProduct>;
}
```

Atualizar:

- `MercadoLivreParser` para coletar dados reais;
- parsers das outras lojas para continuarem compatíveis sem ampliar o escopo;
- `PromotionService.createDraft()` para aguardar a coleta;
- testes e mocks afetados.

### Fase 3 — Extração e validação

Implementar a extração no módulo do Mercado Livre, sem colocar seletores no `PromotionService`.

Responsabilidades:

- validar URL e redirecionamentos;
- obter a página;
- detectar bloqueio antes de interpretar o HTML;
- localizar somente o bloco principal do produto;
- montar preço atual e original;
- localizar imagem principal;
- normalizar e validar o resultado.

Não adicionar uma camada genérica de scraping para todas as lojas neste épico.

### Fase 4 — Integração com o rascunho

Remover o comportamento atual para Mercado Livre:

```text
title: Produto Mercado Livre
priceInCents: 1000
imageUrl: null
```

Persistir:

- `title` com o título coletado;
- `priceInCents` com o preço atual;
- `originalPriceInCents` com o preço anterior ou `null`;
- `productImageUrl` com a imagem principal;
- `sourceUrl` com a URL recebida normalizada.

A coluna `createdAt` da promoção será usada como referência inicial do horário da coleta. Um campo dedicado `productCollectedAt` fica adiado até existir atualização automática de preços.

### Fase 5 — Erros e feedback

Falhas esperadas:

- `UNSUPPORTED_PRODUCT_URL`;
- `PRODUCT_REDIRECT_REJECTED`;
- `PRODUCT_PAGE_BLOCKED`;
- `PRODUCT_PAGE_TIMEOUT`;
- `PRODUCT_DATA_INCOMPLETE`;
- `PRODUCT_PRICE_INVALID`.

Comportamento:

- não criar rascunho com dados falsos;
- painel recebe mensagem clara para tentar novamente;
- Telegram recebe confirmação de falha já suportada pelo webhook;
- não repetir automaticamente `403` ou CAPTCHA;
- no máximo uma repetição para falha transitória de rede, somente se a primeira requisição não recebeu resposta HTTP.

## Limites operacionais do MVP

- uma coleta por link ingerido;
- baixa concorrência compatível com o uso interno de uma pessoa;
- timeout explícito;
- sem execução em massa;
- sem cache adicional nesta fase;
- sem persistência de HTML;
- logs sem conteúdo integral da página, cookies ou tokens;
- registrar apenas host, duração, resultado e categoria do erro.

Se concorrência real causar bloqueio, adicionar depois uma fila com limite por loja. Não antecipar BullMQ ou Redis.

## Testes obrigatórios

### Unitários

Usar fragmentos HTML mínimos criados para o teste, não salvar páginas completas do Mercado Livre.

Cobrir:

- preço inteiro sem centavos;
- preço com centavos;
- preço atual com preço original;
- produto sem desconto;
- título ausente;
- imagem principal e fallback `og:image`;
- HTML de bloqueio;
- redirecionamento para domínio não permitido;
- conversão monetária para centavos.

### Integração local

Um smoke test manual, fora da suíte de CI, deve receber uma URL real e verificar:

- título não vazio;
- `priceInCents` inteiro e positivo;
- `originalPriceInCents` nulo ou maior/igual ao preço atual;
- imagem HTTPS;
- ausência de login e cookies de conta.

Não fixar em teste o preço observado em 2026-08-05, pois ele pode mudar.

### Regressão do fluxo

Cobrir criação pelo:

- painel;
- webhook do Telegram;
- link de catálogo;
- link direto de anúncio;
- link curto suportado.

## Critérios de aceite

- Colar um produto Mercado Livre cria um rascunho com título real.
- O preço atual é persistido em centavos.
- O preço original é persistido quando exibido na página.
- A imagem principal é persistida e pode alimentar a geração de imagem.
- A coleta funciona sem conta ou cookies do Mercado Livre.
- O link afiliado não é gerado nem alterado por este épico.
- Nenhum placeholder é salvo quando a coleta falha.
- Redirecionamentos não permitem sair dos domínios suportados.
- Testes unitários, lint, typecheck, formatação e build passam.
- Um smoke test manual com URL real é documentado no handoff da implementação.

## Comandos de validação

```powershell
pnpm.cmd test
pnpm.cmd lint
pnpm.cmd typecheck
pnpm.cmd format:check
pnpm.cmd build
```

## Handoff para a próxima sessão

Antes de implementar:

1. Verificar o worktree e preservar mudanças existentes.
2. Confirmar que EPIC-09A continua sendo o próximo escopo.
3. Executar a prova de transporte antes de escolher dependência.
4. Não reutilizar o módulo OAuth como coletor de produtos públicos.
5. Não misturar a chamada `createLink` neste épico.
6. Atualizar este documento com o transporte escolhido e o resultado do smoke test.

## Evoluções posteriores

- geração automática do link afiliado por integração de sessão;
- renovação controlada das credenciais afiliadas;
- atualização periódica de preço;
- cache distribuído;
- fila por loja;
- coleta de variações, frete, avaliações e vendedor;
- coletores equivalentes para Amazon e Shopee.
