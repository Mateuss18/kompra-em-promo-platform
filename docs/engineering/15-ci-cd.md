# CI/CD

## Integração contínua

Em cada pull request:

1. Instalar dependências com lockfile.
2. Executar lint.
3. Executar typecheck.
4. Executar testes.
5. Executar build.
6. Bloquear merge em caso de falha.

## Deploy do frontend

Destino inicial previsto: Vercel.

- Preview por pull request.
- Produção a partir da branch principal.
- Variáveis de ambiente separadas por ambiente.

## Deploy do backend

Destino inicial previsto: Railway.

- API.
- PostgreSQL.
- Redis quando necessário.
- Worker separado da API quando o processamento assíncrono for ativado.

## Migrações

- Migrações Prisma versionadas.
- Não editar migrations já aplicadas.
- Executar backup antes de alterações destrutivas.
- Migração de produção executada como etapa controlada.

## Segredos

- Armazenados no provedor.
- Nunca incluídos no repositório.
- Tokens do Telegram devem permitir rotação.
