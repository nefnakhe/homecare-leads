"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";

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

interface Summary {
  total: number;
  open: number;
  underReview: number;
  approved: number;
  denied: number;
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
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatStatus(s: string) {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [disputes, setDisputes] = useState<AdminDispute[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  const fetchDisputes = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/disputes");
      if (res.status === 403) {
        setForbidden(true);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setDisputes(data.disputes ?? []);
        setSummary(data.summary ?? null);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") fetchDisputes();
  }, [status, fetchDisputes]);

  async function resolveDispute(disputeId: string, resolution: "approved" | "denied") {
    const confirmMsg =
      resolution === "approved"
        ? "Approve this dispute and issue a refund?"
        : "Deny this dispute? The agency will not receive a refund.";
    if (!confirm(confirmMsg)) return;

    setActionLoading(disputeId);
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
      setActionLoading(null);
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
          <p className="text-gray-500">
            You do not have admin privileges. Contact support if you believe this is an error.
          </p>
        </div>
      </div>
    );
  }

  const filtered =
    filter === "all"
      ? disputes
      : filter === "pending"
        ? disputes.filter((d) => d.status === "open" || d.status === "under_review")
        : disputes.filter((d) => d.status === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />

      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage lead disputes and refunds</p>
        </div>

        {/* Summary cards */}
        {summary && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-3xl font-bold text-gray-900">{summary.total}</p>
              <p className="text-sm text-gray-500">Total</p>
            </div>
            <div className="bg-white rounded-xl border border-amber-200 p-4 text-center">
              <p className="text-3xl font-bold text-amber-600">{summary.open}</p>
              <p className="text-sm text-gray-500">Open</p>
            </div>
            <div className="bg-white rounded-xl border border-blue-200 p-4 text-center">
              <p className="text-3xl font-bold text-blue-600">
                {summary.underReview}
              </p>
              <p className="text-sm text-gray-500">Under Review</p>
            </div>
            <div className="bg-white rounded-xl border border-emerald-200 p-4 text-center">
              <p className="text-3xl font-bold text-emerald-600">
                {summary.approved}
              </p>
              <p className="text-sm text-gray-500">Approved</p>
            </div>
            <div className="bg-white rounded-xl border border-red-200 p-4 text-center">
              <p className="text-3xl font-bold text-red-600">{summary.denied}</p>
              <p className="text-sm text-gray-500">Denied</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
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

        {/* Disputes list */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-gray-500 text-lg">
              {disputes.length === 0
                ? "No disputes submitted yet."
                : "No disputes match this filter."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((dispute) => {
              const isResolved =
                dispute.status === "approved" || dispute.status === "denied";
              const isLoading = actionLoading === dispute.id;

              return (
                <div
                  key={dispute.id}
                  className={`bg-white rounded-xl border overflow-hidden ${
                    isResolved ? "border-gray-200 opacity-75" : "border-gray-200"
                  }`}
                >
                  {/* Header row */}
                  <button
                    onClick={() =>
                      setExpandedId(expandedId === dispute.id ? null : dispute.id)
                    }
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition text-left"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0 ${
                          STATUS_STYLES[dispute.status] || STATUS_STYLES.open
                        }`}
                      >
                        {formatStatus(dispute.status)}
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {dispute.agencyName}
                          <span className="font-normal text-gray-500 ml-2">
                            disputing{" "}
                            {dispute.leadFirstName} {dispute.leadLastName.charAt(0)}.
                          </span>
                        </p>
                        <p className="text-sm text-gray-500">
                          {REASON_LABELS[dispute.reason] || dispute.reason} —{" "}
                          {formatDate(dispute.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm font-semibold text-gray-700">
                        ${(dispute.amountCents / 100).toFixed(2)}
                      </span>
                      <svg
                        className={`w-5 h-5 text-gray-400 transition ${
                          expandedId === dispute.id ? "rotate-180" : ""
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
                  {expandedId === dispute.id && (
                    <div className="px-6 pb-5 border-t border-gray-100">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-2">
                            Agency
                          </h3>
                          <p className="text-sm font-medium">{dispute.agencyName}</p>
                          <p className="text-sm text-gray-600">
                            {dispute.agencyEmail}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-2">
                            Lead
                          </h3>
                          <p className="text-sm font-medium">
                            {dispute.leadFirstName} {dispute.leadLastName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {dispute.leadEmail}
                          </p>
                          <p className="text-sm text-gray-600">
                            {dispute.leadPhone}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatCareType(dispute.leadCareType)} —{" "}
                            {dispute.leadCity ? `${dispute.leadCity}, ` : ""}
                            {dispute.leadState || ""} {dispute.leadZip}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-2">
                            Dispute Details
                          </h3>
                          <p className="text-sm">
                            <span className="font-medium">Reason:</span>{" "}
                            {REASON_LABELS[dispute.reason] || dispute.reason}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">Amount:</span>{" "}
                            ${(dispute.amountCents / 100).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="mt-3">
                        <h3 className="text-sm font-medium text-gray-500 mb-1">
                          Agency Description
                        </h3>
                        <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                          {dispute.description}
                        </p>
                      </div>

                      {/* Admin resolution */}
                      {isResolved ? (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm">
                            <span className="font-medium">Resolution:</span>{" "}
                            <span
                              className={
                                dispute.status === "approved"
                                  ? "text-emerald-700"
                                  : "text-red-700"
                              }
                            >
                              {formatStatus(dispute.status)}
                            </span>
                            {dispute.resolvedAt && (
                              <span className="text-gray-500 ml-2">
                                on {formatDate(dispute.resolvedAt)}
                              </span>
                            )}
                          </p>
                          {dispute.adminNote && (
                            <p className="text-sm text-gray-600 mt-1">
                              Note: {dispute.adminNote}
                            </p>
                          )}
                          {dispute.status === "approved" && (
                            <p className="text-sm text-emerald-600 mt-1 font-medium">
                              Refund of ${(dispute.amountCents / 100).toFixed(2)}{" "}
                              has been processed
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="mt-4 space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Admin Note (optional)
                            </label>
                            <textarea
                              value={adminNotes[dispute.id] || ""}
                              onChange={(e) =>
                                setAdminNotes((prev) => ({
                                  ...prev,
                                  [dispute.id]: e.target.value,
                                }))
                              }
                              rows={2}
                              placeholder="Add a note about this resolution..."
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={() =>
                                resolveDispute(dispute.id, "approved")
                              }
                              disabled={isLoading}
                              className="bg-emerald-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isLoading
                                ? "Processing..."
                                : `Approve & Refund $${(dispute.amountCents / 100).toFixed(2)}`}
                            </button>
                            <button
                              onClick={() =>
                                resolveDispute(dispute.id, "denied")
                              }
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
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span className="text-lg font-bold text-gray-900">
              HomeCare Admin
            </span>
          </Link>
          <Link
            href="/admin"
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
