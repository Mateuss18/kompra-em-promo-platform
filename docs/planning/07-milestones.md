# Marcos do Projeto

## M0 — Planejamento e fundação

- Documentação inicial.
- Repositório organizado.
- Stack definida.
- Padrões e ADRs iniciais.

## M1 — MVP frontend com mocks

- Login simulado.
- Layout base.
- Dashboard.
- Lista e filtros de promoções.
- Editor de promoção.
- Preview simples de mensagem e imagem.
- Aprovação e publicação simuladas.
- Persistência local.

## M2 — Backend e autenticação

- API Fastify.
- PostgreSQL e Prisma.
- Autenticação própria.
- Sessão com access token e refresh token.
- Usuário `ADMIN`.
- CRUD de promoções.

## M3 — Entrada de links

- Recebimento de link pelo painel.
- Bot em grupo privado do Telegram.
- Detecção de loja.
- Criação de rascunho.

## M4 — Parsers e afiliados

- Parser da Shopee.
- Parser da Amazon.
- Parser do Mercado Livre.
- Coleta automática de título, imagem e preços do Mercado Livre sem login.
- Normalização do link.
- Validação da identificação de afiliado.

## M5 — Geração e aprovação

- Geração de mensagem.
- Imagem simples com foto do produto e slogan.
- Fluxo de aprovação e rejeição.
- Histórico de alterações.

## M6 — Publicação no Telegram

- Publicação no canal oficial.
- Idempotência.
- Registro de sucesso e falha.
- Reenvio controlado.

## M7 — Editor visual pós-MVP

- Canvas com Konva.js.
- Templates por loja.
- Fundo, imagem, nome e preço.
- Posicionamento e redimensionamento.
- Persistência do template.
- Renderização final no backend.
