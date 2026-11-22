"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "./cart-context";
import { PATHS } from "@/src/constants/paths";
import type { ShopProduct } from "@/src/lib/shop-product";

export function ProductGrid({ products }: { products: ShopProduct[] }) {
  const [isVisible, setIsVisible] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();

  useEffect(() => {
    products.forEach((product) => {
      const img = new window.Image();
      img.src = product.image;
    });
  }, [products]);

  useEffect(() => {
    const gridObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 },
    );

    const headerObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHeaderVisible(true);
      },
      { threshold: 0.1 },
    );

    if (gridRef.current) gridObserver.observe(gridRef.current);
    if (headerRef.current) headerObserver.observe(headerRef.current);

    return () => {
      gridObserver.disconnect();
      headerObserver.disconnect();
    };
  }, []);

  return (
    <section id="materiais" className="py-24 bg-card">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div ref={headerRef} className="text-center mb-16">
          <span
            className={`text-sm tracking-[0.3em] uppercase text-primary mb-4 block ${headerVisible ? "animate-blur-in opacity-0" : "opacity-0"}`}
            style={
              headerVisible
                ? { animationDelay: "0.2s", animationFillMode: "forwards" }
                : {}
            }
          >
            E-books
          </span>
          <h2
            className={`font-serif leading-tight text-foreground mb-4 text-balance text-4xl md:text-5xl ${headerVisible ? "animate-blur-in opacity-0" : "opacity-0"}`}
            style={
              headerVisible
                ? { animationDelay: "0.4s", animationFillMode: "forwards" }
                : {}
            }
          >
            Recursos digitais para o desenvolvimento
          </h2>
          <p
            className={`text-lg text-muted-foreground max-w-xl mx-auto ${headerVisible ? "animate-blur-in opacity-0" : "opacity-0"}`}
            style={
              headerVisible
                ? { animationDelay: "0.6s", animationFillMode: "forwards" }
                : {}
            }
          >
            E-books selecionados para potencializar a terapia e continuar o
            trabalho em casa
          </p>
        </div>

        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <Link
              key={product.id}
              href={PATHS.product(product.slug)}
              className={`group transition-all duration-500 ease-out ${
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <div className="bg-background rounded-2xl overflow-hidden vivi-shadow vivi-transition group-hover:scale-[1.02]">
                <div className="relative aspect-square bg-muted overflow-hidden">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover vivi-transition group-hover:scale-105"
                  />
                  {product.badge && (
                    <span
                      className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs tracking-wide ${
                        product.badge === "Promocao"
                          ? "bg-destructive/10 text-destructive"
                          : product.badge === "Novo"
                            ? "bg-primary/10 text-primary"
                            : "bg-accent text-accent-foreground"
                      }`}
                    >
                      {product.badge}
                    </span>
                  )}
                  {product.purchasable && (
                    <button
                      type="button"
                      className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 vivi-transition vivi-shadow"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addItem({
                          id: product.id,
                          name: product.name,
                          description: product.description,
                          price: product.price,
                          image: product.image,
                        });
                      }}
                      aria-label="Adicionar ao carrinho"
                    >
                      <ShoppingBag className="w-4 h-4 text-foreground" />
                    </button>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="font-serif text-lg text-foreground mb-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {product.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">
                      R$ {product.price}
                    </span>
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

        <div className="text-center mt-12">
          <Link
            href={PATHS.shop}
            className="inline-flex items-center justify-center gap-2 bg-transparent border border-foreground/20 text-foreground px-8 py-4 rounded-full text-sm tracking-wide vivi-transition hover:bg-foreground/5"
          >
            Ver todos os e-books
          </Link>
        </div>
      </div>
    </section>
  );
}
