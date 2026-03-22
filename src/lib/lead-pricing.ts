/**
 * Per-lead pricing — flat rate per confirmed lead.
 *
 * $300 onboarding fee +
 * $997 lead fee
 * ─────────────────────
 * $1,297 total per confirmed lead
 *
 * Charges triggered by admin confirmation, not agency acceptance.
 */

export const ONBOARDING_FEE_CENTS = 30000; // $300
export const LEAD_FEE_CENTS = 99700; // $997
export const TOTAL_LEAD_CHARGE_CENTS = 129700; // $1,297

export function formatCents(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}
