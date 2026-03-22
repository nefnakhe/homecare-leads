export interface GuideData {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  heroSubtext: string;
  sections: { heading: string; content: string }[];
}

export const GUIDES: GuideData[] = [
  {
    slug: "paying-for-home-care-without-insurance",
    title: "How to Pay for Home Care Without Insurance",
    metaTitle:
      "How to Pay for Home Care Without Insurance | HomeCare Leads Guide",
    metaDescription:
      "Learn practical ways to pay for home care services without health insurance. Covers private pay, veterans benefits, Medicaid waivers, and more.",
    heroSubtext:
      "A practical guide for families exploring how to afford home care when insurance doesn't cover it.",
    sections: [
      {
        heading: "Understanding the Gap: What Insurance Typically Covers",
        content:
          "Most health insurance plans, including Medicare, provide limited coverage for home care services. Medicare covers skilled nursing and therapy visits after a qualifying hospital stay, but it does not pay for custodial care — the day-to-day help with bathing, dressing, cooking, and companionship that most families need. Private health insurance rarely covers long-term home care either. This leaves millions of families facing out-of-pocket costs for the care their loved ones need to remain safely at home.",
      },
      {
        heading: "Private Pay: The Most Common Path",
        content:
          "Private pay — paying directly out of pocket — is how most families fund home care. In Connecticut, home care aides typically cost $25 to $35 per hour, with rates varying by location, type of care, and agency. For a senior who needs 20 hours of companion care per week, that translates to roughly $2,000 to $2,800 per month. While this is a significant expense, it's often less than assisted living ($4,000-$7,000/month in CT) or nursing home care ($12,000-$15,000/month). Many families fund private-pay care through a combination of retirement savings, pension income, proceeds from downsizing a home, or contributions from multiple family members.",
      },
      {
        heading: "Long-Term Care Insurance",
        content:
          "If your loved one purchased a long-term care insurance (LTCI) policy years ago, it may cover a significant portion of home care costs. LTCI policies typically pay a daily benefit amount — often $100 to $300 per day — after a waiting period of 30 to 90 days. Check the policy details carefully: some require a prior hospitalization, while others activate when the insured person cannot perform two or more activities of daily living (ADLs). Contact the insurance company to understand your benefit amount, elimination period, and any provider requirements.",
      },
      {
        heading: "Veterans Benefits (Aid and Attendance)",
        content:
          "Veterans and surviving spouses of veterans may qualify for the Aid and Attendance pension benefit, which provides up to $2,431 per month for a veteran or $1,318 for a surviving spouse (2024 rates). This benefit is specifically designed to help pay for in-home care. To qualify, the veteran must have served at least 90 days of active duty with at least one day during a wartime period, and the applicant must demonstrate a medical need for assistance with daily activities. The application process can take several months, so start early. Many elder law attorneys and veteran service organizations can help with the paperwork at no cost.",
      },
      {
        heading: "Connecticut Medicaid Home Care Programs",
        content:
          "Connecticut offers several Medicaid waiver programs that can fund home care for eligible residents. The Connecticut Home Care Program for Elders (CHCPE) provides home care services to adults age 65 and older who meet income and functional eligibility requirements. The program covers personal care, homemaker services, companion care, and adult day care. Income limits are higher than traditional Medicaid — you may qualify even with moderate income. Contact the Connecticut Department of Social Services or your local Area Agency on Aging to learn about eligibility and how to apply.",
      },
      {
        heading: "Reverse Mortgages and Home Equity",
        content:
          "For seniors who own their homes, a reverse mortgage can provide a source of funds for home care without requiring monthly repayments. A Home Equity Conversion Mortgage (HECM) allows homeowners age 62 and older to borrow against their home equity, receiving either a lump sum, monthly payments, or a line of credit. The loan is repaid when the homeowner sells, moves out, or passes away. While reverse mortgages have fees and reduce the estate value, they can be a practical way to fund years of home care while allowing the senior to remain in their home.",
      },
      {
        heading: "Tips for Reducing Home Care Costs",
        content:
          "Families can reduce home care costs in several ways. Start with fewer hours and increase as needed — many families begin with 10-15 hours per week. Consider hiring an independent caregiver for non-medical tasks (though you lose the protections that agencies provide). Ask about package rates or long-term discounts. Combine professional care with family caregiving to reduce total hours needed. Look into adult day programs, which cost $60-$80/day in Connecticut and provide structured activities and supervision during work hours, reducing the need for in-home care during the day.",
      },
    ],
  },
  {
    slug: "home-care-costs-connecticut",
    title: "Home Care Costs in Connecticut: What to Expect",
    metaTitle:
      "Home Care Costs in Connecticut (2026) | What Families Should Know",
    metaDescription:
      "Understand the real costs of home care in Connecticut. Hourly rates by care type, city comparisons, and tips to manage expenses.",
    heroSubtext:
      "A transparent look at what home care actually costs in Connecticut, so you can plan with confidence.",
    sections: [
      {
        heading: "Average Home Care Costs in Connecticut",
        content:
          "Connecticut home care costs are above the national average, reflecting the state's higher cost of living. As of 2026, families can expect to pay $28 to $38 per hour for home health aide services through an agency. Companion care and homemaker services are slightly less, typically $25 to $32 per hour. Skilled nursing visits cost more — $45 to $75 per hour for an LPN and $55 to $90 per hour for an RN. For a senior receiving 30 hours per week of personal care, the monthly cost ranges from $3,360 to $4,560. These rates include the agency's overhead for insurance, training, backup staffing, and supervision.",
      },
      {
        heading: "Costs by Region: How Location Affects Price",
        content:
          "Home care costs vary significantly across Connecticut. Fairfield County (Stamford, Greenwich, Norwalk) has the highest rates, with home health aides averaging $35-$42/hour. The Hartford metro area falls in the middle at $28-$35/hour. New Haven County averages $27-$34/hour. Eastern Connecticut and the Litchfield Hills tend to have the lowest agency rates ($25-$32/hour), though availability can be more limited in rural areas. Cities like Waterbury, Meriden, and New Britain tend to be on the more affordable end within their respective counties.",
      },
      {
        heading: "What Affects the Hourly Rate",
        content:
          "Several factors influence what you'll pay for home care. Type of care is the biggest factor — skilled nursing costs 50-100% more than companion care. Scheduling matters too: overnight shifts, weekends, and holidays typically carry a premium of $2-$5/hour. Consistency of schedule (same hours every week vs. on-call) affects pricing. The number of hours per week also matters — most agencies offer lower hourly rates for clients who book 30+ hours per week. Finally, the caregiver's experience and certifications (CNA vs. HHA vs. companion) influence the rate.",
      },
      {
        heading: "Home Care vs. Other Care Options in Connecticut",
        content:
          "To put home care costs in perspective, compare them to alternatives. Assisted living in Connecticut averages $5,200 to $7,500 per month — comparable to 40-60 hours per week of home care. Memory care facilities average $6,500 to $9,000 per month. Nursing homes in Connecticut cost $12,000 to $16,000 per month for a semi-private room. Adult day programs cost $65 to $85 per day. For many families, starting with 15-20 hours per week of home care ($1,500-$3,000/month) provides significant support at a fraction of facility costs, while allowing their loved one to stay in a familiar environment.",
      },
      {
        heading: "How to Get the Best Value",
        content:
          "Finding good value in home care doesn't mean finding the cheapest provider — it means finding the right match. Request detailed pricing breakdowns from multiple agencies. Ask about minimum hour requirements (some agencies require 3-4 hour minimums per visit). Clarify what's included: does the rate cover travel time, care plan development, and supervisor check-ins? Ask about caregiver consistency — having the same aide each visit improves care quality and can reduce the total hours needed as the caregiver learns routines. Finally, start with a needs assessment to avoid paying for more care than necessary.",
      },
      {
        heading: "Financial Planning for Long-Term Care",
        content:
          "The average home care client in Connecticut uses services for 2 to 4 years, so planning ahead is important. Work with a financial advisor or elder law attorney who understands Connecticut's long-term care landscape. Explore whether your loved one qualifies for programs like the Connecticut Home Care Program for Elders (CHCPE), Veterans Aid and Attendance benefits, or Medicaid waiver programs. Consider setting up a dedicated savings account or using a health savings account (HSA) if eligible. Early planning gives families more options and reduces financial stress when care needs increase over time.",
      },
    ],
  },
];

export function getGuideBySlug(slug: string): GuideData | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

export function getAllGuideSlugs(): string[] {
  return GUIDES.map((g) => g.slug);
}
