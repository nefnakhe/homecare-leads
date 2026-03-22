"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";

interface Dispute {
  id: string;
  reason: string;
  description: string;
  status: string;
  amountCents: number;
  adminNote: string | null;
  resolvedAt: string | null;
  createdAt: string;
  leadFirstName: string;
  leadLastName: string;
  leadCareType: string;
  leadCity: string | null;
  leadState: string | null;
  leadZip: string;
}

interface LeadMatch {
  matchId: string;
  matchStatus: string;
  leadId: string;
  firstName: string;
  lastName: string;
  careType: string;
  city: string | null;
  state: string | null;
  zip: string;
}

const REASON_LABELS: Record<string, string> = {
  invalid_contact: "Invalid Contact Info",
  not_private_pay: "Not Actually Private Pay",
  wrong_location: "Wrong Location",
  duplicate_lead: "Duplicate Lead",
  not_seeking_care: "Not Seeking Care",
  other: "Other",
};

const STATUS_STYLES: Record<string, string> = {
  open: "bg-amber-100 text-amber-700",
  under_review: "bg-blue-100 text-blue-700",
  approved: "bg-emerald-100 text-emerald-700",
  denied: "bg-red-100 text-red-700",
};

function formatCareType(ct: string) {
  return ct.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatStatus(s: string) {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function DisputesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [acceptedLeads, setAcceptedLeads] = useState<LeadMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState("");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  const fetchData = useCallback(async () => {
    try {
      const [disputesRes, leadsRes] = await Promise.all([
        fetch("/api/disputes"),
        fetch("/api/leads/mine"),
      ]);

      if (disputesRes.ok) {
        const data = await disputesRes.json();
        setDisputes(data.disputes ?? []);
      }

      if (leadsRes.ok) {
        const data = await leadsRes.json();
        const accepted = (data.leads ?? []).filter(
          (l: LeadMatch) => l.matchStatus === "accepted"
        );
        setAcceptedLeads(accepted);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") fetchData();
  }, [status, fetchData]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/disputes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId: selectedMatch,
          reason,
          description,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to submit dispute");
        return;
      }

      setShowForm(false);
      setSelectedMatch("");
      setReason("");
      setDescription("");
      fetchData();
    } catch {
      setError("Failed to submit dispute");
    } finally {
      setSubmitting(false);
    }
  }

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

  // Filter out leads that already have disputes
  const disputedMatchIds = new Set(
    disputes.map((d) => {
      // We need to find the matchId — but disputes don't store matchId in the GET response
      // So we filter by lead name matching
      return `${d.leadFirstName}-${d.leadLastName}`;
    })
  );
  const disputeableLeads = acceptedLeads.filter(
    (l) => !disputedMatchIds.has(`${l.firstName}-${l.lastName}`)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />

      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Disputes</h1>
            <p className="text-gray-500 mt-1">
              Dispute leads with invalid info, wrong location, or other issues
            </p>
          </div>
          {disputeableLeads.length > 0 && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              {showForm ? "Cancel" : "New Dispute"}
            </button>
          )}
        </div>

        {/* New Dispute Form */}
        {showForm && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Submit a Dispute
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Lead
                </label>
                <select
                  value={selectedMatch}
                  onChange={(e) => setSelectedMatch(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a lead...</option>
                  {disputeableLeads.map((lead) => (
                    <option key={lead.matchId} value={lead.matchId}>
                      {lead.firstName} {lead.lastName.charAt(0)}. —{" "}
                      {formatCareType(lead.careType)} —{" "}
                      {lead.city ? `${lead.city}, ` : ""}
                      {lead.state || ""} {lead.zip}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a reason...</option>
                  {Object.entries(REASON_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  minLength={10}
                  maxLength={2000}
                  rows={4}
                  placeholder="Please describe the issue in detail..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit Dispute"}
              </button>
            </form>
          </div>
        )}

        {/* Disputes list */}
        {disputes.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-gray-500 text-lg">
              No disputes yet. If you receive a lead with invalid information,
              you can submit a dispute for review.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left px-5 py-3 font-medium text-gray-500">
                      Date
                    </th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">
                      Lead
                    </th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">
                      Reason
                    </th>
                    <th className="text-right px-5 py-3 font-medium text-gray-500">
                      Amount
                    </th>
                    <th className="text-center px-5 py-3 font-medium text-gray-500">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {disputes.map((dispute) => (
                    <tr key={dispute.id} className="hover:bg-gray-50 transition">
                      <td className="px-5 py-3 text-gray-600 whitespace-nowrap">
                        {formatDate(dispute.createdAt)}
                      </td>
                      <td className="px-5 py-3">
                        <p className="font-medium text-gray-900">
                          {dispute.leadFirstName}{" "}
                          {dispute.leadLastName.charAt(0)}.
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatCareType(dispute.leadCareType)} —{" "}
                          {dispute.leadCity ? `${dispute.leadCity}, ` : ""}
                          {dispute.leadState || ""} {dispute.leadZip}
                        </p>
                      </td>
                      <td className="px-5 py-3">
                        <p className="text-gray-900">
                          {REASON_LABELS[dispute.reason] || dispute.reason}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                          {dispute.description}
                        </p>
                      </td>
                      <td className="px-5 py-3 text-right font-semibold text-gray-900">
                        ${(dispute.amountCents / 100).toFixed(2)}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            STATUS_STYLES[dispute.status] ||
                            STATUS_STYLES.open
                          }`}
                        >
                          {formatStatus(dispute.status)}
                        </span>
                        {dispute.adminNote && (
                          <p className="text-xs text-gray-500 mt-1">
                            {dispute.adminNote}
                          </p>
                        )}
                        {dispute.status === "approved" && (
                          <p className="text-xs text-emerald-600 mt-1">
                            Refund processed
                          </p>
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
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition"
          >
            Billing
          </Link>
          <Link
            href="/dashboard/disputes"
            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition"
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
