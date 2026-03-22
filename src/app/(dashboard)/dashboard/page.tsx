"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

interface AgencyProfile {
  name: string;
  adminApproved?: boolean;
  priorityPassExpiresAt?: string | null;
  maxLeadsPerMonth?: number;
  specialties?: string[];
  stripeCustomerId?: string | null;
}

interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  acceptedLeads: number;
  passedLeads: number;
  hotLeads: number;
  actionableLeads: number;
  totalSpentCents: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [agency, setAgency] = useState<AgencyProfile | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;

    async function fetchData() {
      try {
        const [profileRes, leadsRes, billingRes] = await Promise.all([
          fetch("/api/onboarding"),
          fetch("/api/leads/mine"),
          fetch("/api/billing"),
        ]);

        if (profileRes.ok) {
          const data = await profileRes.json();
          setAgency(data.agency ?? null);
        }

        let leadsData: { leads: Array<{ matchStatus: string; score: string | null }> } = { leads: [] };
        if (leadsRes.ok) {
          leadsData = await leadsRes.json();
        }

        let billingData: { summary: { totalChargedCents: number } } = { summary: { totalChargedCents: 0 } };
        if (billingRes.ok) {
          billingData = await billingRes.json();
        }

        const allLeads = leadsData.leads ?? [];
        setStats({
          totalLeads: allLeads.length,
          newLeads: allLeads.filter((l) => l.matchStatus === "delivered").length,
          acceptedLeads: allLeads.filter((l) => l.matchStatus === "accepted").length,
          passedLeads: allLeads.filter((l) => l.matchStatus === "passed").length,
          hotLeads: allLeads.filter((l) => l.score === "hot").length,
          actionableLeads: allLeads.filter(
            (l) => !["accepted", "passed", "expired"].includes(l.matchStatus)
          ).length,
          totalSpentCents: billingData.summary?.totalChargedCents ?? 0,
        });
      } catch {
        // silently fail — user sees onboarding banner
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [status]);

  async function handleCheckout(type: string) {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to create checkout");
      }
    } catch {
      alert("Failed to create checkout session");
    } finally {
      setCheckoutLoading(false);
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Nav />
        <div className="flex items-center justify-center py-32">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#2563eb]" />
        </div>
      </div>
    );
  }

  if (!session) return null;

  const hasPriorityPass =
    agency?.priorityPassExpiresAt &&
    new Date(agency.priorityPassExpiresAt) > new Date();

  const priorityPassDaysLeft = hasPriorityPass
    ? Math.ceil(
        (new Date(agency!.priorityPassExpiresAt!).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />

      <main className="max-w-5xl mx-auto px-4 py-10">
        {/* Onboarding Banner */}
        {!agency && (
          <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-amber-900">
                Complete Your Onboarding
              </h2>
              <p className="text-sm text-amber-700 mt-1">
                Set up your agency profile to start receiving qualified leads — free to join.
              </p>
            </div>
            <Link
              href="/onboarding"
              className="shrink-0 bg-[#2563eb] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-[#1d4ed8] transition"
            >
              Get Started
            </Link>
          </div>
        )}

        {/* Pending Admin Approval Banner */}
        {agency && !agency.adminApproved && (
          <div className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-6">
            <h2 className="text-lg font-semibold text-blue-900">
              Pending Admin Approval
            </h2>
            <p className="text-sm text-blue-700 mt-1">
              Your agency profile is under review. Once approved, you&apos;ll start receiving qualified leads.
              This usually takes 1-2 business days.
            </p>
          </div>
        )}

        {/* Dashboard Content */}
        {agency && (
          <div className="space-y-6">
            {/* Welcome Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {agency.name}
              </h1>
              <p className="text-gray-500 mt-1">
                Here&apos;s an overview of your account.
              </p>
            </div>

            {/* Action banner if there are leads needing action */}
            {stats && stats.actionableLeads > 0 && (
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-blue-900">
                    {stats.actionableLeads} lead{stats.actionableLeads !== 1 ? "s" : ""} need your attention
                  </p>
                  <p className="text-sm text-blue-700 mt-0.5">
                    Review and accept or pass on delivered leads to keep your pipeline moving.
                  </p>
                </div>
                <Link
                  href="/dashboard/leads"
                  className="shrink-0 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Review Leads
                </Link>
              </div>
            )}

            {/* Stats Grid */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <p className="text-sm text-gray-500 mb-1">Total Leads</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalLeads}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <p className="text-sm text-gray-500 mb-1">Hot Leads</p>
                  <p className="text-3xl font-bold text-red-600">{stats.hotLeads}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <p className="text-sm text-gray-500 mb-1">Accepted</p>
                  <p className="text-3xl font-bold text-emerald-600">{stats.acceptedLeads}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <p className="text-sm text-gray-500 mb-1">Total Spent</p>
                  <p className="text-3xl font-bold text-gray-900">
                    ${(stats.totalSpentCents / 100).toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Priority Pass Status */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                  Priority Pass
                </h2>
                {hasPriorityPass ? (
                  <>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-violet-50 text-violet-700 border border-violet-200">
                        <span className="w-2 h-2 rounded-full bg-violet-500" />
                        Active
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">{priorityPassDaysLeft} days</span> remaining — leads are delivered to you first.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-600 mb-3">
                      Get leads delivered before other agencies for 3 months.
                    </p>
                    <button
                      onClick={() => handleCheckout("priority_pass")}
                      disabled={checkoutLoading}
                      className="inline-flex items-center text-sm font-medium bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition disabled:opacity-50"
                    >
                      {checkoutLoading ? "Loading..." : "Get Priority Pass — $197"}
                    </button>
                  </>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                  Quick Actions
                </h2>
                <div className="space-y-2">
                  <Link
                    href="/dashboard/leads"
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition group"
                  >
                    <span className="text-sm font-medium text-gray-900">View Lead Pipeline</span>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link
                    href="/dashboard/billing"
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition group"
                  >
                    <span className="text-sm font-medium text-gray-900">Billing History</span>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  {!agency.stripeCustomerId && (
                    <button
                      onClick={() => handleCheckout("setup_payment")}
                      disabled={checkoutLoading}
                      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition group text-left"
                    >
                      <span className="text-sm font-medium text-blue-600">Set Up Payment Method</span>
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Per-lead pricing info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                Per-Lead Pricing
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Onboarding Fee</p>
                  <p className="text-2xl font-bold text-gray-900">$300</p>
                  <p className="text-xs text-gray-500">per confirmed lead</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Lead Fee</p>
                  <p className="text-2xl font-bold text-gray-900">$2,000</p>
                  <p className="text-xs text-gray-500">per confirmed lead</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-sm text-blue-600 font-medium">Total per Lead</p>
                  <p className="text-2xl font-bold text-blue-700">$2,300</p>
                  <p className="text-xs text-blue-500">charged on admin confirmation</p>
                </div>
              </div>
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
              className="w-7 h-7 text-[#2563eb]"
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
            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition"
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
