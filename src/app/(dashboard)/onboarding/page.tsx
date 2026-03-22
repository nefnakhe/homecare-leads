"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, KeyboardEvent } from "react";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
  "DC",
];

const SPECIALTIES = [
  "Personal Care",
  "Companion Care",
  "Skilled Nursing",
  "Physical Therapy",
  "Occupational Therapy",
  "Speech Therapy",
  "Alzheimer's/Dementia Care",
  "Post-Surgery Recovery",
  "Hospice Support",
  "Live-In Care",
];

interface FormErrors {
  [key: string]: string;
}

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Agency Info
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");

  // Service Area
  const [zipInput, setZipInput] = useState("");
  const [zipCodes, setZipCodes] = useState<string[]>([]);
  const [serviceRadius, setServiceRadius] = useState(25);

  // Specialties
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);

  // Capacity
  const [maxLeads, setMaxLeads] = useState(50);

  // Form state
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#2563eb]" />
      </div>
    );
  }

  if (!session) return null;

  function handleAddZips() {
    if (!zipInput.trim()) return;
    const newZips = zipInput
      .split(",")
      .map((z) => z.trim())
      .filter((z) => /^\d{5}$/.test(z) && !zipCodes.includes(z));
    if (newZips.length > 0) {
      setZipCodes((prev) => [...prev, ...newZips]);
    }
    setZipInput("");
  }

  function handleZipKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddZips();
    }
  }

  function removeZip(zipToRemove: string) {
    setZipCodes((prev) => prev.filter((z) => z !== zipToRemove));
  }

  function toggleSpecialty(specialty: string) {
    setSelectedSpecialties((prev) =>
      prev.includes(specialty)
        ? prev.filter((s) => s !== specialty)
        : [...prev, specialty]
    );
  }

  function validate(): boolean {
    const newErrors: FormErrors = {};
    if (!name.trim()) newErrors.name = "Agency name is required.";
    if (!phone.trim()) newErrors.phone = "Phone number is required.";
    else if (!/^[\d\s\-().+]+$/.test(phone))
      newErrors.phone = "Enter a valid phone number.";
    if (!address.trim()) newErrors.address = "Address is required.";
    if (!city.trim()) newErrors.city = "City is required.";
    if (!state) newErrors.state = "State is required.";
    if (!zip.trim()) newErrors.zip = "ZIP code is required.";
    else if (!/^\d{5}$/.test(zip)) newErrors.zip = "Enter a valid 5-digit ZIP.";
    if (zipCodes.length === 0)
      newErrors.zipCodes = "Add at least one service area ZIP code.";
    if (selectedSpecialties.length === 0)
      newErrors.specialties = "Select at least one specialty.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          website: website.trim() || null,
          address: address.trim(),
          city: city.trim(),
          state,
          zip: zip.trim(),
          serviceAreaZips: zipCodes,
          serviceRadius,
          specialties: selectedSpecialties,
          maxLeadsPerMonth: maxLeads,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Something went wrong. Please try again.");
      }

      router.push("/dashboard");
    } catch (err: unknown) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 focus:outline-none transition";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const errorClass = "text-red-600 text-sm mt-1";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">
            Set Up Your Agency Profile
          </h1>
          <p className="mt-2 text-gray-600">
            Complete the form below to start receiving qualified home care leads.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Agency Info */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Agency Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label htmlFor="name" className={labelClass}>
                  Agency Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Home Care Agency"
                  className={inputClass}
                />
                {errors.name && <p className={errorClass}>{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="phone" className={labelClass}>
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                  className={inputClass}
                />
                {errors.phone && <p className={errorClass}>{errors.phone}</p>}
              </div>
              <div>
                <label htmlFor="website" className={labelClass}>
                  Website{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  id="website"
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://www.example.com"
                  className={inputClass}
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="address" className={labelClass}>
                  Street Address
                </label>
                <input
                  id="address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Main Street"
                  className={inputClass}
                />
                {errors.address && (
                  <p className={errorClass}>{errors.address}</p>
                )}
              </div>
              <div>
                <label htmlFor="city" className={labelClass}>
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  className={inputClass}
                />
                {errors.city && <p className={errorClass}>{errors.city}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="state" className={labelClass}>
                    State
                  </label>
                  <select
                    id="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select</option>
                    {US_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  {errors.state && (
                    <p className={errorClass}>{errors.state}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="zip" className={labelClass}>
                    ZIP Code
                  </label>
                  <input
                    id="zip"
                    type="text"
                    maxLength={5}
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    placeholder="12345"
                    className={inputClass}
                  />
                  {errors.zip && <p className={errorClass}>{errors.zip}</p>}
                </div>
              </div>
            </div>
          </section>

          {/* Service Area */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Service Area
            </h2>
            <div className="space-y-6">
              <div>
                <label htmlFor="zipCodes" className={labelClass}>
                  Primary ZIP Code(s)
                </label>
                <p className="text-sm text-gray-500 mb-2">
                  Enter ZIP codes separated by commas and press Enter or click
                  Add.
                </p>
                <div className="flex gap-2">
                  <input
                    id="zipCodes"
                    type="text"
                    value={zipInput}
                    onChange={(e) => setZipInput(e.target.value)}
                    onKeyDown={handleZipKeyDown}
                    placeholder="10001, 10002, 10003"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={handleAddZips}
                    className="shrink-0 bg-[#2563eb] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-[#1d4ed8] transition"
                  >
                    Add
                  </button>
                </div>
                {errors.zipCodes && (
                  <p className={errorClass}>{errors.zipCodes}</p>
                )}
                {zipCodes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {zipCodes.map((z) => (
                      <span
                        key={z}
                        className="inline-flex items-center gap-1 bg-blue-50 text-[#2563eb] px-3 py-1 rounded-full text-sm font-medium border border-blue-200"
                      >
                        {z}
                        <button
                          type="button"
                          onClick={() => removeZip(z)}
                          className="ml-0.5 text-blue-400 hover:text-red-500 transition"
                          aria-label={`Remove ZIP ${z}`}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="radius" className={labelClass}>
                  Service Radius:{" "}
                  <span className="text-[#2563eb] font-semibold">
                    {serviceRadius} miles
                  </span>
                </label>
                <input
                  id="radius"
                  type="range"
                  min={5}
                  max={100}
                  step={5}
                  value={serviceRadius}
                  onChange={(e) => setServiceRadius(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2563eb]"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>5 mi</span>
                  <span>100 mi</span>
                </div>
              </div>
            </div>
          </section>

          {/* Specialties */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Specialties
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Select all care types your agency provides.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SPECIALTIES.map((specialty) => (
                <label
                  key={specialty}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${
                    selectedSpecialties.includes(specialty)
                      ? "border-[#2563eb] bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedSpecialties.includes(specialty)}
                    onChange={() => toggleSpecialty(specialty)}
                    className="h-4 w-4 rounded border-gray-300 text-[#2563eb] focus:ring-[#2563eb]"
                  />
                  <span className="text-sm font-medium text-gray-800">
                    {specialty}
                  </span>
                </label>
              ))}
            </div>
            {errors.specialties && (
              <p className={errorClass + " mt-3"}>{errors.specialties}</p>
            )}
          </section>

          {/* Capacity */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Lead Capacity
            </h2>
            <div>
              <label htmlFor="maxLeads" className={labelClass}>
                Max Leads Per Month:{" "}
                <span className="text-[#2563eb] font-semibold">{maxLeads}</span>
              </label>
              <input
                id="maxLeads"
                type="range"
                min={5}
                max={500}
                step={5}
                value={maxLeads}
                onChange={(e) => setMaxLeads(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2563eb]"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>5</span>
                <span>500</span>
              </div>
            </div>
          </section>

          {/* Submit */}
          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
              {submitError}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#2563eb] text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-[#1d4ed8] focus:ring-4 focus:ring-[#2563eb]/20 focus:outline-none transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Saving...
              </span>
            ) : (
              "Complete Onboarding"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
