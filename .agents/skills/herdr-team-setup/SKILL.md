---
name: herdr-team-setup
description: "Preparar uma equipe na guia atual do Herdr: orquestrador à esquerda e dois executores mais um revisor empilhados à direita, com harnesses escolhidos pelo usuário. Use para montar ou reutilizar esse ambiente, isoladamente ou como preparação de agent-orchestration."
---

# Preparação da equipe no Herdr

Prepare o ambiente do agente chamador sem iniciar trabalho no repositório. Esta skill funciona de forma independente: não depende de `agent-orchestration`, não a chama e não exige um plano de implementação. Quando invocada por outra skill, devolva o ambiente pronto para que ela conduza o trabalho.

## Layout e papéis

O layout **1 + 3** tem duas colunas na mesma guia: o painel atual ocupa toda a altura da esquerda; três painéis de alturas semelhantes ocupam a direita. São quatro painéis no total, não uma grade de três painéis.

```text
┌────────────────────┬────────────────────┐
│                    │ worker_exec_1      │
│                    ├────────────────────┤
│ Orchestrator       │ worker_exec_2      │
│                    ├────────────────────┤
│                    │ reviewer_agent     │
└────────────────────┴────────────────────┘
```

O Orquestrador é a instância atual da conversa; não inicie outro agente para esse papel. Prepare sempre os dois executores e o revisor, mesmo que não haja tarefas para todos. Nesta skill, os três auxiliares apenas recebem sua identificação e aguardam atribuições.

## 1. Verificar o ambiente

- Leia e siga a skill `herdr` instalada antes de usar comandos do Herdr. Se ela estiver indisponível, informe a dependência ausente e pare.
- Verifique `HERDR_ENV=1`; fora do Herdr, pare sem inspecionar nem controlar uma sessão.
- Use a ajuda do cliente instalado como autoridade para os comandos e opções. Não execute subcomandos mutáveis sem argumentos para descobrir sua sintaxe.
- Descubra o workspace, a guia, o painel do chamador e o caminho absoluto do projeto/checkout. Inspecione as listas ao vivo de painéis e agentes e o layout da guia. Não deduza IDs pela ordem visual nem use o painel com foco de outro cliente.
- Mantenha o diretório de trabalho do chamador. Esta preparação não cria workspace, guia, branch ou worktree e não executa implementação ou verificações do repositório.

## 2. Resolver os harnesses

- Use a escolha do usuário para cada auxiliar: `worker_exec_1`, `worker_exec_2` e `reviewer_agent`. Um único harness pode valer para todos se o usuário indicar esse escopo; aceite também escolhas diferentes por papel.
- Reaproveite escolhas já fornecidas para esta equipe na conversa, inclusive quando recebidas pela skill que chamou a preparação. Não pergunte novamente por escolhas já resolvidas.
- Se faltar alguma escolha, pergunte somente pelos papéis pendentes e aguarde antes de alterar o layout ou iniciar agentes. Exemplo: “Quais harnesses devo usar no executor 1, no executor 2 e no revisor? Pode ser o mesmo para todos.”
- Confira se os `kind` escolhidos são suportados pelo Herdr instalado. Se uma escolha não estiver disponível, informe e peça uma alternativa; não substitua silenciosamente.
- Não identifique, pergunte, selecione nem fixe modelo ou esforço/nível de raciocínio. Preserve as configurações existentes do harness, sem passar argumentos que as sobrescrevam. Elas também não são critérios para reutilização.

## 3. Reutilizar e mapear a equipe

- Use os nomes estáveis `worker_exec_1`, `worker_exec_2` e `reviewer_agent`.
- Reutilize um papel ao vivo somente quando estiver no mesmo workspace, no mesmo caminho absoluto de projeto/checkout e na mesma guia do chamador, com o harness escolhido pelo usuário, pronto, em primeiro plano e livre de tarefa não relacionada.
- Um agente em outra guia não é elegível: crie o papel na guia do chamador. Não mova processos de outra guia para compor a equipe.
- Sufixe o nome somente se ele estiver ocupado por um papel ao vivo inelegível ou não relacionado. Registre o nome real e use-o nas operações posteriores.
- Reutilize painéis de shell disponíveis no mesmo contexto; não inicie agentes sobre comandos, editores ou outros agentes em execução.
- Em chamadas repetidas, confirme o estado ao vivo e reutilize os painéis e agentes elegíveis. Não duplique a equipe nem reinicie auxiliares que já estejam prontos.

