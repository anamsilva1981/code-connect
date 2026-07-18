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
- `pnpm preview:web`: preview the built Vite app.

## Coding Style & Naming Conventions

Use the existing style in each app. Frontend files use ES modules, React function components, two-space indentation, single quotes, and no semicolons. Backend TypeScript follows NestJS conventions, decorators, and semicolons.

Name React components in `PascalCase`, hooks as `useSomething`, and helpers in `camelCase`. In NestJS, keep suffixes such as `.controller.ts`, `.service.ts`, `.module.ts`, and `.spec.ts`.

The API uses ESLint with Prettier integration. The web app uses `oxlint`.

## Testing Guidelines

API unit tests use Jest and match `*.spec.ts` under `apps/api/src`. E2e tests use `apps/api/test/jest-e2e.json`. Add tests when changing controllers, services, or request/response behavior. Use `pnpm test:api` for normal runs and `pnpm --filter api test:cov` for coverage.

The web app has no configured test runner; verify changes with `pnpm lint:web`, `pnpm build:web`, and manual browser checks.

## Commit & Pull Request Guidelines

This repository has no existing commit history yet, so use clear, imperative messages such as `Add API health check` or `Fix web hero spacing`. Prefer focused commits by app or feature.

Pull requests should include a summary, test results, linked issue when applicable, and screenshots or recordings for visible UI changes. Call out shared asset, script, or API contract changes.

## Agent-Specific Instructions

Do not overwrite generated assets or unrelated user changes. Keep edits scoped, and prefer workspace commands over package-manager commands inside individual app folders.
