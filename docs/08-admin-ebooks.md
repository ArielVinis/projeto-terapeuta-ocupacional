# 08 — Admin CRUD e-books + Vercel Blob

**Objetivo:** Admin cria/atualiza e-books; PDF em Blob privado; preço BRL centavos.

**Acceptance:**

- [x] Tabela `ebook`
- [x] CRUD protegido por role admin (ou `ADMIN_EMAIL`)
- [x] Upload PDF via Blob privado
- [x] Validação MIME/tamanho (PDF, máx. 20 MB)

**Verificação:** Lint; admin UI com env Blob.

**Dependencies:** 07

**Files:** `src/server/ebook/**`, `src/server/blob/**`, `src/app/admin/**`, `src/server/actions/ebooks.ts`

## Status: concluído

Concluído em 2026-11-22.
