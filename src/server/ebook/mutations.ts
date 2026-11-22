import { db } from "@/src/server/db";
import { ebook, purchase, purchaseItem } from "@/src/server/db/schema";
import { eq } from "drizzle-orm";

function id(prefix: string) {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, "")}`;
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

  const newId = id("eb");
  await db.insert(ebook).values({
    id: newId,
    slug: input.slug,
    title: input.title,
    description: input.description,
    priceCents: input.priceCents,
    coverUrl: input.coverUrl ?? null,
    blobPath: input.blobPath ?? null,
    active: input.active ?? true,
  });
  return newId;
}

export async function createPurchaseFromStripe(input: {
  userId: string;
  stripeSessionId: string;
  amountCents: number;
  ebookIds: string[];
  prices: Record<string, number>;
}) {
  const existing = await db
    .select({ id: purchase.id })
    .from(purchase)
    .where(eq(purchase.stripeSessionId, input.stripeSessionId))
    .limit(1);
  if (existing[0]) return existing[0].id;

  const purchaseId = id("pur");
  await db.insert(purchase).values({
    id: purchaseId,
    userId: input.userId,
    stripeSessionId: input.stripeSessionId,
    amountCents: input.amountCents,
    currency: "brl",
    status: "paid",
  });

  if (input.ebookIds.length) {
    await db.insert(purchaseItem).values(
      input.ebookIds.map((ebookId) => ({
        id: id("pi"),
        purchaseId,
        ebookId,
        priceCents: input.prices[ebookId] ?? 0,
      })),
    );
  }

  return purchaseId;
}
