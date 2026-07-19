# Code Connect

Code Connect e uma plataforma full stack para compartilhar conteudos, ideias e projetos da area de tecnologia. A aplicacao funciona como um feed: pessoas usuarias podem criar uma conta, publicar posts, buscar conteudos, abrir detalhes, curtir e comentar publicacoes.

O repositorio esta organizado como um monorepo PNPM com duas aplicacoes principais:

- `apps/web`: frontend em React 19, Vite e Tailwind CSS.
- `apps/api`: backend em NestJS, Prisma e PostgreSQL.

## Funcionalidades

- Cadastro, login e sessao autenticada com JWT.
- Feed de posts com busca e filtros por tags/termos.
- Pagina de detalhes de uma publicacao.
- Criacao de posts por pessoas autenticadas.
- Curtidas e remocao de curtidas.
- Comentarios em posts.
- Persistencia em PostgreSQL via Prisma.
- Documentacao interativa da API com Swagger.

## Tecnologias

- PNPM workspaces
- React 19
- Vite
- Tailwind CSS
- Axios
- NestJS
- Prisma ORM
- PostgreSQL
- Jest
- Oxlint
- Docker Compose

## Estrutura Do Projeto

```text
code-connect/
|-- apps/
|   |-- web/                 # Aplicacao frontend
|   |   |-- src/
|   |   |   |-- components/  # Componentes em Atomic Design
|   |   |   |-- pages/       # Paginas da aplicacao
|   |   |   `-- services/    # Clientes HTTP para a API
|   |   `-- public/          # Assets publicos do Vite
|   `-- api/                 # Aplicacao backend
|       |-- src/
|       |   |-- auth/        # Cadastro, login e guards JWT
|       |   |-- posts/       # Posts, curtidas, comentarios e filtros
|       |   |-- prisma/      # PrismaService e modulo de banco
|       |   `-- users/       # Regras e tipos de usuarios
|       `-- prisma/          # Schema, migrations e seed
|-- assest/                  # Assets compartilhados do projeto
|-- docker-compose.yml       # PostgreSQL local
|-- package.json             # Scripts do workspace
`-- pnpm-workspace.yaml      # Configuracao do monorepo
```

## Requisitos

- Node.js compativel com as dependencias do projeto
- PNPM 11
- Docker e Docker Compose para subir o PostgreSQL local

## Configuracao Local

1. Instale as dependencias:

```bash
pnpm install
```

2. Crie o arquivo `.env` na raiz a partir do exemplo:

```bash
cp .env.example .env
```

No Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

3. Suba o banco PostgreSQL:

```bash
docker compose up -d postgres
```

4. Aplique as migrations e gere o Prisma Client:

```bash
pnpm --filter api prisma:migrate
pnpm --filter api prisma:generate
```

5. Opcionalmente, popule o banco com dados de exemplo:

```bash
pnpm --filter api prisma:seed
```

## Executando O Projeto

Para rodar frontend e backend ao mesmo tempo:

```bash
pnpm dev
```

Tambem e possivel rodar cada aplicacao separadamente:

```bash
pnpm dev:web
pnpm dev:api
```

Por padrao:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- Swagger da API: `http://localhost:3000/api`

## Variaveis De Ambiente

O arquivo `.env.example` traz as variaveis esperadas pelo projeto:

```env
DATABASE_URL="postgresql://code_connect:code_connect@localhost:5432/code_connect?schema=public"
JWT_SECRET="dev-only-code-connect-secret"
WEB_ORIGIN="http://localhost:5173"
VITE_API_URL="http://localhost:3000"
```

- `DATABASE_URL`: string de conexao usada pelo Prisma.
- `JWT_SECRET`: chave usada para assinar tokens JWT.
- `WEB_ORIGIN`: origem liberada para CORS no backend.
- `VITE_API_URL`: URL da API consumida pelo frontend.

## Rotas Principais

### Frontend

- `/` ou `/feed`: feed de publicacoes.
- `/publicar`: criacao de post.
- `/posts/:id`: detalhe de um post.
- `/login`: login.
- `/cadastro`: cadastro de usuario.

### Backend

- `POST /auth/register`: cria uma conta.
- `POST /auth/login`: autentica e retorna token JWT.
- `GET /auth/me`: retorna o perfil autenticado.
- `GET /posts`: lista posts com suporte a filtros.
- `GET /posts/:id`: retorna detalhes de um post.
- `POST /posts`: cria uma publicacao autenticada.
- `POST /posts/:id/likes`: adiciona curtida.
- `DELETE /posts/:id/likes`: remove curtida.
- `POST /posts/:id/comments`: adiciona comentario.

## Scripts Uteis

```bash
pnpm dev              # roda web e API em paralelo
pnpm dev:web          # roda apenas o frontend
pnpm dev:api          # roda apenas o backend
pnpm build            # build de todos os apps
pnpm build:web        # build do frontend
pnpm build:api        # build do backend
pnpm lint             # lint de todos os apps
pnpm lint:web         # lint do frontend
pnpm lint:api         # lint do backend
pnpm test:web         # testes unitarios do frontend
pnpm test:a11y:web    # testes de acessibilidade do frontend
pnpm test:api         # testes unitarios da API
pnpm --filter api test:e2e  # testes e2e da API
```

## Banco De Dados

O banco local roda em PostgreSQL 16 via Docker Compose. O Prisma modela:

- `User`: usuarios cadastrados.
- `Post`: publicacoes do feed.
- `PostTag`: tags associadas a posts.
- `PostLike`: curtidas por usuario.
- `PostComment`: comentarios em publicacoes.

As migrations ficam em `apps/api/prisma/migrations`, e o seed fica em `apps/api/prisma/seed.js`.

## Padroes Do Repositorio

- Frontend em componentes funcionais, ES modules e organizacao por Atomic Design.
- Backend seguindo convencoes REST do NestJS, com controllers finos, services para regras de negocio e DTOs para entrada/saida.
- Dados persistidos em PostgreSQL com Prisma; nao use armazenamento em memoria para dados que precisam sobreviver ao restart.
- Cores do frontend devem usar tokens definidos no tema Tailwind em `apps/web/src/index.css`.
- Commits devem seguir Conventional Commits, como `feat(web): add feed filters` ou `fix(api): validate post author`.

## Qualidade

Antes de abrir um pull request ou entregar uma alteracao relevante, rode:

```bash
pnpm lint
pnpm build
pnpm test:web
pnpm test:api
```

Para mudancas de contrato da API, tambem rode:

```bash
pnpm --filter api test:e2e
```
