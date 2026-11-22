# 02 — Limpeza de dependências e UI morta

**Objetivo:** Remover libs e componentes shadcn/Radix não usados pela app; unificar ícones em lucide.

**Acceptance:**

- [x] `src/components/ui/*` mortos removidos
- [x] Pacotes `@radix-ui/*` e deps só-scaffold desinstalados (exceto o necessário ao UI restante)
- [x] `@tabler/icons-react` removido; footer em lucide
- [x] App continua a renderizar home/shop/carrinho
- [x] `styles/globals.css` duplicado apagado

**Verificação:** `npm run lint`; `npm run dev` — home + drawer do carrinho.

**Dependencies:** 01

**Files:** `package.json`, `src/components/ui/**`, `src/components/boty/footer.tsx`, hooks mortos

## Status: concluído

Concluído em 2026-11-22.
