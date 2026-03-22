import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getGuideBySlug, getAllGuideSlugs, GUIDES } from "@/lib/guides";
import { CT_CITIES } from "@/lib/cities";
import LeadCaptureEmbed from "@/components/LeadCaptureEmbed";

export const revalidate = 86400; // ISR: revalidate every 24 hours

export function generateStaticParams() {
  return getAllGuideSlugs().map((slug) => ({ "guide-slug": slug }));
}

export function generateMetadata({
  params,
}: {
  params: { "guide-slug": string };
}): Metadata {
  const guide = getGuideBySlug(params["guide-slug"]);
  if (!guide) return { title: "Guide Not Found" };

  return {
    title: guide.metaTitle,
    description: guide.metaDescription,
    openGraph: {
      title: guide.metaTitle,
      description: guide.metaDescription,
      type: "article",
      locale: "en_US",
    },
  };
}

export default function GuidePage({
  params,
}: {
  params: { "guide-slug": string };
}) {
  const guide = getGuideBySlug(params["guide-slug"]);
  if (!guide) notFound();

  const otherGuides = GUIDES.filter((g) => g.slug !== guide.slug);
  const featuredCities = CT_CITIES.slice(0, 6);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.metaDescription,
    publisher: {
      "@type": "Organization",
      name: "HomeCare Leads",
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
          name: "Guides",
          item: "https://homecareleads.com/guides",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: guide.title,
          item: `https://homecareleads.com/guides/${guide.slug}`,
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
          <span className="text-gray-900">{guide.title}</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-14 sm:py-18">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-4">
            Family Guide
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            {guide.title}
          </h1>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            {guide.heroSubtext}
          </p>
        </div>
      </section>

      {/* Content + Sidebar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
          {/* Article content */}
          <article className="lg:col-span-2 space-y-8">
            {/* Table of contents */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
                In This Guide
              </h2>
              <ul className="space-y-2">
                {guide.sections.map((section, i) => (
                  <li key={i}>
                    <a
                      href={`#section-${i}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {section.heading}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sections */}
            {guide.sections.map((section, i) => (
              <div key={i} id={`section-${i}`}>
                <h2 className="text-2xl font-bold text-gray-900">
                  {section.heading}
                </h2>
                <p className="mt-3 text-gray-600 leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}

            {/* Related guides */}
            {otherGuides.length > 0 && (
              <div className="border-t pt-8 mt-8">
                <h3 className="text-lg font-bold text-gray-900">
                  Related Guides
                </h3>
                <ul className="mt-3 space-y-2">
                  {otherGuides.map((g) => (
                    <li key={g.slug}>
                      <Link
                        href={`/guides/${g.slug}`}
                        className="text-blue-600 hover:underline"
                      >
                        {g.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CT cities */}
            <div className="border-t pt-8">
              <h3 className="text-lg font-bold text-gray-900">
                Find Home Care in Your Connecticut City
              </h3>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {featuredCities.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/${city.slug}`}
                    className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-center hover:border-blue-600 transition text-sm font-medium text-gray-700"
                  >
                    {city.name}, CT
                  </Link>
                ))}
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <LeadCaptureEmbed
                heading="Need Home Care?"
                subtext="Get matched with trusted agencies in your area — free, no obligation."
              />
            </div>
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
