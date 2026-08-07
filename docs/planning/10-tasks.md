# Tarefas

## EPIC-01 — Fundação do frontend

- Criar projeto Vue 3 com Vite e TypeScript.
- Configurar Tailwind CSS.
- Configurar Pinia.
- Configurar Vue Router.
- Configurar Axios.
- Configurar ESLint e Prettier.
- Criar alias `@/`.
- Criar estrutura de pastas.
- Criar layout com header e sidebar.
- Criar rotas principais.

## EPIC-02 — Login simulado

- Criar `LoginPage`.
- Criar `authStore`.
- Salvar sessão fake em `localStorage`.
- Criar guard de rota.
- Adicionar logout.
- Criar credenciais de demonstração documentadas.

## EPIC-03 — Dashboard

- Criar mocks de indicadores.
- Criar cards de resumo.
- Criar tabela de últimas promoções.
- Criar estados de loading, erro e vazio.

## EPIC-04 — Promoções

- Definir tipos de domínio.
- Criar mocks realistas das três lojas.
- Criar `promotionService`.
- Criar `promotionStore`.
- Criar tabela de promoções.
- Adicionar busca.
- Adicionar filtros.
- Adicionar ordenação.
- Adicionar paginação.
- Criar rota de detalhes.

## EPIC-05 — Editor

- Criar formulário de informações.
- Criar schema Zod.
- Criar aba de mensagem.
- Criar preview simples de imagem.
- Criar aba de publicação.
- Persistir mudanças localmente.
- Adicionar confirmação para descartar mudanças.

## EPIC-06 — Aprovação simulada

- Definir máquina de estados.
- Implementar aprovação.
- Implementar rejeição com motivo.
- Implementar publicação simulada.
- Registrar eventos localmente.
- Impedir transições inválidas.

## Backend

- Inicializar Fastify.
- Configurar Prisma e PostgreSQL.
- Criar migrations.
- Implementar autenticação própria.
- Implementar refresh token.
- Implementar rate limiting.
- Implementar CRUD de promoções.
- Implementar auditoria.

## Integrações

- Criar webhook do bot Telegram.
- Receber links no grupo privado.
- Criar interface `StoreParser`.
- Implementar parser para Shopee, validando domínios e preservando parâmetros de afiliado.
- Implementar parser para Amazon, validando domínios e preservando o parâmetro `tag`.
- Implementar parser para Mercado Livre, validando domínios e preservando o parâmetro de afiliado.
- Implementar normalização de links de afiliado por loja.
- Adicionar validação de loja suportada antes de criar o rascunho.
- Atualizar testes de criação de rascunho para cobrir links afiliados e não afiliados.

### EPIC-09A — Coleta automática Mercado Livre

- Executar a prova de transporte com `fetch` no ambiente da API e em ambiente equivalente ao deploy.
- Adotar navegador headless somente se a prova de `fetch` falhar.
- Alterar `StoreParser.parse()` para contrato assíncrono.
- Adicionar `originalPriceInCents` ao resultado normalizado do parser.
- Resolver links curtos com limite de redirecionamentos e validação de domínio.
- Extrair título, preço atual, preço original e imagem do bloco principal do produto.
- Converter preços para centavos e rejeitar valores inválidos.
- Remover placeholders do fluxo Mercado Livre.
- Impedir criação do rascunho quando a coleta falhar.
- Manter coleta sem login, cookies ou OAuth.
- Adicionar testes com fragmentos HTML mínimos e smoke test manual com URL real.
- Registrar no handoff o transporte escolhido e o resultado da validação real.

Detalhamento e critérios de aceite: [`11-epic-09a-mercado-livre-product-collection.md`](11-epic-09a-mercado-livre-product-collection.md).

- Gerar imagem com Sharp.
- Publicar no Telegram.
- Implementar idempotência e reenvio.
