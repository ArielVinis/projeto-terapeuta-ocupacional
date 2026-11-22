"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ShoppingBag } from "lucide-react"
import { Header } from "@/src/components/boty/header"
import { Footer } from "@/src/components/boty/footer"
import { useCart } from "@/src/components/boty/cart-context"
import { PATHS } from "@/src/constants/paths"
import type { ShopProduct } from "@/src/lib/shop-product"

export function ProductDetail({ product }: { product: ShopProduct }) {
  const { addItem } = useCart()

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <section className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Link
            href={PATHS.shop}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-10"
          >
            <ArrowLeft className="size-4" />
            Voltar para a loja
          </Link>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted vivi-shadow">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div>
              {product.badge && (
                <span className="inline-block mb-4 px-3 py-1 rounded-full text-xs bg-primary/10 text-primary">
                  {product.badge}
                </span>
              )}
              <h1 className="font-serif text-4xl text-foreground mb-4">
                {product.name}
              </h1>
              <p className="text-muted-foreground text-lg mb-6">
                {product.description}
              </p>
              <div className="flex items-center gap-3 mb-8">
                <span className="text-2xl font-medium">R$ {product.price}</span>
                {product.originalPrice && (
                  <span className="text-muted-foreground line-through">
                    R$ {product.originalPrice}
                  </span>
                )}
              </div>
              {product.purchasable ? (
                <button
                  type="button"
                  onClick={() =>
                    addItem({
                      id: product.id,
                      name: product.name,
                      description: product.description,
                      price: product.price,
                      image: product.image,
                    })
                  }
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-medium hover:bg-primary/90 vivi-transition"
                >
                  <ShoppingBag className="size-4" />
                  Adicionar ao carrinho
                </button>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Este e-book ainda não está disponível para compra.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