## 4. Organizar a guia atual

Nomeie explicitamente os quatro painéis no Herdr, incluindo o próprio painel do agente chamador. Use estes títulos visíveis para identificar os papéis:

| Painel | Título obrigatório |
| --- | --- |
| Agente chamador, à esquerda | `Orchestrator` |
| Executor 1, no topo à direita | `worker_exec_1` |
| Executor 2, no meio à direita | `worker_exec_2` |
| Revisor, na base à direita | `reviewer_agent` |

O título do painel e o nome ao vivo do agente são identificações distintas: registrar um nome com `agent start` não substitui a renomeação do painel. Mantenha os títulos acima mesmo quando o nome ao vivo de um auxiliar precisar de sufixo por colisão.

- Renomeie o painel do chamador para `Orchestrator`, exatamente assim, usando o comando suportado pelo Herdr instalado, e confirme o título. Preserve esse painel à esquerda em toda a altura.
- Crie apenas os painéis faltantes, todos na guia atual e no diretório do chamador, com `--no-focus`. Aplique os títulos obrigatórios aos painéis novos e reutilizados, usando seus IDs explícitos e o comando de renomeação suportado pelo Herdr instalado.
- Partindo de uma guia com apenas o chamador, divida seu painel para a direita e depois divida apenas a região da direita para baixo até obter três painéis empilhados. Use os IDs retornados a cada criação; não divida a coluna do Orquestrador em linhas.
- O primeiro split pode usar `herdr pane split --current --direction right --cwd "$PWD" --no-focus`. Para os splits seguintes, use o ID explícito do painel da direita e a sintaxe confirmada na ajuda instalada.
- Ajuste os tamanhos com os recursos suportados pelo cliente para obter duas colunas de larguras semelhantes e três linhas de alturas semelhantes à direita. Splits sucessivos pela metade podem exigir redimensionamento. Mantenha o foco do usuário no chamador.
- Se já houver painéis elegíveis da equipe, organize-os no layout solicitado sem encerrar ou reiniciar seus agentes. Não feche, substitua ou interrompa painéis e processos não relacionados. Se eles impedirem o layout, explique o conflito e peça ao usuário como acomodá-los antes de modificá-los; não crie outra guia como alternativa automática.
- Inspecione o layout resultante e confirme a posição do chamador e a ordem dos três auxiliares. Se o cliente não permitir concluir o arranjo, reporte o impedimento sem declarar o ambiente pronto.

## 5. Iniciar e confirmar prontidão

- Inicie os papéis faltantes apenas em painéis de shell disponíveis, com `herdr agent start <nome-ao-vivo> --kind <harness-escolhido> --pane <pane-id>`.
- Não acrescente flags de modelo ou esforço, nem altere a configuração do harness.
- Aguarde o Herdr reconhecer cada agente e confirmar prontidão. Inspecione estado e saída quando houver dúvida. Em falha ou timeout, verifique o que já foi criado/iniciado antes de tentar novamente.
- Se houver pergunta ou diálogo de aprovação que dependa do usuário, reporte o prompt exato e aguarde. Preserve autorizações já concedidas; não responda nem contorne aprovações por conta própria.
- Envie uma mensagem curta a cada auxiliar com o papel e o diretório de trabalho, pedindo que aguarde atribuição sem editar arquivos nem executar tarefas. O revisor recebe também a orientação de revisão e investigação sem edição, salvo implementação explicitamente atribuída depois.
- Após a inicialização, consulte os títulos ao vivo dos quatro painéis e confirme que correspondem à tabela, inclusive `Orchestrator`. Corrija títulos ausentes ou alterados pela inicialização antes de declarar o ambiente pronto.
- Confirme que os três auxiliares estão prontos para receber instruções. Prontidão não é evidência de execução ou conclusão de qualquer tarefa de desenvolvimento.

## 6. Devolver o ambiente

Registre na conversa o mapeamento dos quatro papéis: workspace, caminho absoluto do projeto/checkout, guia, ID e título confirmado do painel, nome ao vivo do agente quando houver, harness e prontidão. Para o Orquestrador, use apenas os dados já conhecidos, sem renomear sua identidade de agente nem investigar modelo ou esforço.

Informe o layout confirmado e quaisquer bloqueios. Na chamada isolada, encerre com os auxiliares aguardando. Quando chamada por outra skill, devolva o mapeamento e a prontidão para que ela prossiga. Não delegue implementação nem imponha regras de coordenação nesta preparação.
