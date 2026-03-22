"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";

interface BillingEvent {
  id: string;
  type: string;
  amountCents: number;
  careType: string;
  isExclusive: boolean;
  status: string;
  failureReason: string | null;
  stripePaymentIntentId: string | null;
  createdAt: string;
  leadFirstName: string;
  leadLastName: string;
  leadCity: string | null;
  leadState: string | null;
  leadZip: string;
}

interface BillingSummary {
  totalChargedCents: number;
  totalLeadsAccepted: number;
  failedCharges: number;
}

function formatCareType(ct: string) {
  return ct.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const STATUS_STYLES: Record<string, string> = {
  succeeded: "bg-emerald-100 text-emerald-700",
  failed: "bg-red-100 text-red-700",
  pending: "bg-amber-100 text-amber-700",
  refunded: "bg-blue-100 text-blue-700",
};

export default function BillingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState<BillingEvent[]>([]);
  const [summary, setSummary] = useState<BillingSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  const fetchBilling = useCallback(async () => {
    try {
      const res = await fetch("/api/billing");
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events ?? []);
        setSummary(data.summary ?? null);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") fetchBilling();
  }, [status, fetchBilling]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Nav />
        <div className="flex items-center justify-center py-32">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600" />
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />

      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
          <p className="text-gray-500 mt-1">
            Per-lead charges and payment history
          </p>
        </div>

        {/* Summary cards */}
        {summary && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-sm text-gray-500 mb-1">Total Charged</p>
              <p className="text-3xl font-bold text-gray-900">
                ${(summary.totalChargedCents / 100).toFixed(2)}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-sm text-gray-500 mb-1">Leads Accepted</p>
              <p className="text-3xl font-bold text-emerald-600">
                {summary.totalLeadsAccepted}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-sm text-gray-500 mb-1">Failed Charges</p>
              <p className="text-3xl font-bold text-red-600">
                {summary.failedCharges}
              </p>
            </div>
          </div>
        )}

        {/* Transaction table */}
        {events.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-gray-500 text-lg">
              No billing events yet. Charges will appear here when you accept leads.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Date</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Lead</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Care Type</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Type</th>
                    <th className="text-right px-5 py-3 font-medium text-gray-500">Amount</th>
                    <th className="text-center px-5 py-3 font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {events.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50 transition">
                      <td className="px-5 py-3 text-gray-600 whitespace-nowrap">
                        {formatDate(event.createdAt)}
                      </td>
                      <td className="px-5 py-3">
                        <p className="font-medium text-gray-900">
                          {event.leadFirstName} {event.leadLastName.charAt(0)}.
                        </p>
                        <p className="text-xs text-gray-500">
                          {event.leadCity ? `${event.leadCity}, ` : ""}{event.leadState || ""} {event.leadZip}
                        </p>
                      </td>
                      <td className="px-5 py-3 text-gray-600">
                        {formatCareType(event.careType)}
                        {event.isExclusive && (
                          <span className="ml-1 px-1.5 py-0.5 bg-violet-100 text-violet-700 text-xs font-medium rounded">
                            Exclusive
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-gray-600 capitalize">
                        {event.type.replace(/_/g, " ")}
                      </td>
                      <td className="px-5 py-3 text-right font-semibold text-gray-900">
                        ${(event.amountCents / 100).toFixed(2)}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            STATUS_STYLES[event.status] || STATUS_STYLES.pending
                          }`}
                        >
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </span>
                        {event.failureReason && (
                          <p className="text-xs text-red-500 mt-1">{event.failureReason}</p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function Nav() {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2">
            <svg
              className="w-7 h-7 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z"
              />
            </svg>
            <span className="text-lg font-bold text-gray-900">
              HomeCare Leads
            </span>
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/leads"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition"
          >
            Leads
          </Link>
          <Link
            href="/dashboard/billing"
            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition"
          >
            Billing
          </Link>
          <Link
            href="/dashboard/disputes"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition"
          >
            Disputes
          </Link>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-sm font-medium text-gray-500 hover:text-red-600 transition"
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
}
