# ADR-0006 — Autenticação própria

## Status

Aceito

## Contexto

O projeto terá backend próprio, poucos usuários e necessidade de aprendizado e controle do fluxo.

## Opções consideradas

- Firebase Auth.
- Supabase Auth.
- Keycloak.
- Autenticação própria.

## Decisão

Implementar autenticação própria com senha segura, access token, refresh token e autorização.

## Consequências

- Não haverá dependência de provedor externo.
- A equipe será responsável por segurança, recuperação de senha e rotação de tokens.
- No MVP haverá apenas o papel ADMIN.
