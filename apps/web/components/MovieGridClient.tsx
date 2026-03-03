"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { tmdbImageUrl } from "@movie/api-client";
import type { MovieCardVM } from "@movie/core";
import { MovieActionsClient } from "./MovieActionsClient";

type Flags = { liked: boolean; watchlisted: boolean };
type FlagsMap = Record<string, Flags>;

export function MovieGridClient({ movies }: { movies: MovieCardVM[] }) {
  const [flags, setFlags] = useState<FlagsMap>({});
  useEffect(() => {
    (async () => {
      const ids = movies.map((m) => m.id);
      const r = await fetch("/api/movies/flags", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ movieIds: ids }),
      });
      if (!r.ok) return;
      const j = await r.json();
      setFlags(j.flags ?? {});
    })();
  }, [movies]);

  return (
    <div className="grid">
      {movies.map((m) => {
        const poster = tmdbImageUrl(m.posterPath ?? null, "w342");
        const f = flags[String(m.id)] ?? { liked: false, watchlisted: false };
        return (
          <article key={m.id} className="card">
            <Link href={`/movies/${m.id}`} style={{ display: "block" }}>
              <div style={{ position: "relative", width: "100%", aspectRatio: "2/3", background: "rgba(255,255,255,.05)" }}>
                {poster ? <Image src={poster} alt={m.title} fill sizes="(max-width: 600px) 50vw, 200px" style={{ objectFit: "cover" }} /> : null}
              </div>
              <div className="cardBody">
                <div className="cardTitle">{m.title}</div>
                {m.subtitle ? <div className="cardSub">{m.subtitle}</div> : null}
              </div>
            </Link>
            <div className="cardBody" style={{ paddingTop: 0 }}>
              <MovieActionsClient movieId={m.id} initialFlags={f} />
            </div>
          </article>
        );
      })}
    </div>
  );
}
