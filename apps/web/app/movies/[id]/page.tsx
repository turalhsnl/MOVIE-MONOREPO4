import Link from "next/link";
import Image from "next/image";
import { getMovieDetails, tmdbImageUrl } from "@movie/api-client";
import { MovieActionsClient } from "../../../components/MovieActionsClient";

function money(n?: number) {
  if (!n) return "-";
  return Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export default async function MovieDetailsPage({ params }: { params: { id: string } }) {
  const apiKey = process.env.TMDB_API_KEY ?? "";
  const movieId = Number(params.id);
  const m: any = await getMovieDetails({ apiKey }, movieId);

  const poster = tmdbImageUrl(m.poster_path ?? null, "w500");
  const backdrop = tmdbImageUrl(m.backdrop_path ?? null, "original");
  const genres = (m.genres ?? []).map((g: any) => g.name).join(" • ");

  return (
    <main className="container">
      <Link className="pilllink" href="/">← Back</Link>

      <div className="panel" style={{ marginTop: 18, padding: 0, overflow: "hidden", position: "relative", borderRadius: 22 }}>
        {backdrop ? (
          <div style={{ position: "relative", width: "100%", height: 340 }}>
            <Image src={backdrop} alt={m.title} fill sizes="100vw" style={{ objectFit: "cover", filter: "saturate(1.1)" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(7,10,19,.95) 0%, rgba(7,10,19,.65) 45%, rgba(7,10,19,.2) 100%)" }} />
          </div>
        ) : null}

        <div style={{ padding: 18, marginTop: backdrop ? -280 : 0, display: "grid", gridTemplateColumns: "280px 1fr", gap: 18 }}>
          <div className="card" style={{ borderRadius: 18 }}>
            {poster ? <Image src={poster} alt={m.title} width={560} height={840} style={{ width: "100%", height: "auto" }} /> : null}
          </div>

          <div style={{ alignSelf: "end" }}>
            <h1 style={{ margin: 0, fontSize: 44, letterSpacing: "-0.02em" }}>{m.title}</h1>

            <div className="row" style={{ marginTop: 10 }}>
              {m.release_date ? <span className="badge">{m.release_date}</span> : null}
              {m.runtime ? <span className="badge">{m.runtime} min</span> : null}
              {m.status ? <span className="badge">{m.status}</span> : null}
              {m.vote_average != null ? <span className="badge">⭐ {Number(m.vote_average).toFixed(1)} ({m.vote_count ?? 0})</span> : null}
            </div>

            {genres ? <div className="small" style={{ marginTop: 10 }}>{genres}</div> : null}
            {m.tagline ? <div style={{ marginTop: 10, fontStyle: "italic", color: "rgba(255,255,255,.82)" }}>{m.tagline}</div> : null}

            <div style={{ marginTop: 14, lineHeight: 1.7, color: "rgba(255,255,255,.88)", fontSize: 15 }}>
              {m.overview}
            </div>

            <div style={{ marginTop: 16 }}><MovieActionsClient movieId={movieId} /></div>

            <div className="panel" style={{ marginTop: 16 }}>
              <div className="row" style={{ justifyContent: "space-between" }}>
                <div><b>Budget</b><div className="small">{money(m.budget)}</div></div>
                <div><b>Revenue</b><div className="small">{money(m.revenue)}</div></div>
                <div><b>Homepage</b><div className="small">{m.homepage ? <a href={m.homepage} target="_blank">Open</a> : "-"}</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
