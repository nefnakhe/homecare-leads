/**
 * Per-lead pricing — flat rate per confirmed lead.
 *
 * $300  onboarding fee +
 * $2,000 lead fee
 * ─────────────────────
 * $2,300 total per confirmed lead
 *
 * Charges triggered by admin confirmation, not agency acceptance.
 */

export const ONBOARDING_FEE_CENTS = 30000; // $300
export const LEAD_FEE_CENTS = 200000; // $2,000
export const TOTAL_LEAD_CHARGE_CENTS = 230000; // $2,300

export function formatCents(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}
