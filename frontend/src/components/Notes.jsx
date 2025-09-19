import React, { useEffect, useState } from "react";
import API from "../services/api";
import Upgrade from "./Upgrade";

function Notes({ user, setUser }) {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [limitReached, setLimitReached] = useState(false);

  const fetchNotes = async () => {
    try {
      const { data } = await API.get("/api/notes", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setNotes(data);
      if (user.role === "MEMBER" || user.role === "ADMIN") {
        if (data.length >= 3 && user.tenant !== "pro") {
          setLimitReached(true);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const addNote = async (e) => {
    e.preventDefault();
    try {
      await API.post(
        "/api/notes",
        { title, content },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setTitle("");
      setContent("");
      fetchNotes();
    } catch (err) {
      alert(err.response?.data?.message || "Error adding note");
    }
  };

  const deleteNote = async (id) => {
    try {
      await API.delete(`/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <div className="card">
      <h2>Notes</h2>
      <p>
        Logged in as <strong>{user.email}</strong> ({user.role}) in tenant{" "}
        <strong>{user.tenant}</strong>
      </p>
      <button onClick={logout}>Logout</button>

      {limitReached && <Upgrade user={user} setLimitReached={setLimitReached} />}

      <form onSubmit={addNote}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">Add Note</button>
      </form>

      <ul className="note-list">
        {notes.map((note) => (
          <li key={note._id}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <button onClick={() => deleteNote(note._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Notes;
