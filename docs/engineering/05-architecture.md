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

- Login simulado no MVP frontend.
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
  supports(url: string): boolean
  parse(url: string): Promise<ParsedProduct>
}
```

Implementações iniciais:

- `ShopeeParser`
- `AmazonParser`
- `MercadoLivreParser`

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
