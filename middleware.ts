import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const PAY_COOKIE = "pay_gate";

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Protect /payment/* and /api/pay/*
  const isProtected =
    pathname.startsWith("/payment") || pathname.startsWith("/api/pay");

  // Allow the verification and logout endpoints and the passcode page
  const isGateEndpoint =
    pathname.startsWith("/api/pay/gate") || pathname.startsWith("/passcode");

  if (!isProtected || isGateEndpoint) {
    return NextResponse.next();
  }

  const token = req.cookies.get(PAY_COOKIE)?.value;
  const secret = process.env.PAY_GATE_SECRET;

  const redirectToPasscode = () => {
    const url = req.nextUrl.clone();
    url.pathname = "/passcode";
    url.searchParams.set("returnTo", pathname + (search || ""));
    const res = NextResponse.redirect(url);
    res.cookies.delete(PAY_COOKIE);
    return res;
  };

  if (!token || !secret) {
    return redirectToPasscode();
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );
    if (payload?.type !== "pay_gate") throw new Error("bad token");
    return NextResponse.next();
  } catch {
    return redirectToPasscode();
  }
}

export const config = {
  matcher: ["/payment((?!/complete).*)", "/api/pay/:path*"],
};
