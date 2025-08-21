import { NextResponse } from "next/server";
const PAY_COOKIE = "pay_gate";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(PAY_COOKIE);
  return res;
}
