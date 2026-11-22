import { getStripe } from "./client";

export async function createEbookCheckoutSession(input: {
  userId: string;
  userEmail: string;
  items: Array<{ id: string; name: string; priceCents: number }>;
  successUrl: string;
  cancelUrl: string;
}) {
  const stripe = getStripe();
  return stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: input.userEmail,
    client_reference_id: input.userId,
    payment_method_types: ["card", "pix"],
    line_items: input.items.map((item) => ({
      quantity: 1,
      price_data: {
        currency: "brl",
        unit_amount: item.priceCents,
        product_data: {
          name: item.name,
          metadata: { ebookId: item.id },
        },
      },
    })),
    metadata: {
      userId: input.userId,
      ebookIds: input.items.map((i) => i.id).join(","),
    },
    success_url: input.successUrl,
    cancel_url: input.cancelUrl,
  });
}
