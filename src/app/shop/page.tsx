import { Header } from "@/src/components/boty/header"
import { Footer } from "@/src/components/boty/footer"
import { listActiveEbooks } from "@/src/server/ebook/queries"
import { ShopGrid } from "./shop-grid"

export default async function ShopPage() {
  const products = await listActiveEbooks()

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
          <ShopGrid products={products} />
        </div>
      </section>

      <Footer />
    </main>
  )
}
