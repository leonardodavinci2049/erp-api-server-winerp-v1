# Consultas de marcas portadas do Delphi

Origem: `C:/PROJECTS/project_webservice/m2-Models/UsvmMarca.pas`.
As rotas abaixo usam SQL direto parametrizado, DTO próprio, query builder,
tipos em `types/brand.type.ts` e métodos próprios de serviço/controller.
As rotas anteriores de `brand` continuam disponíveis.

Todas as requisições são `POST /api/brand/v2/<rota>` com JSON e header
`Authorization: Bearer <API_KEY>` ou `x-api-key`. A porta vem de `APP_PORT`.

| Método Delphi      | Rota                | Campos específicos obrigatórios                                          |
| ------------------ | ------------------- | ------------------------------------------------------------------------ |
| `UpdateMarca`      | `marca-find-all`    | `PE_ID_MARCA`, `PE_MARCA`                                                |
| `MarcaAddComboBox` | `marca-AddComboBox` | `PE_ID_MARCA` (recebido, mas não utilizado)                              |
| `updateMarcaV1`    | `marca-create`      | `PE_NOME`, `PE_PASTA_IMG`, `PE_ANOTACOES`                                |
| `acceptMarcaV1`    | `marca-update`      | `PE_ID_MARCA`, `PE_NOME`, `PE_PATH_IMAGEM`, `PE_INATIVO`, `PE_ANOTACOES` |
| `cancelMarcaV1`    | `marca-delete`      | `PE_ID_MARCA`                                                            |

O contexto obrigatório mantém `PE_ID_SYSTEM`, `PE_ID_LOJA`, `PE_ID_DEPARTAMENTO` e
`PE_ID_USUARIO` como campos do corpo, herdados de `BaseRequestDto`. A autenticação
é feita apenas pelo header `Authorization`/`x-api-key`; `PE_PASSKEY` não faz parte
do corpo e é rejeitada como campo desconhecido. Os parâmetros posicionais do
Delphi são propriedades do corpo JSON no NestJS; os métodos que recebem
`opJSONObject` recebem seu conteúdo diretamente no corpo, sem um wrapper com
esse nome.

Exemplo de listagem:

```json
{
  "PE_ID_SYSTEM": 1,
  "PE_ID_LOJA": 1,
  "PE_ID_DEPARTAMENTO": 0,
  "PE_ID_USUARIO": "1",
  "PE_ID_MARCA": 0,
  "PE_MARCA": "%marca%"
}
```

## Regras preservadas

- Todas as operações usam `PE_ID_SYSTEM` como `ID_SYSTEM_CLIENTE`. Loja,
  departamento e usuário são recebidos, mas não entram no SQL do legado.
  Não foi adicionado filtro de loja nem gravação de `ID_LOJA`.
- Listagem e combo retornam apenas `INATIVO = 0`, ordenados por `NOME`.
  A listagem filtra o ID somente quando positivo e o nome somente quando
  não vazio. O padrão `LIKE` é enviado pelo consumidor, sem adicionar `%`.
- Os textos JSON removem ocorrências de `null`, sem diferenciar maiúsculas,
  como o `StringReplace` do Delphi. Campos textuais SQL nulos nas leituras
  retornam texto vazio.
- A criação grava `INATIVO = 0` e `DATADOCADASTRO = CURRENT_TIMESTAMP`.
  A atualização sobrescreve nome, imagem, anotações e inativo.
- A exclusão é física, limitada ao tenant e ao ID informado.

## Respostas e diferenças de transporte

O envelope segue `supplier`: `ResultModel`, sem reproduzir o envelope
DataSnap (`arrayTable`, `psCodeErro`, `psFeedback`, `psQtRegistros`, `psTempo`).
A adaptação do envelope deve ocorrer na conexão do WINERP.

`data["Marca FindAll"]` contém exatamente os campos:
`PS_REGISTROS_COUNT`, `PS_ID_MARCA`, `PS_ID_PESSOA`, `PS_ID_IMAGEM`,
`PS_NOME`, `PS_MARCA`, `PS_PATH_IMAGEM`, `PS_INATIVO`,
`PS_DATADOCADASTRO`, `PS_ANOTACOES`.
`PS_ID_PESSOA` repete o ID da marca; contagem e ID da imagem são zero;
anotações são vazias, como no Delphi.

`data["Marca AddComboBox"]` contém `ID_MARCA`, `ID_PESSOA`, `NOME`,
`ID_IMAGEM`, `PATH_IMAGEM`, `PATH_IMAGEM01`, `PATH_IMAGEM02`.
Pessoa e imagem são zero; os dois caminhos adicionais são vazios.
Os aliases SQL fixam a capitalização independentemente do schema.

Nas mutações, `recordId` corresponde ao `psIDCadastro`: `insertId` na
criação e `PE_ID_MARCA` na atualização/exclusão. Nenhuma linha afetada
produz `errorId = 206`. A criação deixa o `AUTO_INCREMENT` gerar o ID,
em vez de consultar antecipadamente `information_schema.TABLES`, como
faz `Get_ID_Generation_TABLE` no Delphi.

Diferenças adicionais:

- Autenticação é feita pelo header; `PE_PASSKEY` não é aceita no corpo e é
  rejeitada como campo desconhecido (`forbidNonWhitelisted`).
- O `ValidationPipe` rejeita campos desconhecidos, campos obrigatórios
  ausentes, tenant menor que 1 e IDs de mutação menores que 1 com HTTP 400.
  A criação exige nome de pelo menos cinco caracteres.
- `PS_DATADOCADASTRO` é texto SQL (`YYYY-MM-DD HH:mm:ss`, conforme o tipo
  da coluna), sem depender da formatação regional do FireDAC.
- Consultas vazias usam o comportamento do processor NestJS: quantidade
  zero e mensagem de ausência; não reproduzem `psCodeErro = 404`.
- Falhas retornam mensagem segura, sem SQL, credenciais ou erro bruto.

## Validação

Testes unitários cobrem contratos dos DTOs, parâmetros SQL, filtros de tenant,
campos de saída, ID das mutações, ausência de linhas e erros seguros.
Não houve escrita na base nem teste HTTP autenticado. O cliente `mariadb`
não foi encontrado no ambiente; o schema atual e os efeitos reais ainda
precisam ser conferidos antes de declarar substituição funcional do DataSnap.
