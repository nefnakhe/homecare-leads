/**
 * Geo-matching engine.
 * Matches qualified leads to agencies based on ZIP code overlap and specialty match.
 * Returns up to maxMatches agencies sorted by match quality.
 */

type Agency = {
  id: string;
  name: string;
  email: string;
  serviceAreaZips: string[];
  specialties: string[];
  maxLeadsPerMonth: number;
  currentCapacity: number;
  subscriptionStatus: string | null;
};

type MatchResult = {
  agencyId: string;
  agencyName: string;
  agencyEmail: string;
  matchScore: number; // 0-100
};

export function matchLeadToAgencies(
  leadZip: string,
  leadCareType: string,
  agencies: Agency[],
  maxMatches: number = 3
): MatchResult[] {
  const scored: MatchResult[] = [];

  for (const agency of agencies) {
    // Must have active subscription
    if (agency.subscriptionStatus !== "active" && agency.subscriptionStatus !== "trialing") {
      continue;
    }

    // Must have capacity
    if (agency.currentCapacity >= agency.maxLeadsPerMonth) {
      continue;
    }

    let score = 0;

    // ZIP match (0-60 points)
    if (agency.serviceAreaZips.includes(leadZip)) {
      score += 60;
    } else {
      // Check ZIP prefix match (same area code region)
      const leadPrefix = leadZip.substring(0, 3);
      const hasNearbyZip = agency.serviceAreaZips.some(
        (z) => z.substring(0, 3) === leadPrefix
      );
      if (hasNearbyZip) {
        score += 30;
      } else {
        // No geo overlap at all — skip this agency
        continue;
      }
    }

    // Specialty match (0-40 points)
    if (agency.specialties.includes(leadCareType)) {
      score += 40;
    } else {
      // Partial credit for related care types
      const relatedTypes: Record<string, string[]> = {
        personal_care: ["companion_care", "live_in_care"],
        companion_care: ["personal_care", "respite_care"],
        skilled_nursing: ["post_surgery", "hospice_support"],
        dementia_care: ["personal_care", "live_in_care"],
        post_surgery: ["skilled_nursing", "personal_care"],
        live_in_care: ["personal_care", "companion_care"],
        hospice_support: ["skilled_nursing", "personal_care"],
        respite_care: ["companion_care", "personal_care"],
      };

      const related = relatedTypes[leadCareType] ?? [];
      const hasRelated = agency.specialties.some((s) => related.includes(s));
      if (hasRelated) {
        score += 20;
      } else {
        score += 5; // minimal credit — agency is in area but not specialized
      }
    }

    scored.push({
      agencyId: agency.id,
      agencyName: agency.name,
      agencyEmail: agency.email,
      matchScore: score,
    });
  }

  // Sort by match score descending, take top N
  return scored
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, maxMatches);
}
