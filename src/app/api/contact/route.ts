import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_LEN = 5000;

type Payload = {
  name?: unknown;
  company?: unknown;
  email?: unknown;
  message?: unknown;
};

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const company = typeof body.company === "string" ? body.company.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || !email || !message || name.length > MAX_LEN || message.length > MAX_LEN) {
    return NextResponse.json({ error: "Missing or invalid fields." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL ?? "Nice Move Logistics <onboarding@resend.dev>";

  if (!apiKey || !to) {
    console.error(
      "[contact] RESEND_API_KEY or CONTACT_TO_EMAIL is not set — inquiry was not sent.",
      { name, company, email }
    );
    return NextResponse.json(
      { error: "Contact form is not configured yet." },
      { status: 503 }
    );
  }

  const text = [
    `Name: ${name}`,
    company && `Company: ${company}`,
    `Email: ${email}`,
    "",
    message,
  ]
    .filter(Boolean)
    .join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: email,
      subject: `New inquiry from ${name}${company ? ` (${company})` : ""}`,
      text,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("[contact] Resend API error:", res.status, detail);
    return NextResponse.json({ error: "Failed to send message." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
