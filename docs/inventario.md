# Inventário (fatia 01)

**Arquitetura:** modular em `src/server/` (sem hexagonal formal).  
**Graphify Cloud:** indexa `clinic-system`, não este repo. CLI local `graphify` disponível; inventário abaixo via análise de código.

## Rotas

| Rota            | Ficheiro                        | Notas                       |
| --------------- | ------------------------------- | --------------------------- |
| `/`             | `src/app/page.tsx`              | Landing                     |
| `/shop`         | `src/app/shop/page.tsx`         | Catálogo (físicos + ebooks) |
| `/product/[id]` | `src/app/product/[id]/page.tsx` | PDP (só 6 físicos)          |

## Commerce

- Catálogo duplicado: `product-grid.tsx`, `shop/page.tsx`, `product/[id]/page.tsx`
- Carrinho: `cart-context.tsx` (memória) + `cart-drawer.tsx` (vaul)
- Sem auth, DB, Stripe, admin, downloads

## UI usada pela app

- Único import `@/components/ui`: `drawer` (via cart-drawer)
- Hooks `use-toast` / `use-mobile`: não usados pela app

## Deps a remover (scaffold)

Radix (todos), cmdk, embla, recharts, input-otp, react-day-picker, react-resizable-panels, date-fns, next-themes (se não montado), @tabler/icons-react, @hookform/_ (até admin), maioria de `ui/_`

## Deps a manter / adicionar depois

next, react, lucide, vaul, clsx, tailwind-merge, cva, zod, sonner; depois: better-auth, drizzle, stripe, @vercel/blob, @base-ui/\*
## Status: concluído

Concluído em 2026-11-22.
