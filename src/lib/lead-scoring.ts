/**
 * Lead scoring engine.
 * Scores leads as Hot / Warm / Cold based on urgency, budget, care type, and payment.
 * Returns a total score (0–100) and breakdown factors.
 */

type ScoreInput = {
  urgency: string;
  paymentType: string;
  careType: string;
  budgetMax?: number | null;
  hoursPerWeek?: number | null;
};

type ScoreResult = {
  score: "hot" | "warm" | "cold";
  total: number;
  factors: Record<string, number>;
};

const URGENCY_SCORES: Record<string, number> = {
  immediate: 30,
  within_week: 22,
  within_month: 12,
  exploring: 5,
};

const CARE_TYPE_SCORES: Record<string, number> = {
  skilled_nursing: 20,
  dementia_care: 18,
  post_surgery: 18,
  live_in_care: 16,
  hospice_support: 15,
  personal_care: 12,
  respite_care: 10,
  companion_care: 8,
  other: 6,
};

export function scoreLead(input: ScoreInput): ScoreResult {
  const factors: Record<string, number> = {};

  // Urgency (0-30)
  factors.urgency = URGENCY_SCORES[input.urgency] ?? 5;

  // Payment type — private pay is highest value (0-25)
  factors.payment =
    input.paymentType === "private_pay"
      ? 25
      : input.paymentType === "long_term_care_insurance"
        ? 15
        : 5;

  // Care type complexity (0-20)
  factors.careType = CARE_TYPE_SCORES[input.careType] ?? 6;

  // Budget signal (0-15)
  if (input.budgetMax && input.budgetMax >= 5000) {
    factors.budget = 15;
  } else if (input.budgetMax && input.budgetMax >= 2000) {
    factors.budget = 10;
  } else if (input.budgetMax && input.budgetMax > 0) {
    factors.budget = 5;
  } else {
    factors.budget = 3; // no budget = unknown, slight positive
  }

  // Hours signal (0-10)
  if (input.hoursPerWeek && input.hoursPerWeek >= 40) {
    factors.hours = 10;
  } else if (input.hoursPerWeek && input.hoursPerWeek >= 20) {
    factors.hours = 7;
  } else if (input.hoursPerWeek && input.hoursPerWeek > 0) {
    factors.hours = 4;
  } else {
    factors.hours = 2;
  }

  const total = Object.values(factors).reduce((a, b) => a + b, 0);

  let score: "hot" | "warm" | "cold";
  if (total >= 65) {
    score = "hot";
  } else if (total >= 40) {
    score = "warm";
  } else {
    score = "cold";
  }

  return { score, total, factors };
}
