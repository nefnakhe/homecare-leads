"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

interface AgencyProfile {
  name: string;
  subscriptionStatus?: string;
  maxLeadsPerMonth?: number;
  specialties?: string[];
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [agency, setAgency] = useState<AgencyProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;

    async function fetchProfile() {
      try {
        const res = await fetch("/api/onboarding");
        if (res.ok) {
          const data = await res.json();
          setAgency(data.agency ?? null);
        }
      } catch {
        // silently fail — user sees onboarding banner
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [status]);

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

  const isSubscribed = agency?.subscriptionStatus === "active";

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
                Set up your agency profile to start receiving qualified leads.
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Subscription Status */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                  Subscription Status
                </h2>
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                      isSubscribed
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-gray-100 text-gray-600 border border-gray-200"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isSubscribed ? "bg-green-500" : "bg-gray-400"
                      }`}
                    />
                    {isSubscribed ? "Active" : "Inactive"}
                  </span>
                </div>
                {!isSubscribed && (
                  <Link
                    href="/#pricing"
                    className="inline-flex items-center text-sm font-medium text-[#2563eb] hover:text-[#1d4ed8] transition"
                  >
                    Subscribe to a plan
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                )}
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                  Quick Stats
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">0</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Leads This Month
                    </p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">0</p>
                    <p className="text-sm text-gray-500 mt-1">Active Leads</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Your Subscription Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Your Subscription
              </h2>
              {isSubscribed ? (
                <p className="text-gray-600">
                  Your subscription is active. You can receive up to{" "}
                  <span className="font-semibold text-gray-900">
                    {agency.maxLeadsPerMonth ?? "N/A"}
                  </span>{" "}
                  leads per month.
                </p>
              ) : (
                <div>
                  <p className="text-gray-600 mb-4">
                    You don&apos;t have an active subscription yet. Choose a plan
                    to start receiving leads.
                  </p>
                  <Link
                    href="/#pricing"
                    className="inline-flex bg-[#2563eb] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-[#1d4ed8] transition"
                  >
                    Choose a Plan
                  </Link>
                </div>
              )}
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
