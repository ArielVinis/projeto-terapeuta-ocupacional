export type EbookCatalogItem = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number | null;
  image: string;
  badge: string | null;
};

/** Catálogo estático de fallback (vitrine quando a DB está vazia — não vendável). */
export const EBOOKS_CATALOG: EbookCatalogItem[] = [
  {
    id: "ebook-integracao-sensorial",
    slug: "ebook-integracao-sensorial",
    name: "E-book Integracao Sensorial",
    description: "Guia completo para pais sobre processamento sensorial",
    price: 47,
    originalPrice: 67,
    image: "/images/products/ebook-sensorial.jpg",
    badge: "Mais Vendido",
  },
  {
    id: "ebook-rotina-visual",
    slug: "ebook-rotina-visual",
    name: "E-book Rotina Visual em Casa",
    description: "Como criar e implementar rotinas visuais",
    price: 37,
    originalPrice: null,
    image: "/images/products/ebook-rotina.jpg",
    badge: "Novo",
  },
  {
    id: "ebook-atividades-motoras",
    slug: "ebook-atividades-motoras",
    name: "E-book Atividades Motoras",
    description: "50 atividades para fazer em casa",
    price: 39,
    originalPrice: null,
    image: "/images/products/ebook-motor.jpg",
    badge: null,
  },
  {
    id: "ebook-entendendo-autismo",
    slug: "ebook-entendendo-autismo",
    name: "E-book Entendendo o Autismo",
    description: "Guia pratico para familias",
    price: 57,
    originalPrice: 79,
    image: "/images/products/ebook-autismo.jpg",
    badge: "Promocao",
  },
];
