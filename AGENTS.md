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
