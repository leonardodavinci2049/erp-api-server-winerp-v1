---
name: agent-orchestration
description: "Coordenar uma equipe de quatro agentes no Herdr: orquestrador, dois executores e revisor independente, com delegação, acompanhamento e revisão obrigatória. Use quando solicitado a liderar trabalho entre agentes; depende de herdr-team-setup para preparar ou reutilizar a equipe."
---

# Orquestrador, executores e revisor independente — Orquestração de agentes

Coordene o **Orquestrador** (a instância corrente da conversa, qualquer que seja o harness), **dois executores** e **um revisor independente**. A skill `herdr-team-setup` prepara os quatro painéis e deixa os três auxiliares prontos. Use o segundo executor para trabalho ou investigação independente, com arquivos distintos ou acesso somente leitura, contratos estáveis e benefício concreto de paralelismo; ele pode permanecer aguardando em tarefas sequenciais.

Os títulos identificam os destinatários das instruções. **Auxiliares** são os executores e o revisor; **todos os agentes** inclui também o Orquestrador.

## Orquestrador — Limites de atuação

O Orquestrador conduz a conversa, planeja, delega, monitora e consolida resultados. Pode ler arquivos, logs, diffs, status, refs e saídas dos agentes, conferir requisitos e questionar evidências. Delega todas as edições, operações Git que alterem estado e verificações executáveis aos executores: não cria, edita, move ou exclui arquivos, não executa formatters, linters, testes, builds ou validadores, nem altera branch, worktree, stage, commit, merge, push, tag ou release.

O veredito técnico pertence ao revisor independente. O Orquestrador exige evidências compatíveis com a entrega e não substitui nem contorna a revisão com aprovação própria.

Inicializar a equipe e controlar painéis do Herdr são funções do Orquestrador. Não use `run` de um painel nem artefatos intermediários para executar implementação ou verificações em seu lugar.

## Todos os agentes — Autorizações e decisões do usuário

- Preserve o escopo e as autorizações já concedidas; não peça aprovação do plano ou de cada etapa por rotina. Operações Git seguem o `AGENTS.md`; commit, merge, push e exclusão de branch exigem autorização do usuário.
- Se uma ferramenta exigir aprovação ou houver decisão realmente pendente do usuário, reporte o prompt exato e a origem da exigência. Aguarde para a ação dependente, mantendo outras tarefas autorizadas e independentes em andamento. Não responda nem contorne barreiras de aprovação.
- Os auxiliares não subdelegam sem atribuição explícita dessa autoridade pelo Orquestrador.

## Orquestrador — Preparação obrigatória do ambiente

1. Apresente o plano inicial conforme a seção seguinte antes de preparar a equipe ou atribuir trabalho.
2. Leia e execute [herdr-team-setup](../herdr-team-setup/SKILL.md), inclusive para reutilizar uma equipe existente. Essa skill verifica o Herdr, resolve os harnesses, organiza os painéis e confirma prontidão; não duplique seus procedimentos aqui. Se estiver indisponível ou a preparação ficar bloqueada, informe o impedimento e não despache tarefas.
3. Reaproveite as escolhas de harness já fornecidas para esta equipe; a preparação pergunta apenas pelos papéis pendentes, nunca por modelo ou esforço.
4. Consuma o mapeamento devolvido: workspace, caminho absoluto do projeto/checkout, aba, painel, nome ao vivo, harness e prontidão de cada papel. Despache somente após os três auxiliares estarem prontos, seguindo o protocolo de atribuição abaixo. A mensagem inicial da preparação apenas identifica o papel e pede que aguarde.

## Orquestrador — Plano de execução e acompanhamento

### 1. Plano inicial e dependências

- Mantenha o plano somente na conversa, com etapas numeradas, entrega, responsável e estado. Inclua verificações, revisão independente e consolidação, em detalhe proporcional à tarefa.
- Para cada dependência, declare o que libera a próxima etapa: contrato definido, implementação disponível ou revisão aprovada, e qual evidência comprova esse marco. Antecipar trabalho com contrato definido ou implementação disponível não conclui a etapa anterior; mudanças posteriores nesses insumos exigem reavaliar os consumidores.
- Associe tarefas às etapas e use ID com revisão, como `T3/r1`. Incremente a revisão quando mudar escopo, contrato, critérios de aceite ou iniciar uma rodada de correção/revisão sobre novo estado. Respostas de versões anteriores servem como histórico e não concluem a versão vigente. Esclarecimentos que não alterem a atribuição mantêm o ID.

