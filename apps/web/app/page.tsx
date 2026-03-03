import Link from "next/link";
import { redirect } from "next/navigation";
import { getPopularMovies } from "@movie/api-client";
import { toMovieCardVM } from "@movie/core";
import { getAuthedUser } from "@/lib/auth";
import { MovieGridClient } from "../components/MovieGridClient";

export default async function Page() {
  const user = await getAuthedUser();
  if (!user) redirect("/auth");

  const apiKey = process.env.TMDB_API_KEY ?? "";
  const data = await getPopularMovies({ apiKey }, 1);
  const movies = data.results.map(toMovieCardVM);

  return (
    <main className="container">
      <header className="topbar">
        <div className="brand">
          <h1>MovieVerse</h1>
          <p>Track what you love. Build your watchlist. Secure it with MetaMask.</p>
          <div className="pills">
            <Link className="pilllink" href="/likes">Likes</Link>
            <Link className="pilllink" href="/watchlist">Watchlist</Link>
            <Link className="pilllink" href="/profile">Profile</Link>
          </div>
        </div>
      </header>
      <section><MovieGridClient movies={movies} /></section>
    </main>
  );
}
