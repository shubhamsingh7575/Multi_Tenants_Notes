import React, { useState } from "react";
import Login from "./components/Login";
import Notes from "./components/Notes";

function App() {
  const [user, setUser] = useState(null);

  return (
    <div className="container">
      <h1>Multi-Tenant Notes App</h1>
      {!user ? (
        <Login setUser={setUser} />
      ) : (
        <Notes user={user} setUser={setUser} />
      )}
    </div>
  );
}

export default App;
