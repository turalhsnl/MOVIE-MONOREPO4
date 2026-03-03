import { TmdbMovieSchema, TmdbPagedResponseSchema, type TmdbMovie, type TmdbPagedResponse } from "@movie/schemas";

export type TmdbConfig = { apiKey: string; baseUrl?: string };
const DEFAULT_BASE = "https://api.themoviedb.org/3";

async function tmdbFetch<T>(cfg: TmdbConfig, path: string, params: Record<string, string> = {}): Promise<T> {
  if (!cfg.apiKey || cfg.apiKey.trim().length < 10) throw new Error("TMDB apiKey missing.");
  const baseUrl = cfg.baseUrl ?? DEFAULT_BASE;
  const url = new URL(baseUrl + path);
  url.searchParams.set("api_key", cfg.apiKey);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url.toString(), { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`TMDB error ${res.status}`);
  return (await res.json()) as T;
}

export async function getPopularMovies(cfg: TmdbConfig, page = 1): Promise<TmdbPagedResponse> {
  const json = await tmdbFetch<unknown>(cfg, "/movie/popular", { page: String(page) });
  return TmdbPagedResponseSchema.parse(json);
}

export async function getMovieDetails(cfg: TmdbConfig, id: number): Promise<TmdbMovie> {
  const json = await tmdbFetch<unknown>(cfg, `/movie/${id}`);
  return TmdbMovieSchema.parse(json);
}

export function tmdbImageUrl(path: string | null | undefined, size: "w185" | "w342" | "w500" | "original" = "w342") {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