### 2. Estados e critérios de conclusão

- Use **pendente**, **em andamento**, **em revisão**, **concluída** ou **bloqueada**.
- Etapas de preparação terminam com evidência de prontidão. Entregas de execução ou investigação só ficam concluídas com evidências dos critérios de aceite e aprovação independente do estado entregue. Correções retornam a etapa para **em andamento**.
- Registre bloqueio, responsável pela resolução e condição para retomar. Bloqueie apenas as etapas afetadas e seus dependentes.

### 3. Progresso, retomada e encerramento

- Informe mudanças de estado com número/nome da etapa e próximo passo; identifique as etapas paralelas e seus responsáveis. Em etapas demoradas, comunique o último avanço comprovado e a espera atual, respeitando a frequência exigida pelo ambiente e evitando mensagens repetitivas sem informação nova.
- Atualize o plano quando escopo ou dependências mudarem, sem ampliar a autorização existente. Em marcos importantes, mantenha um resumo de retomada: objetivo, versões vigentes, decisões, responsáveis/propriedade de arquivos, evidências, revisão e pendências. Após compactação, confira esse resumo contra o estado ao vivo antes de despachar; se o histórico for perdido, reconstrua o contexto com evidências e esclareça decisões irrecuperáveis.
- Ao encerrar, apresente o estado final das etapas, entregas, verificações, veredito e limitações. Trabalho bloqueado, não verificado ou sem revisão exigida permanece pendente de conclusão.

## Todos os agentes — Delegação e comunicação

### 1. Orquestrador — Preparação e formato da atribuição

Leia os `AGENTS.md` aplicáveis e, antes de cada nova atribuição, siga a seção de limpeza de contexto. Envie uma mensagem autocontida com os campos abaixo; use “não se aplica” quando necessário.

| Campo | Conteúdo obrigatório |
| --- | --- |
| Identificação | ID/revisão, etapa, papel e caminho absoluto do checkout. |
| Objetivo e aceite | Entrega esperada; cada requisito associado à verificação/evidência que o comprova. |
| Escopo e propriedade | Paths permitidos, dono de cada arquivo/recurso compartilhado e limites de atuação do papel. |
| Contexto e dependências | Fatos confirmados e suas fontes, decisões vigentes, hipóteses/dúvidas ainda abertas e condições para avançar. |
| Regras e autorizações | Regras aplicáveis desta skill e do repositório, inclusive branch/worktree, restrições e permissões já concedidas. |
| Estado e retorno | Baseline relevante, formato da entrega e, para correção ou revisão, constatações anteriores e estado exato a examinar. |

### 2. Orquestrador — Envio e concorrência

- Use `herdr agent prompt <role-or-pane-id> "<atribuição>"` com o destinatário exato do mapeamento ao vivo e a sintaxe confirmada pela preparação. Não interpole texto arbitrário em comandos de shell sem escape adequado.
- Despache tarefas independentes sem `--wait` antes de aguardar conclusões. Para tarefas dependentes, aguarde a condição de liberação definida no plano. Use esperas curtas, dentro dos limites do ambiente, para manter o acompanhamento e a comunicação com o usuário.

### 3. Auxiliares — Formato da entrega

- Informe ID/revisão, estado examinado ou produzido, resultado real e arquivos afetados ou consultados.
- Para cada critério de aceite, indique evidência, resultado e limitações; identifique checagens executadas e as não executadas com o motivo. Separe fatos comprovados de hipóteses.
- Registre decisões tomadas, dúvidas, bloqueios e condição de retomada. O revisor acrescenta as constatações e o veredito definidos na seção de revisão.

### 4. Orquestrador — Comprovação da entrega

