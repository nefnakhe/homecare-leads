import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Sticky Header / Nav */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-[#2563eb]">
            HomeCare Leads
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-[#2563eb] transition-colors">
              How It Works
            </a>
            <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-[#2563eb] transition-colors">
              Pricing
            </a>
            <a href="#faq" className="text-sm font-medium text-gray-600 hover:text-[#2563eb] transition-colors">
              FAQ
            </a>
            <Link href="/find-care" className="text-sm font-medium text-gray-600 hover:text-[#2563eb] transition-colors">
              Find Care
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
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#2563eb] via-[#3b82f6] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 sm:pt-28 sm:pb-40">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
              Pre-Qualified Private Pay Home Care Leads
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-blue-100 leading-relaxed max-w-2xl mx-auto">
              Stop wasting time on unqualified leads. We connect your home health care agency with families who are ready to pay out-of-pocket for quality care.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold rounded-lg bg-white text-[#2563eb] hover:bg-gray-50 transition-colors shadow-lg"
              >
                Join Free
              </Link>
              <a
                href="#pricing"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold rounded-lg border-2 border-white text-white hover:bg-white/10 transition-colors"
              >
                See How It Works
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Three simple steps to start receiving qualified leads.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
            {/* Step 1 */}
            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-[#2563eb]/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-[#2563eb]">1</span>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                Families Submit Care Requests
              </h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Families in your area fill out detailed care needs assessments.
              </p>
            </div>
            {/* Step 2 */}
            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-[#2563eb]/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-[#2563eb]">2</span>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                We Qualify &amp; Match
              </h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Every lead is verified as private-pay and matched to agencies by location, specialty, and capacity.
              </p>
            </div>
            {/* Step 3 */}
            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-[#2563eb]/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-[#2563eb]">3</span>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                You Get Pre-Qualified Leads
              </h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Receive leads delivered to your inbox with full care details, ready to close.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why HomeCare Leads Section */}
      <section className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Why HomeCare Leads
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Built specifically for home health care agencies that want quality over quantity.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-10">
            {/* Private Pay Only */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="w-12 h-12 rounded-lg bg-[#2563eb]/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#2563eb]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Private Pay Only</h3>
              <p className="mt-2 text-gray-600 leading-relaxed">
                Every lead is pre-screened. No more wasting time on Medicaid-eligible inquiries.
              </p>
            </div>
            {/* Geo-Matched */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="w-12 h-12 rounded-lg bg-[#2563eb]/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#2563eb]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Geo-Matched to Your Service Area</h3>
              <p className="mt-2 text-gray-600 leading-relaxed">
                Only receive leads from families in ZIP codes you serve.
              </p>
            </div>
            {/* Real-Time Delivery */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="w-12 h-12 rounded-lg bg-[#2563eb]/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#2563eb]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Real-Time Delivery</h3>
              <p className="mt-2 text-gray-600 leading-relaxed">
                Leads delivered instantly via email and SMS. First to respond wins.
              </p>
            </div>
            {/* Free to Join */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="w-12 h-12 rounded-lg bg-[#2563eb]/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#2563eb]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Free to Join</h3>
              <p className="mt-2 text-gray-600 leading-relaxed">
                No subscription. No monthly fees. You only pay when you receive a confirmed, qualified lead.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Simple, Pay-Per-Lead Pricing
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Join free. Receive qualified, exclusive leads. Pay only for confirmed leads.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Per-Lead Pricing */}
            <div className="rounded-2xl border-2 border-[#2563eb] bg-white p-8 flex flex-col relative shadow-lg">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#2563eb] text-white text-xs font-semibold px-4 py-1 rounded-full uppercase tracking-wide">
                Per-Lead
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Qualified Lead</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-gray-900">$2,300</span>
                <span className="text-gray-500">/lead</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">$300 onboarding + $2,000 lead fee</p>
              <ul className="mt-8 space-y-4 flex-1">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#2563eb] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span className="text-gray-600">Free to join — no monthly fees</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#2563eb] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span className="text-gray-600">Exclusive leads — 1 agency per lead</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#2563eb] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span className="text-gray-600">Pre-qualified private-pay families</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#2563eb] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span className="text-gray-600">Only charged after quality verification</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#2563eb] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span className="text-gray-600">Dispute protection on unqualified leads</span>
                </li>
              </ul>
              <Link
                href="/register"
                className="mt-8 block text-center px-6 py-3 rounded-lg bg-[#2563eb] text-white font-semibold hover:bg-[#1d4ed8] transition-colors"
              >
                Join Free
              </Link>
            </div>

            {/* Priority Pass */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 flex flex-col">
              <h3 className="text-lg font-semibold text-gray-900">Priority Pass</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-gray-900">$197</span>
                <span className="text-gray-500">/3 months</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">One-time payment, not a subscription</p>
              <ul className="mt-8 space-y-4 flex-1">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#2563eb] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span className="text-gray-600">Get leads delivered before free agencies</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#2563eb] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span className="text-gray-600">First pick on all exclusive leads</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#2563eb] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span className="text-gray-600">Priority support</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#2563eb] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span className="text-gray-600">Per-lead charges still apply ($2,300/lead)</span>
                </li>
              </ul>
              <Link
                href="/register"
                className="mt-8 block text-center px-6 py-3 rounded-lg border-2 border-[#2563eb] text-[#2563eb] font-semibold hover:bg-[#2563eb]/5 transition-colors"
              >
                Join Free, Then Upgrade
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="mt-12 space-y-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                What counts as a qualified lead?
              </h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Every lead has been verified as actively seeking private-pay home care. We confirm budget, care needs, timeline, and location before routing.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                How quickly will I receive leads?
              </h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Most agencies receive their first leads within 48 hours of being approved. There&apos;s no subscription required — you only pay $2,300 per confirmed lead.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                Can I set my service area?
              </h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Yes. You define the ZIP codes you serve during onboarding. You only receive leads from those areas.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                What if a lead doesn&apos;t convert?
              </h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Every lead is verified before you&apos;re charged. If a confirmed lead turns out to be unqualified (e.g., invalid contact, not private-pay), submit a dispute for a full refund.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CT City Pages Section */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Find Home Care in Connecticut
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              We serve families across Connecticut. Find trusted home care agencies in your city.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {[
              { name: "Waterbury", slug: "waterbury-ct" },
              { name: "Meriden", slug: "meriden-ct" },
              { name: "Middletown", slug: "middletown-ct" },
              { name: "Torrington", slug: "torrington-ct" },
              { name: "Norwich", slug: "norwich-ct" },
              { name: "New Britain", slug: "new-britain-ct" },
              { name: "Bristol", slug: "bristol-ct" },
              { name: "Enfield", slug: "enfield-ct" },
              { name: "Shelton", slug: "shelton-ct" },
              { name: "Wallingford", slug: "wallingford-ct" },
            ].map((city) => (
              <Link
                key={city.slug}
                href={`/${city.slug}`}
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-center hover:border-[#2563eb] hover:shadow-sm transition text-sm font-medium text-gray-700"
              >
                {city.name}, CT
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Family Resources</h3>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/guides/paying-for-home-care-without-insurance" className="text-[#2563eb] hover:underline text-sm font-medium">
                How to Pay for Home Care Without Insurance
              </Link>
              <Link href="/guides/home-care-costs-connecticut" className="text-[#2563eb] hover:underline text-sm font-medium">
                Home Care Costs in Connecticut
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Family CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white">
            Looking for Home Care?
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Tell us about your care needs and we&apos;ll connect you with qualified agencies in your area — free of charge.
          </p>
          <Link
            href="/find-care"
            className="mt-8 inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold rounded-lg bg-white text-blue-600 hover:bg-gray-50 transition-colors shadow-lg"
          >
            Find Care Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-lg font-bold text-white">HomeCare Leads</span>
            </div>
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
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              HomeCare Leads is a lead generation service. We do not provide home health care services. All care is provided by independently licensed home health care agencies.
            </p>
            <p className="mt-4 text-xs text-gray-500 text-center">
              &copy; 2026 HomeCare Leads. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
