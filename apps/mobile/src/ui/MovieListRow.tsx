import { Image, Pressable, Text, View } from "react-native";
import { Link } from "expo-router";
import { tmdbImageUrl } from "@movie/api-client";
import type { MovieCardVM } from "@movie/core";
import { theme } from "./theme";
import { MovieRowActions } from "./MovieRowActions";

export function MovieListRow({ m }: { m: MovieCardVM }) {
  const poster = tmdbImageUrl(m.posterPath ?? null, "w185");
  return (
    <View style={{ flexDirection: "row", gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.border }}>
      {poster ? (
        <Image source={{ uri: poster }} style={{ width: 70, height: 105, borderRadius: 12, backgroundColor: theme.card }} />
      ) : (
        <View style={{ width: 70, height: 105, borderRadius: 12, backgroundColor: theme.card }} />
      )}

      <View style={{ flex: 1 }}>
        <Link href={`/movie/${m.id}`} asChild>
          <Pressable>
            <Text style={{ fontSize: 16, fontWeight: "900", color: theme.text }}>{m.title}</Text>
            {m.subtitle ? <Text style={{ marginTop: 4, color: theme.muted }}>{m.subtitle}</Text> : null}
            <Text numberOfLines={2} style={{ marginTop: 6, color: "rgba(255,255,255,0.80)" }}>{m.overview}</Text>
          </Pressable>
        </Link>
        <View style={{ marginTop: 10 }}><MovieRowActions movieId={m.id} /></View>
      </View>
    </View>
  );
}
