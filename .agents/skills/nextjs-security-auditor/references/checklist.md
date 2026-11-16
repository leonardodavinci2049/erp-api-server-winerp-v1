# Checklist de Auditoria de Seguranca

Use este checklist durante a Fase 3 da auditoria. Marque cada item como `[x]` conforme analisa.

## 1. Segredos e Exposicao de Credenciais

- [ ] Buscar chaves hardcoded: `rg -n "password|secret|token|api[_-]?key" src --type ts`
- [ ] Verificar se `NEXT_PUBLIC_*` em `envs.client.ts` inclui segredos (nao deve)
- [ ] Verificar se `envs.server.ts` tem `import "server-only"`
- [ ] Buscar `console.log|console.error` com dados sensiveis
- [ ] Verificar mensagens de erro que revelam valores de env
- [ ] Verificar `.gitignore` inclui `.env*`

## 2. Autenticacao e Sessao

- [ ] Layout de `src/app/dashboard/layout.tsx` verifica sessao
- [ ] Middleware (se existir) protege rotas autenticadas
- [ ] Sessao expira em tempo razoavel (ver `expiresIn` em auth.ts)
- [ ] Logout invalida sessao no servidor
- [ ] Reset password usa token com expiracao
- [ ] OAuth verifica email antes de permitir login
- [ ] Rate limiting habilitado em auth
- [ ] `BETTER_AUTH_SECRET` e suficientemente forte
- [ ] Providers OAuth configurados corretamente (OAuth providers list vs envs)

## 3. Autorizacao e Controle de Acesso

- [ ] Cada Server Action em `src/app/actions/` checa sessao antes de executar
- [ ] Cada Server Action checa role/permissoes quando necessario
- [ ] Services DB filtram por usuario/organizacao logada
- [ ] Nao ha IDOR em rotas com IDs sequenciais (userId, customerId, orderId, leadId)
- [ ] Rotas de admin sao protegidas por role
- [ ] Dados de outros usuarios/organizacoes nao sao acessiveis
- [ ] CRM data e protegido por organizacao

## 4. Validacao de Entrada e Injection

- [ ] Queries SQL usam parametros preparados (nenhuma concatenacao)
- [ ] `selectExecute`/`modifyExecute` usados em vez de `selectQuery`/`modifyQuery` quando possivel
- [ ] Server Actions validam input com Zod antes de operacoes sensiveis
- [ ] Nao ha path traversal em upload/download
- [ ] URLs construidas com input do usuario sao validadas (SSRF)
- [ ] Nao ha command injection

### Teste rapido de SQL injection

```bash
rg -n 'query\(|execute\(' src/services/db/ src/app/actions/ | rg -v 'params|{\s*\w+\s*}'
```

Linhas que restam merecem investigacao.

## 5. XSS e Seguranca de Renderizacao

- [ ] Buscar `dangerouslySetInnerHTML`: `rg -n "dangerouslySetInnerHTML" src --type tsx`
- [ ] Se encontrado, verificar se HTML e sanitizado com dompurify
- [ ] HTML de APIs externas e sanitizado antes de renderizar
- [ ] URLs dinamicas em href/src sao validadas
- [ ] Nao reportar JSX comum (React escapa por padrao)

## 6. CSRF, CORS e Headers

- [ ] Server Actions com mutacao verificam origem
- [ ] API routes tem protecao CSRF
- [ ] Headers de seguranca configurados (CSP, X-Frame-Options, HSTS, X-Content-Type-Options)
- [ ] CORS nao e permissivo demais
- [ ] Verificar `next.config.ts` e `middleware.ts` para headers

## 7. Cache e Vazamento entre Usuarios

- [ ] Componentes com `'use cache'` que retornam dados personalizados por usuario
- [ ] Tags de cache distinguem entre usuarios quando necessario
- [ ] `cacheComponents: true` no next.config nao causa vazamento
- [ ] `revalidateTag` so e chamado com autorizacao
- [ ] Dados de CRM/agenda/pedidos nao sao cacheados globalmente

### Teste rapido de cache

```bash
rg -n "use cache|cacheTag|cacheLife" src
```

Verificar se cada uso e seguro para dados por usuario.

## 8. Dependencias e Supply Chain

```bash
pnpm audit
```

- [ ] Vulnerabilidades criticas ou altas em next, react, better-auth, mysql2, axios
- [ ] CVEs em resend, zod, dompurify
- [ ] Scripts postinstall suspeitos
- [ ] Pacotes desconhecidos ou nao utilizados

## 9. Configuracao e Operacao

- [ ] Source maps desabilitados em producao
- [ ] `dangerouslyAllowLocalIP: true` e justificado
- [ ] Remote patterns de imagens sao restritivos o suficiente
- [ ] Erros nao vazam stack traces para o client
- [ ] Logs nao contem dados sensiveis
- [ ] `ErroExecucaoConsulta.consulta` redacta em producao
- [ ] Debug mode desabilitado em producao

## 10. Integracoes Externas

- [ ] API key no header Authorization e adequado
- [ ] Webhook URLs sao validadas (nao apontam para IPs internos)
- [ ] Emails via Resend validam destinatario
- [ ] CEP e validado antes de chamar ViaCEP
- [ ] Upload de assets requer autenticacao
