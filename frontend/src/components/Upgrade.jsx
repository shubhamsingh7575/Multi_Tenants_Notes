import React, { useState } from "react";
import api, { authHeader } from "../services/api";

export default function Upgrade({ token, user, onUpgraded, setError }) {
  const [loading, setLoading] = useState(false);

  async function upgrade() {
    setLoading(true);
    try {
      await api.post(`/tenants/${user.tenant}/upgrade`, {}, { headers: authHeader(token) });
      alert("Tenant upgraded to PRO");
      onUpgraded();
    } catch (err) {
      setError(err.response?.data?.message || "Upgrade failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="upgrade">
      <p>Free plan limit reached. Upgrade to Pro to add more notes.</p>
      {user.role === "ADMIN" ? (
        <button onClick={upgrade} disabled={loading}>{loading ? "Upgrading..." : "Upgrade to Pro"}</button>
      ) : (
        <p className="small">Ask an Admin to upgrade the tenant.</p>
      )}
    </div>
  );
}
