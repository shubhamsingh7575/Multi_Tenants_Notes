import React, { useState } from "react";
import api, { authHeader } from "../services/api";

export default function InviteUser({ token, user, onInvited }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("password");
  const [role, setRole] = useState("MEMBER");
  const [loading, setLoading] = useState(false);

  async function invite(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post(
        `/tenants/${user.tenant}/users`,
        { email: email.trim().toLowerCase(), role, password },
        { headers: authHeader(token) }
      );
      alert("User invited: " + res.data.email);
      setEmail("");
      setPassword("password");
      setRole("MEMBER");
      onInvited && onInvited(res.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Invite failed");
    } finally {
      setLoading(false);
    }
  }

  if (user.role?.toUpperCase() !== "ADMIN") return null;

  return (
    <div className="card" style={{ marginTop: 12 }}>
      <h4>Invite User (Admin)</h4>
      <form onSubmit={invite} className="form">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
          required
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="MEMBER">Member</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button type="submit" disabled={loading} style={{marginLeft: 10}}>
          {loading ? "Inviting..." : "Invite"}
        </button>
      </form>
    </div>
  );
}
