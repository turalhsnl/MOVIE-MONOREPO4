import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getAuthedUser } from "@/lib/auth";
import { getMovieDetails } from "@movie/api-client";
import { toMovieCardVM } from "@movie/core";
import { MovieGridClient } from "../../components/MovieGridClient";

export default async function WatchlistPage() {
  const user = await getAuthedUser();
  if (!user) return <main className="container"><Link className="pilllink" href="/">← Back</Link><h1>Watchlist</h1><p className="small">Sign in to see your watchlist.</p></main>;

  const apiKey = process.env.TMDB_API_KEY ?? "";
  const items = await prisma.movieAction.findMany({ where: { userId: user.id, type: "WATCHLIST" }, orderBy: { createdAt: "desc" }, take: 120 });
  const moviesRaw = await Promise.all(items.map((l) => getMovieDetails({ apiKey }, l.movieId).catch(() => null)));
  const movies = moviesRaw.filter(Boolean).map((m: any) => toMovieCardVM(m));

  return (
    <main className="container">
      <Link className="pilllink" href="/">← Back</Link>
      <h1>Watchlist</h1>
      {movies.length ? <MovieGridClient movies={movies} /> : <p className="small">Your watchlist is empty.</p>}
    </main>
  );
}
