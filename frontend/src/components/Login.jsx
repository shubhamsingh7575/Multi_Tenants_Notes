import React, { useState } from "react";
import API from "../services/api";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/api/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      setUser(data);
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <form onSubmit={submitHandler} className="card">
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
