import type { TmdbMovie } from "@movie/schemas";

export type MovieCardVM = {
  id: number;
  title: string;
  subtitle?: string;
  overview: string;
  posterPath?: string | null;
};

export function toMovieCardVM(m: TmdbMovie): MovieCardVM {
  return {
    id: m.id,
    title: m.title,
    subtitle: (m.release_date ?? undefined) as any,
    overview: m.overview ?? "",
    posterPath: m.poster_path ?? null,
  };
}
