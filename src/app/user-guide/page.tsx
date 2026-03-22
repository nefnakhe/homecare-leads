import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Guide — HomeCare Leads",
  description: "Learn how to use HomeCare Leads. Guides for agencies, administrators, and families.",
};

const guides = [
  {
    title: "Agency Guide",
    description: "How to register, receive leads, manage your dashboard, and get the most from HomeCare Leads.",
    href: "/user-guide/agency",
    icon: (
      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
  },
  {
    title: "Admin Guide",
    description: "How to approve agencies, review leads, confirm charges, and manage disputes.",
    href: "/user-guide/admin",
    icon: (
      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: "Family Guide",
    description: "How to submit a care request and get matched with qualified home care agencies.",
    href: "/user-guide/family",
    icon: (
      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
];

export default function UserGuidePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-[#2563eb]">
            HomeCare Leads
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-[#2563eb] transition-colors">
              Log In
            </Link>
            <Link href="/register" className="text-sm font-medium bg-[#2563eb] text-white px-4 py-2 rounded-lg hover:bg-[#1d4ed8] transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">User Guide</h1>
          <p className="mt-4 text-lg text-gray-600">
            Select your role to learn how to use HomeCare Leads.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guides.map((guide) => (
            <Link
              key={guide.href}
              href={guide.href}
              className="bg-white rounded-xl border border-gray-200 p-8 hover:border-blue-600 hover:shadow-md transition group"
            >
              <div className="mb-4">{guide.icon}</div>
              <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition">
                {guide.title}
              </h2>
              <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                {guide.description}
              </p>
            </Link>
          ))}
        </div>
      </main>

      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs text-gray-500">&copy; 2026 HomeCare Leads. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
