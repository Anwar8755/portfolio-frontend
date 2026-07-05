import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./contactManager.css";
import { DashboardContext } from "../dashboard/Dashboard"; 

const ACCENTS = ["teal", "purple", "green", "amber"];

export default function ContactManager() {
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const token = localStorage.getItem("token");

  const { refetchCounts } = useContext(DashboardContext); 

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/contacts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching contacts:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/contacts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchContacts();
      refetchCounts(); 
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  };

  const handleCopyEmail = (email, id) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(email).then(() => {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 1500);
      });
    }
  };

  const getInitials = (name) =>
    name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("") || "?";

  const filteredMessages = messages.filter((msg) =>
    msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="contact-manager">
      <div className="cm-header">
        <p className="cm-eyebrow">// messages</p>
        <div className="cm-header-row">
          <h2 className="cm-title">Contact Messages</h2>
          <span className="cm-count-pill">{messages.length} total</span>
        </div>
        <p className="cm-subtitle">Messages submitted through your portfolio's contact form.</p>
      </div>

      <div className="cm-search-row">
        <span className="cm-search-prompt">$</span>
        <input
          type="text"
          className="cm-search-input"
          placeholder="grep --name --email --subject"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredMessages.length === 0 ? (
        <div className="cm-empty">
          <p className="cm-eyebrow">// inbox empty</p>
          <p>No messages found.</p>
        </div>
      ) : (
        <div className="message-list">
          {filteredMessages.map((msg, index) => (
            <div
              className={`cm-card cm-card--${ACCENTS[index % ACCENTS.length]}`}
              key={msg._id}
            >
              <div className="cm-card-titlebar">
                <span className="dot dot--red" />
                <span className="dot dot--yellow" />
                <span className="dot dot--green" />
                <span className="cm-card-filename">message.eml</span>
              </div>

              <div className="cm-card-body">
                <div className="cm-card-top">
                  <span className={`cm-avatar cm-avatar--${ACCENTS[index % ACCENTS.length]}`}>
                    {getInitials(msg.name)}
                  </span>
                  <div className="cm-card-identity">
                    <h3 className="cm-card-name">{msg.name}</h3>
                    <button
                      className="cm-email-btn"
                      onClick={() => handleCopyEmail(msg.email, msg._id)}
                      type="button"
                    >
                      {msg.email}
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M5 15V6a2 2 0 0 1 2-2h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      <span className={`cm-copied ${copiedId === msg._id ? "cm-copied--visible" : ""}`}>
                        copied
                      </span>
                    </button>
                  </div>
                </div>

                <div className="cm-meta-row">
                  <span className="cm-meta-label">phone</span>
                  <span className="cm-meta-value">{msg.phone || "—"}</span>
                </div>

                <div className="cm-subject-row">
                  <span className="cm-prompt">$</span> subject:
                  <span className="cm-subject-text">{msg.subject}</span>
                </div>

                <p className="cm-message-text">{msg.message}</p>

                <div className="cm-card-actions">
                  <button className="cm-delete-btn" onClick={() => handleDelete(msg._id)}>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 7h14M10 7V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2M7 7l1 13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}