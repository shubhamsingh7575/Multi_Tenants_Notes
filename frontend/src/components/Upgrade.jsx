import React, { useState } from "react";
import api, { authHeader } from "../services/api";

export default function Upgrade({ token, user, onUpgraded, setError }) {
  const [loading, setLoading] = useState(false);

  async function upgrade() {
    setLoading(true);
    try {
      await api.post(`/tenants/${user.tenant}/upgrade`, {}, { headers: authHeader(token) });
      alert("Tenant upgraded to PRO");
      onUpgraded({ plan: "PRO" });
      const upgradedUser = await api.post("/auth/check", { email: user.email });
      console.log("updgrade", upgradedUser.data.user);
      localStorage.removeItem("user")
      localStorage.setItem("user", JSON.stringify(upgradedUser.data.user));
      window.location.reload();
    } catch (err) {
      console.log("error:", err);
      setError(err.response?.data?.message || "Upgrade failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {user?.tenantPlan === "FREE" && (
        user.role === "ADMIN" ? (
          <div className="upgrade">
            <p>Free plan limit reached. Upgrade to Pro to add more notes.</p>
            <button onClick={upgrade} disabled={loading}>
              {loading ? "Upgrading..." : "Upgrade to Pro"}
            </button>
          </div>
        ) : (
          <p className="small">Free plan limit reached. Ask an Admin to upgrade the tenant.</p>
        )
      )}

    </div>
  );
}
