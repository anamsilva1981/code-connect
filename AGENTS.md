# Repository Guidelines

## Project Structure & Module Organization

This PNPM workspace keeps application code under `apps/*`:

- `apps/web`: React 19 + Vite frontend. Source is in `apps/web/src`, public files are in `apps/web/public`, and styles are in `src/*.css`.
- `apps/api`: NestJS backend. Source is in `apps/api/src`; unit tests sit beside source files as `*.spec.ts`; e2e tests live in `apps/api/test`.
- `assest`: shared logos, icons, and card/general images. Use `apps/web/src/assets` or `apps/web/public` only for web-specific assets.

## Build, Test, and Development Commands

Run commands from the repository root unless noted.

- `pnpm install`: install workspace dependencies.
- `pnpm dev`: run web and API dev servers in parallel.
- `pnpm dev:web` / `pnpm dev:api`: run one app during focused work.
- `pnpm build`: build all workspace apps.
- `pnpm lint`: run each app's lint task.
- `pnpm test:api`: run API unit tests with Jest.
- `pnpm --filter api test:e2e`: run Nest e2e tests.
- `docker compose up -d postgres`: start the local PostgreSQL database with a persistent Docker volume.
- `pnpm --filter api prisma:migrate`: apply Prisma migrations to the local PostgreSQL database.
- `pnpm --filter api prisma:generate`: regenerate the Prisma Client after schema changes.
- `pnpm preview:web`: preview the built Vite app.

## Coding Style & Naming Conventions

Use the existing style in each app. Frontend files use ES modules, function components, two-space indentation, single quotes, and no semicolons. Backend TypeScript follows NestJS conventions, decorators, and semicolons.

Frontend components should follow Atomic Design: atoms, molecules, organisms, templates, and pages. Name components in `PascalCase`, hooks as `useSomething`, and helpers in `camelCase`. Prefer Tailwind utilities for new UI; keep custom CSS for global styles or cases Tailwind cannot express cleanly.

For frontend colors, define and reuse the project palette through Tailwind theme tokens, currently in `apps/web/src/index.css` via `@theme`. Do not use hex colors directly in JSX/Tailwind arbitrary color classes such as `text-[#...]`, `bg-[#...]`, or `border-[#...]`; add or reuse semantic `code-*` color tokens instead. Raw hex values should live only in the palette/theme definition or source assets such as SVGs.

For font sizes, use the closest Tailwind size token (`text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`, etc.) instead of custom pixel/rem classes like `text-[15px]` or CSS `font-size`. Only use arbitrary font sizes when a component has a documented, non-negotiable design requirement and no reasonable token match exists.

Backend code must stay REST-oriented. Model resources with nouns, use HTTP verbs consistently, return appropriate status codes, keep controllers thin, validate DTOs, and avoid action routes such as `/createUser` when `POST /users` fits. In NestJS, keep suffixes like `.controller.ts`, `.service.ts`, `.module.ts`, and `.spec.ts`.

The API persists data with PostgreSQL and Prisma. Keep Prisma schema and migrations under `apps/api/prisma`, use `PrismaService` for database access, and do not introduce in-memory stores for data that must survive process restarts.

The API uses ESLint with Prettier integration. The web app uses `oxlint`.

## Testing Guidelines

API unit tests use Jest and match `*.spec.ts` under `apps/api/src`. E2e tests use `apps/api/test/jest-e2e.json`. Add tests when changing controllers, services, or request/response behavior. Run `pnpm test:api`, or `pnpm --filter api test:cov` for coverage.

Every frontend component needs a test covering essential use: render behavior, important props, and primary interaction when applicable. The web app has no root test command yet, so add or use the local frontend test setup when introducing components, then verify with `pnpm lint:web`, `pnpm build:web`, and manual browser checks.

## Commit & Pull Request Guidelines

Use Conventional Commits for both apps and shared changes: `feat(web): add profile card`, `fix(api): return 404 for missing user`, `test(web): cover button click`, or `docs: update agent guide`. Prefer focused commits by app or feature.

Pull requests should include a summary, test results, linked issue when applicable, and screenshots or recordings for visible UI changes. Call out shared asset, script, or API contract changes.

## Agent-Specific Instructions

Do not overwrite generated assets or unrelated user changes. Keep edits scoped, and prefer workspace commands over package-manager commands inside individual app folders.
