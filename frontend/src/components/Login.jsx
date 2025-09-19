import React, { useState } from "react";
import api from "../services/api";

export default function Login({ onAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      // expected: { token, user: { email, role, tenant } }
      const { token, user } = res.data;
      onAuth(token, user);
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card center">
      <h2>Login</h2>
      <form onSubmit={submit} className="form">
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="email" required />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="password" required />
        <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
      </form>

      <div className="hint">
        <b>Test accounts (password: password)</b>
        <ul>
          <li>admin@acme.test (Admin)</li>
          <li>user@acme.test (Member)</li>
          <li>admin@globex.test (Admin)</li>
          <li>user@globex.test (Member)</li>
        </ul>
      </div>
    </div>
  );
}
