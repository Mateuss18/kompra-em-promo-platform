# Instruções de Projeto — Kompra Em Promo Platform

## Contexto

Este repositório contém uma plataforma interna para gerenciar promoções de afiliados da Shopee, Amazon e Mercado Livre.

## Regras principais

- Usar TypeScript.
- Evitar `any`.
- Manter componentes Vue em `PascalCase`.
- Manter stores Pinia com sufixo `Store`.
- Manter serviços com sufixo `Service`.
- Separar páginas, componentes, stores, serviços, tipos e mocks.
- Não acessar mocks diretamente nas páginas.
- Não acoplar componentes à implementação futura da API.
- Não colocar comentarios no codigo.
- Valores monetários devem ser tratados em centavos na camada de domínio.
- Datas devem usar ISO 8601 na persistência e comunicação.
- O MVP frontend deve funcionar sem backend.
- O login do frontend será simulado.
- A autenticação real será própria, implementada no backend.
- No MVP existe apenas o papel `ADMIN`.
- `EDITOR` e `VIEWER` são evoluções futuras.
- O editor visual estilo Canva não faz parte do MVP inicial.

## Fluxo principal

1. Receber o link pelo Telegram privado ou pelo painel web.
2. Detectar a loja.
3. Obter dados do produto.
4. Normalizar ou gerar o link de afiliado.
5. Gerar mensagem e imagem simples.
6. Criar rascunho.
7. Aguardar aprovação do administrador.
8. Publicar no Telegram.
9. Permitir cópia manual para o WhatsApp.

## Commits

- Os commits devem ser feitos apenas se o usuario pedir
- Eles devem seguir o formato de conventional commits
- Sempre em ingles assim como a codebase
- Format: <type>(<scope>): <subject>

feat: add hat wobble
^--^ ^------------^
| |
| +-> Summary in present tense.
|
+-------> Type: chore, docs, feat, fix, refactor, style, or test.

feat: (new feature for the user, not a new feature for build script)
fix: (bug fix for the user, not a fix to a build script)
docs: (changes to the documentation)
style: (formatting, missing semi colons, etc; no production code change)
refactor: (refactoring production code, eg. renaming a variable)
test: (adding missing tests, refactoring tests; no production code change)
chore: (updating grunt tasks etc; no production code change)

## Criação de branch e merge

- branch deve ser criada com base em um escopo, se o escopo for enorme ou tiver varios escopos totalmente nao relacionados falar ao usuario e ponderar para criação de varias branchs
- nome da branch seguir o padrão feature/nome-implementacao (em ingles)
- pode ser: feature, fix ou hotfix
- Na abertura do merge request colocar na descrição um breve resumo do que ele cobre (aqui em portugues)
- No Windows, se `gh` não estiver no `PATH`, usar `C:\Program Files\GitHub CLI\gh.exe`
- Se `gh auth status` falhar dentro do sandbox, validar novamente fora dele antes de solicitar `gh auth login`; pedir nova autenticação apenas se a verificação externa também falhar
