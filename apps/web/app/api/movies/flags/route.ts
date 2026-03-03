import { NextResponse } from "next/server";
import { getAuthedUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const user = await getAuthedUser();
  if (!user) return NextResponse.json({ flags: {} });

  const { movieIds } = (await request.json()) as { movieIds: number[] };
  const ids = Array.isArray(movieIds) ? movieIds.slice(0, 200) : [];

  const actions = await prisma.movieAction.findMany({ where: { userId: user.id, movieId: { in: ids } } });

  const flags: Record<string, { liked: boolean; watchlisted: boolean }> = {};
  for (const id of ids) flags[String(id)] = { liked: false, watchlisted: false };

  for (const a of actions) {
    const f = flags[String(a.movieId)] ?? { liked: false, watchlisted: false };
    if (a.type === "LIKE") f.liked = true;
    if (a.type === "WATCHLIST") f.watchlisted = true;
    flags[String(a.movieId)] = f;
  }

  return NextResponse.json({ flags });
}
