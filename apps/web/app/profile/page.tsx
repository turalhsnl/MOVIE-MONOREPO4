import Link from "next/link";
import { getAuthedUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function ProfilePage() {
  const user = await getAuthedUser();
  if (!user) return <main className="container"><Link className="pilllink" href="/">← Back</Link><h1>Profile</h1><p className="small">Sign in first.</p></main>;

  const profile = await prisma.profile.findUnique({ where: { userId: user.id } });

  return (
    <main className="container">
      <Link className="pilllink" href="/">← Back</Link>
      <h1>Profile</h1>
      <div className="panel" style={{ display: "grid", gap: 8 }}>
        <div><b>UserId:</b> {user.id}</div>
        <div><b>Email:</b> {user.email ?? "-"}</div>
        <div><b>Wallet:</b> {user.walletAddress ?? "-"}</div>
        <div><b>Display name:</b> {profile?.displayName ?? "-"}</div>
        <form action="/api/auth/logout" method="post"><button className="btn btnGhost" style={{ width: "auto" }}>Logout</button></form>
      </div>
    </main>
  );
}
