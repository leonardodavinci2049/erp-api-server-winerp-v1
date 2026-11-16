# Checklist de implementação e evidência

Usar este arquivo depois que o questionário estiver respondido e antes de editar o código.

## 1. Hierarquia das fontes

Aplicar esta ordem, registrando qualquer divergência material:

1. definição SQL completa fornecida para a tarefa;
2. procedure efetivamente instalada no banco de desenvolvimento, quando houver validação runtime autorizada;
3. schema físico das tabelas e expressões retornadas;
4. exemplo de chamada fornecido;
5. endpoint equivalente aprovado no módulo atual;
6. convenções gerais do repositório e prompts históricos.

O exemplo de chamada prova valores e ordem pretendidos, mas não corrige automaticamente uma assinatura SQL divergente. Uma referência antiga prova estilo local, mas não autoriza interpolação SQL, tipos imprecisos ou rotas incompatíveis.

## 2. Contrato da procedure

Conferir e anotar antes da implementação:

- nome exato da procedure;
- natureza de leitura ou mutação e efeitos colaterais;
- parâmetros na ordem da assinatura, incluindo tipo, nulabilidade e valor padrão efetivo;
- presença e posição de `PE_SYSTEM_CLIENT_ID` e `PE_STORE_ID`;
- cada `SELECT` que forma um result set de dados, inclusive fluxos condicionais;
- aliases exatos das colunas e possibilidade de `NULL` causada por schema, expressão ou `LEFT JOIN`;
- representação de `DATE`, `DATETIME`, `BIGINT`, `DECIMAL`, `BIT` e outros tipos pelo `mysql2` configurado;
- feedback `sp_return_id`, `sp_message`, `sp_error_id`;
- `ResultSetHeader`/metadado operacional final devolvido por `CALL`.

Usar `information_schema`, `SHOW CREATE PROCEDURE` e `SHOW CREATE TABLE` somente pelo fluxo da skill `access-development-database`. Não executar DDL nem substituir a procedure para completar esta tarefa.

## 3. Seleção do padrão local

Ler no módulo de destino:

- `AGENTS.md`, se existir;
- DTO mais próximo;
- query parametrizada mais próxima;
- interfaces e tuplas em `types/`;
- método equivalente do service;
- método equivalente do controller;
- arquivo do module;
- registro em `src/app.main/app.module.ts`;
- documentação equivalente em `API-documentation/<modulo>/`.

Preferir um endpoint com a mesma classe de operação e a mesma quantidade de result sets. Se o DTO indicado for útil apenas para campos de contexto, usar outra referência aprovada para query/service/types.

## 4. DTO

- Estender `EndpointContextDto` quando os oito campos de contexto fizerem parte da assinatura.
- Não redeclarar campos herdados.
- Representar os demais parâmetros com tipos TypeScript e validações coerentes.
- Usar `@IsOptional()` somente quando a procedure aceitar ausência de valor e a transformação definida for clara.
- Incluir descrições e exemplos do Swagger sem dados pessoais reais.
- Encerrar com um único JSON válido após `Sample JSON for testing in body endpoint:`.
- Manter o JSON compatível com `ValidationPipe` e com a chamada de teste autorizada.

## 5. Query

Sempre criar uma função pura que monta a chamada da procedure no padrão estrutural da referência canônica `src/customer/query/costumer-create-manager.query.ts`, em três blocos na ordem abaixo — nunca interpolar valores do DTO na string SQL nem copiar consultas legadas interpoladas como `src/customer/query/costumer-create.query.ts`:

1. declaração de variáveis locais na ordem da assinatura da procedure, iniciando por `const OlUuid = UuidV4();` e seguindo o prefixo `ol` (`olAppId`, `olSystemClientId`, `olStoreId`, ...), com `?? null` apenas nos campos opcionais;
2. montagem do `queryString` com `call sp_<nome>(?, ?, ...)` usando um `?` por parâmetro;
3. montagem e retorno de `{ queryString, queryParams }` com a tupla tipada.

```ts
interface ExampleQueryResult {
  queryString: string;
  queryParams: [string, number, number, number, string, string, string, string, number | null, string | null];
}

export function ExampleQuery(data: ExampleDto): ExampleQueryResult {
  const OlUuid = UuidV4();
  const olAppId = data.pe_app_id;
  const olSystemClientId = data.pe_system_client_id;
  const olStoreId = data.pe_store_id;
  const olFilter = data.pe_filter ?? null;

  const queryString = `call sp_example_v2(
        ?,
        ?,
        ?,
        ?,
        ?
      )`;

  const queryParams: ExampleQueryResult['queryParams'] = [
    OlUuid,
    olAppId,
    olSystemClientId,
    olStoreId,
    olFilter,
  ];

  return { queryString, queryParams };
}
```

