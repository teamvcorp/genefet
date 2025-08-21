import { NextResponse } from "next/server";
import { SignJWT } from "jose";

const PAY_COOKIE = "pay_gate";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const passcode = String(body?.passcode || "");
  const expected = process.env.PAY_GATE_CODE;
  const secret = process.env.PAY_GATE_SECRET;

  if (!expected || !secret) {
    return NextResponse.json(
      { error: "Server not configured" },
      { status: 500 }
    );
  }

  if (!passcode || passcode !== expected) {
    return NextResponse.json({ error: "Invalid passcode" }, { status: 401 });
  }

  const token = await new SignJWT({ type: "pay_gate" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(new TextEncoder().encode(secret));

  const res = NextResponse.json({ ok: true });
  res.cookies.set(PAY_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });
  return res;
}
