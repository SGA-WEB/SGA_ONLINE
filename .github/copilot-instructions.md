## Guia rápido para agentes de código (SGA_ONLINE)

Este repositório é um monolito com front-end estático servido pelo back-end Node.js. As instruções abaixo focam no conhecimento prático que um agente precisa para ser produtivo imediatamente.

- Arquitetura principal:
  - Back-end: `Back_end/src/server.js` (Express, usa Pool do `pg`, sessions com `express-session`).
  - Front-end: arquivos estáticos em `Front_end/` (o servidor Express os serve via `express.static`).
  - Storage: Supabase usado como storage de arquivos (bucket `fotos-usuarios`) — see `Back_end/src/supabase.js`.
  - Banco: PostgreSQL (schema `sga`) — scripts SQL em `Back_end/Banco_de_dados/`.

- Como o projeto roda (Back-end):
  - Instalar dependências: `cd Back_end && npm install`
  - Rodar em dev: `npm run dev` (usa `nodemon`), rodar em produção: `npm start`.
  - Entrypoint: `Back_end/src/server.js`.

- Padrões e convenções encontradas (específicas deste projeto):
  - Soft-delete com coluna `inativo` em muitas tabelas (em vez de DELETE). Ex.: `UPDATE ... SET inativo = TRUE` em endpoints de exclusão.
  - Esquema SQL qualificado como `sga.*` em todas as queries — sempre usar o schema ao editar/gerar SQL.
  - Transações explícitas ao criar recursos compostos (ex.: `/api/contatos`, `/entrada_produto`) — manter a mesma abordagem para evitar inconsistências.
  - Uploads: imagens convertidas para WebP e nomeadas como `<userId>.webp` no bucket `fotos-usuarios` (ver `POST /upload-avatar` em `server.js`).
  - CORS e CSP configurados no servidor: origin padrão `http://127.0.0.1:5503` e header `Content-Security-Policy` aplicado.
  - Autenticação de sessão via `express-session` (cookie based). O servidor cria/usa `req.session.user`.

- Integrações e riscos a observar:
  - Chaves e credenciais estão hardcoded em `Back_end/src/supabase.js` e `Back_end/src/server.js` (supabase key, host/credentials do banco). Substituir por `.env` é prioridade para segurança.
  - O código recria triggers/functions dinamicamente (ex.: `recalcular_total_entrada`) — alterações nesses trechos exigem cuidado (podem interromper o banco em produção).
  - Há comentários indicando hosts diferentes por branch (p.ex. hosts Neon/NeonDB). Verifique a branch ativa antes de trocar host/database.

- Endpoints e exemplos úteis (referência rápida):
  - Health: GET `/health`
  - Login: POST `/api/login` (body: { email, senha }) — cria `req.session.user`.
  - Centros de estoque: GET `/api/centro_estoque`
  - Produtos: GET `/api/produto`, POST `/produtos`, PUT `/produto/:id_produto`, DELETE `/produto/:id_produto` (soft-delete)
  - Upload de avatar: POST `/upload-avatar` (form-data: `avatar` + `userId`)

- Recomendações práticas para agentes:
  - Ao modificar queries, preserve o schema `sga.` e a estratégia de soft-delete.
  - Evite remover ou alterar triggers/functions no banco sem um plano de migração; o código espera que certas triggers existam.
  - Troque chaves hardcoded por variáveis de ambiente (`dotenv` já está nas dependências). Arquivo alvo: `Back_end/src/supabase.js` e variáveis de conexão do `pg` em `server.js`.
  - Use `npm run dev` em `Back_end/` para desenvolvimento local e Postman/Insomnia para testar rotas JSON e upload multipart.

- Onde olhar primeiro (arquivos-chave):
  - `Back_end/src/server.js` — ponto central: rotas, pool do PG, CSP, CORS, sessão.
  - `Back_end/src/supabase.js` — cliente Supabase e bucket usado.
  - `Back_end/Banco_de_dados/` — dumps e scripts SQL usados pelo projeto.
  - `Front_end/` — front-end estático e módulos (ex.: `Front_end/modulos/...`) que consomem as rotas.

Se algo estiver incompleto ou você quer que eu adicione exemplos de PRs/commits, testes rápidos ou checks automáticos, diga o que prefere que eu inclua. Quer que eu troque as chaves hardcoded por uso de `.env` como próxima tarefa? 
