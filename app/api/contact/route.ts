// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';

const WEB3FORMS_API_URL = 'https://api.web3forms.com/submit';
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

// Best-effort only: this map is per-instance and resets on cold start, so it
// slows down abuse from a single warm serverless instance rather than
// guaranteeing a hard cap. Web3Forms applies its own limits server-side too.
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX_REQUESTS;
}

const DISPOSABLE_DOMAINS = [
  'tempmail.com', '10minutemail.com', 'guerrillamail.com',
  'mailinator.com', 'yopmail.com', 'throwaway.com',
  'temp-mail.org', 'maildrop.cc', 'spamgourmet.com',
  'fake.com', 'mailnesia.com', 'guerrillamail.org',
  'mailinator.net', 'trash-mail.com', 'trash2009.com',
  'mytrashmail.com', 'spambox.us', 'throwawayemail.com',
];

function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) return false;
  const domain = email.split('@')[1];
  if (!domain) return false;
  return !DISPOSABLE_DOMAINS.some((d) => domain.includes(d));
}

interface ContactPayload {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  botcheck?: string;
}

export async function POST(request: NextRequest) {
  // Reject cross-origin form submissions (this endpoint has no auth, so
  // scoping it to our own site cuts down on drive-by abuse from other pages).
  const origin = request.headers.get('origin');
  const allowedOrigin = new URL(request.url).origin;
  if (origin && origin !== allowedOrigin) {
    return NextResponse.json({ success: false, message: 'Invalid origin.' }, { status: 403 });
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { success: false, message: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  let body: ContactPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid request body.' }, { status: 400 });
  }

  const { name, email, subject, message, botcheck } = body;

  // Honeypot: real users never fill this (it's hidden via CSS). Bots that
  // skip our client-side JS and post directly get a fake success so they
  // don't learn the field is being checked.
  if (botcheck && botcheck.trim() !== '') {
    return NextResponse.json({ success: true, message: 'Message sent!' });
  }

  if (!name || name.trim().length < 2) {
    return NextResponse.json({ success: false, message: 'Name must be at least 2 characters.' }, { status: 400 });
  }
  if (!email || !isValidEmail(email)) {
    return NextResponse.json(
      { success: false, message: 'Please enter a valid email address.' },
      { status: 400 }
    );
  }
  if (!subject || subject.trim().length < 3) {
    return NextResponse.json({ success: false, message: 'Subject must be at least 3 characters.' }, { status: 400 });
  }
  if (!message || message.trim().length < 10) {
    return NextResponse.json({ success: false, message: 'Message must be at least 10 characters.' }, { status: 400 });
  }

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) {
    console.error('WEB3FORMS_ACCESS_KEY is not configured.');
    return NextResponse.json({ success: false, message: 'Server misconfiguration.' }, { status: 500 });
  }

  try {
    const web3formsRes = await fetch(WEB3FORMS_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: accessKey,
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
        from_name: 'Portfolio Contact Form',
      }),
    });

    const data = await web3formsRes.json();

    if (!web3formsRes.ok || !data.success) {
      return NextResponse.json(
        { success: false, message: data.message || 'Something went wrong. Please try again.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, message: data.message || 'Message sent!' });
  } catch (error) {
    console.error('Web3Forms submission failed:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
