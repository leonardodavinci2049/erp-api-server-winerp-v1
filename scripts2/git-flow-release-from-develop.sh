# FLUXO GIT FLOW

##atualziar remoto

```shell
git fetch origin

git switch main
git merge --ff-only origin/main

git switch develop
git merge --ff-only origin/develop


git branch --set-upstream-to=origin/develop develop

Para confirmar que cada branch local está no mesmo commit da correspondente remota:

git rev-list --left-right --count main...origin/main
git rev-list --left-right --count develop...origin/develop


```


### Task 2 - Finalizar Feaure

só use se estiver tudo ok, ou apena der commit - cuidado não execute
sempre execute o lint e o build

```shell

git status

git add .
git commit -m " task final adjustments and completion"

mkdir -p /home/leomer/projects/mercury-worktrees/web-app-manager-erp-v1
git flow feature finish featr-507

git checkout feature/dashboard-pdv-ui-concept

git branch
git push origin develop

clear

```

### Task 3 - Criar a release (Somente DEV1 )

- Certifique que está na branch developer

```shell
# atualize os pacotes e faça o build novamente
git flow release start rls-508

git flow release finish rls-508

git branch



```

### Task 4 - Enviar para o Main remoto

```shell

clear

git push origin main develop --follow-tags

```

### Task 4 - criar nova branch de feature

```shell

# crie uma nova
clear

git branch

# start a new branch

git flow feature start featr-750

#Limpa cache
rm -rf .next && pnpm dev

```

### Código 200 - Deu Merda!!! - Excluir branch

```shell

git add .
git commit -m " Codigo 200"

git checkout develop

git checkout feature/featr-341
git checkout release/rls-239

  feature/featr-239

git branch -d feature/featr-176 ( if it have a commit)
git branch -D feature/painel-operacional-importacoes

git branch

```

### mover entre branchs

```shell

git checkout release/rls-600
git checkout feature/featr-500

git branch

```

## Iniciar uma nova worktree

```shell
chmod +x scripts/create-feature-worktree.sh


./scripts/create-feature-worktree.sh <slug-da-feature> develop
./scripts/create-feature-worktree.sh catalog-image-gallery

./scripts/create-feature-worktree.sh improvements-to-the-product-detail-page

```

### desbloquer porta

```shell

lsof -i :5555
kill -9 26405


# Opção 1: Matar por nome do processo
pkill -f "next dev"

# Opção 2: Matar por porta (se souber o PID)
lsof -ti:5555 | xargs kill

# Opção 3: Matar processos npm
pkill -f "npm run dev"


npm run dev

# NEST

lsof -i :3333
kill -9 26405
lsof -i :3333
npm run start:dev

```
