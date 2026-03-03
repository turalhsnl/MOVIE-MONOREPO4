import { redirect } from "next/navigation";
import { getAuthedUser } from "@/lib/auth";
import { AuthBar } from "../../components/AuthBar";

export default async function AuthPage() {
  const user = await getAuthedUser();
  if (user) redirect("/");

  return (
    <main className="container authPage">
      <section className="panel authIntro">
        <h1>Welcome to MovieVerse</h1>
        <p className="small">Register or log in to continue to the main page.</p>
        <ul className="small" style={{ margin: "8px 0 0 0", paddingLeft: 18 }}>
          <li>MetaMask can register a new account or log into an existing wallet account.</li>
          <li>On mobile, registration is MetaMask-only.</li>
          <li>Email login is still available from the login tab.</li>
        </ul>
      </section>

      <AuthBar />
    </main>
  );
}
