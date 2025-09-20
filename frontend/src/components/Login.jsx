import React, { useState } from "react";
import api from "../services/api";
import "./Login.css"; // Import the CSS file

export default function Login({ onAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, user } = res.data;
      onAuth(token, user);
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        <form onSubmit={submit} className="login-form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="login-input"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="login-input"
          />
          <button type="submit" disabled={loading} className="login-button">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="login-hint">
          <b>Test accounts (password: password)</b>
          <ul>
            <li>admin@acme.test (Admin)</li>
            <li>user@acme.test (Member)</li>
            <li>admin@globex.test (Admin)</li>
            <li>user@globex.test (Member)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
