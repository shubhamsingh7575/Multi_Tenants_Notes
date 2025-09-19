import React, { useState } from "react";
import api, { authHeader } from "../services/api";

export default function InviteUser({ token, user, onInvited }) {
  const [email, setEmail] = useState("");
  
  const [password, setPassword] = useState("password");
  const [loading, setLoading] = useState(false);

  async function invite(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post(`/tenants/${user.tenant}/users`,
        { email: email.trim().toLowerCase(), role, password },
        { headers: authHeader(token) }
      );
      alert("User invited: " + res.data.email);
      setEmail(""); setPassword("password");
      onInvited && onInvited(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Invite failed");
    } finally {
      setLoading(false);
    }
  }

  if (user.role !== "ADMIN") return null;

  return (
    <div className="card" style={{ marginTop: 12 }}>
      <h4>Invite User (Admin)</h4>
      <form onSubmit={invite} className="form">
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="email" required />
        
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="password" required />
        <button type="submit" disabled={loading}>{loading ? "Inviting..." : "Invite Member"}</button>
      </form>
    </div>
  );
}
