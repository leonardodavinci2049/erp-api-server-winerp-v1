# AGENTS.md - src/brand

Este diretório contém a lógica de negócio para o gerenciamento de Marcas (Brands).

## Visão Geral do Módulo

O módulo `Brand` segue o padrão de arquitetura v2 do projeto, com SQL direto e Stored Procedures. As cinco rotas `marca-*` portadas de `UsvmMarca.pas` usam SQL direto parametrizado; consulte `README.md` neste diretório para contratos e diferenças do legado.

## Estrutura de Arquivos

- `dto/`: Definições de entrada com validação (`class-validator`).
- `query/`: Funções puras que retornam `{ queryString, queryParams }` com placeholders `?` (ex: `call sp_brand_find_all_v2(?, ?, ...)`). Nunca interpole valores do DTO na string SQL.
- `types/`: Interfaces que estendem `RowDataPacket` para tipagem dos retornos do MySQL.
- `brand.service.ts`: Orquestração, chamada ao `DbOperationService` (módulo `db-operation`) e tratamento de erros.
- `brand.controller.ts`: Endpoints versionados (v2) e protegidos por `AuthGuard`.

## Stored Procedures Relacionadas

- `sp_brand_find_all_v2`: Lista marcas por cliente/loja.
- `sp_brand_find_id_v2`: Busca uma marca específica.
- `sp_brand_create_v2`: Cria nova marca.
- `sp_brand_update_v2`: Atualiza marca existente.
- `sp_brand_delete_v2`: Remove (ou inativa) uma marca.

## Convenções Locais

1. **Multi-tenancy:** Preserve o contexto e os filtros das operações existentes. Nas cinco rotas `marca-*`, o tenant é `PE_ID_SYSTEM` (`ID_SYSTEM_CLIENTE`); `PE_ID_LOJA` é obrigatório no DTO, mas não participa do SQL, como no legado. Não renomeie os campos legados para `BaseRequestDto`.
2. **Nomenclatura de Métodos:**
   - No Service: `taskBrand[Ação]V2`.
   - No Controller: `brand[Ação]V2`.
3. **Retornos:** Utilize as funções auxiliares de `src/core/process-result/`: `processSqlResultQuery` e `processSqlResultMutation` para SQL direto e o processor de procedure nas operações correspondentes. Preserve os aliases de saída e o envelope `ResultModel`.

## Exemplo de Fluxo (v2)

Para adicionar uma nova funcionalidade:

1. Crie o DTO em `dto/`.
2. Crie a função de query em `query/`.
3. Adicione o método no `brand.service.ts` tratando o `ResultModel`.
4. Exponha o endpoint no `brand.controller.ts` com `@Post('v2/...')`.
