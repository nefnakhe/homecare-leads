"use client";

import { useState } from "react";

const CARE_TYPES = [
  { value: "personal_care", label: "Personal Care (bathing, dressing, grooming)" },
  { value: "companion_care", label: "Companion Care (social, errands, meals)" },
  { value: "skilled_nursing", label: "Skilled Nursing (medical care, wound care)" },
  { value: "dementia_care", label: "Dementia / Alzheimer's Care" },
  { value: "respite_care", label: "Respite Care (temporary relief for caregivers)" },
  { value: "live_in_care", label: "Live-In / 24-Hour Care" },
  { value: "post_surgery", label: "Post-Surgery / Rehab Care" },
  { value: "hospice_support", label: "Hospice Support" },
  { value: "other", label: "Other" },
];

const URGENCY_OPTIONS = [
  { value: "immediate", label: "Immediately (within 48 hours)" },
  { value: "within_week", label: "Within a week" },
  { value: "within_month", label: "Within a month" },
  { value: "exploring", label: "Just exploring options" },
];

const PAYMENT_OPTIONS = [
  { value: "private_pay", label: "Private Pay (out of pocket)" },
  { value: "long_term_care_insurance", label: "Long-Term Care Insurance" },
  { value: "medicare", label: "Medicare" },
  { value: "medicaid", label: "Medicaid" },
  { value: "va_benefits", label: "VA Benefits" },
  { value: "other", label: "Other / Not Sure" },
];

const RELATION_OPTIONS = [
  "Self",
  "Son / Daughter",
  "Spouse / Partner",
  "Sibling",
  "Grandchild",
  "Friend",
  "Professional (social worker, case manager)",
  "Other",
];

type FormStep = 1 | 2 | 3;

