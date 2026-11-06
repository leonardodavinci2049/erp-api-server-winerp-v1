# API WinERP para Aplicações Desktop

API REST multi-tenant destinada à integração com aplicações desktop utilizadas pelos clientes WinERP. Este serviço faz parte de um conjunto de APIs que inclui o projeto `srvapi01`: ambos atendem os mesmos clientes e compartilham o contexto de negócio, mas este projeto tem como público consumidor as aplicações desktop.

O projeto está em fase inicial. A base atual inclui a aplicação NestJS, acesso a MySQL/MariaDB, processamento compartilhado de resultados e um módulo de gerenciamento de marcas. Novos módulos de negócio e requisitos específicos de integração desktop serão documentados conforme forem implementados.

## Estado atual

- API NestJS com o prefixo global `/api`.
- Autenticação por chave de API nas rotas de negócio do módulo de marcas.
- Acesso a MySQL/MariaDB por meio de `mysql2`, sem ORM.
- Rotas de gerenciamento de marcas em `/api/brand/v2`.
- Página estática servida a partir de `pageroot/`.
- O módulo de marcas recebe contexto de cliente e loja; operações multi-tenant devem preservar os identificadores aplicáveis.

## Tecnologias

| Camada                    | Tecnologia                             |
| ------------------------- | -------------------------------------- |
| Runtime                   | Node.js                                |
| Linguagem                 | TypeScript com módulos NodeNext e ESM  |
| Framework                 | NestJS 12                              |
| Banco de dados            | MySQL / MariaDB                        |
| Driver de banco           | `mysql2`                               |
| Validação de configuração | Zod                                    |
| Validação de requisições  | `class-validator`, `class-transformer` |
| Gerenciador de pacotes    | pnpm                                   |
| Lint                      | oxlint                                 |
| Formatação                | Prettier                               |
| Testes                    | Vitest                                 |

## Estrutura do projeto

```text
erp-api-server-winerp-v1/
├── pageroot/                 # Página estática e arquivos servidos pela aplicação
├── src/
│   ├── app.main/             # Módulo NestJS principal, controller e service
│   ├── brand/                # Rotas e regras de negócio de marcas
│   │   ├── dto/              # DTOs validados das requisições
│   │   ├── query/            # Construtores de consultas e chamadas de procedures
│   │   └── types/            # Tipos dos resultados do banco
│   ├── core/                 # Configuração, guards, processadores e utilitários
│   ├── db-connection/        # Pool MySQL/MariaDB e ciclo de vida das conexões
│   ├── db-operation/         # Operações de consulta, alteração e procedures
│   └── main.ts               # Inicialização e configurações HTTP globais
├── test/                     # Testes end-to-end
├── stored-procedures/        # Diretório local placeholder; definições são mantidas fora daqui
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

Esta estrutura representa os módulos que existem atualmente. Novos diretórios de funcionalidades devem ser adicionados conforme essas funcionalidades forem implementadas.

## Pré-requisitos

- Node.js compatível com as versões exigidas pelas dependências do projeto.
- pnpm.
- Banco MySQL/MariaDB acessível, com as stored procedures necessárias às funcionalidades habilitadas.

## Como começar

1. Instale as dependências:

   ```bash
   pnpm install
   ```

2. Crie um arquivo `.env` na raiz do projeto e configure as variáveis obrigatórias. Consulte [Variáveis de ambiente](#variáveis-de-ambiente).

3. Inicie a aplicação em modo de desenvolvimento:

   ```bash
   pnpm run dev
   ```

A aplicação escuta na porta definida por `APP_PORT` e aplica o prefixo global `/api` às rotas da API. A página estática configurada é servida na raiz.

Para gerar a versão de produção e executá-la:

```bash
pnpm run build
pnpm run start:prod
```

## Variáveis de ambiente

As variáveis são carregadas do arquivo `.env` e validadas na inicialização da configuração da aplicação. A aplicação não inicia se um valor obrigatório estiver ausente ou inválido.

| Variável                         | Obrigatória | Descrição                                                                                  |
| -------------------------------- | ----------- | ------------------------------------------------------------------------------------------ |
| `APP_API_URL`                    | Sim         | Configuração da URL base da API                                                            |
| `APP_SWAGGER_URL`                | Sim         | Configuração da URL do Swagger                                                             |
| `APP_JWT_SECRET`                 | Sim         | Segredo obrigatório na configuração atual                                                  |
| `APP_PORT`                       | Sim         | Porta HTTP da aplicação                                                                    |
| `API_KEY`                        | Sim         | Chave aceita pelo `AuthGuard`                                                              |
| `REVALIDATE_SECRET`              | Não         | Segredo opcional para revalidação                                                          |
| `DATABASE_HOST`                  | Sim         | Host do MySQL/MariaDB                                                                      |
| `DATABASE_PORT`                  | Sim         | Porta do MySQL/MariaDB                                                                     |
| `DATABASE_USER`                  | Sim         | Usuário do banco de dados                                                                  |
| `DATABASE_PASSWORD`              | Sim         | Senha do banco de dados                                                                    |
| `DATABASE_NAME`                  | Sim         | Nome do banco/schema                                                                       |
| `DATABASE_POOL_CONNECTION_LIMIT` | Não         | Máximo de conexões por processo da API; padrão `10`                                        |
| `DATABASE_POOL_QUEUE_LIMIT`      | Não         | Máximo de requisições aguardando conexão; padrão `100`. O valor `0` deixa a fila ilimitada |
| `DATABASE_CONNECT_TIMEOUT_MS`    | Não         | Tempo limite, em milissegundos, para estabelecer conexão; padrão `10000`                   |

`APP_API_URL`, `APP_SWAGGER_URL` e `APP_JWT_SECRET` são exigidas pela validação de ambiente atual. A autenticação implementada nas rotas de negócio usa `API_KEY`; a presença dessas variáveis, por si só, não significa que autenticação JWT ou uma interface Swagger estejam implementadas.

Exemplo de `.env` com valores fictícios:

```dotenv
APP_API_URL=http://localhost:3000/api
APP_SWAGGER_URL=http://localhost:3000/docs
APP_JWT_SECRET=substitua-por-um-segredo-local
APP_PORT=3000
API_KEY=substitua-por-uma-chave-local

