import { useCallback, useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { apiFetch } from "../../src/lib/api";
import { clearToken, setToken } from "../../src/lib/session";
import { theme } from "../../src/ui/theme";

export default function Profile() {
  const [me, setMe] = useState<any>({ authed: false, user: null });
  const [mode, setMode] = useState<"register" | "login">("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  const refresh = useCallback(async () => {
    try { setMe(await apiFetch("/api/me")); }
    catch { setMe({ authed: false, user: null }); }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const submit = useCallback(async () => {
    try {
      setStatus("...");
      const j = await apiFetch(`/api/auth/password/${mode}`, { method: "POST", body: JSON.stringify({ email, password }) });
      await setToken(j.token);
      setStatus("Success ✅");
      await refresh();
    } catch (e: any) {
      setStatus(e?.message ?? "Failed");
    }
  }, [mode, email, password, refresh]);

  const logout = useCallback(async () => {
    await clearToken();
    setStatus("Logged out");
    await refresh();
  }, [refresh]);

  const authed = !!me?.authed;

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: theme.bg }}>
      <Text style={{ fontSize: 24, fontWeight: "900", color: theme.text }}>Profile</Text>

      {authed ? (
        <View style={{ marginTop: 12, gap: 8, padding: 14, borderRadius: 18, borderWidth: 1, borderColor: theme.border, backgroundColor: theme.card }}>
          <Text style={{ color: theme.text }}><Text style={{ fontWeight: "900" }}>UserId:</Text> {me.user.id}</Text>
          <Text style={{ color: theme.text }}><Text style={{ fontWeight: "900" }}>Email:</Text> {me.user.email ?? "-"}</Text>
          <Text style={{ color: theme.text }}><Text style={{ fontWeight: "900" }}>Wallet:</Text> {me.user.walletAddress ?? "-"}</Text>
          <Pressable onPress={logout} style={btn()}><Text style={btnText()}>Logout</Text></Pressable>
          <Text style={{ color: theme.muted }}>To link wallet: login on web and connect MetaMask.</Text>
        </View>
      ) : (
        <View style={{ marginTop: 12, gap: 10, padding: 14, borderRadius: 18, borderWidth: 1, borderColor: theme.border, backgroundColor: theme.card }}>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Pressable onPress={() => setMode("register")} style={[seg(mode === "register")]}><Text style={segText(mode === "register")}>Register</Text></Pressable>
            <Pressable onPress={() => setMode("login")} style={[seg(mode === "login")]}><Text style={segText(mode === "login")}>Login</Text></Pressable>
          </View>

          <TextInput value={email} onChangeText={setEmail} placeholder="email" autoCapitalize="none" placeholderTextColor={theme.muted} style={input()} />
          <TextInput value={password} onChangeText={setPassword} placeholder="password (8+ chars)" secureTextEntry placeholderTextColor={theme.muted} style={input()} />

          <Pressable onPress={submit} style={btnGrad()}><Text style={btnText()}>Continue</Text></Pressable>
          {status ? <Text style={{ color: theme.muted }}>{status}</Text> : null}
        </View>
      )}
    </View>
  );
}

function input() { return { borderWidth: 1, borderColor: theme.border, borderRadius: 14, padding: 12, color: theme.text, backgroundColor: "rgba(0,0,0,0.22)" as const }; }
function btn() { return { backgroundColor: "#0D1020", borderRadius: 14, padding: 12, alignItems: "center" as const, borderWidth: 1, borderColor: theme.border }; }
function btnGrad() { return { borderRadius: 14, padding: 12, alignItems: "center" as const, backgroundColor: theme.brandA }; }
function btnText() { return { color: "white", fontWeight: "900" as const }; }
function seg(active: boolean) { return { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: "center" as const, borderWidth: 1, borderColor: theme.border, backgroundColor: active ? theme.brandB : "rgba(255,255,255,0.04)" }; }
function segText(active: boolean) { return { color: "white", fontWeight: active ? ("900" as const) : ("700" as const) }; }
