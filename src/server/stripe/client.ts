import { env } from "@/src/env";
import Stripe from "stripe";

export function getStripe() {
  const key = env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key);
}
