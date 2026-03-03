import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import Constants from "expo-constants";
import { getMovieDetails, tmdbImageUrl } from "@movie/api-client";
import { MovieRowActions } from "../../src/ui/MovieRowActions";
import { theme } from "../../src/ui/theme";

export default function MovieDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const movieId = Number(id);
  const [m, setM] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const extra: any = Constants.expoConfig?.extra ?? {};
        const apiKey = extra.EXPO_PUBLIC_TMDB_API_KEY as string;
        const d = await getMovieDetails({ apiKey }, movieId);
        if (!alive) return;
        setM(d);
      } catch (e: any) {
        if (!alive) return;
        setErr(e?.message ?? "Failed");
      }
    })();
    return () => { alive = false; };
  }, [movieId]);

  if (err) return <View style={{ flex: 1, padding: 16, backgroundColor: theme.bg }}><Text style={{ color: theme.bad }}>{err}</Text></View>;
  if (!m) return <View style={{ flex: 1, padding: 16, backgroundColor: theme.bg }}><Text style={{ color: theme.text }}>Loading...</Text></View>;

  const poster = tmdbImageUrl(m.poster_path ?? null, "w500");

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bg }} contentContainerStyle={{ padding: 16 }}>
      {poster ? <Image source={{ uri: poster }} style={{ width: "100%", aspectRatio: 2/3, borderRadius: 18, backgroundColor: theme.card }} /> : null}
      <Text style={{ marginTop: 14, fontSize: 24, fontWeight: "900", color: theme.text }}>{m.title}</Text>
      <Text style={{ marginTop: 6, color: theme.muted }}>{m.release_date ?? ""} · Rating {m.vote_average ?? "-"}</Text>
      <Text style={{ marginTop: 12, lineHeight: 20, color: "rgba(255,255,255,0.82)" }}>{m.overview}</Text>
      <View style={{ marginTop: 14 }}><MovieRowActions movieId={movieId} /></View>
    </ScrollView>
  );
}
