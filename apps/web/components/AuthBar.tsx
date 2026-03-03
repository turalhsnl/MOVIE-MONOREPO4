import { AuthCard } from "./AuthCard";
import { MetaMaskSIWE } from "./MetaMaskSIWE";

export function AuthBar() {
  return (
    <div style={{ display: "grid", gap: 12, minWidth: 0 }}>
      <AuthCard />
      <MetaMaskSIWE />
    </div>
  );
}
