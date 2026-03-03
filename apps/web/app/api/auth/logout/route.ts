import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { cookieName } from "@/lib/jwt";
export async function POST() {
  const c = await cookies();
  c.set(cookieName(), "", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 });
  return NextResponse.json({ ok: true });
}