Garantir que a quantidade de `?` seja igual ao tamanho da tupla e que ambos sigam a assinatura SQL. Não aplicar fallback silencioso que altere o contrato, exceto quando o padrão aprovado e a procedure definirem a mesma semântica.

## 6. Tipos e processamento

- Fazer cada linha de dados estender `RowDataPacket`.
- Criar uma interface por result set semanticamente distinto.
- Declarar `SpDefaultFeedback` e `SpOperationResult` por importação ou pelo padrão vigente no módulo, sem duplicação desnecessária.
- Declarar a tupla na ordem real: result sets de dados, feedback e metadado operacional.
- Usar `processProcedureResultMutation` para contratos de feedback de mutação.
- Usar `processProcedureResultQuery`/`processProcedureResultQueryWithoutId` para um result set quando o padrão do módulo for compatível.
- Usar `processProcedureResultMultiQuery` para múltiplos result sets, fornecendo um nome estável por result set e na mesma ordem.
- Verificar o comportamento do helper quando a procedure retorna feedback antecipado sem os result sets de dados.

## 7. Service, controller e módulo

- No service, desestruturar `{ queryString, queryParams }` e chamar `selectExecute(queryString, queryParams)`.
- Usar cast `as unknown as <TipoDaTupla>` para o retorno da procedure conforme a convenção do repositório.
- Preservar `try/catch`, mensagens e `ResultModel` no padrão local.
- No controller, usar `@UseGuards(AuthGuard)` e `@Post('v2/<endpoint-slug>')`.
- Não alterar endpoints vizinhos.
- Registrar o módulo no `imports` de `src/app.main/app.module.ts` somente quando ainda não estiver registrado.

## 8. Verificação estática

Executar, nesta ordem prática:

1. `pnpm exec biome format --write <arquivos-ts-alterados>`;
2. `pnpm exec biome lint --write <arquivos-ts-alterados>`;
3. `pnpm run build`;
4. `pnpm run format:check`;
5. `pnpm run lint:check`;
6. `git diff --check`;
7. inspeção direta de todos os arquivos ignorados criados ou alterados.

Não executar correções globais sobre uma árvore com alterações alheias sem avaliar o impacto. O projeto não possui uma suíte automatizada implementada; não declarar testes unitários ou de integração como executados.

## 9. Teste HTTP direcionado

- Confirmar `APP_PORT` sem expor o `.env`.
- Identificar o processo da porta e seu diretório de trabalho antes de reutilizá-lo.
- Subir o build atual deste checkout quando necessário e aguardar o log de prontidão.
- Enviar somente a requisição da nova rota com `Authorization: Bearer <API_KEY>` ou `x-api-key`.
- Manter a API key fora do histórico exibido, logs e Markdown.
- Registrar request, status e response necessários para a documentação.
- Não executar uma mutation sem autorização explícita e dados descartáveis/limpeza definidos no questionário.

## 10. Documento do endpoint

Criar `API-documentation/<modulo>/<endpoint-slug>.md` nesta ordem:

1. `# Endpoint API Reference - <título>`;
2. `### Descrição`;
3. `## Informações do Endpoint`;
4. `## Url Base`;
5. `## Autenticação`;
6. `## Estrutura da Requisição (Body)`;
7. `### Exemplo de Requisição`;
8. `## Estrutura da Resposta`;
9. `### Exemplo de Sucesso (<status real>)`;
10. `## Respostas de Erro`.

Documentar `POST`, path sem host, autenticação obrigatória, `application/json`, campos/validações do DTO e envelope real. Incluir erros `400`, `401` e erro de negócio coerente. Se informar rate limit, ler o valor atual em `src/app.main/app.module.ts`; não copiar números possivelmente obsoletos de documentos antigos.

Usar o request realmente testado. Usar a response real como base, substituindo nomes, documentos, telefones, e-mails, endereços, tokens e outros dados identificáveis por valores fictícios coerentes. Não alterar nomes de campos, tipos, nulabilidade, estrutura, quantidades ou códigos durante a anonimização.

Quando o runtime não puder ser validado, identificar claramente exemplos derivados do DTO/SQL e não apresentar o endpoint como funcionalmente comprovado.
