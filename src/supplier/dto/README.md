# Testes dos DTOs de fornecedor

Todos os campos dos cinco DTOs são obrigatórios e rejeitam `null`, incluindo o contexto herdado de `BaseRequestDto`. Textos vazios continuam aceitos, exceto `PE_NOME` na criação, que exige pelo menos cinco caracteres. Os consumidores devem enviar todos os campos; nas consultas, os filtros continuam seguindo as regras existentes para `0` e `""`.

A suíte verifica cada campo individualmente quando omitido ou enviado como `null`, além de validar requisições completas.

Execute os comandos a partir da raiz do projeto.

Para executar o teste de validação das requisições de fornecedor:

```bash
pnpm exec vitest run src/supplier/dto/supplier-request.spec.ts
```

Para executar todos os testes da pasta `dto`:

```bash
pnpm exec vitest run src/supplier/dto
```
