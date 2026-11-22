# 12 — Auditoria final

## Checklist do roadmap

- [x] Docs 01–12 criados
- [x] Limpeza deps/UI + Base UI
- [x] Upgrades (stack nova instalada)
- [x] Imagens assets (05 — mapeadas via `ASSETS`)
- [x] Loja só e-books
- [x] Better Auth + Drizzle em `src/server` (+ Google)
- [x] Admin CRUD + Blob hooks
- [x] Stripe checkout card+pix (código + webhook)
- [x] Meus e-books + download autenticado (Blob privado)
- [x] Termos + Privacidade
- [x] Arquitetura modular `src/server/` (sem hexagonal)
- [x] Follow-ups: `PATHS`/`ASSETS`, `src/env.ts`, `proxy.ts`, `SubmitEvent`

## Auditoria de código (2026-11-22) — corrigido

- [x] Open redirect em `callbackUrl` → `safeCallbackUrl`
- [x] Download Blob privado via `GET /api/ebooks/[id]/download` + `get` privado
- [x] `callbackUrl` duplicado no checkout → `requireSession(PATHS.shop)`
- [x] Secrets críticos obrigatórios em produção (`BETTER_AUTH_SECRET`, `DATABASE_URL`)
- [x] Upload PDF: MIME + limite 20 MB
- [x] `ADMIN_EMAIL` bootstrap de admin
- [x] Catch do cart-drawer deixa de forçar login em qualquer erro

## Removido na limpeza

- Kit shadcn/Radix (~55 componentes) e dezenas de `@radix-ui/*`
- Deps scaffold: cmdk, embla, recharts, vaul, tabler, next-themes, date-fns, etc.
- Produtos físicos da loja/grelha/PDP
- Hooks `use-toast` / `use-mobile` mortos
- `styles/globals.css` duplicado

## Validações

- `npx tsc --noEmit` — OK
- `npm run build` — OK (após limpar `.next`)
- Dev server — smoke browser (quando env configurado)

## Pendente operacional (env)

Configurar `.env` (Neon, Better Auth, Google, Stripe, Blob) e `drizzle-kit push` antes de compras reais.

## Status: concluído

Concluído em 2026-11-22.
