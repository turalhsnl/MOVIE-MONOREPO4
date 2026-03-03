import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import Constants from "expo-constants";
import { apiFetch } from "../../src/lib/api";
import { getMovieDetails } from "@movie/api-client";
import { toMovieCardVM, type MovieCardVM } from "@movie/core";
import { theme } from "../../src/ui/theme";
import { MovieListRow } from "../../src/ui/MovieListRow";

export default function Watchlist() {
  const [movies, setMovies] = useState<MovieCardVM[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const j = await apiFetch("/api/mobile/list", { method: "POST", body: JSON.stringify({ type: "WATCHLIST" }) });
        const ids: number[] = j.movieIds ?? [];

        const extra: any = Constants.expoConfig?.extra ?? {};
        const apiKey = extra.EXPO_PUBLIC_TMDB_API_KEY as string;

        const raw = await Promise.all(ids.map((id) => getMovieDetails({ apiKey }, id).catch(() => null)));
        const list = raw.filter(Boolean).map((m: any) => toMovieCardVM(m));

        if (!alive) return;
        setMovies(list);
      } catch (e: any) {
        if (!alive) return;
        setErr(e?.message ?? "Sign in required");
      }
    })();
    return () => { alive = false; };
  }, []);

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: theme.bg }}>
      <Text style={{ fontSize: 24, fontWeight: "900", color: theme.text }}>Watchlist</Text>
      {err ? <Text style={{ color: theme.bad, marginTop: 10 }}>{err}</Text> : null}
      <FlatList style={{ marginTop: 12 }} data={movies} keyExtractor={(m) => String(m.id)} renderItem={({ item }) => <MovieListRow m={item} />} />
    </View>
  );
}
