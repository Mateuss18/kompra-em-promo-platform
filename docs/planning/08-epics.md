# Épicos

## EPIC-01 — Fundação do frontend ✅

Configurar Vue, TypeScript, Tailwind, Router, Pinia, padrões e layout base.

## EPIC-02 — Autenticação simulada ✅

Permitir acesso ao frontend com login fake e rota protegida, sem backend.

## EPIC-03 — Dashboard ✅

Apresentar resumo de rascunhos, aprovadas, publicadas e erros.

## EPIC-04 — Gestão de promoções ✅

Listar, buscar, filtrar, visualizar e editar promoções.

## EPIC-05 — Conteúdo da promoção ✅

Editar dados do produto, cupom, mensagem e preview da imagem.

## EPIC-06 — Aprovação e publicação simulada ✅

Alterar estados da promoção e validar o fluxo antes da API real.

## EPIC-07 — Backend e autenticação real ✅

Criar API, banco, autenticação própria e autorização para `ADMIN`.

## EPIC-08 — Ingestão de links ✅

Receber links pelo painel e pelo grupo privado do Telegram, com confirmação ou erro pelo bot.

## EPIC-09 — Integração com lojas

Isolar parsers por loja, normalizar links de afiliado e validar URLs recebidas antes de criar o rascunho. A identificação de loja já está implementada; este épico foca na camada de parser, no tratamento de links afiliados e na validação de domínios suportados.

- Manter a interface `StoreParser` para cada loja (Shopee, Amazon, Mercado Livre).
- Receber links já afiliados e preservar a URL original quando o identificador de afiliado estiver presente.
- Rejeitar links de lojas não suportadas com erro claro para o usuário.
- Validar e normalizar a estrutura do link antes de salvar o rascunho.

### EPIC-09A — Coleta automática de produtos do Mercado Livre

Coletar título, imagem, preço atual e preço original diretamente da página pública do produto, sem login e sem OAuth. A pesquisa confirmou que esses dados estão no HTML inicial e que a geração do link afiliado é uma operação separada.

- Não criar rascunhos com placeholders quando a coleta falhar.
- Começar com uma prova de `fetch` e usar navegador headless apenas se necessário.
- Manter geração de link afiliado fora deste subépico.
- Implementar coleta somente para Mercado Livre antes de generalizar a solução.

Especificação completa: [`11-epic-09a-mercado-livre-product-collection.md`](11-epic-09a-mercado-livre-product-collection.md).

## EPIC-10 — Geração de imagem

Gerar a arte simples do MVP: foto do produto com a logo/slogan do grupo no canto superior esquerdo, em quadrado 1080x1080.

- Armazenar a URL da imagem do produto (`productImageUrl`) e da imagem gerada (`generatedImageUrl`) na promoção.
- Gerar a imagem apenas quando o administrador clicar em "Gerar imagem" no preview.
- Usar Sharp no backend renderizando SVG para PNG.
- Salvar o arquivo gerado em `apps/api/public/generated-images/` durante o desenvolvimento.
- No frontend, o preview deve exibir a imagem gerada quando disponível e oferecer fallback com Canvas quando o MVP estiver rodando sem backend.
- A logo/slogan do MVP é um placeholder simples; o identificador visual real será substituído depois.

## EPIC-11 — Publicação no Telegram

Publicar promoções aprovadas no canal oficial e registrar o resultado.

## EPIC-12 — Histórico e auditoria

Registrar mudanças de status, edições, aprovações e publicações.

## EPIC-13 — Editor visual pós-MVP

Criar templates visuais avançados (formatos Instagram/Reels, múltiplas camadas, posicionamento livre) usando Konva.js no frontend e Sharp no backend. Este épico é pós-MVP e não deve ser misturado com a arte simples do EPIC-10.
