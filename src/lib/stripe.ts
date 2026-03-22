import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe() {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-02-25.clover",
      typescript: true,
    });
  }
  return _stripe;
}

// Lazy proxy
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export const PLANS = {
  starter: {
    name: "Starter",
    price: 149,
    priceId: process.env.STRIPE_PRICE_ID_STARTER || "",
    leads: 10,
    features: [
      "Up to 10 leads/month",
      "Email notifications",
      "Basic lead details",
      "Standard support",
    ],
  },
  growth: {
    name: "Growth",
    price: 349,
    priceId: process.env.STRIPE_PRICE_ID_GROWTH || "",
    leads: 30,
    features: [
      "Up to 30 leads/month",
      "SMS + email notifications",
      "Full lead details with care assessment",
      "Priority lead delivery",
      "Priority support",
    ],
  },
  premium: {
    name: "Premium",
    price: 699,
    priceId: process.env.STRIPE_PRICE_ID_PREMIUM || "",
    leads: 75,
    features: [
      "Up to 75 leads/month",
      "Instant SMS + email notifications",
      "Full lead details with care assessment",
      "First-priority lead delivery",
      "Exclusive territory options",
      "Dedicated account manager",
    ],
  },
} as const;
