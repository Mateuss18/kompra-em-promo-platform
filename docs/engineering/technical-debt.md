# Dívida Técnica

Este documento registra atalhos conscientes e limitações aceitas temporariamente.

| Item | Motivo | Risco | Momento de correção |
|---|---|---|---|
| Mocks no frontend | Validar UX e fluxo | Diferenças em relação à API real | Integração com backend |
| Persistência em `localStorage` | Evitar banco no primeiro marco | Dados locais e frágeis | CRUD no PostgreSQL |
| Publicação simulada | Validar estados sem Telegram | Não testa integração real | Milestone de publicação |
| Imagem simples | Entregar valor rapidamente | Qualidade visual limitada | Editor visual pós-MVP |
| Apenas papel `ADMIN` | Equipe inicial pequena | Falta de segregação | Antes de delegar acesso |
| WhatsApp manual | Evitar complexidade inicial | Processo parcialmente manual | Avaliação pós-MVP |
| Parsers dependentes de páginas externas | APIs podem não estar disponíveis | Quebra por alteração de HTML | Monitoramento e fallback |
| Ausência inicial de fila | Menos infraestrutura | Operações podem bloquear | Antes da ingestão real |
| Cobertura de testes gradual | Priorizar fluxo principal | Regressões em áreas periféricas | A cada milestone |

## Regra

Toda nova dívida técnica deve registrar:

- Contexto.
- Impacto.
- Risco.
- Responsável.
- Condição ou prazo de correção.
