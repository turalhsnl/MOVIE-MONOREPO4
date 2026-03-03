import { NextResponse } from "next/server";
import { getAuthedUser } from "@/lib/auth";
export async function GET() {
  const user = await getAuthedUser();
  if (!user) return NextResponse.json({ authed: false, user: null });
  return NextResponse.json({ authed: true, user: { id: user.id, email: user.email ?? null, walletAddress: user.walletAddress ?? null } });
}
