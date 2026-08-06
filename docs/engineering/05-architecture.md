# Arquitetura

## Visão geral

```text
Frontend Vue
    |
    | HTTPS / REST
    v
API Fastify
    |
    +--> PostgreSQL
    |
    +--> Redis / BullMQ
    |
    +--> Worker de coleta e imagem
    |
    +--> Telegram Bot
```

## Componentes

### Frontend

Responsável por:

- Login e sessão integrados à API.
- Dashboard.
- Gestão e edição de promoções.
- Aprovação.
- Preview de mensagem e imagem.
- Histórico e configurações.

### API

Responsável por:

- Autenticação real.
- Regras de negócio.
- Persistência.
- Validação de transições.
- Criação e consulta de promoções.
- Aprovação e publicação.

### Bot Telegram

Responsável por:

- Receber links no grupo privado.
- Encaminhar o link à API.
- Informar sucesso ou falha de ingestão.
- Publicar promoções aprovadas no canal oficial.

### Parsers de loja

Cada loja terá implementação isolada de uma interface comum.

```ts
interface StoreParser {
  readonly store: PromotionStore;
  canHandle(url: string): boolean;
  normalizeAffiliateUrl(url: string): string;
  parse(url: string): Promise<ParsedProduct>;
}
```

Implementações iniciais:

- `ShopeeParser`
- `AmazonParser`
- `MercadoLivreParser`

No EPIC-09A, somente o parser do Mercado Livre fará coleta remota. Ele lerá a página pública sem login e manterá seletores e tratamento de bloqueio dentro do módulo da loja. Geração de link afiliado continua separada da coleta do produto.

### Worker

Responsável por tarefas assíncronas:

- Resolver links.
- Coletar dados.
- Gerar imagem.
- Publicar no Telegram.
- Repetir operações transitórias.

## Fluxos de entrada

### Telegram privado

```text
Link no grupo privado
→ bot
→ API
→ detecção da loja
→ coleta e normalização
→ geração de mensagem e imagem
→ rascunho
→ aprovação
→ publicação no Telegram
```

### Painel web

```text
Link no painel
→ API
→ detecção da loja
→ coleta e normalização
→ geração de mensagem e imagem
→ rascunho
→ aprovação
→ publicação no Telegram
```

## Estados da promoção

```text
DRAFT
PROCESSING
READY_FOR_REVIEW
APPROVED
REJECTED
PUBLISHING
PUBLISHED
FAILED
```

## Princípios

- Aprovação humana obrigatória.
- Integrações externas isoladas.
- Operações de publicação idempotentes.
- Frontend desacoplado da origem dos dados.
- Logs sem segredos.
- Erros externos não devem corromper o estado interno.
