import { useCallback, useEffect, useState } from "react";
import { Linking, Pressable, Text, View } from "react-native";
import { apiBaseUrl, apiFetch } from "../../src/lib/api";
import { clearToken } from "../../src/lib/session";
import { theme } from "../../src/ui/theme";

export default function Profile() {
  const [me, setMe] = useState<any>({ authed: false, user: null });
  const [status, setStatus] = useState("");

  const refresh = useCallback(async () => {
    try { setMe(await apiFetch("/api/me")); }
    catch { setMe({ authed: false, user: null }); }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const openWalletAuth = useCallback(async () => {
    const url = `${apiBaseUrl()}/auth`;
    setStatus("Opening wallet auth...");
    const ok = await Linking.canOpenURL(url);
    if (!ok) {
      setStatus(`Cannot open ${url}`);
      return;
    }
    await Linking.openURL(url);
  }, []);

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
          <Text style={{ color: theme.text }}><Text style={{ fontWeight: "900" }}>Wallet:</Text> {me.user.walletAddress ?? "-"}</Text>
          <Pressable onPress={logout} style={btn()}><Text style={btnText()}>Logout</Text></Pressable>
        </View>
      ) : (
        <View style={{ marginTop: 12, gap: 10, padding: 14, borderRadius: 18, borderWidth: 1, borderColor: theme.border, backgroundColor: theme.card }}>
          <Text style={{ color: theme.text, fontWeight: "900" }}>MetaMask-only authentication</Text>
          <Text style={{ color: theme.muted }}>
            Registration and login are done with MetaMask. Tap below to open the auth page and connect your wallet.
          </Text>
          <Pressable onPress={openWalletAuth} style={btnGrad()}><Text style={btnText()}>Open MetaMask Auth</Text></Pressable>
          <Pressable onPress={refresh} style={btn()}><Text style={btnText()}>I already connected, refresh</Text></Pressable>
          {status ? <Text style={{ color: theme.muted }}>{status}</Text> : null}
        </View>
      )}
    </View>
  );
}

function btn() { return { backgroundColor: "#0D1020", borderRadius: 14, padding: 12, alignItems: "center" as const, borderWidth: 1, borderColor: theme.border }; }
function btnGrad() { return { borderRadius: 14, padding: 12, alignItems: "center" as const, backgroundColor: theme.brandA }; }
function btnText() { return { color: "white", fontWeight: "900" as const }; }
