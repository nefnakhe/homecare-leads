/**
 * Geo-matching engine.
 *
 * Matches qualified leads to agencies based on:
 *  1. Priority Pass status (Priority Pass holders get first pick)
 *  2. ZIP code overlap (geo match)
 *  3. Specialty match
 *
 * All leads are exclusive — matched to 1 agency only.
 * Agencies must be admin-approved to receive leads.
 */

type Agency = {
  id: string;
  name: string;
  email: string;
  serviceAreaZips: string[];
  specialties: string[];
  maxLeadsPerMonth: number;
  currentCapacity: number;
  adminApproved: boolean;
  priorityPassExpiresAt: Date | null;
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
  maxMatches: number = 1
): MatchResult[] {
  const scored: (MatchResult & { hasPriorityPass: boolean })[] = [];

  for (const agency of agencies) {
    // Must be admin-approved
    if (!agency.adminApproved) {
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
        score += 5;
      }
    }

    // Check if Priority Pass is active
    const hasPriorityPass =
      agency.priorityPassExpiresAt !== null &&
      agency.priorityPassExpiresAt > new Date();

    scored.push({
      agencyId: agency.id,
      agencyName: agency.name,
      agencyEmail: agency.email,
      matchScore: score,
      hasPriorityPass,
    });
  }

  // Sort: Priority Pass holders first, then by match score descending
  scored.sort((a, b) => {
    if (a.hasPriorityPass !== b.hasPriorityPass) {
      return a.hasPriorityPass ? -1 : 1;
    }
    return b.matchScore - a.matchScore;
  });

  return scored.slice(0, maxMatches).map((item) => ({
    agencyId: item.agencyId,
    agencyName: item.agencyName,
    agencyEmail: item.agencyEmail,
    matchScore: item.matchScore,
  }));
}
