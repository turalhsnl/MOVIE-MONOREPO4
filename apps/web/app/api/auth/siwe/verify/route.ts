import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SiweMessage } from "siwe";
import { prisma } from "@/lib/prisma";
import { cookieName, signToken, verifyToken } from "@/lib/jwt";

export async function POST(request: Request) {
  const c = await cookies();
  const nonce = c.get("siwe_nonce")?.value;
  const { message, signature } = (await request.json()) as { message: string; signature: string };

  try {
    const siwe = new SiweMessage(message);
    const result = await siwe.verify({ signature, nonce });
    if (!result.success) return NextResponse.json({ error: "SIWE verify failed (bad signature/nonce)" }, { status: 401 });

    const wallet = siwe.address.toLowerCase();

    const existingToken = c.get(cookieName())?.value;
    if (existingToken) {
      try {
        const payload = await verifyToken(existingToken);
        const authedUser = await prisma.user.findUnique({ where: { id: payload.sub } });
        if (authedUser) {
          const walletOwner = await prisma.user.findUnique({ where: { walletAddress: wallet } });
          if (walletOwner && walletOwner.id !== authedUser.id) return NextResponse.json({ error: "Wallet already linked to another account" }, { status: 409 });
          await prisma.user.update({ where: { id: authedUser.id }, data: { walletAddress: wallet } });

          const token = await signToken({ sub: authedUser.id });
          const res = NextResponse.json({ ok: true, token, linked: true });
          res.cookies.set(cookieName(), token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 30 });
          res.cookies.set("siwe_nonce", "", { path: "/", maxAge: 0 });
          return res;
        }
      } catch {}
    }

    const user = await prisma.user.upsert({ where: { walletAddress: wallet }, update: {}, create: { walletAddress: wallet, profile: { create: { displayName: null } } } });
    const token = await signToken({ sub: user.id });
    const res = NextResponse.json({ ok: true, token, userId: user.id, linked: false });
    res.cookies.set(cookieName(), token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 30 });
    res.cookies.set("siwe_nonce", "", { path: "/", maxAge: 0 });
    return res;
  } catch {
    return NextResponse.json({ error: "Bad SIWE payload" }, { status: 400 });
  }
}
