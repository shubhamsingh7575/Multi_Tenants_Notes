import React, { useEffect, useState } from "react";
import api, { authHeader } from "../services/api";
import Upgrade from "./Upgrade";

export default function Notes({ token, user, onLogout }) {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const [limitReached, setLimitReached] = useState(false);
  const [loading, setLoading] = useState(false);

  async function fetchNotes() {
    setLoading(true);
    setError(null);
    try {
      console.log(user)
      const res = await api.get(`/notes`, { headers: authHeader(token) });
      setNotes(res.data);
      // set limitReached if tenant plan is FREE and notes length >= 3
      if (user && user.tenant && user.role) {
        // We don't have tenant.plan from login by default. We'll consider limit based on API response count.
        const isFree = true; // fallback; backend enforces exact rule
        if (isFree && res.data.length >= 3) setLimitReached(true);
        else setLimitReached(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load notes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNotes();
    // eslint-disable-next-line
  }, []);

  async function createNote(e) {
    e && e.preventDefault();
    setError(null);
    try {
      await api.post(`/notes`, { title, content }, { headers: authHeader(token) });
      setTitle(""); setContent("");
      await fetchNotes();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create note";
      setError(msg);
      if (err.response?.status === 403) {
        setLimitReached(true);
      }
    }
  }

  async function deleteNote(id) {
    try {
      await api.delete(`/notes/${id}`, { headers: authHeader(token) });
      setNotes(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  }

  function onUpgraded() {
    // called after upgrade; refetch notes and clear limit flag
    setLimitReached(false);
    fetchNotes();
  }

  return (
    <div className="container">
      <header className="topbar">
        <div>
          <h2>Tenant: {user.tenant}</h2>
          <div>{user.email} — {user.role}</div>
        </div>
        <div>
          <button onClick={onLogout} className="ghost">Logout</button>
        </div>
      </header>

      <div className="card">
        <h3>Create note</h3>
        <form onSubmit={createNote} className="form">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required />
          <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Content" />
          <button type="submit">Create</button>
        </form>

        {error && <div className="error">{error}</div>}
        {limitReached && <Upgrade token={token} user={user} onUpgraded={onUpgraded} setError={setError} />}
      </div>

      <div className="card">
        <h3>Notes</h3>
        {loading ? <div>Loading…</div> : null}
        <ul className="note-list">
          {notes.map(n => (
            <li key={n._id} className="note-item">
              <div className="note-head">
                <strong>{n.title}</strong>
                <button className="danger" onClick={() => deleteNote(n._id)}>Delete</button>
              </div>
              <div className="note-body">{n.content}</div>
              <div className="meta">created: {new Date(n.createdAt || n.updatedAt || Date.now()).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
