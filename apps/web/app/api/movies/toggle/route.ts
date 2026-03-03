import { NextResponse } from "next/server";
import { getAuthedUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const user = await getAuthedUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const { movieId, type } = (await request.json()) as { movieId: number; type: "LIKE" | "WATCHLIST" };
  if (!movieId || (type !== "LIKE" && type !== "WATCHLIST")) return NextResponse.json({ error: "Bad request" }, { status: 400 });

  const existing = await prisma.movieAction.findUnique({ where: { userId_movieId_type: { userId: user.id, movieId, type } } });
  if (existing) await prisma.movieAction.delete({ where: { id: existing.id } });
  else await prisma.movieAction.create({ data: { userId: user.id, movieId, type } });

  const liked = await prisma.movieAction.findUnique({ where: { userId_movieId_type: { userId: user.id, movieId, type: "LIKE" } } });
  const watchlisted = await prisma.movieAction.findUnique({ where: { userId_movieId_type: { userId: user.id, movieId, type: "WATCHLIST" } } });

  return NextResponse.json({ flags: { liked: !!liked, watchlisted: !!watchlisted } });
}
