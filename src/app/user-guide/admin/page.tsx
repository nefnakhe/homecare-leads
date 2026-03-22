import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Guide — HomeCare Leads",
  description: "How to approve agencies, review leads, confirm charges, and manage disputes.",
};

const sections = [
  {
    title: "1. Admin Dashboard Overview",
    content: `The admin dashboard (/admin) has three tabs: Lead Review, Agencies, and Disputes. Summary cards at the top show leads pending review, confirmed leads, agencies pending approval, and open disputes. You must have the "admin" role to access this panel.`,
  },
  {
    title: "2. Approving Agencies",
    content: `When a new agency completes onboarding, they appear in the Agencies tab with a "Pending Approval" badge. Review their details: name, email, phone, service area ZIPs, specialties, and whether they have a payment method on file. Click "Approve" to allow them to receive leads. You can revoke approval at any time by clicking "Revoke."`,
  },
  {
    title: "3. Reviewing Leads",
    content: `The Lead Review tab shows all delivered leads. Each entry displays the lead's quality score (Hot/Warm/Cold), care type, location, and the matched agency. Filter by "Needs Review" to see unconfirmed leads. Click a lead to expand full details: contact info, care requirements, budget, and the matched agency's payment status.`,
  },
  {
    title: "4. Confirming Leads (Triggering Charges)",
    content: `When you confirm a lead, two Stripe charges are created against the matched agency: a $300 onboarding fee and a $997 lead fee ($1,297 total). Click "Confirm & Charge $1,297" to process. The system verifies the agency has a payment method before allowing confirmation. If a charge fails, the billing event is recorded with the failure reason.`,
  },
  {
    title: "5. Rejecting Leads",
    content: `If a lead is low quality or unqualified, click "Reject Lead." This marks the lead match as expired and no charges are applied. Rejected leads are not billed to the agency.`,
  },
  {
    title: "6. Managing Disputes",
    content: `Agencies can submit disputes on confirmed leads they believe are unqualified. The Disputes tab shows all disputes with filters: All, Needs Action, Open, Under Review, Approved, Denied. Each dispute shows the reason, agency details, lead details, and the disputed amount.`,
  },
  {
    title: "7. Resolving Disputes",
    content: `Expand a dispute to see full details. Add an optional admin note, then either "Approve & Refund" (processes a Stripe refund for the disputed amount and creates a refund billing event) or "Deny Dispute" (no refund). Both actions are final — resolved disputes cannot be reopened.`,
  },
  {
    title: "8. Monitoring Priority Pass",
    content: `In the Agencies tab, agencies with an active Priority Pass show a "Priority Pass" badge. Priority Pass holders receive leads before free agencies in the matching algorithm. The pass expires after 3 months — no admin action required.`,
  },
];

export default function AdminGuidePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-[#2563eb]">HomeCare Leads</Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-[#2563eb]">Log In</Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/user-guide" className="hover:text-blue-600">User Guide</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Admin Guide</span>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Guide</h1>
        <p className="text-lg text-gray-600 mb-10">
          How to manage agencies, review leads, and handle disputes as an administrator.
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

        {/* Workflow summary */}
        <div className="mt-12 bg-amber-50 rounded-xl p-6 border border-amber-200">
          <h2 className="text-lg font-bold text-amber-900 mb-4">Admin Workflow</h2>
          <ol className="space-y-3 text-sm text-gray-700">
            <li className="flex gap-3">
              <span className="font-bold text-amber-600 shrink-0">Step 1.</span>
              <span>New agency completes onboarding &rarr; Review and approve in Agencies tab</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-amber-600 shrink-0">Step 2.</span>
              <span>Family submits care request &rarr; Lead auto-matched to approved agency</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-amber-600 shrink-0">Step 3.</span>
              <span>Review lead quality in Lead Review tab &rarr; Confirm ($1,297 charge) or Reject (no charge)</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-amber-600 shrink-0">Step 4.</span>
              <span>If agency disputes &rarr; Review in Disputes tab &rarr; Approve refund or deny</span>
            </li>
          </ol>
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
