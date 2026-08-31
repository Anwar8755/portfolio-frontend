import React, { useEffect, useState } from "react";
import API from "../../../../services/api";
import "./AvailabilityManager.css";

export default function AvailabilityManager() {
  const [status,  setStatus]  = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState({ text: "", type: "" });

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await API.get("/availability");
      setStatus(res.data);
      setMessage(res.data.message);
    } catch (err) {
      console.error("Availability fetch error:", err);
      setMsg({ text: "Failed to load availability status.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async () => {
    setSaving(true);
    try {
      const res = await API.put("/availability", {
        isAvailable: !status.isAvailable,
        message,
      });
      setStatus(res.data);
      setMsg({
        text: `Status updated to ${res.data.isAvailable ? "Available" : "Not Available"}`,
        type: "success",
      });
      setTimeout(() => setMsg({ text: "", type: "" }), 3000);
    } catch (err) {
      console.error("Availability toggle error:", err);
      setMsg({ text: "Failed to update status.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleMessageSave = async () => {
    if (!message.trim()) {
      setMsg({ text: "Message cannot be empty.", type: "error" });
      return;
    }
    setSaving(true);
    try {
      const res = await API.put("/availability", {
        isAvailable: status.isAvailable,
        message,
      });
      setStatus(res.data);
      setMsg({ text: "Message updated successfully!", type: "success" });
      setTimeout(() => setMsg({ text: "", type: "" }), 3000);
    } catch (err) {
      console.error("Message save error:", err);
      setMsg({ text: "Failed to update message.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="av-loading">
        <span className="av-spinner" />
        Loading status...
      </div>
    );
  }

  return (
    <div className="av-wrap">

      <div className="av-head">
        <div>
          <p className="av-eyebrow">// availability</p>
          <h2 className="av-title">Availability Status</h2>
        </div>
        {msg.text && (
          <div className={`av-msg av-msg--${msg.type}`}>
            {msg.type === "success" ? "✓" : "✗"} {msg.text}
          </div>
        )}
      </div>

      {/* Status Toggle Card */}
      <div className="av-card">
        <div className="av-card__left">
          <div className={`av-indicator ${status?.isAvailable ? "av-indicator--on" : "av-indicator--off"}`}>
            <span className="av-indicator__dot" />
            <span className="av-indicator__text">
              {status?.isAvailable ? "Available" : "Not Available"}
            </span>
          </div>
          <p className="av-card__desc">
            {status?.isAvailable
              ? "You are currently visible as available for work on your portfolio."
              : "You are currently shown as not available for work on your portfolio."}
          </p>
        </div>

        <button
          className={`av-toggle ${status?.isAvailable ? "av-toggle--on" : "av-toggle--off"}`}
          onClick={handleToggle}
          disabled={saving}
        >
          <span className="av-toggle__track">
            <span className="av-toggle__thumb" />
          </span>
          <span className="av-toggle__label">
            {status?.isAvailable ? "ON" : "OFF"}
          </span>
        </button>
      </div>

      {/* Preview Card */}
      <div className="av-preview">
        <p className="av-preview__label">Portfolio Preview</p>
        <div className={`av-badge ${status?.isAvailable ? "av-badge--on" : "av-badge--off"}`}>
          <span className="av-badge__dot" />
          {status?.message || "Open to work"}
        </div>
        <p className="av-preview__hint">This is how it appears on your portfolio home page</p>
      </div>

      {/* Message Editor */}
      <div className="av-message">
        <label className="av-message__label">Status Message</label>
        <div className="av-message__row">
          <input
            type="text"
            className="av-message__input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Open to work"
            maxLength={50}
          />
          <button
            className="av-message__btn"
            onClick={handleMessageSave}
            disabled={saving || message === status?.message}
          >
            {saving ? <span className="av-spinner av-spinner--sm" /> : "Save"}
          </button>
        </div>
        <p className="av-message__hint">{message.length}/50 characters</p>
      </div>

    </div>
  );
}