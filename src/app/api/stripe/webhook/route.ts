import { env } from "@/src/env";
import { getStripe } from "@/src/server/stripe/client";
import { fulfillCheckoutSession } from "@/src/server/stripe/webhook";
import { NextResponse } from "next/server";
import type Stripe from "stripe";

export const runtime = "nodejs";

const FULFILL_EVENTS = new Set([
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
]);

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const secret = env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !secret) {
    return NextResponse.json({ error: "Webhook misconfigured" }, { status: 400 });
  }

  const body = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (FULFILL_EVENTS.has(event.type)) {
    const session = event.data.object as Stripe.Checkout.Session;
    await fulfillCheckoutSession(session);
  }

  // async_payment_failed / expired: só ACK — sem liberar acesso
  return NextResponse.json({ received: true });
}
