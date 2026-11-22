import { EBOOKS_CATALOG } from "@/src/lib/ebooks-catalog";
import type { ShopProduct } from "@/src/lib/shop-product";
import { db } from "@/src/server/db";
import { ebook, purchase, purchaseItem } from "@/src/server/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";

const uuidSchema = z.uuid();

/** Só DB — usado por checkout, webhook e ownership. */
export async function findEbookInDb(idOrSlug: string) {
  const [bySlug] = await db.select().from(ebook).where(eq(ebook.slug, idOrSlug)).limit(1);
  if (bySlug) return bySlug;

  if (uuidSchema.safeParse(idOrSlug).success) {
    const [byId] = await db.select().from(ebook).where(eq(ebook.id, idOrSlug)).limit(1);
    if (byId) return byId;
  }

  return null;
}

export async function listActiveEbooks(): Promise<ShopProduct[]> {
  try {
    const rows = await db
      .select()
      .from(ebook)
      .where(eq(ebook.active, true))
      .orderBy(desc(ebook.createdAt));
    if (rows.length > 0) {
      return rows.map((row) => ({
        id: row.id,
        slug: row.slug,
        name: row.title,
        description: row.description,
        price: Math.round(row.priceCents / 100),
        priceCents: row.priceCents,
        originalPrice: null,
        image: row.coverUrl ?? "/placeholder.svg",
        badge: null,
        purchasable: true,
      }));
    }
  } catch {
    // DB indisponível → fallback estático
  }
  return EBOOKS_CATALOG.map((item) => ({
    id: item.id,
    slug: item.slug,
    name: item.name,
    description: item.description,
    price: item.price,
    priceCents: item.price * 100,
    originalPrice: item.originalPrice,
    image: item.image,
    badge: item.badge,
    purchasable: false,
  }));
}

export async function listAllEbooksAdmin() {
  return db.select().from(ebook).orderBy(desc(ebook.createdAt));
}

export async function getEbookByIdOrSlug(idOrSlug: string) {
  try {
    const row = await findEbookInDb(idOrSlug);
    if (row) return { ...row, purchasable: true as const };
  } catch {
    // fallback
  }

  const fallback = EBOOKS_CATALOG.find((item) => item.id === idOrSlug || item.slug === idOrSlug);
  if (!fallback) return null;

  return {
    id: fallback.id,
    slug: fallback.slug,
    title: fallback.name,
    description: fallback.description,
    priceCents: fallback.price * 100,
    coverUrl: fallback.image,
    blobPath: null as string | null,
    active: true,
    purchasable: false as const,
  };
}

export async function listUserEntitlements(userId: string) {
  return db
    .select({
      purchaseItemId: purchaseItem.id,
      ebookId: ebook.id,
      title: ebook.title,
      description: ebook.description,
      coverUrl: ebook.coverUrl,
      blobPath: ebook.blobPath,
      purchasedAt: purchase.createdAt,
    })
    .from(purchaseItem)
    .innerJoin(purchase, eq(purchaseItem.purchaseId, purchase.id))
    .innerJoin(ebook, eq(purchaseItem.ebookId, ebook.id))
    .where(eq(purchase.userId, userId))
    .orderBy(desc(purchase.createdAt));
}

export async function userOwnsEbook(userId: string, ebookId: string) {
  const rows = await db
    .select({ id: purchaseItem.id })
    .from(purchaseItem)
    .innerJoin(purchase, eq(purchaseItem.purchaseId, purchase.id))
    .where(and(eq(purchase.userId, userId), eq(purchaseItem.ebookId, ebookId)))
    .limit(1);
  return Boolean(rows[0]);
}
