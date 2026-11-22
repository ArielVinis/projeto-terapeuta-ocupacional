export type ShopProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  priceCents: number;
  originalPrice: number | null;
  image: string;
  badge: string | null;
  /** false = catálogo estático (vitrine); não pode ir ao Stripe */
  purchasable: boolean;
};
