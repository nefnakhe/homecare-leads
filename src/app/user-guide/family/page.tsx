import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Family Guide — HomeCare Leads",
  description: "How to submit a care request and get matched with qualified home care agencies near you.",
};

const sections = [
  {
    title: "1. Submitting a Care Request",
    content: `Visit /find-care to submit your care request. No account or payment is needed — this service is completely free for families. Fill out the form with your contact information, the care recipient's details, the type of care needed, your location (ZIP code), urgency, and payment method.`,
  },
  {
    title: "2. What We Ask For",
    content: `The care request form collects: your name, email, and phone number; the patient's first name and age (optional); the type of care needed (personal care, companion care, skilled nursing, dementia care, respite care, live-in care, post-surgery, or hospice support); your ZIP code, city, and state; how urgently you need care; how you plan to pay; your budget range; and how many hours per week you need.`,
  },
  {
    title: "3. Private Pay Requirement",
    content: `HomeCare Leads specializes in connecting families who plan to pay privately (out-of-pocket or through long-term care insurance) with agencies. If you select Medicare, Medicaid, or VA benefits as your payment type, we'll recommend other resources that may be a better fit. This helps ensure we match you with agencies that can serve your specific situation.`,
  },
  {
    title: "4. How Matching Works",
    content: `After you submit, your request is scored based on urgency, care type, budget, and hours needed. We then match you with a qualified, licensed agency in your area based on ZIP code proximity and care specialization. Each lead is exclusive — you'll be matched with one agency that's a strong fit for your needs.`,
  },
  {
    title: "5. What Happens Next",
    content: `The matched agency receives your care request details and will reach out to you directly. Most agencies contact families within 24-48 hours. You'll also receive an introduction email connecting you with the agency, including their name and contact information.`,
  },
  {
    title: "6. Your Information",
    content: `Your contact information is shared only with the single matched agency — it is not sold, shared with multiple providers, or used for marketing purposes. The agency will use your details solely to discuss care options and schedule a consultation.`,
  },
  {
    title: "7. No Cost to Families",
    content: `There is no cost to families for using HomeCare Leads. Our service is funded by the agencies who receive qualified leads. You'll never be charged for submitting a care request or receiving a match.`,
  },
  {
    title: "8. Tips for a Strong Match",
    content: `To get the best possible agency match, be as specific as possible in your care request. Include details about the type of care needed, any special requirements (mobility assistance, medication management, etc.), your preferred schedule, and your budget range. The more information you provide, the better we can match you with an agency equipped to handle your needs.`,
  },
];

export default function FamilyGuidePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-[#2563eb]">HomeCare Leads</Link>
          <div className="flex items-center gap-3">
            <Link href="/find-care" className="text-sm font-medium text-gray-600 hover:text-[#2563eb]">Find Care</Link>
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-[#2563eb]">Log In</Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/user-guide" className="hover:text-blue-600">User Guide</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Family Guide</span>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Family Guide</h1>
        <p className="text-lg text-gray-600 mb-10">
          How to find qualified home care for your loved one through HomeCare Leads.
        </p>

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

        <div className="space-y-10">
          {sections.map((section, i) => (
            <div key={i} id={`section-${i}`}>
              <h2 className="text-xl font-bold text-gray-900 mb-3">{section.title}</h2>
              <p className="text-gray-600 leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-blue-600 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to Find Care?</h2>
          <p className="text-blue-100 mb-6">
            Submit your care request and get matched with a qualified agency — completely free.
          </p>
          <Link
            href="/find-care"
            className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold rounded-lg bg-white text-blue-600 hover:bg-gray-50 transition-colors"
          >
            Find Care Now
          </Link>
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
