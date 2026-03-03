"use client";
import { useCallback, useState } from "react";
type Flags = { liked: boolean; watchlisted: boolean };
export function MovieActionsClient({ movieId, initialFlags }: { movieId: number; initialFlags?: Flags }) {
  const [flags, setFlags] = useState<Flags>(initialFlags ?? { liked: false, watchlisted: false });
  const [status, setStatus] = useState("");
  const toggle = useCallback(async (type: "LIKE" | "WATCHLIST") => {
    setStatus("...");
    const r = await fetch("/api/movies/toggle", {
      method: "POST",
      headers: { "content-type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ movieId, type }),
    });
    const j = await r.json();
    if (!r.ok) { setStatus(j?.error ?? "Sign in required"); setTimeout(() => setStatus(""), 1500); return; }
    setFlags(j.flags); setStatus("");
  }, [movieId]);
  return (
    <div className="row">
      <button className="btn" style={{ width: "auto" }} onClick={() => toggle("LIKE")}>{flags.liked ? "♥ Liked" : "♡ Like"}</button>
      <button className="btn" style={{ width: "auto" }} onClick={() => toggle("WATCHLIST")}>{flags.watchlisted ? "✓ Watchlist" : "+ Watchlist"}</button>
      {status ? <span className="small">{status}</span> : null}
    </div>
  );
}
