"use client";
import { useState } from "react";

export function AuthCard() {
  const [mode, setMode] = useState<"login"|"register">("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  async function submit() {
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
        <input className="input" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="input" placeholder="password (8+ chars)" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="btn btnPrimary" onClick={submit}>{mode === "register" ? "Register" : "Login"}</button>
        {status ? <div className="small">{status}</div> : null}
        <div className="small">No emails, just password auth.</div>
      </div>
    </div>
  );
}
