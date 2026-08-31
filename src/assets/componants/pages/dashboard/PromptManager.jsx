import React, { useEffect, useState } from "react";
import API from "../../../../services/api";
import "./PromptManager.css";

export default function PromptManager() {
  const [prompt,  setPrompt]  = useState("");
  const [saved,   setSaved]   = useState("");
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState({ text: "", type: "" });

  useEffect(() => {
    fetchPrompt();
  }, []);

  const fetchPrompt = async () => {
    try {
      const res = await API.get("/prompt");
      setPrompt(res.data.content);
      setSaved(res.data.content);
    } catch (err) {
      console.error("Prompt fetch error:", err);
      setMsg({ text: "Failed to load prompt.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!prompt.trim()) {
      setMsg({ text: "Prompt cannot be empty.", type: "error" });
      return;
    }
    setSaving(true);
    try {
      await API.put("/prompt", { content: prompt });
      setSaved(prompt);
      setMsg({ text: "Prompt saved successfully!", type: "success" });
      setTimeout(() => setMsg({ text: "", type: "" }), 3000);
    } catch (err) {
      console.error("Prompt save error:", err);
      setMsg({ text: "Failed to save prompt.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setPrompt(saved);
    setMsg({ text: "", type: "" });
  };

  const hasChanges = prompt !== saved;

  return (
    <div className="pm-wrap">

      <div className="pm-head">
        <div>
          <p className="pm-eyebrow">// ai-assistant</p>
          <h2 className="pm-title">Prompt Manager</h2>
        </div>
        {msg.text && (
          <div className={`pm-msg pm-msg--${msg.type}`}>
            {msg.type === "success" ? "✓" : "✗"} {msg.text}
          </div>
        )}
      </div>

      <div className="pm-info">
        <div className="pm-info__item">
          <span className="pm-info__icon">🤖</span>
          <span>This text defines the AI assistant's base personality and behavior</span>
        </div>
        <div className="pm-info__item">
          <span className="pm-info__icon">🗄️</span>
          <span>Projects, Skills and all other data is automatically fetched from the database</span>
        </div>
        <div className="pm-info__item">
          <span className="pm-info__icon">⚡</span>
          <span>Changes take effect immediately after saving</span>
        </div>
      </div>

      {loading ? (
        <div className="pm-loading">
          <span className="pm-spinner" />
          Loading prompt...
        </div>
      ) : (
        <div className="pm-editor">
          <div className="pm-editor__bar">
            <div className="pm-dots">
              <span /><span /><span />
            </div>
            <span className="pm-editor__file">system-prompt.txt</span>
            <span className="pm-editor__chars">{prompt.length} chars</span>
          </div>
          <textarea
            className="pm-textarea"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Write your AI system prompt here..."
            spellCheck={false}
          />
        </div>
      )}

      <div className="pm-actions">
        <button
          className="pm-btn pm-btn--reset"
          onClick={handleReset}
          disabled={!hasChanges || saving}
        >
          Reset
        </button>
        <button
          className="pm-btn pm-btn--save"
          onClick={handleSave}
          disabled={!hasChanges || saving || loading}
        >
          {saving ? (
            <><span className="pm-spinner pm-spinner--sm" /> Saving...</>
          ) : (
            "Save Prompt"
          )}
        </button>
      </div>

    </div>
  );
}