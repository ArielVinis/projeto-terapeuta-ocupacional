import { db } from "@/src/server/db";
import { ebook, purchase, purchaseItem } from "@/src/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export async function deleteEbookById(id: string) {
  if (!z.uuid().safeParse(id).success) {
    throw new Error("E-book inválido");
  }

  return db.transaction(async (tx) => {
    const [row] = await tx.select().from(ebook).where(eq(ebook.id, id)).limit(1);
    if (!row) return null;

    await tx.delete(purchaseItem).where(eq(purchaseItem.ebookId, id));
    await tx.delete(ebook).where(eq(ebook.id, id));
    return row;
  });
}

export async function upsertEbook(input: {
  id?: string;
  slug: string;
  title: string;
  description: string;
  priceCents: number;
  coverUrl?: string | null;
  blobPath?: string | null;
  active?: boolean;
}) {
  if (input.id) {
    await db
      .update(ebook)
      .set({
        slug: input.slug,
        title: input.title,
        description: input.description,
        priceCents: input.priceCents,
        coverUrl: input.coverUrl ?? null,
        blobPath: input.blobPath ?? null,
        active: input.active ?? true,
      })
      .where(eq(ebook.id, input.id));
    return input.id;
  }

  const [row] = await db
    .insert(ebook)
    .values({
      slug: input.slug,
      title: input.title,
      description: input.description,
      priceCents: input.priceCents,
      coverUrl: input.coverUrl ?? null,
      blobPath: input.blobPath ?? null,
      active: input.active ?? true,
    })
    .returning({ id: ebook.id });

  return row!.id;
}

export async function createPurchaseFromStripe(input: {
  userId: string;
  stripeSessionId: string;
  amountCents: number;
  ebookIds: string[];
  prices: Record<string, number>;
}) {
  const uniqueIds = [...new Set(input.ebookIds)];
  for (const id of uniqueIds) {
    if (!z.uuid().safeParse(id).success) {
      throw new Error(`Invalid ebook id: ${id}`);
    }
  }

  return db.transaction(async (tx) => {
    const existing = await tx
      .select({ id: purchase.id })
      .from(purchase)
      .where(eq(purchase.stripeSessionId, input.stripeSessionId))
      .limit(1);

    if (existing[0]) {
      const purchaseId = existing[0].id;
      const existingItems = await tx
        .select({ ebookId: purchaseItem.ebookId })
        .from(purchaseItem)
        .where(eq(purchaseItem.purchaseId, purchaseId));
      const have = new Set(existingItems.map((item) => item.ebookId));
      const missing = uniqueIds.filter((id) => !have.has(id));
      if (missing.length) {
        await tx.insert(purchaseItem).values(
          missing.map((ebookId) => ({
            purchaseId,
            ebookId,
            priceCents: input.prices[ebookId] ?? 0,
          })),
        );
      }
      return purchaseId;
    }

    const [created] = await tx
      .insert(purchase)
      .values({
        userId: input.userId,
        stripeSessionId: input.stripeSessionId,
        amountCents: input.amountCents,
        currency: "brl",
        status: "paid",
      })
      .returning({ id: purchase.id });

    const purchaseId = created!.id;

    if (uniqueIds.length) {
      await tx.insert(purchaseItem).values(
        uniqueIds.map((ebookId) => ({
          purchaseId,
          ebookId,
          priceCents: input.prices[ebookId] ?? 0,
        })),
      );
    }

    return purchaseId;
  });
}
