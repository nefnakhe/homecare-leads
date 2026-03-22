export interface CityData {
  slug: string;
  name: string;
  state: string;
  county: string;
  population: string;
  zipCodes: string[];
  heroHeadline: string;
  heroSubtext: string;
  localContent: string;
  seniorStats: string;
  careInsights: string;
  metaTitle: string;
  metaDescription: string;
}

export const CT_CITIES: CityData[] = [
  {
    slug: "waterbury-ct",
    name: "Waterbury",
    state: "CT",
    county: "New Haven County",
    population: "114,403",
    zipCodes: ["06701", "06702", "06704", "06705", "06706", "06708", "06710"],
    heroHeadline: "Home Care Services in Waterbury, Connecticut",
    heroSubtext:
      "Find trusted, affordable home care for your loved one in the Waterbury area. We connect families with vetted private-pay home care agencies.",
    localContent:
      "Waterbury, known as the Brass City, is the largest city in the Naugatuck Valley and one of Connecticut's most diverse communities. With a growing senior population concentrated in neighborhoods like Town Plot, Bunker Hill, and the East End, many families are searching for reliable home care. Local resources like the Waterbury Senior Center and the Greater Waterbury YMCA support aging residents, but personalized in-home care often makes the biggest difference in quality of life.",
    seniorStats:
      "Approximately 16% of Waterbury residents are age 65 or older, with many living independently and needing part-time or full-time home care assistance. The city's affordable cost of living relative to coastal Connecticut makes private-pay home care a viable option for many families.",
    careInsights:
      "Waterbury families frequently seek companion care and personal care services due to the city's older housing stock, which can present mobility challenges. Dementia care demand has risen steadily as the population ages. Agencies serving Waterbury typically cover surrounding towns like Wolcott, Prospect, and Middlebury.",
    metaTitle:
      "Home Care in Waterbury, CT | Find Private-Pay Home Care Agencies",
    metaDescription:
      "Find trusted private-pay home care agencies in Waterbury, CT. Compare services, get matched with vetted providers, and request care today.",
  },
  {
    slug: "meriden-ct",
    name: "Meriden",
    state: "CT",
    county: "New Haven County",
    population: "60,850",
    zipCodes: ["06450", "06451"],
    heroHeadline: "Home Care Services in Meriden, Connecticut",
    heroSubtext:
      "Connecting Meriden families with quality home care providers who understand your community's needs.",
    localContent:
      "Meriden sits at the geographic center of Connecticut, making it a hub for families seeking home care across the state. The city's Silver City heritage reflects its manufacturing roots, and today its residents benefit from access to MidState Medical Center and the Meriden Senior Center. Neighborhoods like South Meriden, Yalesville, and the downtown area are home to many seniors who prefer aging in place over institutional care.",
    seniorStats:
      "About 17% of Meriden's population is 65 or older. The city has seen growing demand for home health aides as its Baby Boomer generation transitions into retirement, particularly in the areas surrounding Broad Street and East Main Street.",
    careInsights:
      "Meriden families commonly request post-surgery rehab care and skilled nursing visits, likely influenced by proximity to MidState Medical Center. Companion care is popular among seniors who live alone in the city's many single-family homes. Home care agencies serving Meriden often also cover Wallingford, Durham, and Middletown.",
    metaTitle:
      "Home Care in Meriden, CT | Find Private-Pay Home Care Agencies",
    metaDescription:
      "Find trusted private-pay home care agencies in Meriden, CT. Get matched with qualified providers for personal care, companion care, and more.",
  },
  {
    slug: "middletown-ct",
    name: "Middletown",
    state: "CT",
    county: "Middlesex County",
    population: "47,717",
    zipCodes: ["06457", "06459"],
    heroHeadline: "Home Care Services in Middletown, Connecticut",
    heroSubtext:
      "Quality home care for Middletown families. Get matched with experienced agencies in the heart of Connecticut.",
    localContent:
      "Middletown is a vibrant city on the Connecticut River, home to Wesleyan University and Middlesex Health, one of the state's leading health systems. The city's mix of historic neighborhoods like the South Green, Westfield, and Maromas provide diverse living environments for seniors. Middletown's strong healthcare infrastructure, including the Connecticut Valley Hospital campus, makes it a natural center for home care services in Middlesex County.",
    seniorStats:
      "Approximately 15% of Middletown residents are seniors. The presence of Middlesex Health's continuum of care means many older adults transition from hospital stays to in-home care, creating consistent demand for skilled nursing and personal care aides.",
    careInsights:
      "Middletown's proximity to major healthcare facilities drives demand for post-hospitalization home care and skilled nursing. Many families also seek live-in care arrangements due to the city's quieter residential neighborhoods. Agencies here typically serve Portland, Cromwell, Durham, and East Hampton.",
    metaTitle:
      "Home Care in Middletown, CT | Find Private-Pay Home Care Agencies",
    metaDescription:
      "Find private-pay home care agencies in Middletown, CT. Compare providers, read about local services, and submit a care request today.",
  },
  {
    slug: "torrington-ct",
    name: "Torrington",
    state: "CT",
    county: "Litchfield County",
    population: "35,515",
    zipCodes: ["06790"],
    heroHeadline: "Home Care Services in Torrington, Connecticut",
    heroSubtext:
      "Reliable home care in Torrington and the Litchfield Hills. We help families find the right care, close to home.",
    localContent:
      "Torrington is the largest city in Litchfield County and serves as the commercial center for northwest Connecticut's rural communities. Charlotte Hungerford Hospital (now part of Hartford HealthCare) anchors local healthcare, while the Torrington Senior Center and Northwest CT Area Agency on Aging provide vital elder services. The city's New England character and small-town feel make aging in place a priority for many families in the Litchfield Hills region.",
    seniorStats:
      "Nearly 20% of Torrington's population is 65 or older — one of the highest rates in Connecticut. The rural nature of surrounding towns means many seniors face transportation barriers, making in-home care especially critical for maintaining independence.",
    careInsights:
      "Torrington families often need help bridging the gap between rural isolation and access to services. Companion care and transportation assistance are in high demand. Due to the area's geography, finding agencies willing to travel to outlying areas like Goshen, Norfolk, and Colebrook can be challenging — our matching service helps solve this.",
    metaTitle:
      "Home Care in Torrington, CT | Find Private-Pay Home Care Agencies",
    metaDescription:
      "Find private-pay home care agencies in Torrington and the Litchfield Hills, CT. Get matched with trusted providers for in-home care.",
  },
  {
    slug: "norwich-ct",
    name: "Norwich",
    state: "CT",
    county: "New London County",
    population: "40,125",
    zipCodes: ["06360", "06365", "06380"],
    heroHeadline: "Home Care Services in Norwich, Connecticut",
    heroSubtext:
      "Find compassionate home care in Norwich and eastern Connecticut. Trusted agencies, personalized matching.",
    localContent:
      "Norwich, the Rose of New England, is a historic city at the confluence of the Yantic, Shetucket, and Thames rivers in eastern Connecticut. The city is home to William W. Backus Hospital and the Otis Library, community anchors that serve the region's aging population. Norwich's diverse neighborhoods — from the historic downtown to Taftville and Greeneville — house many seniors who value their independence and community connections.",
    seniorStats:
      "About 18% of Norwich residents are 65 or older. Eastern Connecticut generally has fewer home care options than the Hartford or New Haven corridors, making quality matching especially valuable for Norwich families.",
    careInsights:
      "Norwich families frequently seek personal care and dementia care services. The presence of VA facilities in the region also creates demand for home care among veterans. Agencies serving Norwich often cover Montville, Ledyard, Preston, and portions of Windham County, providing critical coverage to underserved rural areas.",
    metaTitle:
      "Home Care in Norwich, CT | Find Private-Pay Home Care Agencies",
    metaDescription:
      "Find private-pay home care agencies in Norwich and eastern CT. Get matched with vetted providers for personal care, dementia care, and more.",
  },
  {
    slug: "new-britain-ct",
    name: "New Britain",
    state: "CT",
    county: "Hartford County",
    population: "74,135",
    zipCodes: ["06050", "06051", "06052", "06053"],
    heroHeadline: "Home Care Services in New Britain, Connecticut",
    heroSubtext:
      "Connecting New Britain families with affordable, high-quality home care agencies in the Hartford metro area.",
    localContent:
      "New Britain, the Hardware City, is one of Connecticut's most culturally diverse cities, with a large Polish-American and Latino community. The Hospital of Central Connecticut serves as the primary healthcare facility, while the New Britain Senior Center offers robust programming for older adults. Neighborhoods like the West End, East Side, and Stanley Quarter provide comfortable residential settings where many seniors prefer to age in place rather than move to assisted living facilities.",
    seniorStats:
      "Approximately 14% of New Britain's population is 65 or older. The city's diverse population means many seniors speak Spanish or Polish as a primary language — bilingual home care aides are often specifically requested by families.",
    careInsights:
      "New Britain's cultural diversity drives demand for bilingual caregivers, particularly Spanish-speaking aides. Personal care and companion care are the most requested services. The city's central location means agencies often also serve Plainville, Berlin, Farmington, and Newington, expanding care options for families.",
    metaTitle:
      "Home Care in New Britain, CT | Find Private-Pay Home Care Agencies",
    metaDescription:
      "Find private-pay home care agencies in New Britain, CT. Bilingual caregivers available. Get matched with trusted providers today.",
  },
  {
    slug: "bristol-ct",
    name: "Bristol",
    state: "CT",
    county: "Hartford County",
    population: "60,833",
    zipCodes: ["06010", "06011"],
    heroHeadline: "Home Care Services in Bristol, Connecticut",
    heroSubtext:
      "Trusted home care agencies in Bristol and the surrounding Farmington Valley. Quality care, close to home.",
    localContent:
      "Bristol is best known as the home of ESPN and Lake Compounce, but it's also a community with deep roots and a strong sense of neighborhood identity. Bristol Hospital provides local healthcare, and the Bristol Senior Center on North Main Street is a hub for the city's active older adult community. The West End, Forestville, and Edgewood neighborhoods are home to many long-time residents who want to stay in the homes where they raised their families.",
    seniorStats:
      "About 17% of Bristol's residents are age 65 or older. Many are longtime homeowners in established neighborhoods, making in-home care a natural choice over relocation to assisted living or nursing facilities.",
    careInsights:
      "Bristol families often seek personal care and respite care services. The city's suburban layout with single-family homes lends itself well to live-in and overnight care arrangements. Home care agencies serving Bristol also typically cover Burlington, Plainville, Plymouth, and Terryville.",
    metaTitle:
      "Home Care in Bristol, CT | Find Private-Pay Home Care Agencies",
    metaDescription:
      "Find private-pay home care agencies in Bristol, CT. Compare providers for personal care, companion care, and skilled nursing services.",
  },
  {
    slug: "enfield-ct",
    name: "Enfield",
    state: "CT",
    county: "Hartford County",
    population: "42,141",
    zipCodes: ["06082", "06083"],
    heroHeadline: "Home Care Services in Enfield, Connecticut",
    heroSubtext:
      "Find trusted home care in Enfield and the Connecticut-Massachusetts border region.",
    localContent:
      "Enfield sits on the Connecticut-Massachusetts border, giving families access to care providers in both states. The town has a suburban character with a mix of historic villages — Thompsonville, Hazardville, and Scitico — each with its own identity. Johnson Memorial Hospital and the Enfield Senior Center serve as community healthcare anchors. Enfield's location along I-91 provides convenient access to both Hartford and Springfield healthcare systems.",
    seniorStats:
      "About 16% of Enfield's population is 65 or older. The town's proximity to the Massachusetts border means some families explore care options in both states, though Connecticut-licensed agencies are required for care delivered in CT.",
    careInsights:
      "Enfield families often seek companion care and personal care for seniors aging in place in the town's many single-family homes and condo communities. The town's border location is unique — families sometimes need guidance on licensing requirements for cross-state care. Agencies serving Enfield also cover Suffield, Somers, and East Windsor.",
    metaTitle:
      "Home Care in Enfield, CT | Find Private-Pay Home Care Agencies",
    metaDescription:
      "Find private-pay home care agencies in Enfield, CT. Get matched with trusted providers near the CT-MA border.",
  },
  {
    slug: "shelton-ct",
    name: "Shelton",
    state: "CT",
    county: "Fairfield County",
    population: "41,692",
    zipCodes: ["06484"],
    heroHeadline: "Home Care Services in Shelton, Connecticut",
    heroSubtext:
      "Quality home care in Shelton and the lower Naugatuck Valley. Vetted agencies, personalized to your needs.",
    localContent:
      "Shelton is a growing suburban city in Fairfield County's Naugatuck Valley, known for its excellent quality of life and strong community bonds. Griffin Health serves the area from nearby Derby, and the Shelton Senior Center on Meadow Street provides programs and services for older adults. The city's neighborhoods — from downtown Shelton to Huntington and White Hills — offer diverse residential settings where families are increasingly choosing home care to keep loved ones comfortable and independent.",
    seniorStats:
      "About 18% of Shelton residents are age 65 or older. The city's relatively affluent demographics make private-pay home care accessible to many families, with demand particularly strong for personal care and skilled nursing services.",
    careInsights:
      "Shelton families tend to seek higher-end personal care and skilled nursing services. The city's proximity to larger markets like Bridgeport and New Haven means good availability of experienced home care agencies. Providers serving Shelton also typically cover Derby, Ansonia, Oxford, and Monroe.",
    metaTitle:
      "Home Care in Shelton, CT | Find Private-Pay Home Care Agencies",
    metaDescription:
      "Find private-pay home care agencies in Shelton, CT. Compare providers in the Naugatuck Valley for personal care, skilled nursing, and more.",
  },
  {
    slug: "wallingford-ct",
    name: "Wallingford",
    state: "CT",
    county: "New Haven County",
    population: "44,396",
    zipCodes: ["06492", "06493"],
    heroHeadline: "Home Care Services in Wallingford, Connecticut",
    heroSubtext:
      "Trusted home care agencies in Wallingford. We match families with the right provider for their unique needs.",
    localContent:
      "Wallingford is a picturesque New England town in New Haven County, known for its charming town center, Choate Rosemary Hall, and strong community identity. MidState Medical Center (part of Hartford HealthCare) provides local healthcare, while the Wallingford Senior Center on South Main Street is an active hub for older adults. The town's well-maintained residential neighborhoods — from Yalesville to Cook Hill — are where many seniors hope to continue living independently with the right support.",
    seniorStats:
      "Approximately 19% of Wallingford residents are 65 or older, one of the higher percentages among Connecticut's mid-sized towns. The town's stable, family-oriented community means many adult children live nearby and actively coordinate care for aging parents.",
    careInsights:
      "Wallingford families frequently seek companion care and personal care services, often starting with a few hours per week and gradually increasing as needs change. The town's central location between Hartford and New Haven gives families access to a wide range of agencies. Providers serving Wallingford also cover Durham, Cheshire, and North Haven.",
    metaTitle:
      "Home Care in Wallingford, CT | Find Private-Pay Home Care Agencies",
    metaDescription:
      "Find private-pay home care agencies in Wallingford, CT. Get matched with trusted providers for companion care, personal care, and more.",
  },
];

export function getCityBySlug(slug: string): CityData | undefined {
  return CT_CITIES.find((c) => c.slug === slug);
}

export function getAllCitySlugs(): string[] {
  return CT_CITIES.map((c) => c.slug);
}