- Prompt enviado, prontidão ou ociosidade do Herdr não comprovam conclusão. Uma espera pode retornar sobre ociosidade anterior à tarefa; vincule atividade e saída observadas ao ID/revisão vigente.
- Leia a saída estabilizada com `herdr agent read <role-or-pane-id> --source recent-unwrapped --lines 120`, ampliando a leitura quando necessário, e inspecione o estado real dos arquivos em modo somente leitura. Confirme que não há execução ainda alterando a entrega antes da revisão.

### 5. Orquestrador — Interrupções, timeout e recuperação

- Em timeout, queda de agente, fechamento de painel ou interrupção da sessão, inspecione agentes/processos ainda ativos, saída disponível e trabalho parcial antes de reenviar ou transferir uma tarefa. Ausência do painel não comprova que seus processos pararam.
- Preserve alterações e evidências; confirme quem ainda pode escrever. Só transfira a propriedade após comprovar o encerramento da execução anterior ou a liberação explícita pelo executor sem processos pendentes. Se não for possível confirmar, bloqueie os paths afetados e solicite a informação/intervenção necessária.
- Retome com o estado real e critérios pendentes em uma atribuição autocontida. Para repor um auxiliar, aguarde as entregas dos demais antes de reaplicar `herdr-team-setup`, preservando os papéis elegíveis; atualize o mapeamento e aplique a limpeza de contexto. Não reexecute automaticamente mutações que possam já ter ocorrido.
- Replaneje quando as tentativas repetirem a mesma falha, deixarem de produzir evidência nova ou revelarem dependências ausentes. Limites de tempo/custo seguem os acordados com o usuário ou impostos pelo ambiente; não invente valores padrão.

## Orquestrador e executores — Propriedade de checkout e integração

### 1. Orquestrador — Designação do executor de integração

- Designe um único executor para operações Git, integração e verificações finais. Ele segue as regras de branch/worktree do repositório e preserva alterações preexistentes, registradas fora do escopo da tarefa.

### 2. Coordenação do checkout compartilhado

- Defina propriedade de arquivos e condições para transferi-la. Escritas concorrentes só podem atingir arquivos distintos; ninguém edita arquivo de outro executor sem transferência explícita.
- Branch, índice, dependências e saídas de build são compartilhados. Serialize operações Git, instalações, formatação global e verificações finais; suspenda atividades que usem os recursos afetados. Não troque de branch enquanto outros escrevem.
- Worktrees seguem a autorização vigente e as regras do repositório; não mude a topologia por conveniência da coordenação. Quando usados, registre seus caminhos e destinos de integração e submeta o resultado integrado à revisão.

## Todos os agentes — Revisão independente e correções

### 1. Orquestrador e executores — Congelamento do estado

- Após a entrega, suspenda edições no checkout compartilhado e peça ao executor de integração as verificações finais. Conclua geração/formatação antes de fixar o estado revisável; alterações decorrentes das checagens também pertencem à entrega.
- O executor registra branch, HEAD, arquivos da tarefa e fingerprint do conteúdo, incluindo alterações no índice, fora dele e arquivos novos/ignorados relevantes. Não inclua segredos ou artefatos alheios ao escopo. O registro não exige commit.
- Só então atribua a revisão, mantendo o estado congelado. Para investigação sem edição, identifique o relatório e as fontes/estado examinados. Arquivos ignorados ou não rastreados exigem comparação e fingerprint próprios, conforme a seção de verificações.

### 2. Revisor independente — Análise e veredito

- Revise em modo somente leitura o estado identificado, os requisitos, o diff e as evidências. Peça ao Orquestrador verificações adicionais para um executor quando necessário; não implemente correções nem aprove mudanças de sua autoria.
- Classifique constatações como **defeito bloqueador**, **risco relevante** ou **sugestão opcional**. Para defeitos/riscos, informe localização, evidência, impacto e condição objetiva de resolução ou aceitação; preferências sem violação de requisito não bloqueiam por si só.
- Devolva ID/revisão, fingerprint/estado examinado, resultado por critério de aceite e um veredito: **`ship as-is`** quando os requisitos estiverem comprovados e não houver bloqueadores nem riscos relevantes sem tratamento; **`needs changes`** quando houver defeito ou risco que exija correção; **`blocked`** quando faltar acesso, decisão ou evidência essencial para decidir. Sugestões opcionais não exigem correção para aprovação.

