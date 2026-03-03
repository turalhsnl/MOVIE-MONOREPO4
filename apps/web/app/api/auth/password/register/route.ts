import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { cookieName, signToken } from "@/lib/jwt";

export async function POST(request: Request) {
  const { email, password } = (await request.json()) as { email: string; password: string };
  const normalized = (email ?? "").trim().toLowerCase();
  if (!normalized.includes("@")) return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  if (!password || password.length < 8) return NextResponse.json({ error: "Password must be 8+ chars" }, { status: 400 });

  const existing = await prisma.user.findUnique({ where: { email: normalized } });
  if (existing) return NextResponse.json({ error: "Email already registered" }, { status: 409 });

  const hash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({ data: { email: normalized, passwordHash: hash, profile: { create: { displayName: null } } } });

  const token = await signToken({ sub: user.id });
  const c = await cookies();
  c.set(cookieName(), token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 30 });
  return NextResponse.json({ ok: true, token, userId: user.id });
}
