import { createPurchaseFromStripe } from "@/src/server/ebook/mutations";
import { findEbookInDb } from "@/src/server/ebook/queries";
import type Stripe from "stripe";

/** Libera e-books só quando o pagamento está confirmado (cartão ou Pix). */
export async function fulfillCheckoutSession(session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid") return;

  const userId = session.client_reference_id ?? session.metadata?.userId ?? null;
  if (!userId || !session.id) return;

  const ebookIds = (session.metadata?.ebookIds ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const prices: Record<string, number> = {};
  for (const ebookId of ebookIds) {
    const row = await findEbookInDb(ebookId);
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
