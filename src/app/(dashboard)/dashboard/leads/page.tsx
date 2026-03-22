"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";

interface LeadMatch {
  matchId: string;
  matchStatus: string;
  matchScore: number | null;
  isExclusive: boolean;
  deliveredAt: string | null;
  viewedAt: string | null;
  contactedAt: string | null;
  acceptedAt: string | null;
  passedAt: string | null;
  leadId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  careType: string;
  careDescription: string | null;
  zip: string;
  city: string | null;
  state: string | null;
  urgency: string;
  patientFirstName: string | null;
  patientAge: number | null;
  hoursPerWeek: number | null;
  score: string | null;
  createdAt: string;
}

const SCORE_COLORS: Record<string, string> = {
  hot: "bg-red-100 text-red-700 border-red-200",
  warm: "bg-amber-100 text-amber-700 border-amber-200",
  cold: "bg-gray-100 text-gray-600 border-gray-200",
};

const STATUS_COLORS: Record<string, string> = {
  delivered: "bg-blue-100 text-blue-700",
  viewed: "bg-purple-100 text-purple-700",
  contacted: "bg-green-100 text-green-700",
  accepted: "bg-emerald-100 text-emerald-700",
  passed: "bg-gray-200 text-gray-500",
  pending: "bg-gray-100 text-gray-600",
  expired: "bg-gray-100 text-gray-400",
};

const LEAD_PRICES: Record<string, number> = {
  companion_care: 75,
  personal_care: 75,
  respite_care: 75,
  other: 75,
  skilled_nursing: 150,
  post_surgery: 150,
  dementia_care: 150,
  live_in_care: 200,
  hospice_support: 200,
};

function getLeadPrice(careType: string, isExclusive: boolean) {
  const base = LEAD_PRICES[careType] ?? 75;
  return isExclusive ? Math.round(base * 1.5) : base;
}

