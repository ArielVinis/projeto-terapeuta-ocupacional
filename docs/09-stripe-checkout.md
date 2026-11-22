# 09 — Stripe Checkout (card + Pix)

**Objetivo:** Checkout autenticado; BRL; card+pix; webhook → entitlements.

**Acceptance:**

- [x] Sem sessão → redirect login (`requireSession(PATHS.shop)` sem callback duplicado)
- [x] Session Stripe com payment methods card+pix
- [x] Webhook idempotente cria purchase/items
- [x] Docs Stripe CLI
- [x] Erros de checkout não redirecionam erroneamente para login

**Verificação:** Stripe test mode + CLI webhook.

**Dependencies:** 08

**Files:** `src/server/stripe/**`, `src/app/api/stripe/webhook/**`, cart checkout CTA

## Status: concluído

Concluído em 2026-11-22.
