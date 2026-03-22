"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";

// ─── Types ───────────────────────────────────────────────────────────
interface AdminLead {
  matchId: string;
  matchStatus: string;
  adminConfirmed: boolean;
  adminConfirmedAt: string | null;
  deliveredAt: string | null;
  acceptedAt: string | null;
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
  paymentType: string;
  score: string | null;
  budgetMin: number | null;
  budgetMax: number | null;
  hoursPerWeek: number | null;
  leadCreatedAt: string;
  agencyId: string;
  agencyName: string;
  agencyEmail: string;
  agencyPhone: string | null;
  stripeCustomerId: string | null;
}

interface AdminAgency {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  website: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  serviceAreaZips: string[];
  specialties: string[];
  onboardingStatus: string;
  adminApproved: boolean;
  stripeCustomerId: string | null;
  priorityPassExpiresAt: string | null;
  createdAt: string;
}

interface AdminDispute {
  id: string;
  reason: string;
  description: string;
  status: string;
  amountCents: number;
  adminNote: string | null;
  resolvedAt: string | null;
  createdAt: string;
  agencyName: string;
  agencyEmail: string;
  leadFirstName: string;
  leadLastName: string;
  leadEmail: string;
  leadPhone: string;
  leadCareType: string;
  leadCity: string | null;
  leadState: string | null;
  leadZip: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────
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

function formatStatus(s: string) {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
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

const SCORE_COLORS: Record<string, string> = {
  hot: "bg-red-100 text-red-700",
  warm: "bg-amber-100 text-amber-700",
  cold: "bg-gray-100 text-gray-600",
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<"leads" | "agencies" | "disputes">("leads");
  const [forbidden, setForbidden] = useState(false);
  const [loading, setLoading] = useState(true);

  // Leads state
  const [adminLeads, setAdminLeads] = useState<AdminLead[]>([]);
  const [leadsSummary, setLeadsSummary] = useState<{ total: number; pendingReview: number; confirmed: number } | null>(null);
  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);
  const [leadFilter, setLeadFilter] = useState<string>("pending");
  const [leadActionLoading, setLeadActionLoading] = useState<string | null>(null);

  // Agencies state
  const [adminAgencies, setAdminAgencies] = useState<AdminAgency[]>([]);
  const [agencyActionLoading, setAgencyActionLoading] = useState<string | null>(null);

  // Disputes state
  const [disputes, setDisputes] = useState<AdminDispute[]>([]);
  const [disputeSummary, setDisputeSummary] = useState<{ total: number; open: number; underReview: number; approved: number; denied: number } | null>(null);
  const [expandedDisputeId, setExpandedDisputeId] = useState<string | null>(null);
  const [disputeFilter, setDisputeFilter] = useState<string>("all");
  const [disputeActionLoading, setDisputeActionLoading] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  const fetchLeads = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/leads");
      if (res.status === 403) { setForbidden(true); return; }
      if (res.ok) {
        const data = await res.json();
        setAdminLeads(data.matches ?? []);
        setLeadsSummary(data.summary ?? null);
      }
    } catch { /* silently fail */ }
  }, []);

  const fetchAgencies = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/agencies");
      if (res.ok) {
        const data = await res.json();
        setAdminAgencies(data.agencies ?? []);
      }
    } catch { /* silently fail */ }
  }, []);

  const fetchDisputes = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/disputes");
      if (res.ok) {
        const data = await res.json();
        setDisputes(data.disputes ?? []);
        setDisputeSummary(data.summary ?? null);
      }
    } catch { /* silently fail */ }
  }, []);

  useEffect(() => {
    if (status !== "authenticated") return;
    Promise.all([fetchLeads(), fetchAgencies(), fetchDisputes()]).finally(() =>
      setLoading(false)
    );
  }, [status, fetchLeads, fetchAgencies, fetchDisputes]);

  async function confirmLead(matchId: string, action: "confirm" | "reject") {
    const confirmMsg =
      action === "confirm"
        ? "Confirm this lead and charge the agency $2,300?"
        : "Reject this lead? No charges will be applied.";
    if (!confirm(confirmMsg)) return;

    setLeadActionLoading(matchId);
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId, action }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed");
        return;
      }
      if (action === "confirm" && !data.allChargesSucceeded) {
        alert("Warning: Some charges may have failed. Check billing events.");
      }
      fetchLeads();
    } catch {
      alert("Failed to process lead");
    } finally {
      setLeadActionLoading(null);
    }
  }

  async function toggleAgencyApproval(agencyId: string, approved: boolean) {
    setAgencyActionLoading(agencyId);
    try {
      const res = await fetch("/api/admin/agencies", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agencyId, approved }),
      });
      if (res.ok) fetchAgencies();
    } catch {
      alert("Failed to update agency");
    } finally {
      setAgencyActionLoading(null);
    }
  }

  async function resolveDispute(disputeId: string, resolution: "approved" | "denied") {
    const confirmMsg =
      resolution === "approved"
        ? "Approve this dispute and issue a refund?"
        : "Deny this dispute? The agency will not receive a refund.";
    if (!confirm(confirmMsg)) return;

    setDisputeActionLoading(disputeId);
    try {
      const res = await fetch("/api/admin/disputes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          disputeId,
          resolution,
          adminNote: adminNotes[disputeId] || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to resolve dispute");
        return;
      }
      fetchDisputes();
    } catch {
      alert("Failed to resolve dispute");
    } finally {
      setDisputeActionLoading(null);
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNav />
        <div className="flex items-center justify-center py-32">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600" />
        </div>
      </div>
    );
  }

  if (!session) return null;

  if (forbidden) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNav />
        <div className="max-w-5xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-500">You do not have admin privileges.</p>
        </div>
      </div>
    );
  }

  // Filter leads
  const filteredLeads =
    leadFilter === "all"
      ? adminLeads
      : leadFilter === "pending"
        ? adminLeads.filter((l) => !l.adminConfirmed && l.matchStatus !== "passed")
        : adminLeads.filter((l) => l.adminConfirmed);

  // Filter disputes
  const filteredDisputes =
    disputeFilter === "all"
      ? disputes
      : disputeFilter === "pending"
        ? disputes.filter((d) => d.status === "open" || d.status === "under_review")
        : disputes.filter((d) => d.status === disputeFilter);

  const pendingAgencies = adminAgencies.filter(
    (a) => a.onboardingStatus === "complete" && !a.adminApproved
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />

      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Manage leads, agencies, and disputes
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-blue-200 p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">
              {leadsSummary?.pendingReview ?? 0}
            </p>
            <p className="text-sm text-gray-500">Leads to Review</p>
          </div>
          <div className="bg-white rounded-xl border border-emerald-200 p-4 text-center">
            <p className="text-3xl font-bold text-emerald-600">
              {leadsSummary?.confirmed ?? 0}
            </p>
            <p className="text-sm text-gray-500">Leads Confirmed</p>
          </div>
          <div className="bg-white rounded-xl border border-amber-200 p-4 text-center">
            <p className="text-3xl font-bold text-amber-600">
              {pendingAgencies.length}
            </p>
            <p className="text-sm text-gray-500">Agencies Pending</p>
          </div>
          <div className="bg-white rounded-xl border border-red-200 p-4 text-center">
            <p className="text-3xl font-bold text-red-600">
              {disputeSummary?.open ?? 0}
            </p>
            <p className="text-sm text-gray-500">Open Disputes</p>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {(
            [
              { value: "leads" as const, label: "Lead Review", count: leadsSummary?.pendingReview },
              { value: "agencies" as const, label: "Agencies", count: pendingAgencies.length },
              { value: "disputes" as const, label: "Disputes", count: disputeSummary?.open },
            ] as const
          ).map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
                tab === t.value
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.label}
              {(t.count ?? 0) > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ─── LEADS TAB ─── */}
        {tab === "leads" && (
          <>
            <div className="flex gap-2 mb-6">
              {[
                { value: "pending", label: "Needs Review" },
                { value: "confirmed", label: "Confirmed" },
                { value: "all", label: "All" },
              ].map((f) => (
                <button
                  key={f.value}
                  onClick={() => setLeadFilter(f.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    leadFilter === f.value
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {filteredLeads.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <p className="text-gray-500 text-lg">
                  {adminLeads.length === 0 ? "No leads yet." : "No leads match this filter."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredLeads.map((lead) => {
                  const isLoading = leadActionLoading === lead.matchId;
                  return (
                    <div
                      key={lead.matchId}
                      className={`bg-white rounded-xl border overflow-hidden ${
                        lead.adminConfirmed ? "border-emerald-200" : "border-gray-200"
                      }`}
                    >
                      <button
                        onClick={() =>
                          setExpandedLeadId(
                            expandedLeadId === lead.matchId ? null : lead.matchId
                          )
                        }
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition text-left"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          {lead.score && (
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${SCORE_COLORS[lead.score] || SCORE_COLORS.cold}`}>
                              {lead.score.toUpperCase()}
                            </span>
                          )}
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 truncate">
                              {lead.firstName} {lead.lastName.charAt(0)}.
                              <span className="font-normal text-gray-500 ml-2">
                                {formatCareType(lead.careType)}
                              </span>
                              <span className="font-normal text-gray-400 ml-2">
                                &rarr; {lead.agencyName}
                              </span>
                            </p>
                            <p className="text-sm text-gray-500">
                              {lead.city ? `${lead.city}, ` : ""}{lead.state || ""} {lead.zip}
                              {lead.deliveredAt && ` · ${formatDate(lead.deliveredAt)}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          {lead.adminConfirmed ? (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                              Confirmed
                            </span>
                          ) : lead.matchStatus === "passed" ? (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-500">
                              Passed
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                              Pending Review
                            </span>
                          )}
                          <span className="text-sm font-semibold text-gray-700">$2,300</span>
                          <svg
                            className={`w-5 h-5 text-gray-400 transition ${expandedLeadId === lead.matchId ? "rotate-180" : ""}`}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>

                      {expandedLeadId === lead.matchId && (
                        <div className="px-6 pb-5 border-t border-gray-100">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                            <div>
                              <h3 className="text-sm font-medium text-gray-500 mb-2">Lead Contact</h3>
                              <p className="text-sm"><strong>Name:</strong> {lead.firstName} {lead.lastName}</p>
                              <p className="text-sm"><strong>Email:</strong> {lead.email}</p>
                              <p className="text-sm"><strong>Phone:</strong> {lead.phone}</p>
                              <p className="text-sm"><strong>Payment:</strong> {formatStatus(lead.paymentType)}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-500 mb-2">Care Details</h3>
                              <p className="text-sm"><strong>Type:</strong> {formatCareType(lead.careType)}</p>
                              <p className="text-sm"><strong>Urgency:</strong> {formatStatus(lead.urgency)}</p>
                              {lead.hoursPerWeek && <p className="text-sm"><strong>Hours/Week:</strong> {lead.hoursPerWeek}</p>}
                              {lead.budgetMax && <p className="text-sm"><strong>Budget:</strong> ${lead.budgetMin ?? 0} - ${lead.budgetMax}</p>}
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-500 mb-2">Matched Agency</h3>
                              <p className="text-sm font-medium">{lead.agencyName}</p>
                              <p className="text-sm text-gray-600">{lead.agencyEmail}</p>
                              {lead.agencyPhone && <p className="text-sm text-gray-600">{lead.agencyPhone}</p>}
                              <p className="text-sm text-gray-500 mt-1">
                                {lead.stripeCustomerId ? "Payment method on file" : "No payment method"}
                              </p>
                            </div>
                          </div>
                          {lead.careDescription && (
                            <div className="mt-3">
                              <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                              <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{lead.careDescription}</p>
                            </div>
                          )}

                          {!lead.adminConfirmed && lead.matchStatus !== "passed" && (
                            <div className="flex gap-3 mt-4">
                              <button
                                onClick={() => confirmLead(lead.matchId, "confirm")}
                                disabled={isLoading || !lead.stripeCustomerId}
                                className="bg-emerald-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isLoading ? "Processing..." : "Confirm & Charge $2,300"}
                              </button>
                              <button
                                onClick={() => confirmLead(lead.matchId, "reject")}
                                disabled={isLoading}
                                className="border border-red-300 text-red-600 px-5 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Reject Lead
                              </button>
                              {!lead.stripeCustomerId && (
                                <p className="text-sm text-red-500 self-center">Agency has no payment method</p>
                              )}
                            </div>
                          )}

                          {lead.adminConfirmed && (
                            <div className="mt-4 p-3 bg-emerald-50 rounded-lg">
                              <p className="text-sm text-emerald-700 font-medium">
                                Confirmed — $2,300 charged to {lead.agencyName}
                                {lead.adminConfirmedAt && ` on ${formatDate(lead.adminConfirmedAt)}`}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ─── AGENCIES TAB ─── */}
        {tab === "agencies" && (
          <div className="space-y-3">
            {adminAgencies.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <p className="text-gray-500 text-lg">No agencies registered yet.</p>
              </div>
            ) : (
              adminAgencies.map((agency) => {
                const hasPriorityPass =
                  agency.priorityPassExpiresAt &&
                  new Date(agency.priorityPassExpiresAt) > new Date();
                const isLoading = agencyActionLoading === agency.id;

                return (
                  <div key={agency.id} className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">{agency.name}</h3>
                          {agency.adminApproved ? (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                              Approved
                            </span>
                          ) : agency.onboardingStatus === "complete" ? (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                              Pending Approval
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                              Onboarding
                            </span>
                          )}
                          {hasPriorityPass && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-700">
                              Priority Pass
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{agency.email}</p>
                        <p className="text-sm text-gray-500">
                          {agency.city ? `${agency.city}, ` : ""}{agency.state || ""} {agency.zip}
                          {agency.phone && ` · ${agency.phone}`}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Specialties: {(agency.specialties as string[]).map(formatCareType).join(", ") || "None"}
                        </p>
                        <p className="text-sm text-gray-500">
                          Service ZIPs: {(agency.serviceAreaZips as string[]).join(", ") || "None"}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Registered {formatDate(agency.createdAt)}
                          {agency.stripeCustomerId ? " · Payment method on file" : " · No payment method"}
                        </p>
                      </div>
                      <div className="shrink-0">
                        {agency.onboardingStatus === "complete" && (
                          <button
                            onClick={() => toggleAgencyApproval(agency.id, !agency.adminApproved)}
                            disabled={isLoading}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50 ${
                              agency.adminApproved
                                ? "border border-red-300 text-red-600 hover:bg-red-50"
                                : "bg-emerald-600 text-white hover:bg-emerald-700"
                            }`}
                          >
                            {isLoading ? "..." : agency.adminApproved ? "Revoke" : "Approve"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ─── DISPUTES TAB ─── */}
        {tab === "disputes" && (
          <>
            <div className="flex gap-2 mb-6">
              {[
                { value: "all", label: "All" },
                { value: "pending", label: "Needs Action" },
                { value: "open", label: "Open" },
                { value: "under_review", label: "Under Review" },
                { value: "approved", label: "Approved" },
                { value: "denied", label: "Denied" },
              ].map((f) => (
                <button
                  key={f.value}
                  onClick={() => setDisputeFilter(f.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                    disputeFilter === f.value
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {filteredDisputes.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <p className="text-gray-500 text-lg">
                  {disputes.length === 0 ? "No disputes submitted yet." : "No disputes match this filter."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredDisputes.map((dispute) => {
                  const isResolved = dispute.status === "approved" || dispute.status === "denied";
                  const isLoading = disputeActionLoading === dispute.id;

                  return (
                    <div
                      key={dispute.id}
                      className={`bg-white rounded-xl border overflow-hidden ${
                        isResolved ? "border-gray-200 opacity-75" : "border-gray-200"
                      }`}
                    >
                      <button
                        onClick={() => setExpandedDisputeId(expandedDisputeId === dispute.id ? null : dispute.id)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition text-left"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0 ${STATUS_STYLES[dispute.status] || STATUS_STYLES.open}`}>
                            {formatStatus(dispute.status)}
                          </span>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 truncate">
                              {dispute.agencyName}
                              <span className="font-normal text-gray-500 ml-2">
                                disputing {dispute.leadFirstName} {dispute.leadLastName.charAt(0)}.
                              </span>
                            </p>
                            <p className="text-sm text-gray-500">
                              {REASON_LABELS[dispute.reason] || dispute.reason} — {formatDate(dispute.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-sm font-semibold text-gray-700">
                            ${(dispute.amountCents / 100).toFixed(2)}
                          </span>
                          <svg
                            className={`w-5 h-5 text-gray-400 transition ${expandedDisputeId === dispute.id ? "rotate-180" : ""}`}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>

                      {expandedDisputeId === dispute.id && (
                        <div className="px-6 pb-5 border-t border-gray-100">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                            <div>
                              <h3 className="text-sm font-medium text-gray-500 mb-2">Agency</h3>
                              <p className="text-sm font-medium">{dispute.agencyName}</p>
                              <p className="text-sm text-gray-600">{dispute.agencyEmail}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-500 mb-2">Lead</h3>
                              <p className="text-sm font-medium">{dispute.leadFirstName} {dispute.leadLastName}</p>
                              <p className="text-sm text-gray-600">{dispute.leadEmail}</p>
                              <p className="text-sm text-gray-600">{dispute.leadPhone}</p>
                              <p className="text-sm text-gray-500">
                                {formatCareType(dispute.leadCareType)} — {dispute.leadCity ? `${dispute.leadCity}, ` : ""}{dispute.leadState || ""} {dispute.leadZip}
                              </p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-500 mb-2">Dispute Details</h3>
                              <p className="text-sm"><span className="font-medium">Reason:</span> {REASON_LABELS[dispute.reason] || dispute.reason}</p>
                              <p className="text-sm"><span className="font-medium">Amount:</span> ${(dispute.amountCents / 100).toFixed(2)}</p>
                            </div>
                          </div>
                          <div className="mt-3">
                            <h3 className="text-sm font-medium text-gray-500 mb-1">Agency Description</h3>
                            <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{dispute.description}</p>
                          </div>

                          {isResolved ? (
                            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm">
                                <span className="font-medium">Resolution:</span>{" "}
                                <span className={dispute.status === "approved" ? "text-emerald-700" : "text-red-700"}>
                                  {formatStatus(dispute.status)}
                                </span>
                                {dispute.resolvedAt && (
                                  <span className="text-gray-500 ml-2">on {formatDate(dispute.resolvedAt)}</span>
                                )}
                              </p>
                              {dispute.adminNote && <p className="text-sm text-gray-600 mt-1">Note: {dispute.adminNote}</p>}
                              {dispute.status === "approved" && (
                                <p className="text-sm text-emerald-600 mt-1 font-medium">
                                  Refund of ${(dispute.amountCents / 100).toFixed(2)} has been processed
                                </p>
                              )}
                            </div>
                          ) : (
                            <div className="mt-4 space-y-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Note (optional)</label>
                                <textarea
                                  value={adminNotes[dispute.id] || ""}
                                  onChange={(e) => setAdminNotes((prev) => ({ ...prev, [dispute.id]: e.target.value }))}
                                  rows={2}
                                  placeholder="Add a note about this resolution..."
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                              <div className="flex gap-3">
                                <button
                                  onClick={() => resolveDispute(dispute.id, "approved")}
                                  disabled={isLoading}
                                  className="bg-emerald-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {isLoading ? "Processing..." : `Approve & Refund $${(dispute.amountCents / 100).toFixed(2)}`}
                                </button>
                                <button
                                  onClick={() => resolveDispute(dispute.id, "denied")}
                                  disabled={isLoading}
                                  className="border border-red-300 text-red-600 px-5 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  Deny Dispute
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function AdminNav() {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/admin" className="flex items-center gap-2">
            <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-lg font-bold text-gray-900">HomeCare Admin</span>
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
