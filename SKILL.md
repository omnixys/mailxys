<!-- repository: projects/omnimail | kind: PROJECT_NEXTJS | stack: nextjs -->

# omnimail — Skill: Next.js Project Development

> Workflow for omnimail (projects/omnimail). Execute this workflow before, during, and
> after changes in this repository.

## Repository Facts

- Kind: Next.js Project
- Package: `omnimail (Next.js)` (version: ?)
- Runtime: Next.js 16 + React 19 + TypeScript
- Description: Omnixys Omnimail frontend (Next.js 16, MUI, Apollo + codegen, TanStack Query, Zustand, next-intl).
- Architecture: src/app (App Router), src/api, src/assets, src/auth, src/components, src/constants, src/generated, src/hooks, src/lib
- Database: n/a; Migrations: n/a
- API: GraphQL (Apollo Client + graphql-codegen)
- Messaging: n/a
- Tests: none defined


## Workflow

### 1. Understand the change

- This is a client-side Next.js 16 + React 19 + TypeScript project (App Router).
- Respect the server/client boundary: components and hooks must mark `"use client"`
  when they rely on browser-only APIs.

### 2. Implement

- Preserve responsive behavior and accessibility (semantic HTML, focus states,
  keyboard navigation, adequate contrast).
- Follow the existing component and directory conventions in `src/app (App Router), src/api, src/assets, src/auth, src/components, src/constants, src/generated, src/hooks, src/lib`.
- For Apollo/graphql-codegen projects: never hand-edit generated GraphQL output —
  regenerate with the repository's codegen command and commit only when the repository
  convention requires it.

### 3. Write tests

  - No test suite is defined in this repository; record as NOT RUN with a reason.


### 4. Validate

## Validation

Run each applicable check and record the result as `PASS`, `FAIL`, `PRE-EXISTING
FAILURE`, or `NOT RUN` (with a reason). Never convert `NOT RUN` into `PASS`.

  - `pnpm install --frozen-lockfile`
  - `pnpm exec biome check .  (check-only; never run `biome check --write` against existing work)`
  - `pnpm exec biome check .  (check-only)`
  - `pnpm exec tsc --noEmit`
  - `pnpm build (next build)`
  - `pnpm lint && pnpm exec tsc --noEmit && pnpm build`

## Commit

- Use Conventional Commits (`<type>(<scope>): <summary>`), e.g. `feat`, `fix`, `refactor`, `test`, `docs`, `build`, `ci`, `perf`.
- Stage only files belonging to the logical change. Run `git diff --check` before committing.
- Commit locally; never push.

## Definition of Done

See the "Definition of Done" section in `AGENTS.md`. Before finishing, confirm
`AGENTS.md` and `SKILL.md` remain accurate for this repository.
