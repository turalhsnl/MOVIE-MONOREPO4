import { NextResponse } from "next/server";
import { getAuthedUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const user = await getAuthedUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const { type } = (await request.json()) as { type: "LIKE" | "WATCHLIST" };
  if (type !== "LIKE" && type !== "WATCHLIST") return NextResponse.json({ error: "Bad request" }, { status: 400 });

  const actions = await prisma.movieAction.findMany({ where: { userId: user.id, type }, orderBy: { createdAt: "desc" }, take: 300 });
  return NextResponse.json({ movieIds: actions.map((a) => a.movieId) });
}
