import { createPurchaseFromStripe } from "@/src/server/ebook/mutations";
import { getEbookByIdOrSlug } from "@/src/server/ebook/queries";
import type Stripe from "stripe";

export async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.client_reference_id ?? session.metadata?.userId ?? null;
  if (!userId || !session.id) return;

  const ebookIds = (session.metadata?.ebookIds ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const prices: Record<string, number> = {};
  for (const ebookId of ebookIds) {
    const row = await getEbookByIdOrSlug(ebookId);
    prices[ebookId] = row?.priceCents ?? 0;
  }

  await createPurchaseFromStripe({
    userId,
    stripeSessionId: session.id,
    amountCents: session.amount_total ?? 0,
    ebookIds,
    prices,
  });
}
