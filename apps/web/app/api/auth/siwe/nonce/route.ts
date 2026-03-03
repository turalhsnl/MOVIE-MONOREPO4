import { NextResponse } from "next/server";
export async function GET() {
  const nonce = crypto.randomUUID();
  const res = NextResponse.json({ nonce });
  res.cookies.set("siwe_nonce", nonce, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 600 });
  return res;
}
