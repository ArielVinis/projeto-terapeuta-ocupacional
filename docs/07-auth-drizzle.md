# 07 — Better Auth + Drizzle + Neon em `src/server`

**Objetivo:** Postgres (Neon) + Drizzle + Better Auth (email/password + Google); roles; seed admin; atualizar rules.

**Acceptance:**

- [x] Schema auth + role em Drizzle
- [x] Login/registo email e Google
- [x] Guards `/admin/*` e `/meus-ebooks` (`src/proxy.ts` + `requireSession`/`requireAdmin`)
- [x] `.env.example` e `project-core.mdc` (Drizzle + `src/server/`)
- [x] `src/env.ts` (Zod) ligado a auth/db
- [x] `callbackUrl` sanitizado (anti open-redirect)
- [x] `ADMIN_EMAIL` usado como bootstrap de admin

**Verificação:** Lint; fluxo login no browser (com env).

**Dependencies:** 06

**Files:** `src/server/**`, `src/app/login/**`, `src/proxy.ts`, `src/env.ts`, `.env.example`, `.cursor/rules/project-core.mdc`

## Status: concluído

Concluído em 2026-11-22.
