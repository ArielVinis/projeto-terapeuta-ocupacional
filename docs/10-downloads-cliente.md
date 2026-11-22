# 10 — Meus e-books + download

**Objetivo:** Página autenticada lista purchases; download via stream autenticado Blob privado.

**Acceptance:**

- [x] `/meus-ebooks` lista entitlements
- [x] Download só com entitlement
- [x] Sem path público permanente do PDF (`GET /api/ebooks/[id]/download` + Blob `get` com `access: "private"`)

**Verificação:** Browser com purchase de teste.

**Dependencies:** 09

**Files:** `src/app/meus-ebooks/**`, `src/app/api/ebooks/[id]/download/**`, `src/server/blob/**`, `src/server/ebook/**`

## Status: concluído

Concluído em 2026-11-22. Correção auditoria: `getDownloadUrl` público substituído por rota autenticada.
