import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCityBySlug, getAllCitySlugs, CT_CITIES } from "@/lib/cities";
import LeadCaptureEmbed from "@/components/LeadCaptureEmbed";

export const revalidate = 86400; // ISR: revalidate every 24 hours

export function generateStaticParams() {
  return getAllCitySlugs().map((slug) => ({ "city-slug": slug }));
}

export function generateMetadata({
  params,
}: {
  params: { "city-slug": string };
}): Metadata {
  const city = getCityBySlug(params["city-slug"]);
  if (!city) return { title: "City Not Found" };

  return {
    title: city.metaTitle,
    description: city.metaDescription,
    openGraph: {
      title: city.metaTitle,
      description: city.metaDescription,
      type: "website",
      locale: "en_US",
    },
  };
}

export default function CityPage({
  params,
}: {
  params: { "city-slug": string };
}) {
  const city = getCityBySlug(params["city-slug"]);
  if (!city) notFound();

  const otherCities = CT_CITIES.filter((c) => c.slug !== city.slug).slice(0, 5);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: city.metaTitle,
    description: city.metaDescription,
    about: {
      "@type": "Service",
      name: `Home Care Services in ${city.name}, ${city.state}`,
      areaServed: {
        "@type": "City",
        name: city.name,
        containedInPlace: {
          "@type": "State",
          name: "Connecticut",
        },
      },
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://homecareleads.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: `${city.name}, CT`,
          item: `https://homecareleads.com/${city.slug}`,
        },
      ],
    },
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-[#2563eb]">
            HomeCare Leads
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/find-care"
              className="text-sm font-medium text-gray-600 hover:text-[#2563eb] transition-colors"
            >
              Find Care
            </Link>
            <Link
              href="/guides/paying-for-home-care-without-insurance"
              className="text-sm font-medium text-gray-600 hover:text-[#2563eb] transition-colors"
            >
              Guides
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-[#2563eb] transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium bg-[#2563eb] text-white px-4 py-2 rounded-lg hover:bg-[#1d4ed8] transition-colors"
            >
              For Agencies
            </Link>
          </div>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <nav className="text-sm text-gray-500">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">
            Home Care in {city.name}, {city.state}
          </span>
        </nav>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-b from-[#2563eb] to-[#3b82f6] text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              {city.heroHeadline}
            </h1>
            <p className="mt-4 text-lg text-blue-100 leading-relaxed">
              {city.heroSubtext}
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <span className="bg-white/20 rounded-full px-4 py-1.5">
                {city.county}
              </span>
              <span className="bg-white/20 rounded-full px-4 py-1.5">
                Population: {city.population}
              </span>
              <span className="bg-white/20 rounded-full px-4 py-1.5">
                ZIP: {city.zipCodes.join(", ")}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content + Sidebar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
          {/* Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* About the city */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Home Care in {city.name}
              </h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                {city.localContent}
              </p>
            </div>

            {/* Senior demographics */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Senior Population in {city.name}
              </h3>
              <p className="mt-2 text-gray-600 leading-relaxed">
                {city.seniorStats}
              </p>
            </div>

            {/* Care insights */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                What Families in {city.name} Are Looking For
              </h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                {city.careInsights}
              </p>
            </div>

            {/* Types of care */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Types of Home Care Available in {city.name}
              </h2>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    title: "Personal Care",
                    desc: "Help with bathing, dressing, grooming, and daily activities.",
                  },
                  {
                    title: "Companion Care",
                    desc: "Social engagement, errands, meal preparation, and light housekeeping.",
                  },
                  {
                    title: "Skilled Nursing",
                    desc: "Medical care, wound management, and medication administration by RNs.",
                  },
                  {
                    title: "Dementia Care",
                    desc: "Specialized memory care and Alzheimer's support at home.",
                  },
                  {
                    title: "Respite Care",
                    desc: "Temporary relief for family caregivers, from a few hours to overnight.",
                  },
                  {
                    title: "Live-In Care",
                    desc: "24-hour care for seniors who need around-the-clock assistance.",
                  },
                ].map((care) => (
                  <div
                    key={care.title}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <h4 className="font-semibold text-gray-900">
                      {care.title}
                    </h4>
                    <p className="mt-1 text-sm text-gray-500">{care.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Helpful resources */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Helpful Resources for {city.name} Families
              </h2>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link
                    href="/guides/paying-for-home-care-without-insurance"
                    className="text-blue-600 hover:underline"
                  >
                    How to Pay for Home Care Without Insurance
                  </Link>
                </li>
                <li>
                  <Link
                    href="/guides/home-care-costs-connecticut"
                    className="text-blue-600 hover:underline"
                  >
                    Home Care Costs in Connecticut: What to Expect
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Sidebar with lead capture */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <LeadCaptureEmbed
                city={city.name}
                state={city.state}
                heading={`Find Home Care in ${city.name}`}
                subtext={`Connect with vetted agencies serving ${city.name} and surrounding areas.`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Other cities */}
      <section className="bg-gray-50 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Home Care in Other Connecticut Cities
          </h2>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {otherCities.map((c) => (
              <Link
                key={c.slug}
                href={`/${c.slug}`}
                className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-center hover:border-blue-600 hover:shadow-sm transition text-sm font-medium text-gray-700"
              >
                {c.name}, CT
              </Link>
            ))}
          </div>
          <div className="mt-4">
            <Link
              href="/find-care"
              className="text-sm text-blue-600 hover:underline"
            >
              Or search by ZIP code →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <span className="text-lg font-bold text-white">HomeCare Leads</span>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8">
            <p className="text-xs text-gray-500 text-center">
              &copy; 2026 HomeCare Leads. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
