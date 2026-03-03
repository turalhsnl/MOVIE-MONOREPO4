"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BrowserProvider } from "ethers";
import { SiweMessage } from "siwe";

type EthProvider = { request: (args: { method: string; params?: unknown[] }) => Promise<unknown> };
declare global { interface Window { ethereum?: EthProvider } }

export function MetaMaskSIWE() {
  const hasMetaMask = useMemo(() => typeof window !== "undefined" && !!window.ethereum, []);
  const [status, setStatus] = useState(hasMetaMask ? "Not linked" : "MetaMask not found");
  const [address, setAddress] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const r = await fetch("/api/me", { cache: "no-store", credentials: "include" });
    const me = await r.json();
    if (me.authed && me.user?.walletAddress) {
      setAddress(me.user.walletAddress);
      setStatus("Wallet linked ✅");
    } else {
      setAddress(null);
      setStatus(hasMetaMask ? "Link wallet for extra security" : "MetaMask not found");
    }
  }, [hasMetaMask]);

  useEffect(() => { refresh(); }, [refresh]);

  const connect = useCallback(async () => {
    try {
      if (!window.ethereum) return;
      setStatus("Connecting...");
      const provider = new BrowserProvider(window.ethereum as any);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const signer = await provider.getSigner();
      const addr = await signer.getAddress();
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);

      setStatus("Nonce...");
      const nonceRes = await fetch("/api/auth/siwe/nonce", { cache: "no-store", credentials: "include" });
      const { nonce } = await nonceRes.json();

      const msg = new SiweMessage({
        domain: window.location.host,
        address: addr,
        statement: "Secure your MovieVerse account with MetaMask",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce,
      });

      setStatus("Signing...");
      const message = msg.prepareMessage();
      const signature = await signer.signMessage(message);

      setStatus("Verifying...");
      const vr = await fetch("/api/auth/siwe/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message, signature }),
      });
      const j = await vr.json();
      if (!vr.ok) throw new Error(j?.error ?? "SIWE verify failed");

      await refresh();
      setStatus("Done ✅");
    } catch (e: any) {
      setStatus(e?.message ?? "Failed");
    }
  }, [refresh]);

  return (
    <div className="panel">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div>
          <div style={{ fontWeight: 900 }}>MetaMask Security</div>
          <div className="small">{status}</div>
        </div>
        {address ? <span className="badge">{address.slice(0,6)}…{address.slice(-4)}</span> : null}
      </div>
      <button className="btn btnPrimary" onClick={connect} disabled={!hasMetaMask} style={{ marginTop: 10, opacity: hasMetaMask ? 1 : 0.6 }}>
        {hasMetaMask ? "Connect Wallet" : "Install MetaMask"}
      </button>
    </div>
  );
}
