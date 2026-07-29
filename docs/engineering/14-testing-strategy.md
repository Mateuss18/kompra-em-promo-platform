# Estratégia de Testes

## Objetivos

- Proteger regras de estado.
- Reduzir regressões no fluxo de promoção.
- Validar parsers e links de afiliado.
- Garantir que a publicação não seja duplicada.

## Frontend

### Testes unitários

- Formatação monetária.
- Filtros e ordenação.
- Validação de formulários.
- Mapeamento de status.

### Testes de stores

- Carregamento.
- Edição.
- Persistência local.
- Aprovação.
- Rejeição.
- Publicação simulada.

### Testes de componentes

- Tabela de promoções.
- Formulário.
- Estados de loading, vazio e erro.
- Diálogos de confirmação.

### End-to-end

- Login simulado.
- Abrir lista.
- Editar rascunho.
- Aprovar.
- Publicar de forma simulada.

## Backend

- Autenticação.
- Refresh token.
- Transições de status.
- Idempotência.
- CRUD.
- Validação de URL.
- Parsers por loja.
- Publicação no Telegram.

## Integrações

Usar fixtures versionadas e mocks para evitar dependência contínua das páginas reais em testes comuns.

Testes contra serviços externos devem ser separados e executados de forma controlada.

## Prioridade

A cobertura deve priorizar regras críticas, não um percentual arbitrário.
