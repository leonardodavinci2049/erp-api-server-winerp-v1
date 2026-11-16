# Fluxo Git Flow em dois computadores

Este guia mantém `main` e `develop` locais atualizadas e permite continuar a mesma tarefa em dois computadores usando uma branch `feature/*` no remoto.

Use os comandos no Git Bash, dentro da pasta do repositório. Troque `nome-da-tarefa` pelo mesmo identificador nos dois computadores.

## 1. Atualizar `main` e `develop`

Antes de trocar de branch, confira se há alterações locais:

```bash
git status --short --branch
```

Se houver alterações não salvas em commit, conclua ou resolva esse trabalho antes de seguir. Não faça `pull` por cima de alterações que você ainda precisa preservar.

Atualize as referências do remoto e avance as branches locais apenas quando for possível fazer fast-forward:

```bash
git fetch origin --prune
git switch main
git pull --ff-only origin main
git switch develop
git pull --ff-only origin develop
```

Repita essa atualização em cada computador quando começar a trabalhar. `--ff-only` evita criar um merge automático se a branch local divergiu do remoto; nesse caso, pare e investigue a divergência.

## 2. Criar e publicar a branch da tarefa

Faça isso uma vez, no primeiro computador, partindo de `develop` atualizada:

```bash
git switch develop
git pull --ff-only origin develop
git switch -c feature/nome-da-tarefa
```

Depois de fazer alterações e criar um commit, publique a branch:

```bash
git add caminho/do/arquivo
git commit -m "Describe the change"
git push -u origin feature/nome-da-tarefa
```

O `-u` configura o acompanhamento do remoto; nos próximos envios dessa branch, `git push` costuma ser suficiente.

## 3. Continuar a mesma tarefa no outro computador

Busque as branches remotas:

```bash
git fetch origin --prune
```

Se a branch ainda não existir localmente nesse computador:

```bash
git switch --track origin/feature/nome-da-tarefa
```

Se ela já existir localmente:

```bash
git switch feature/nome-da-tarefa
git pull --rebase origin feature/nome-da-tarefa
```

Faça suas alterações e publique os commits:

```bash
git add caminho/do/arquivo
git commit -m "Describe the change"
git push
```

## 4. Alternar entre os computadores

Antes de parar de trabalhar em um computador, faça commit e envie a branch `feature/*`:

```bash
git status --short --branch
git add caminho/do/arquivo
git commit -m "Describe the change"
git push
```

No outro computador, antes de continuar na mesma branch:

```bash
git fetch origin --prune
git switch feature/nome-da-tarefa
git pull --rebase origin feature/nome-da-tarefa
```

Se o `git push` for recusado porque o outro computador publicou commits primeiro, atualize sua branch e tente novamente:

```bash
git pull --rebase origin feature/nome-da-tarefa
git push
```

Se houver conflito durante o rebase, resolva os arquivos indicados e continue com:

```bash
git add caminho/do/arquivo-resolvido
git rebase --continue
git push
```

## Regras práticas

- Use a mesma branch `feature/nome-da-tarefa` nos dois computadores para a mesma tarefa.
- Envie commits para o remoto antes de trocar de computador; alterações sem commit não ficam disponíveis no outro PC.
- Atualize `main` e `develop` com `git pull --ff-only` e publique o trabalho na branch `feature/*`.
- Não envie a tarefa diretamente para `main` ou `develop`. A integração da feature segue o processo de revisão/merge do repositório.
- Se houver alterações locais ou uma divergência inesperada, confira `git status` e o histórico antes de continuar; não descarte trabalho para “forçar” a atualização.
