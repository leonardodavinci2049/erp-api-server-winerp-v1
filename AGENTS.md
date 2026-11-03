# Instruções para agentes

Responda em português do Brasil. Antes de alterar o projeto, examine os arquivos relevantes, as instruções aplicáveis e o estado do Git. Preserve alterações existentes e limite o trabalho ao escopo solicitado.

## Contexto e arquitetura

- Este projeto é uma API REST em NestJS e TypeScript para operações CRUD, com acesso direto ao MariaDB por `mysql2`, sem ORM.
- Preserve as convenções existentes e prefira soluções simples. Organize novas funcionalidades em módulos NestJS; controllers tratam HTTP, services concentram regras de negócio e componentes de acesso a dados executam consultas.
- Use injeção de dependências e mantenha os contratos públicos compatíveis, salvo solicitação explícita de mudança. Não invente tabelas, campos ou regras de negócio: confira as fontes disponíveis e esclareça dúvidas relevantes.
- O projeto usa módulos ESM e `moduleResolution: nodenext`; siga o padrão existente de imports locais com extensão `.js`.

## API e TypeScript

- Mantenha a tipagem rigorosa, evite `any` e valide em tempo de execução dados externos, incluindo parâmetros, queries, corpos e configuração.
- Use DTOs e os mecanismos de validação já adotados pelo projeto. As dependências disponíveis não significam que validação global já esteja configurada: verifique a configuração antes de depender dela.
- Use métodos e status HTTP adequados, trate recursos inexistentes e erros previsíveis, e não exponha detalhes internos, SQL, credenciais ou stack traces nas respostas.
- Considere autenticação, autorização, paginação, filtros e limites conforme o recurso e os requisitos; documente contratos relevantes.

## MariaDB e segurança

- Use `mysql2`, preferencialmente sua API de promises, e consultas parametrizadas. Nunca concatene valores externos ao SQL; identificadores e ordenações dinâmicas devem ser escolhidos a partir de uma lista permitida.
- Centralize e reutilize a configuração e o pool de conexões quando necessário. Libere conexões adquiridas em `finally` e encerre o pool no ciclo de vida da aplicação.
- Use transações para operações que precisem ser atômicas, com commit, rollback e liberação adequados. Considere concorrência, integridade e índices conforme as consultas reais.
- Obtenha credenciais da configuração do ambiente, valide-as sem expor seus valores e nunca versione segredos. Evite registrar dados sensíveis.
- Não execute alterações destrutivas no banco, migrações destrutivas ou exclusões em massa sem autorização explícita. Antes de propor mudanças estruturais, descreva impactos e uma estratégia segura de migração e rollback.

## Verificação e entrega

- Use `pnpm`, conforme o lockfile do projeto. Para mudanças relevantes, execute as verificações aplicáveis: `pnpm lint`, `pnpm test`, `pnpm test:e2e` e `pnpm build`. Execute testes de integração com banco apenas em ambiente apropriado e autorizado.
- Crie ou atualize testes para comportamentos relevantes, incluindo validação, erros e acesso a dados quando aplicável. Não apresente testes simulados como prova de integração real com MariaDB.
- Revise as alterações e informe o que mudou, os arquivos afetados, os comandos executados e eventuais limitações. Não faça commit, push ou deploy sem autorização explícita.
