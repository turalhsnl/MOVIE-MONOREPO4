import { Tabs } from "expo-router";
export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerStyle: { backgroundColor: "#070A13" }, tabBarStyle: { backgroundColor: "#070A13", borderTopColor: "rgba(255,255,255,0.10)" }, tabBarActiveTintColor: "#28D7FF", tabBarInactiveTintColor: "rgba(255,255,255,0.65)" }}>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="watchlist" options={{ title: "Watchlist" }} />
      <Tabs.Screen name="likes" options={{ title: "Likes" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
