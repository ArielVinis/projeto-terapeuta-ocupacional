import { Header } from "@/src/components/boty/header";
import { Hero } from "@/src/components/boty/hero";
import { TrustBadges } from "@/src/components/boty/trust-badges";
import { AboutMe } from "@/src/components/boty/about-me";
import { ProductGrid } from "@/src/components/boty/product-grid";
import { CTABanner } from "@/src/components/boty/cta-banner";
import { Footer } from "@/src/components/boty/footer";
import { listActiveEbooks } from "@/src/server/ebook/queries";

export default async function HomePage() {
  const products = await listActiveEbooks();

  return (
    <main>
      <Header />
      <Hero />
      <TrustBadges />
      <ProductGrid products={products} />
      <AboutMe />
      <CTABanner />
      <Footer />
    </main>
  );
}
