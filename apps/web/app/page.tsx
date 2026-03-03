import Link from "next/link";
import { getPopularMovies } from "@movie/api-client";
import { toMovieCardVM } from "@movie/core";
import { AuthBar } from "../components/AuthBar";
import { MovieGridClient } from "../components/MovieGridClient";

export default async function Page() {
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
        <AuthBar />
      </header>
      <section><MovieGridClient movies={movies} /></section>
    </main>
  );
}
