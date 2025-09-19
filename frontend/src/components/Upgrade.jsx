import React from "react";
import API from "../services/api";

function Upgrade({ user, setLimitReached }) {
  const upgradePlan = async () => {
    try {
      await API.post(
        `/tenants/${user.tenant}/upgrade`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert("Tenant upgraded to PRO!");
      setLimitReached(false);
    } catch (err) {
      alert("Only Admin can upgrade the plan");
    }
  };

  return (
    <div className="upgrade-box">
      <p>Free plan limit reached! Upgrade to Pro for unlimited notes.</p>
      {user.role === "ADMIN" && <button onClick={upgradePlan}>Upgrade to Pro</button>}
    </div>
  );
}

export default Upgrade;
