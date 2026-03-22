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

// Priority Pass: $197 one-time for 3 months of priority lead delivery
export const PRIORITY_PASS = {
  name: "Priority Pass",
  price: 197,
  priceCents: 19700,
  durationMonths: 3,
  priceId: process.env.STRIPE_PRICE_ID_PRIORITY_PASS || "",
} as const;

// Per-lead pricing: flat rate charged on admin confirmation
export const LEAD_FEES = {
  onboardingFeeCents: 30000, // $300 onboarding fee per lead
  leadFeeCents: 99700, // $997 lead fee per lead
  totalCents: 129700, // $1,297 total per confirmed lead
} as const;