DATABASE_HOST=127.0.0.1
DATABASE_PORT=3306
DATABASE_USER=usuario_do_banco
DATABASE_PASSWORD=senha_local
DATABASE_NAME=nome_do_banco

# Configurações opcionais do pool
DATABASE_POOL_CONNECTION_LIMIT=10
DATABASE_POOL_QUEUE_LIMIT=100
DATABASE_CONNECT_TIMEOUT_MS=10000
```

Não versione arquivos `.env` nem inclua credenciais reais em exemplos, logs ou comandos.

## Scripts disponíveis

| Comando                | Descrição                                                    |
| ---------------------- | ------------------------------------------------------------ |
| `pnpm run dev`         | Inicia o NestJS em modo de observação de alterações          |
| `pnpm run start`       | Inicia o NestJS sem modo de observação                       |
| `pnpm run start:debug` | Inicia em modo de depuração e observação                     |
| `pnpm run build`       | Compila a aplicação com o NestJS                             |
| `pnpm run start:prod`  | Executa a aplicação compilada em `dist/`                     |
| `pnpm run lint`        | Executa verificações de lint com oxlint em `src/` e `test/`  |
| `pnpm run format`      | Formata arquivos TypeScript em `src/` e `test/` com Prettier |
| `pnpm run test`        | Executa testes unitários com Vitest                          |
| `pnpm run test:watch`  | Executa Vitest em modo de observação                         |
| `pnpm run test:cov`    | Executa testes unitários com relatório de cobertura          |
| `pnpm run test:e2e`    | Executa testes end-to-end usando `vitest.config.e2e.ts`      |

## Autenticação da API

As rotas de negócio protegidas pelo `AuthGuard` aceitam a chave de API em um destes cabeçalhos:

```http
Authorization: Bearer <API_KEY>
```

```http
x-api-key: <API_KEY>
```

A chave enviada deve corresponder ao valor configurado em `API_KEY`. Não inclua chaves reais no controle de versão nem em exemplos.

## Rotas disponíveis atualmente

O módulo de marcas é, atualmente, o único módulo de negócio no repositório.

| Método | Rota                                      | Descrição                                                  |
| ------ | ----------------------------------------- | ---------------------------------------------------------- |
| `GET`  | `/api/brand`                              | Retorna informações básicas de status da API e das rotas   |
| `POST` | `/api/brand/v2/brand-create`              | Cria uma marca                                             |
| `POST` | `/api/brand/v2/brand-find-all`            | Lista marcas                                               |
| `POST` | `/api/brand/v2/brand-search-all`          | Pesquisa marcas                                            |
| `POST` | `/api/brand/v2/brand-find-manager-all`    | Lista marcas para uso do gerenciador                       |
| `POST` | `/api/brand/v2/brand-find-id`             | Busca uma marca pelo identificador                         |
| `POST` | `/api/brand/v2/brand-find-manager-id`     | Busca uma marca pelo identificador para uso do gerenciador |
| `POST` | `/api/brand/v2/brand-update`              | Atualiza uma marca                                         |
| `POST` | `/api/brand/v2/brand-delete`              | Exclui ou inativa uma marca, conforme a stored procedure   |
| `POST` | `/api/brand/v2/brand-upd-general-field`   | Atualiza um campo geral da marca                           |
| `POST` | `/api/brand/v2/brand-upd-inl-flag-active` | Atualiza o indicador de marca ativa                        |
| `POST` | `/api/brand/v2/brand-upd-inl-name`        | Atualiza o nome da marca                                   |
| `POST` | `/api/brand/v2/brand-upd-inl-notes`       | Atualiza as observações da marca                           |
| `POST` | `/api/brand/v2/brand-upd-inl-slug`        | Atualiza o slug da marca                                   |

As rotas de negócio recebem corpos JSON validados pelos DTOs correspondentes. Consulte os DTOs e o service do módulo para conhecer os campos aceitos e os detalhes atuais das respostas.

## Arquitetura e convenções

O fluxo atual das requisições de negócio é:

```text
Requisição HTTP
    -> Controller
    -> Validação do DTO
    -> Service
    -> Construtor de query
    -> DbOperationService
    -> DbConnectionService
    -> MySQL/MariaDB