function formatCareType(ct: string) {
  return ct.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatUrgency(u: string) {
  return u.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function timeAgo(date: string) {
  const ms = Date.now() - new Date(date).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function statusLabel(status: string) {
  switch (status) {
    case "delivered":
      return "New";
    case "accepted":
      return "Accepted";
    case "passed":
      return "Passed";
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
}

export default function LeadsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [leads, setLeads] = useState<LeadMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  const fetchLeads = useCallback(async () => {
    try {
      const res = await fetch("/api/leads/mine");
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads ?? []);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") fetchLeads();
  }, [status, fetchLeads]);

  async function updateStatus(matchId: string, newStatus: string) {
    await fetch("/api/leads/mine", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matchId, status: newStatus }),
    });
    fetchLeads();
  }

  async function acceptLead(matchId: string) {
    setActionLoading(matchId);
    try {
      const res = await fetch("/api/leads/mine/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to accept lead");
        return;
      }
      fetchLeads();
    } catch {
      alert("Failed to accept lead");
    } finally {
      setActionLoading(null);
    }
  }

  async function passLead(matchId: string) {
    if (!confirm("Are you sure you want to pass on this lead? This cannot be undone.")) return;
    setActionLoading(matchId);
    try {
      const res = await fetch("/api/leads/mine/pass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to pass on lead");
        return;
      }
      fetchLeads();
    } catch {
      alert("Failed to pass on lead");
    } finally {
      setActionLoading(null);
    }
  }

  const filtered =
    filter === "all"
      ? leads
      : filter === "actionable"
        ? leads.filter((l) => !["accepted", "passed", "expired"].includes(l.matchStatus))
        : leads.filter((l) => l.matchStatus === filter || l.score === filter);

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

  const hotCount = leads.filter((l) => l.score === "hot").length;
  const warmCount = leads.filter((l) => l.score === "warm").length;
  const newCount = leads.filter((l) => l.matchStatus === "delivered").length;
  const acceptedCount = leads.filter((l) => l.matchStatus === "accepted").length;
  const actionableCount = leads.filter(
    (l) => !["accepted", "passed", "expired"].includes(l.matchStatus)
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />

      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your Leads</h1>
            <p className="text-gray-500 mt-1">
              {leads.length} total lead{leads.length !== 1 ? "s" : ""} delivered
              {actionableCount > 0 && (
                <span className="text-blue-600 font-medium"> &middot; {actionableCount} need action</span>
              )}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-3xl font-bold text-red-600">{hotCount}</p>
            <p className="text-sm text-gray-500">Hot Leads</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-3xl font-bold text-amber-600">{warmCount}</p>
            <p className="text-sm text-gray-500">Warm Leads</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{newCount}</p>
            <p className="text-sm text-gray-500">New (Unviewed)</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-3xl font-bold text-emerald-600">{acceptedCount}</p>
            <p className="text-sm text-gray-500">Accepted</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { value: "all", label: "All" },
            { value: "actionable", label: "Needs Action" },
            { value: "hot", label: "Hot" },
            { value: "warm", label: "Warm" },
            { value: "delivered", label: "New" },
            { value: "viewed", label: "Viewed" },
            { value: "contacted", label: "Contacted" },
            { value: "accepted", label: "Accepted" },
            { value: "passed", label: "Passed" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                filter === f.value
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Lead list */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-gray-500 text-lg">
              {leads.length === 0
                ? "No leads yet. Leads will appear here as families submit care requests in your area."
                : "No leads match this filter."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((lead) => {
              const canAct = !["accepted", "passed", "expired"].includes(lead.matchStatus);
              const price = getLeadPrice(lead.careType, lead.isExclusive);
              const isLoading = actionLoading === lead.matchId;

              return (
                <div
                  key={lead.matchId}
                  className={`bg-white rounded-xl border overflow-hidden ${
                    lead.matchStatus === "passed"
                      ? "border-gray-200 opacity-60"
                      : lead.matchStatus === "accepted"
                        ? "border-emerald-200"
                        : "border-gray-200"
                  }`}
                >
                  {/* Lead header row */}
                  <button
                    onClick={() => {
                      setExpandedId(
                        expandedId === lead.matchId ? null : lead.matchId
                      );
                      if (lead.matchStatus === "delivered") {
                        updateStatus(lead.matchId, "viewed");
                      }
                    }}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition text-left"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      {/* Score badge */}
                      {lead.score && (
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                            SCORE_COLORS[lead.score] || SCORE_COLORS.cold
                          }`}
                        >
                          {lead.score.toUpperCase()}
                        </span>
                      )}

                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {lead.firstName} {lead.lastName.charAt(0)}.
                          <span className="font-normal text-gray-500 ml-2">
                            {formatCareType(lead.careType)}
                          </span>
                          {lead.isExclusive && (
                            <span className="ml-2 px-1.5 py-0.5 bg-violet-100 text-violet-700 text-xs font-medium rounded">
                              Exclusive
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-500">
                          {lead.city ? `${lead.city}, ` : ""}
                          {lead.state || ""} {lead.zip}
                          {" \u00b7 "}
                          {formatUrgency(lead.urgency)}
                          {lead.deliveredAt && ` \u00b7 ${timeAgo(lead.deliveredAt)}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {canAct && (
                        <span className="text-sm font-semibold text-gray-700">
                          ${price}
                        </span>
                      )}
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          STATUS_COLORS[lead.matchStatus] || STATUS_COLORS.pending
                        }`}
                      >
                        {statusLabel(lead.matchStatus)}
                      </span>
                      <svg
                        className={`w-5 h-5 text-gray-400 transition ${
                          expandedId === lead.matchId ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </button>

                  {/* Expanded details */}
                  {expandedId === lead.matchId && (
                    <div className="px-6 pb-5 border-t border-gray-100">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-2">
                            Contact Info
                          </h3>
                          <p className="text-sm">
                            <strong>Name:</strong> {lead.firstName} {lead.lastName}
                          </p>
                          <p className="text-sm">
                            <strong>Email:</strong>{" "}
                            <a
                              href={`mailto:${lead.email}`}
                              className="text-blue-600 hover:underline"
                            >
                              {lead.email}
                            </a>
                          </p>
                          <p className="text-sm">
                            <strong>Phone:</strong>{" "}
                            <a
                              href={`tel:${lead.phone}`}
                              className="text-blue-600 hover:underline"
                            >
                              {lead.phone}
                            </a>
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-2">
                            Care Details
                          </h3>
                          <p className="text-sm">
                            <strong>Type:</strong> {formatCareType(lead.careType)}
                          </p>
                          {lead.patientFirstName && (
                            <p className="text-sm">
                              <strong>Patient:</strong> {lead.patientFirstName}
                              {lead.patientAge ? `, age ${lead.patientAge}` : ""}
                            </p>
                          )}
                          {lead.hoursPerWeek && (
                            <p className="text-sm">
                              <strong>Hours/Week:</strong> {lead.hoursPerWeek}
                            </p>
                          )}
                        </div>
                      </div>
                      {lead.careDescription && (
                        <div className="mt-3">
                          <h3 className="text-sm font-medium text-gray-500 mb-1">
                            Description
                          </h3>
                          <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                            {lead.careDescription}
                          </p>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex flex-wrap gap-3 mt-4">
                        {canAct && (
                          <>
                            <button
                              onClick={() => acceptLead(lead.matchId)}
                              disabled={isLoading}
                              className="bg-emerald-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isLoading ? "Processing..." : `Accept Lead ($${price})`}
                            </button>
                            <button
                              onClick={() => passLead(lead.matchId)}
                              disabled={isLoading}
                              className="border border-gray-300 text-gray-600 px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Pass
                            </button>
                          </>
                        )}

                        {lead.matchStatus === "accepted" && (
                          <div className="flex items-center gap-2 text-emerald-700 text-sm font-medium">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Accepted &middot; Intro email sent to family
                          </div>
                        )}

                        {lead.matchStatus === "passed" && (
                          <div className="text-gray-500 text-sm">
                            You passed on this lead
                          </div>
                        )}

                        {lead.matchStatus !== "contacted" && lead.matchStatus !== "passed" && (
                          <button
                            onClick={() => updateStatus(lead.matchId, "contacted")}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition"
                          >
                            Mark Contacted
                          </button>
                        )}

                        <a
                          href={`mailto:${lead.email}`}
                          className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition"
                        >
                          Send Email
                        </a>
                        <a
                          href={`tel:${lead.phone}`}
                          className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                        >
                          Call
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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
            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition"
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
