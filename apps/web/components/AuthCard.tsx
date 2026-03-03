"use client";

export function AuthCard() {
  return (
    <div className="panel">
      <div style={{ fontWeight: 900, fontSize: 16 }}>MetaMask-only authentication</div>
      <div className="small" style={{ marginTop: 10 }}>
        Registration and login are handled with MetaMask only.
      </div>
      <div className="small" style={{ marginTop: 8 }}>
        Use the <b>Connect Wallet</b> button below to create your account or sign in with your wallet profile.
      </div>
    </div>
  );
}
