---
name: create-procedure-endpoint
description: Cria, valida e documenta um endpoint REST NestJS completo para expor uma stored procedure existente no srvapi01, com questionário prévio persistido, DTO, query parametrizada, tipos mysql2, service, controller, teste HTTP direcionado e exemplos reais de request e response. Use quando o usuário pedir para disponibilizar, expor, integrar ou consumir uma procedure nova ou existente por um endpoint deste repositório.
---

# Criar endpoint para stored procedure

## Objetivo

Entregar uma integração completa `procedure -> DTO -> query -> types -> service -> controller -> teste HTTP -> documentação`, preservando os contratos e as convenções do módulo de destino.

Trabalhar com uma procedure por questionário. Para várias procedures, repetir o fluxo e manter os contratos separados.

## Regras obrigatórias

- Responder e escrever artefatos em português do Brasil, preservando identificadores técnicos.
- Tratar a definição SQL, o exemplo de chamada e o código atual do módulo como fontes de evidência; não inventar parâmetros, tipos, result sets, mensagens nem rotas.
- Usar SQL parametrizado com placeholders `?` e `queryParams`; nunca interpolar valores do DTO na string SQL, mesmo que uma referência antiga faça isso.
- Incluir `pe_system_client_id` e `pe_store_id` em toda chamada multi-tenant, na posição exata da assinatura.
- Não alterar nem implantar a procedure, o schema, dados, outros módulos, dependências, Git ou infraestrutura sem autorização explícita.
- Preservar mudanças locais alheias à tarefa.
- Não declarar o endpoint funcional sem uma resposta HTTP bem-sucedida obtida contra o build deste checkout.

## Fase 1: coletar e persistir respostas

Não alterar `src/`, banco ou documentação do endpoint nesta fase.

1. Confirmar a raiz física do repositório, branch, status e diffs existentes. Ler todos os `AGENTS.md` aplicáveis.
2. Obter o nome da procedure. Se o pedido não informar nem o nome nem um caminho SQL do qual ele possa ser extraído com segurança, pedir somente esse dado no chat e aguardar.
3. Criar o questionário com o script incluído. Preencher nos argumentos tudo o que o usuário já informou e deixar o restante como `[PENDENTE]`:

```bash
python3 .agents/skills/create-procedure-endpoint/scripts/create_questionnaire.py \
  sp_example_find_v2 \
  --procedure-file database-objects/stored-procedures/example/sp_example_find_v2.sql \
  --call-example-file database-objects/stored-procedures/example/query_call.sql \
  --module example \
  --dto-reference src/example/dto/example-find-id-v2.dto.ts
```

Adicionar, quando já conhecidos, `--endpoint-reference`, `--endpoint-slug`, `--deployed-in-development`, `--runtime-test-authorization` e até duas ocorrências de `--extra-question`.
Usar as perguntas extras para ambiguidades materiais, como nomes semânticos dos result sets, criação de um módulo ausente ou colisão de rota.

4. Verificar diretamente que o arquivo foi criado em `docs/questions/YYYY/MM/YYYY-MM-DD-HHmm-<nome-procedure>.md`. Nunca sobrescrever: o script acrescenta `-02`, `-03` e assim por diante.
5. Informar o caminho e parar para aguardar as respostas quando houver qualquer pendência material.
6. Quando o usuário responder, registrar as respostas no mesmo arquivo, adicionar eventuais perguntas derivadas até o limite total de 10 e marcar o questionário como respondido. Não criar outro questionário para a mesma execução.
7. Prosseguir somente após confirmar, no mínimo:
   - arquivo com a definição SQL completa;
   - arquivo com uma chamada de exemplo e valores seguros para desenvolvimento;
   - módulo de destino;
   - DTO de referência;
   - rota pretendida ou autorização para inferi-la;
   - referência aprovada das demais camadas ou autorização para escolher a mais próxima;
   - disponibilidade da procedure no banco de desenvolvimento;
   - segurança e autorização da execução HTTP, especialmente para procedures mutáveis.

Se as respostas divergirem dos arquivos, registrar a divergência no questionário, explicar o impacto e aguardar decisão antes de implementar.

## Fase 2: reconstruir o contrato

Ler integralmente [references/implementation-checklist.md](references/implementation-checklist.md) antes de alterar código.