export default function FindCarePage() {
  const [step, setStep] = useState<FormStep>(1);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    message: string;
    qualified: boolean;
  } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    // Step 1 — Care needs
    careType: "",
    careDescription: "",
    urgency: "",
    hoursPerWeek: "",
    patientFirstName: "",
    patientAge: "",

    // Step 2 — Location & budget
    zip: "",
    city: "",
    state: "",
    paymentType: "",
    budgetMin: "",
    budgetMax: "",

    // Step 3 — Contact info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    relationToPatient: "",
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function validateStep(s: FormStep): boolean {
    const e: Record<string, string> = {};
    if (s === 1) {
      if (!form.careType) e.careType = "Please select a care type";
      if (!form.urgency) e.urgency = "Please select urgency";
    } else if (s === 2) {
      if (!form.zip || form.zip.length < 5) e.zip = "Enter a valid ZIP code";
      if (!form.paymentType) e.paymentType = "Please select payment type";
    } else if (s === 3) {
      if (!form.firstName.trim()) e.firstName = "First name is required";
      if (!form.lastName.trim()) e.lastName = "Last name is required";
      if (!form.email.includes("@")) e.email = "Valid email is required";
      if (form.phone.length < 7) e.phone = "Valid phone number is required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function nextStep() {
    if (validateStep(step)) {
      setStep((s) => (s + 1) as FormStep);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateStep(3)) return;

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        patientAge: form.patientAge ? parseInt(form.patientAge) : undefined,
        hoursPerWeek: form.hoursPerWeek ? parseInt(form.hoursPerWeek) : undefined,
        budgetMin: form.budgetMin ? parseInt(form.budgetMin) : undefined,
        budgetMax: form.budgetMax ? parseInt(form.budgetMax) : undefined,
      };

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full text-center">
          <div
            className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
              result.qualified ? "bg-green-100" : "bg-yellow-100"
            }`}
          >
            <span className="text-3xl">{result.qualified ? "\u2713" : "\u2139"}</span>
          </div>
          <h2 className="text-2xl font-bold mb-4">
            {result.qualified ? "Request Submitted!" : "Thank You"}
          </h2>
          <p className="text-gray-600 mb-6">{result.message}</p>
          <a
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="text-xl font-bold text-blue-600">
            HomeCare Leads
          </a>
          <span className="text-sm text-gray-500">
            Step {step} of 3
          </span>
        </div>
      </header>

      {/* Progress bar */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <div className="flex gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full transition-colors ${
                s <= step ? "bg-blue-600" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 py-8">
        {/* ── Step 1: Care Needs ─── */}
        {step === 1 && (
          <div className="bg-white rounded-xl shadow p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Tell us about the care needed</h2>
              <p className="text-gray-500 mt-1">
                Help us understand what type of care you&apos;re looking for.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Type of Care Needed *
              </label>
              <select
                value={form.careType}
                onChange={(e) => update("careType", e.target.value)}
                className={`w-full border rounded-lg px-3 py-2.5 ${errors.careType ? "border-red-500" : "border-gray-300"}`}
              >
                <option value="">Select care type...</option>
                {CARE_TYPES.map((ct) => (
                  <option key={ct.value} value={ct.value}>
                    {ct.label}
                  </option>
                ))}
              </select>
              {errors.careType && (
                <p className="text-red-500 text-sm mt-1">{errors.careType}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Describe the care situation (optional)
              </label>
              <textarea
                value={form.careDescription}
                onChange={(e) => update("careDescription", e.target.value)}
                rows={3}
                placeholder="e.g., My mother needs help with daily activities after hip surgery..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                How soon do you need care? *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {URGENCY_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-2 border rounded-lg px-4 py-3 cursor-pointer transition ${
                      form.urgency === opt.value
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="urgency"
                      value={opt.value}
                      checked={form.urgency === opt.value}
                      onChange={(e) => update("urgency", e.target.value)}
                      className="sr-only"
                    />
                    <span className="text-sm">{opt.label}</span>
                  </label>
                ))}
              </div>
              {errors.urgency && (
                <p className="text-red-500 text-sm mt-1">{errors.urgency}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Care recipient&apos;s first name
                </label>
                <input
                  type="text"
                  value={form.patientFirstName}
                  onChange={(e) => update("patientFirstName", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5"
                  placeholder="First name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Age</label>
                <input
                  type="number"
                  value={form.patientAge}
                  onChange={(e) => update("patientAge", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5"
                  placeholder="e.g., 78"
                  min="0"
                  max="120"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Estimated hours per week
              </label>
              <input
                type="number"
                value={form.hoursPerWeek}
                onChange={(e) => update("hoursPerWeek", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5"
                placeholder="e.g., 20"
                min="1"
                max="168"
              />
            </div>

            <button
              type="button"
              onClick={nextStep}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Continue
            </button>
          </div>
        )}

        {/* ── Step 2: Location & Budget ─── */}
        {step === 2 && (
          <div className="bg-white rounded-xl shadow p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Location & Payment</h2>
              <p className="text-gray-500 mt-1">
                We&apos;ll match you with agencies in your area.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <label className="block text-sm font-medium mb-2">ZIP Code *</label>
                <input
                  type="text"
                  value={form.zip}
                  onChange={(e) =>
                    update("zip", e.target.value.replace(/\D/g, "").slice(0, 5))
                  }
                  className={`w-full border rounded-lg px-3 py-2.5 ${errors.zip ? "border-red-500" : "border-gray-300"}`}
                  placeholder="12345"
                  maxLength={5}
                />
                {errors.zip && (
                  <p className="text-red-500 text-sm mt-1">{errors.zip}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">State</label>
                <input
                  type="text"
                  value={form.state}
                  onChange={(e) =>
                    update("state", e.target.value.toUpperCase().slice(0, 2))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5"
                  maxLength={2}
                  placeholder="CA"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                How will care be paid for? *
              </label>
              <div className="space-y-2">
                {PAYMENT_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition ${
                      form.paymentType === opt.value
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentType"
                      value={opt.value}
                      checked={form.paymentType === opt.value}
                      onChange={(e) => update("paymentType", e.target.value)}
                      className="sr-only"
                    />
                    <span className="text-sm">{opt.label}</span>
                  </label>
                ))}
              </div>
              {errors.paymentType && (
                <p className="text-red-500 text-sm mt-1">{errors.paymentType}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Monthly budget range (optional)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400">$</span>
                  <input
                    type="number"
                    value={form.budgetMin}
                    onChange={(e) => update("budgetMin", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2.5"
                    placeholder="Min"
                    min="0"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400">$</span>
                  <input
                    type="number"
                    value={form.budgetMax}
                    onChange={(e) => update("budgetMax", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2.5"
                    placeholder="Max"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Contact Info ─── */}
        {step === 3 && (
          <div className="bg-white rounded-xl shadow p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Your Contact Information</h2>
              <p className="text-gray-500 mt-1">
                Agencies will use this to reach out to you.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => update("firstName", e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2.5 ${errors.firstName ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => update("lastName", e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2.5 ${errors.lastName ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className={`w-full border rounded-lg px-3 py-2.5 ${errors.email ? "border-red-500" : "border-gray-300"}`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone *</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className={`w-full border rounded-lg px-3 py-2.5 ${errors.phone ? "border-red-500" : "border-gray-300"}`}
                placeholder="(555) 123-4567"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Relationship to care recipient
              </label>
              <select
                value={form.relationToPatient}
                onChange={(e) => update("relationToPatient", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5"
              >
                <option value="">Select...</option>
                {RELATION_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Care Request"}
              </button>
            </div>

            <p className="text-xs text-gray-400 text-center">
              By submitting, you agree to be contacted by up to 3 home care agencies in
              your area. Your information is kept confidential and never sold.
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
