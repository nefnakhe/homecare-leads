"use client";

import { useState } from "react";
import Link from "next/link";

interface LeadCaptureEmbedProps {
  city?: string;
  state?: string;
  heading?: string;
  subtext?: string;
}

export default function LeadCaptureEmbed({
  city,
  state,
  heading = "Get Matched with Home Care Agencies",
  subtext = "Tell us about your care needs and we'll connect you with trusted providers — free, no obligation.",
}: LeadCaptureEmbedProps) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    zip: "",
    careType: "",
    urgency: "",
    paymentType: "",
    city: city || "",
    state: state || "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    message: string;
    qualified: boolean;
  } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.email.includes("@")) e.email = "Valid email required";
    if (form.phone.length < 7) e.phone = "Valid phone required";
    if (!form.zip || form.zip.length < 5) e.zip = "ZIP code required";
    if (!form.careType) e.careType = "Required";
    if (!form.urgency) e.urgency = "Required";
    if (!form.paymentType) e.paymentType = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setResult({ message: data.message, qualified: data.qualified ?? false });
    } catch {
      setResult({
        message: "Something went wrong. Please try again.",
        qualified: false,
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div
          className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
            result.qualified ? "bg-green-100" : "bg-yellow-100"
          }`}
        >
          <span className="text-3xl">
            {result.qualified ? "\u2713" : "\u2139"}
          </span>
        </div>
        <h3 className="text-2xl font-bold mb-2">
          {result.qualified ? "Request Submitted!" : "Thank You"}
        </h3>
        <p className="text-gray-600 mb-6">{result.message}</p>
        <Link
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
      <h3 className="text-xl font-bold text-gray-900">{heading}</h3>
      <p className="text-gray-500 mt-1 text-sm">{subtext}</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              placeholder="First name *"
              value={form.firstName}
              onChange={(e) => update("firstName", e.target.value)}
              className={`w-full border rounded-lg px-3 py-2.5 text-sm ${errors.firstName ? "border-red-500" : "border-gray-300"}`}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Last name"
              value={form.lastName}
              onChange={(e) => update("lastName", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm"
            />
          </div>
        </div>

        <input
          type="email"
          placeholder="Email address *"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          className={`w-full border rounded-lg px-3 py-2.5 text-sm ${errors.email ? "border-red-500" : "border-gray-300"}`}
        />

        <input
          type="tel"
          placeholder="Phone number *"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          className={`w-full border rounded-lg px-3 py-2.5 text-sm ${errors.phone ? "border-red-500" : "border-gray-300"}`}
        />

        <input
          type="text"
          placeholder="ZIP code *"
          value={form.zip}
          onChange={(e) =>
            update("zip", e.target.value.replace(/\D/g, "").slice(0, 5))
          }
          maxLength={5}
          className={`w-full border rounded-lg px-3 py-2.5 text-sm ${errors.zip ? "border-red-500" : "border-gray-300"}`}
        />

        <select
          value={form.careType}
          onChange={(e) => update("careType", e.target.value)}
          className={`w-full border rounded-lg px-3 py-2.5 text-sm ${errors.careType ? "border-red-500" : "border-gray-300"}`}
        >
          <option value="">Type of care needed *</option>
          <option value="personal_care">Personal Care</option>
          <option value="companion_care">Companion Care</option>
          <option value="skilled_nursing">Skilled Nursing</option>
          <option value="dementia_care">Dementia / Alzheimer&apos;s Care</option>
          <option value="respite_care">Respite Care</option>
          <option value="live_in_care">Live-In / 24-Hour Care</option>
          <option value="post_surgery">Post-Surgery / Rehab Care</option>
          <option value="hospice_support">Hospice Support</option>
          <option value="other">Other</option>
        </select>

        <select
          value={form.urgency}
          onChange={(e) => update("urgency", e.target.value)}
          className={`w-full border rounded-lg px-3 py-2.5 text-sm ${errors.urgency ? "border-red-500" : "border-gray-300"}`}
        >
          <option value="">When is care needed? *</option>
          <option value="immediate">Immediately</option>
          <option value="within_week">Within a week</option>
          <option value="within_month">Within a month</option>
          <option value="exploring">Just exploring</option>
        </select>

        <select
          value={form.paymentType}
          onChange={(e) => update("paymentType", e.target.value)}
          className={`w-full border rounded-lg px-3 py-2.5 text-sm ${errors.paymentType ? "border-red-500" : "border-gray-300"}`}
        >
          <option value="">Payment method *</option>
          <option value="private_pay">Private Pay</option>
          <option value="long_term_care_insurance">Long-Term Care Insurance</option>
          <option value="medicare">Medicare</option>
          <option value="medicaid">Medicaid</option>
          <option value="va_benefits">VA Benefits</option>
          <option value="other">Other / Not Sure</option>
        </select>

        {Object.keys(errors).length > 0 && (
          <p className="text-red-500 text-sm">
            Please fill in all required fields.
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Get Matched with Agencies"}
        </button>

        <p className="text-xs text-gray-400 text-center">
          Free, no obligation. Your information is kept confidential and never
          sold.
        </p>
      </form>
    </div>
  );
}