### 3. Orquestrador — Mudanças durante o congelamento

- Enfileire pedidos independentes sem gravações no checkout congelado. Se um pedido alterar a tarefa atual, invalide a revisão, atualize a versão da atribuição e libere explicitamente o executor antes de editar.
- Qualquer mudança no estado revisado invalida seu veredito: repita as verificações afetadas, fixe novo fingerprint e peça nova revisão. Resultados de versões ou estados antigos não aprovam a entrega atual.

### 4. Orquestrador — Correções e aprovação final

- Para `needs changes`, libere o executor responsável para corrigir e repita o ciclo de verificação, congelamento e revisão. Para `blocked`, resolva a informação/decisão faltante; se forem necessárias novas checagens executáveis, libere o executor de integração e fixe novamente o estado antes de retomar a revisão.
- Após duas rodadas de correção com o mesmo problema, reavalie a decomposição ou peça investigação ao outro executor antes de repetir a abordagem. O revisor permanece independente da implementação.
- Consolide apenas com `ship as-is` para a versão e o estado atuais, evidências de aceite e ausência de alterações posteriores. Aprovação da entrega não autoriza operações Git ou publicação adicionais.

## Orquestrador — Limpeza de contexto a cada nova tarefa

- Antes de cada nova atribuição, limpe o contexto somente do auxiliar destinatário, inclusive em correções e novas rodadas de revisão. Não limpe o Orquestrador. Acompanhamento e esclarecimentos da mesma atribuição dispensam limpeza.
- Confirme o fim da atribuição anterior e recolha entrega, evidências, constatações e bloqueios na conversa. Nunca limpe durante execução, aprovação pendente ou estado incerto; resolva ou encerre a atribuição antes de reutilizar o auxiliar. A limpeza não conclui nem aprova a entrega anterior.
- Use o mecanismo de nova sessão/limpeza suportado pelo harness instalado, com sintaxe confirmada na ajuda ou documentação. Não presuma suporte a `/new`: `herdr agent get`/`list`, limpeza de tela, compactação ou envio de resumo não comprovam reinício do contexto.
- Confirme o reinício e a prontidão antes do envio. Sem mecanismo confirmado ou em caso de falha, bloqueie novas atribuições a esse auxiliar até resolver. Preserve painel, papel e configurações de harness, modelo e esforço; atualize o mapeamento se a identidade ao vivo mudar.
- Restaure as instruções e evidências pelo formato autocontido de atribuição, sem depender do histórico apagado, e registre a limpeza confirmada junto ao ID/revisão. Ela não altera arquivos nem autorizações vigentes.

## Todos os agentes — Verificações proporcionais à mudança

### 1. Executores — Execução e evidências

- Siga a política do repositório: sem framework de testes ou scripts Jest legados. Para código, use `pnpm lint`, `pnpm build` e verificações manuais pertinentes; para documentação, `git diff --check`, sem exigir build. Alterações de skill também usam `quick_validate.py` de `skill-creator` quando disponível; ausência deve ser registrada. Esse validador verifica estrutura, não comportamento.
- Relacione cada resultado ao requisito que comprova. Lint/build não demonstram comportamento de interface ou integração; quando necessário, obtenha evidência funcional autorizada e registre limites de acesso/ambiente sem declarar sucesso não observado.
- `git diff` comum não cobre arquivos ignorados/não rastreados. Compare seus conteúdos reais com o baseline por `git diff --no-index`, verifique whitespace com `--check` e registre hashes ou snapshots dos arquivos relevantes. Para arquivos novos, use baseline vazio. Em `--no-index`, código 1 por diferenças encontradas não significa, sozinho, falha de validação.

## Orquestrador — Telemetria e métricas opcionais

Se útil, registre na conversa tempo decorrido, espera de revisão, rodadas de correção, conflitos e custo disponibilizado pela ferramenta. Não crie infraestrutura ou armazenamento de telemetria nem persista dados sensíveis.
