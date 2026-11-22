import Link from "next/link"
import { Header } from "@/src/components/boty/header"
import { Footer } from "@/src/components/boty/footer"
import { PATHS } from "@/src/constants/paths"
import type { ShopProduct } from "@/src/lib/shop-product"
import { getEbookByIdOrSlug } from "@/src/server/ebook/queries"
import { ProductDetail } from "./product-detail"

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const row = await getEbookByIdOrSlug(id)

  if (!row) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="max-w-3xl mx-auto px-6 pt-40 pb-24 text-center">
          <h1 className="font-serif text-3xl mb-4">E-book não encontrado</h1>
          <Link href={PATHS.shop} className="text-primary hover:underline">
            Voltar para a loja
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  const product: ShopProduct = {
    id: row.id,
    slug: row.slug,
    name: row.title,
    description: row.description,
    price: Math.round(row.priceCents / 100),
    priceCents: row.priceCents,
    originalPrice: null,
    image: row.coverUrl ?? "/placeholder.svg",
    badge: null,
    purchasable: row.purchasable,
  }

  return <ProductDetail product={product} />
}
