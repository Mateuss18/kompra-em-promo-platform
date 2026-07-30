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

- Criar bot grammY.
- Receber links no grupo privado.
- Criar interface `StoreParser`.
- Implementar parsers por loja.
- Implementar normalização de links de afiliado.
- Gerar imagem com Sharp.
- Publicar no Telegram.
- Implementar idempotência e reenvio.
