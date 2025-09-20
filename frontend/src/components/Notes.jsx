import React, { useEffect, useState } from "react";
import api, { authHeader } from "../services/api";
import Upgrade from "./Upgrade";
import InviteUser from "./InviteUser";
import "./Notes.css"; // Make sure to update the CSS
export default function Notes({ token, user, onLogout }) {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const [limitReached, setLimitReached] = useState(false);
  const [loading, setLoading] = useState(false);

    // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");


  async function fetchNotes() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/notes`, { headers: authHeader(token) });
      setNotes(res.data);
      const isFree = true;
      if (isFree && res.data.length >= 3) setLimitReached(true);
      else setLimitReached(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load notes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  async function createNote(e) {
    e?.preventDefault();
    setError(null);
    try {
      await api.post(`/notes`, { title, content }, { headers: authHeader(token) });
      setTitle("");
      setContent("");
      await fetchNotes();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create note");
      if (err.response?.status === 403) setLimitReached(true);
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

   // start editing
  function startEdit(note) {
    setEditingId(note._id);
    setEditTitle(note.title);
    setEditContent(note.content);
  }

  async function saveEdit(e) {
    e && e.preventDefault();
    try {
      const res = await api.put(
        `/notes/${editingId}`,
        { title: editTitle, content: editContent },
        { headers: authHeader(token) }
      );
      setNotes((prev) => prev.map((n) => (n._id === editingId ? res.data : n)));
      setEditingId(null);
      setEditTitle("");
      setEditContent("");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setEditTitle("");
    setEditContent("");
  }

  function onUpgraded() {
    setLimitReached(false);
    fetchNotes();
  }

  return (
    <div className="container">
      <header className="topbar">
        <div className="user-info">
          <h2>Tenant: {user.tenant}</h2>
          <span>{user.email} — {user.role}</span>
        </div>
        <button onClick={onLogout} className="ghost logout-btn">Logout</button>
      </header>

      <div className="card create-note-card">
        <h3>Create Note</h3>
        <form onSubmit={createNote} className="form">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required />
          <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Content" />
          <button type="submit" className="btn-primary">Create</button>
        </form>
        {error && <div className="error">{error}</div>}
        {limitReached && <Upgrade token={token} user={user} onUpgraded={onUpgraded} setError={setError} />}
      </div>

       {/* Admin invite panel */}
      {user.role === "ADMIN" && (
        <InviteUser
          token={token}
          user={user}
          onInvited={(u) => console.log("Invited:", u)}
        />
      )}

      <div className="card">
        <h3>Notes</h3>
        {loading ? <div>Loading…</div> : null}
        <ul className="note-list">
          {notes.map((n) => (
            <li key={n._id} className="note-item">
              {editingId === n._id ? (
                <form onSubmit={saveEdit} className="form">
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    required
                  />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button type="submit">Save</button>
                    <button type="button" onClick={cancelEdit} className="ghost">
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="note-head">
                    <strong>{n.title}</strong>
                    <div>
                      <button
                        onClick={() => startEdit(n)}
                        className="btn-edit"
                      >
                        Edit
                      </button>{" "}
                      <button
                        className="btn-danger"
                        onClick={() => deleteNote(n._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="note-body">{n.content}</div>
                  <div className="meta">
                    created:{" "}
                    {new Date(
                      n.createdAt || n.updatedAt || Date.now()
                    ).toLocaleString()}
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}