import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agency Guide — HomeCare Leads",
  description: "How to register, receive leads, manage your dashboard, and get the most from HomeCare Leads.",
};

const sections = [
  {
    title: "1. Registration",
    content: `Getting started is free — no subscription required. Create an account at /register with your email and password. After verifying your email, you'll be directed to complete your agency onboarding profile.`,
  },
  {
    title: "2. Onboarding",
    content: `During onboarding, you'll provide your agency details: name, phone, address, service area ZIP codes, specialties (care types you handle), and your preferred monthly lead capacity. Be thorough — this information determines which leads are matched to you.`,
  },
  {
    title: "3. Admin Approval",
    content: `After completing onboarding, your profile goes through an admin review to verify your license and service area. This typically takes 1-2 business days. You'll see a "Pending Admin Approval" banner on your dashboard until approved. Once approved, you'll start receiving matched leads.`,
  },
  {
    title: "4. Receiving Leads",
    content: `Leads are matched exclusively — each lead goes to one agency only. Matching is based on ZIP code overlap and specialty fit. You'll receive an email notification when a new lead is delivered. All leads are pre-qualified as private-pay or long-term care insurance.`,
  },
  {
    title: "5. Priority Pass",
    content: `For $197 (one-time, 3 months), the Priority Pass gives you first pick on all leads in your area. Priority Pass holders receive leads before free agencies. Purchase it from your dashboard under "Priority Pass." Per-lead charges still apply.`,
  },
  {
    title: "6. Managing Leads",
    content: `On the Leads page, you can view all delivered leads with their quality score (Hot, Warm, Cold), care type, location, and urgency. For each lead, you can: Accept (sends an intro email to the family), Pass (removes from your pipeline), Mark Contacted, or directly email/call the family.`,
  },
  {
    title: "7. Per-Lead Billing",
    content: `You are charged $1,297 per confirmed lead ($300 onboarding fee + $997 lead fee). Charges are triggered when an admin verifies the lead's quality — not when you accept the lead. You must have a payment method on file. Set one up from your dashboard.`,
  },
  {
    title: "8. Disputes",
    content: `If a confirmed lead turns out to be unqualified (invalid contact info, not actually private-pay, wrong location, duplicate, or not seeking care), submit a dispute from the Disputes page. Provide a reason and description. Approved disputes result in a full refund.`,
  },
  {
    title: "9. Billing History",
    content: `The Billing page shows all charges: lead fees, onboarding fees, Priority Pass purchases, and refunds. Each entry shows the date, lead name, care type, charge type, amount, and status (succeeded, failed, refunded).`,
  },
];

export default function AgencyGuidePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-[#2563eb]">HomeCare Leads</Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-[#2563eb]">Log In</Link>
            <Link href="/register" className="text-sm font-medium bg-[#2563eb] text-white px-4 py-2 rounded-lg hover:bg-[#1d4ed8]">Get Started</Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/user-guide" className="hover:text-blue-600">User Guide</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Agency Guide</span>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Agency Guide</h1>
        <p className="text-lg text-gray-600 mb-10">
          Everything you need to know about using HomeCare Leads as a home care agency.
        </p>

        {/* Table of contents */}
        <div className="bg-gray-50 rounded-xl p-6 mb-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">In This Guide</h2>
          <ul className="space-y-2">
            {sections.map((section, i) => (
              <li key={i}>
                <a href={`#section-${i}`} className="text-blue-600 hover:underline text-sm">{section.title}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {sections.map((section, i) => (
            <div key={i} id={`section-${i}`}>
              <h2 className="text-xl font-bold text-gray-900 mb-3">{section.title}</h2>
              <p className="text-gray-600 leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>

        {/* Pricing summary */}
        <div className="mt-12 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h2 className="text-lg font-bold text-blue-900 mb-4">Pricing Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-700">Registration</span>
              <span className="font-semibold text-gray-900">Free</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Priority Pass (optional, 3 months)</span>
              <span className="font-semibold text-gray-900">$197</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Onboarding fee (per confirmed lead)</span>
              <span className="font-semibold text-gray-900">$300</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Lead fee (per confirmed lead)</span>
              <span className="font-semibold text-gray-900">$997</span>
            </div>
            <div className="flex justify-between border-t border-blue-200 pt-3">
              <span className="font-semibold text-blue-900">Total per confirmed lead</span>
              <span className="font-bold text-blue-900">$1,297</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-gray-400 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs text-gray-500">&copy; 2026 HomeCare Leads. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
