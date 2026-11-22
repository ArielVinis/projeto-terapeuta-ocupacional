"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { Header } from "@/src/components/boty/header"
import { Footer } from "@/src/components/boty/footer"
import { useCart } from "@/src/components/boty/cart-context"
import { EBOOKS_CATALOG } from "@/src/lib/ebooks-catalog"

export default function ShopPage() {
  const [isVisible, setIsVisible] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)
  const { addItem } = useCart()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 },
    )
    if (gridRef.current) observer.observe(gridRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="pt-32 pb-16 bg-card">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <span className="text-sm tracking-[0.3em] uppercase text-primary mb-4 block">
            Loja
          </span>
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">
            E-books
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Materiais digitais para apoiar o desenvolvimento em casa
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div
            ref={gridRef}
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {EBOOKS_CATALOG.map((product, index) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className={`group transition-all duration-500 ease-out ${
                  isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
                }`}
                style={{ transitionDelay: `${index * 60}ms` }}
              >
                <div className="bg-card rounded-2xl overflow-hidden vivi-shadow vivi-transition group-hover:scale-[1.02]">
                  <div className="relative aspect-square bg-muted overflow-hidden">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover vivi-transition group-hover:scale-105"
                    />
                    {product.badge && (
                      <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs tracking-wide bg-primary/10 text-primary">
                        {product.badge}
                      </span>
                    )}
                    <button
                      type="button"
                      className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 vivi-transition vivi-shadow"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        addItem({
                          id: product.id,
                          name: product.name,
                          description: product.description,
                          price: product.price,
                          image: product.image,
                        })
                      }}
                      aria-label="Adicionar ao carrinho"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-lg text-foreground mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {product.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">R$ {product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          R$ {product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
