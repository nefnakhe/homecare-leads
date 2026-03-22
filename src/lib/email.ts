const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || "noreply@homecareleads.com";
const BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!RESEND_API_KEY) {
    console.log(`[EMAIL STUB] To: ${to}, Subject: ${subject}`);
    console.log(html);
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: EMAIL_FROM, to, subject, html }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to send email: ${err}`);
  }
}

export async function sendVerificationEmail(email: string, token: string) {
  const url = `${BASE_URL}/verify-email?token=${token}`;
  await sendEmail({
    to: email,
    subject: "Verify your HomeCare Leads account",
    html: `
      <h2>Welcome to HomeCare Leads</h2>
      <p>Click the link below to verify your email address:</p>
      <p><a href="${url}" style="background:#2563eb;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;">Verify Email</a></p>
      <p>Or copy this link: ${url}</p>
      <p>This link expires in 24 hours.</p>
    `,
  });
}

export async function sendLeadNotificationEmail(
  agencyEmail: string,
  agencyName: string,
  lead: {
    firstName: string;
    lastName: string;
    careType: string;
    zip: string;
    city?: string | null;
    state?: string | null;
    urgency: string;
    hoursPerWeek?: number | null;
    score: string;
  }
) {
  const careLabel = lead.careType.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const urgencyLabel = lead.urgency.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const scoreColor =
    lead.score === "hot" ? "#dc2626" : lead.score === "warm" ? "#f59e0b" : "#6b7280";
  const dashboardUrl = `${BASE_URL}/dashboard/leads`;

  await sendEmail({
    to: agencyEmail,
    subject: `New ${lead.score.toUpperCase()} Lead — ${careLabel} in ${lead.zip}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:#2563eb;">New Lead for ${agencyName}</h2>
        <div style="background:#f8fafc;border-radius:8px;padding:20px;margin:16px 0;">
          <p style="margin:0 0 4px;"><strong>Score:</strong>
            <span style="background:${scoreColor};color:white;padding:2px 10px;border-radius:12px;font-size:13px;">
              ${lead.score.toUpperCase()}
            </span>
          </p>
          <p><strong>Name:</strong> ${lead.firstName} ${lead.lastName.charAt(0)}.</p>
          <p><strong>Care Type:</strong> ${careLabel}</p>
          <p><strong>Location:</strong> ${lead.city ? lead.city + ", " : ""}${lead.state || ""} ${lead.zip}</p>
          <p><strong>Urgency:</strong> ${urgencyLabel}</p>
          ${lead.hoursPerWeek ? `<p><strong>Hours/Week:</strong> ${lead.hoursPerWeek}</p>` : ""}
        </div>
        <p>
          <a href="${dashboardUrl}" style="background:#2563eb;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;">
            View Lead Details
          </a>
        </p>
        <p style="color:#6b7280;font-size:13px;">
          This lead has been shared with up to 3 agencies in your area. Act quickly for the best chance of connecting.
        </p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const url = `${BASE_URL}/reset-password?token=${token}`;
  await sendEmail({
    to: email,
    subject: "Reset your HomeCare Leads password",
    html: `
      <h2>Password Reset</h2>
      <p>Click the link below to reset your password:</p>
      <p><a href="${url}" style="background:#2563eb;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;">Reset Password</a></p>
      <p>Or copy this link: ${url}</p>
      <p>This link expires in 1 hour. If you did not request this, ignore this email.</p>
    `,
  });
}
