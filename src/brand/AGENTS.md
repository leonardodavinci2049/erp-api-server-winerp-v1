# AGENTS.md - src/brand

Este diretório contém a lógica de negócio para o gerenciamento de Marcas (Brands).

## Visão Geral do Módulo

O módulo `Brand` segue o padrão de arquitetura v2 do projeto, utilizando Stored Procedures para todas as operações de banco de dados.

## Estrutura de Arquivos

- `dto/`: Definições de entrada com validação (`class-validator`).
- `query/`: Funções puras que retornam `{ queryString, queryParams }` com placeholders `?` (ex: `call sp_brand_find_all_v2(?, ?, ...)`). Nunca interpole valores do DTO na string SQL.
- `types/`: Interfaces que estendem `RowDataPacket` para tipagem dos retornos do MySQL.
- `brand.service.ts`: Orquestração, chamada ao `DatabaseService` e tratamento de erros.
- `brand.controller.ts`: Endpoints versionados (v2) e protegidos por `AuthGuard`.

## Stored Procedures Relacionadas

- `sp_brand_find_all_v2`: Lista marcas por cliente/loja.
- `sp_brand_find_id_v2`: Busca uma marca específica.
- `sp_brand_create_v2`: Cria nova marca.
- `sp_brand_update_v2`: Atualiza marca existente.
- `sp_brand_delete_v2`: Remove (ou inativa) uma marca.

## Convenções Locais

1. **Multi-tenancy:** Toda query DEVE incluir `pe_system_client_id` e `pe_store_id`.
2. **Nomenclatura de Métodos:**
   - No Service: `taskBrand[Ação]V2`.
   - No Controller: `brand[Ação]V2`.
3. **Retornos:** Utilize sempre as funções auxiliares de `src/core/process-result/` para processar os resultados das SPs.

## Exemplo de Fluxo (v2)

Para adicionar uma nova funcionalidade:

1. Crie o DTO em `dto/`.
2. Crie a função de query em `query/`.
3. Adicione o método no `brand.service.ts` tratando o `ResultModel`.
4. Exponha o endpoint no `brand.controller.ts` com `@Post('v2/...')`.
