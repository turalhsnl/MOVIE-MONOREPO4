import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import Constants from "expo-constants";
import { getPopularMovies } from "@movie/api-client";
import { toMovieCardVM, type MovieCardVM } from "@movie/core";
import { theme } from "../../src/ui/theme";
import { MovieListRow } from "../../src/ui/MovieListRow";

export default function Home() {
  const [movies, setMovies] = useState<MovieCardVM[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const extra: any = Constants.expoConfig?.extra ?? {};
        const apiKey = extra.EXPO_PUBLIC_TMDB_API_KEY as string;
        const data = await getPopularMovies({ apiKey }, 1);
        if (!alive) return;
        setMovies(data.results.map(toMovieCardVM));
      } catch (e: any) {
        if (!alive) return;
        setErr(e?.message ?? "Failed");
      }
    })();
    return () => { alive = false; };
  }, []);

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: theme.bg }}>
      <Text style={{ fontSize: 26, fontWeight: "900", color: theme.text }}>Popular</Text>
      <Text style={{ marginTop: 6, color: theme.muted }}>Tap a movie for details. Save it for later.</Text>
      {err ? <Text style={{ color: theme.bad, marginTop: 10 }}>{err}</Text> : null}
      <FlatList style={{ marginTop: 12 }} data={movies} keyExtractor={(m) => String(m.id)} renderItem={({ item }) => <MovieListRow m={item} />} />
    </View>
  );
}
