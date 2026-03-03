"use client";
import { useEffect, useState } from "react";

export function AuthCard() {
  const [mode, setMode] = useState<"login"|"register">("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  async function submit() {
    if (isMobile && mode === "register") {
      setStatus("Mobile registration uses MetaMask only. Please use Connect Wallet.");
      return;
    }

    setStatus("...");
    const r = await fetch(`/api/auth/password/${mode}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const j = await r.json();
    if (!r.ok) { setStatus(j?.error ?? "Failed"); return; }
    setStatus("Success ✅");
    window.location.href = "/";
  }

  const mobileRegisterOnly = isMobile && mode === "register";

  return (
    <div className="panel">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div style={{ fontWeight: 900, fontSize: 16 }}>{mode === "register" ? "Create account" : "Sign in"}</div>
        <button className="btn btnGhost" style={{ width: "auto", padding: "8px 10px" }}
          onClick={() => { setMode(mode === "register" ? "login" : "register"); setStatus(""); }}>
          Switch to {mode === "register" ? "Login" : "Register"}
        </button>
      </div>
      <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
        {mobileRegisterOnly ? (
          <div className="small">On mobile, new account registration is available with MetaMask only. Switch to Login for email sign-in, or use Connect Wallet below.</div>
        ) : (
          <>
            <input className="input" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="input" placeholder="password (8+ chars)" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button className="btn btnPrimary" onClick={submit}>{mode === "register" ? "Register with Email" : "Login with Email"}</button>
          </>
        )}
        {status ? <div className="small">{status}</div> : null}
        {!mobileRegisterOnly ? <div className="small">Email + password auth is enabled.</div> : null}
      </div>
    </div>
  );
}
