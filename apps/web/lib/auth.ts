import { cookies, headers } from "next/headers";
import { cookieName, verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export async function getAuthedUser() {
  const c = await cookies();
  const token = c.get(cookieName())?.value;

  const h = await headers();
  const authz = h.get("authorization") ?? "";
  const bearer = authz.toLowerCase().startsWith("bearer ") ? authz.slice(7).trim() : null;

  const t = bearer ?? token;
  if (!t) return null;

  try {
    const payload = await verifyToken(t);
    return await prisma.user.findUnique({ where: { id: payload.sub }, include: { profile: true } });
  } catch {
    return null;
  }
}