1. Ler a procedure, o arquivo de chamada, o DTO de referência e as camadas equivalentes do módulo: controller, service, query, types, module e documentação.
2. Confirmar nome, ordem, tipo e nulabilidade dos parâmetros; quantidade e ordem dos result sets; aliases e tipos das colunas; feedback `sp_return_id`, `sp_message`, `sp_error_id`; e metadado operacional retornado pelo `mysql2`.
3. Comparar a procedure em arquivo com a versão do banco de desenvolvimento quando a validação runtime depender dela. Para qualquer acesso ao banco, ler e seguir integralmente `.agents/skills/access-development-database/SKILL.md`.
4. Não implantar uma versão ausente ou divergente. Parar e solicitar autorização específica para qualquer deploy ou alteração de banco.
5. Escolher o helper de `src/core/process-result/` de acordo com o contrato real, não apenas pelo nome da operação.

## Fase 3: implementar

Implementar somente as camadas necessárias ao endpoint:

1. Criar ou atualizar o DTO com `@ApiProperty`, `class-validator`, tipos fiéis e o bloco `Sample JSON for testing in body endpoint:` com JSON válido, seguro e sem segredos.
2. Criar a função que monta a chamada da procedure seguindo sempre o padrão estrutural da referência canônica `src/customer/query/costumer-create-manager.query.ts`: função pura que primeiro declara variáveis locais na ordem da assinatura (`const OlUuid = UuidV4();`, `const olAppId = ...`, `const olSystemClientId = ...`, ...), depois monta o `queryString` com `call sp_<nome>(?, ?, ...)` e retorna `{ queryString, queryParams }`. Tipar a tupla de parâmetros e manter exatamente a ordem da assinatura da procedure. Usar placeholders `?` e `queryParams` — nunca interpolar valores do DTO na string SQL nem copiar consultas legadas interpoladas como `src/customer/query/costumer-create.query.ts`.
3. Criar interfaces `RowDataPacket` para cada result set e a tupla completa do retorno. Modelar `null`, datas e `DECIMAL` conforme o comportamento real do `mysql2` e do projeto.
4. Adicionar o método do service com `DatabaseService.selectExecute(queryString, queryParams)`, cast por `unknown`, helper de resultado adequado, `ResultModel` e `try/catch` no padrão local.
5. Adicionar somente o `@Post('v2/<slug>')` necessário, protegido por `@UseGuards(AuthGuard)`, recebendo o DTO em `@Body()` e delegando ao service.
6. Confirmar o registro do módulo em `src/app.main/app.module.ts`. Alterá-lo apenas se o módulo estiver ausente.
7. Manter nomes, imports, ordem e estilo do módulo. Não copiar falhas de segurança ou contratos obsoletos de referências antigas.

## Fase 4: validar e testar somente o novo endpoint

1. Formatar e verificar os arquivos TypeScript alterados de forma direcionada.
2. Executar `pnpm run build`, `pnpm run format:check`, `pnpm run lint:check` e `git diff --check`. Distinguir falhas preexistentes das introduzidas pela tarefa.
3. Confirmar que a porta usada pertence a este checkout e que o processo executa o build atual. Não validar contra `dist` antigo, outro worktree ou outro processo PM2.
4. Executar via `curl` somente a nova rota. Não usar uma execução que percorra todos os `@Post` do controller, pois isso pode disparar endpoints mutáveis alheios.
5. Obter a API key do `.env` sem imprimi-la e mascará-la em comandos, relatórios e respostas.
6. Para procedure somente de leitura, usar os valores seguros confirmados no questionário. Para criação, atualização, exclusão ou qualquer efeito colateral, executar apenas com autorização explícita registrada e com dados/estratégia de limpeza definidos.
7. Exigir HTTP 2xx e conferir o envelope, `recordId`, `quantity`, `errorId`, nomes dos result sets e campos retornados. Se não houver prova HTTP, informar objetivamente o bloqueio e não chamar o endpoint de funcional.

## Fase 5: documentar

Criar `API-documentation/<modulo>/<endpoint-slug>.md` somente para a nova rota. Usar a estrutura documental descrita no checklist e incluir:

- método, path, autenticação e content type;
- tabela completa do body;
- exemplo de request usado no teste;
- estrutura do envelope e dos result sets;
- exemplo de response HTTP real, anonimizado quando contiver dados pessoais;
- exemplos coerentes de `400`, `401` e erro de negócio;
- nota explícita quando algum exemplo for apenas derivado do DTO ou do contrato por falta de evidência runtime.

Preservar documentos e relatórios existentes. Verificar `docs/`, `.agents/` e `API-documentation/` diretamente no filesystem, pois podem estar ignorados pelo Git.

## Entrega

Revisar o diff e informar:

- arquivos criados e alterados;
- contrato implementado e rota final;
- verificações executadas e seus resultados;
- status HTTP observado;
- caminho do questionário e da documentação;
- artefatos ignorados pelo Git;
- qualquer limitação restante.

Não fazer commit, push, release ou deploy sem solicitação explícita.
