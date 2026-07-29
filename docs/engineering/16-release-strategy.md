# Estratégia de Releases

## Versionamento

Usar Semantic Versioning enquanto fizer sentido:

```text
MAJOR.MINOR.PATCH
```

Durante a fase inicial:

- `0.1.0`: fundação do frontend.
- `0.2.0`: fluxo frontend completo com mocks.
- `0.3.0`: backend e autenticação.
- `0.4.0`: ingestão e parsers.
- `0.5.0`: geração e aprovação.
- `0.6.0`: publicação real no Telegram.
- `1.0.0`: MVP completo estável.

## Critérios de release

Uma versão deve:

- Passar lint, typecheck, testes e build.
- Possuir migrações revisadas, quando aplicável.
- Ter variáveis de ambiente documentadas.
- Atualizar documentação relevante.
- Incluir notas de release.

## Hotfix

Correções urgentes devem sair de uma branch dedicada e ser incorporadas novamente ao fluxo principal.
