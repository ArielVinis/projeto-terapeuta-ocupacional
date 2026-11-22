# 09b — Stripe CLI (webhook local)

**Objetivo:** Documentar `stripe listen` / forward para `/api/stripe/webhook`.

**Acceptance:**

- [x] Notas de CLI e `STRIPE_WEBHOOK_SECRET`
- [x] Card + Pix; boleto desligado

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copia o `whsec_...` para `STRIPE_WEBHOOK_SECRET` no `.env`.

**Verificação:** Webhook local recebe eventos em test mode.

**Dependencies:** 09

**Files:** este doc, `.env.example`

## Status: concluído

Concluído em 2026-11-22.
