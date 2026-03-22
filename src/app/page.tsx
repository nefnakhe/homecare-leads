import Link from "next/link";
import { GUIDES } from "@/lib/guides";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Sticky Header / Nav */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-[#2563eb]">
            Private Home Care HQ
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
              Join Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#2563eb] via-[#3b82f6] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 sm:pt-28 sm:pb-40">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
              Qualified Private-Pay Home Care Leads, Delivered to You
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-blue-100 leading-relaxed max-w-2xl mx-auto">
              Join free. Pay only when you receive a confirmed, private-pay client. One lead can mean $86,000+ in lifetime revenue for your agency.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold rounded-lg bg-white text-[#2563eb] hover:bg-gray-50 transition-colors shadow-lg"
              >
                Join Free — No Credit Card
              </Link>
              <a
                href="#how-it-works"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold rounded-lg border-2 border-white text-white hover:bg-white/10 transition-colors"
              >
                See How It Works
              </a>
            </div>
            <p className="mt-6 text-sm text-blue-200">
              No subscription. No monthly fees. Currently serving Connecticut.
            </p>
          </div>
        </div>
      </section>

      {/* ROI Callout */}
      <section className="py-12 bg-gray-50 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-bold text-[#2563eb]">$86,000+</p>
              <p className="mt-2 text-sm text-gray-600">Average lifetime revenue per private-pay client<br /><span className="text-xs text-gray-400">($2,400/mo &times; 3+ years)</span></p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-bold text-[#2563eb]">$1,297</p>
              <p className="mt-2 text-sm text-gray-600">Your cost per qualified lead<br /><span className="text-xs text-gray-400">Only charged after quality verification</span></p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-bold text-[#2563eb]">66&times;</p>
              <p className="mt-2 text-sm text-gray-600">Potential return on your lead investment<br /><span className="text-xs text-gray-400">$86K revenue vs $1,297 lead cost</span></p>
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
              Start receiving qualified private-pay leads in three steps.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
            {/* Step 1 */}
            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-[#2563eb]/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-[#2563eb]">1</span>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                Join Free &amp; Set Your Service Area
              </h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Create your agency profile in minutes. Tell us which ZIP codes you serve, your specialties, and how many leads you can handle per month. No credit card required.
              </p>
            </div>
            {/* Step 2 */}
            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-[#2563eb]/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-[#2563eb]">2</span>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                We Qualify &amp; Match Every Lead
              </h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Families submit care requests. We verify each one is private-pay, confirm their care needs and timeline, then match them to your agency by location and specialty.
              </p>
            </div>
            {/* Step 3 */}
            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-[#2563eb]/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-[#2563eb]">3</span>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                Receive Exclusive, Ready-to-Close Leads
              </h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Each lead is sent to one agency only — yours. You get the family&apos;s full care details, contact information, and timeline. No competition, no bidding wars.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Private Home Care HQ */}
      <section className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Why Agencies Choose Private Home Care HQ
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              We built this for agencies that are tired of unqualified referrals and shared lead lists.
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
              <h3 className="mt-4 text-lg font-semibold text-gray-900">100% Private Pay</h3>
              <p className="mt-2 text-gray-600 leading-relaxed">
                Every lead is pre-screened for private-pay ability. No Medicaid inquiries, no insurance headaches. These are families ready to pay out of pocket for quality care.
              </p>
            </div>
            {/* Exclusive */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="w-12 h-12 rounded-lg bg-[#2563eb]/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#2563eb]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Exclusive Leads — Never Shared</h3>
              <p className="mt-2 text-gray-600 leading-relaxed">
                Every lead goes to one agency. No shared lists, no bidding wars, no race to the phone. When a family is matched to you, they&apos;re yours.
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
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Matched to Your Service Area</h3>
              <p className="mt-2 text-gray-600 leading-relaxed">
                You set the ZIP codes you serve. We only send you leads from families in your coverage area, matched to your specialties and capacity.
              </p>
            </div>
            {/* Quality Guarantee */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="w-12 h-12 rounded-lg bg-[#2563eb]/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#2563eb]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Admin-Verified Quality</h3>
              <p className="mt-2 text-gray-600 leading-relaxed">
                Every lead is confirmed by our team before you&apos;re charged. If a lead turns out to be unqualified, submit a dispute and get a full refund. You never pay for bad leads.
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
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Join free. Pay only when you receive a confirmed, qualified lead. One private-pay client can generate $86,000+ in lifetime revenue — your lead cost is a fraction of that.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Per-Lead Pricing */}
            <div className="rounded-2xl border-2 border-[#2563eb] bg-white p-8 flex flex-col relative shadow-lg">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#2563eb] text-white text-xs font-semibold px-4 py-1 rounded-full uppercase tracking-wide">
                Most Popular
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Pay-Per-Lead</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-gray-900">$1,297</span>
                <span className="text-gray-500">/lead</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">$300 onboarding + $997 lead fee</p>
              <ul className="mt-8 space-y-4 flex-1">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#2563eb] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span className="text-gray-600">Free to join — no subscription, no upfront cost</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#2563eb] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span className="text-gray-600">Exclusive leads — 1 agency per lead, never shared</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#2563eb] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span className="text-gray-600">Pre-qualified, private-pay families only</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#2563eb] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span className="text-gray-600">Only charged after admin quality verification</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#2563eb] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span className="text-gray-600">Dispute protection — full refund on bad leads</span>
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
              <p className="mt-2 text-sm text-gray-500">One-time payment — jump the queue</p>
              <ul className="mt-8 space-y-4 flex-1">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#2563eb] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span className="text-gray-600">Get leads delivered before free-tier agencies</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#2563eb] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span className="text-gray-600">First pick on every exclusive lead in your area</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#2563eb] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span className="text-gray-600">Priority support from our team</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#2563eb] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span className="text-gray-600">Per-lead charges still apply ($1,297/lead)</span>
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

          {/* ROI breakdown */}
          <div className="mt-12 max-w-2xl mx-auto bg-gray-50 rounded-xl p-6 sm:p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900">The Math Speaks for Itself</h3>
            <p className="mt-3 text-gray-600 leading-relaxed">
              A typical private-pay home care client pays around $2,400 per month and stays for 3 or more years. That&apos;s $86,000+ in revenue from a single client — versus a one-time lead fee of $1,297. Private-pay clients are the most valuable clients your agency can have, and they stay with you for years.
            </p>
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
                Is it really free to join?
              </h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Yes. There is no subscription, no signup fee, and no monthly cost. You create your profile, set your service area, and start receiving leads. You only pay the $1,297 per-lead fee when you receive a confirmed, qualified lead — and only after our team verifies its quality.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                What counts as a qualified lead?
              </h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Every lead is verified as a family actively seeking private-pay home care in Connecticut. We confirm their budget, care needs, timeline, and location before matching. Our admin team reviews every lead before you are charged.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                What if a lead turns out to be bad?
              </h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                We stand behind our leads. If a confirmed lead turns out to be unqualified — invalid contact information, not actually private-pay, or misrepresented care needs — submit a dispute through your dashboard. Approved disputes receive a full refund.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                How quickly will I receive leads?
              </h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                After your profile is approved (typically 1-2 business days), you&apos;ll begin receiving leads as families in your service area submit requests. Lead volume depends on your location and the care types you offer.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                Can I control my service area and lead volume?
              </h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Yes. During onboarding, you set the ZIP codes you serve, the types of care you offer (personal care, companion care, skilled nursing, etc.), and your monthly lead capacity. You only receive leads that match your criteria.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                What is the Priority Pass?
              </h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Priority Pass is an optional $197 upgrade (covers 3 months) that puts your agency at the front of the queue. When a new lead comes in for your area, Priority Pass agencies get first pick before free-tier agencies. Per-lead charges still apply.
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
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap">
              {GUIDES.map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  className="text-[#2563eb] hover:underline text-sm font-medium"
                >
                  {guide.title}
                </Link>
              ))}
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
            Tell us about your care needs and we&apos;ll connect you with a qualified, licensed agency in your area — completely free.
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
              <span className="text-lg font-bold text-white">Private Home Care HQ</span>
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
              Private Home Care HQ is a lead generation service. We do not provide home health care services or medical advice. All care is provided by independently licensed home health care agencies. We connect families with licensed providers — we are not a home care agency.
            </p>
            <p className="mt-4 text-xs text-gray-500 text-center">
              &copy; 2026 Private Home Care HQ. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
