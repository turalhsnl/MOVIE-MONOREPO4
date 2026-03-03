import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { apiFetch } from "../lib/api";
import { theme } from "./theme";

type Flags = { liked: boolean; watchlisted: boolean };

export function MovieRowActions({ movieId }: { movieId: number }) {
  const [flags, setFlags] = useState<Flags>({ liked: false, watchlisted: false });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const j = await apiFetch("/api/movies/flags", { method: "POST", body: JSON.stringify({ movieIds: [movieId] }) });
        if (!alive) return;
        setFlags(j.flags?.[String(movieId)] ?? { liked: false, watchlisted: false });
      } catch {}
    })();
    return () => { alive = false; };
  }, [movieId]);

  async function toggle(type: "LIKE" | "WATCHLIST") {
    try {
      setMsg("");
      const j = await apiFetch("/api/movies/toggle", { method: "POST", body: JSON.stringify({ movieId, type }) });
      setFlags(j.flags);
    } catch (e: any) {
      setMsg(e?.message ?? "Sign in required");
      setTimeout(() => setMsg(""), 1500);
    }
  }

  return (
    <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
      <Pill active={flags.liked} label={flags.liked ? "♥ Liked" : "♡ Like"} onPress={() => toggle("LIKE")} />
      <Pill active={flags.watchlisted} label={flags.watchlisted ? "✓ Watchlist" : "+ Watchlist"} onPress={() => toggle("WATCHLIST")} />
      {msg ? <Text style={{ color: theme.muted }}>{msg}</Text> : null}
    </View>
  );
}

function Pill({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={{
      paddingVertical: 8, paddingHorizontal: 10, borderRadius: 999,
      borderWidth: 1, borderColor: theme.border,
      backgroundColor: active ? theme.brandA : theme.card,
    }}>
      <Text style={{ color: theme.text, fontWeight: "800" }}>{label}</Text>
    </Pressable>
  );
}
