/**
 * Per-lead pricing by care type.
 *
 * Base rates (cents):
 *   $75  — companion_care, personal_care, respite_care, other
 *   $150 — skilled_nursing, post_surgery, dementia_care
 *   $200 — live_in_care, hospice_support
 *
 * Exclusive leads: +50% surcharge
 */

const BASE_PRICES_CENTS: Record<string, number> = {
  companion_care: 7500,
  personal_care: 7500,
  respite_care: 7500,
  other: 7500,
  skilled_nursing: 15000,
  post_surgery: 15000,
  dementia_care: 15000,
  live_in_care: 20000,
  hospice_support: 20000,
};

export function getLeadPriceCents(careType: string, isExclusive: boolean): number {
  const base = BASE_PRICES_CENTS[careType] ?? 7500;
  return isExclusive ? Math.round(base * 1.5) : base;
}

export function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
