import React, { useEffect, useState } from "react";
import Login from "./components/Login";
import Notes from "./components/Notes";

/*
  App keeps token+user in localStorage.
  Backend login returns: { token, user: { email, role, tenant } }
*/

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  function handleLogout() {
    setToken(null);
    setUser(null);
  }

  if (!token || !user) {
    return <Login onAuth={(t, u) => { setToken(t); setUser(u); }} />;
  }

  return <Notes token={token} user={user} onLogout={handleLogout} />;
}