```

- Controllers cuidam do roteamento HTTP e recebem os corpos já validados.
- Services coordenam as operações de banco e convertem os resultados para o modelo compartilhado de resposta.
- Os construtores de query fornecem as consultas SQL ou chamadas de stored procedures e seus parâmetros.
- O acesso ao banco usa `mysql2`; o projeto não utiliza ORM.
- Use placeholders para os valores das consultas. Não interpole dados da requisição em strings SQL.
- Preserve o contexto do tenant, incluindo `pe_system_client_id` e `pe_store_id`, em todas as operações que dependem desses identificadores.
- As definições de stored procedures não são mantidas neste repositório. Antes de adicionar ou alterar seu uso, confirme a assinatura e os result sets no banco de desenvolvimento.

## Testes

Execute os testes unitários:

```bash
pnpm run test
```

Execute os testes end-to-end:

```bash
pnpm run test:e2e
```

Testes unitários que usam mocks para as dependências do banco não precisam de uma conexão ativa. Testes end-to-end ou requisições autenticadas que exercitam operações de banco podem exigir um `.env` válido e acesso ao banco de desenvolvimento.

## Lint e formatação

Verifique os diretórios de código e testes com oxlint:

```bash
pnpm run lint
```

Formate os arquivos TypeScript cobertos pelo script do projeto:

```bash
pnpm run format
```

O comando `pnpm run format` altera arquivos. Revise o diff depois de executá-lo.

## Escopo de desenvolvimento

Este repositório está em fase inicial. A implementação atual não representa a lista completa de capacidades planejadas para a API desktop. À medida que novos módulos, contratos e comportamentos de integração forem desenvolvidos, este documento deverá ser atualizado para descrever a estrutura implementada e o comportamento verificado da API.

## Licença

Este projeto é privado e está marcado como `UNLICENSED`.
