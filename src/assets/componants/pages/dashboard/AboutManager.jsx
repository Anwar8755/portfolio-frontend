import React, { useEffect, useState } from "react";
import API from "../../../../services/api";
import "./AboutManager.css";

export default function AboutManager() {
  const [form, setForm] = useState({ photo: "", name: "", tagline: "", bio: "" });
  const [saved, setSaved] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const res = await API.get("/about");
      setForm({
        photo: res.data.photo || "",
        name: res.data.name || "",
        tagline: res.data.tagline || "",
        bio: res.data.bio || "",
      });
      setSaved(res.data);
    } catch (err) {
      console.error("About fetch error:", err);
      setMsg({ text: "Failed to load about info.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.bio.trim()) {
      setMsg({ text: "Name and bio cannot be empty.", type: "error" });
      return;
    }
    setSaving(true);
    try {
      const res = await API.put("/about", form);
      setSaved(res.data.about);
      setMsg({ text: "About info saved successfully!", type: "success" });
      setTimeout(() => setMsg({ text: "", type: "" }), 3000);
    } catch (err) {
      console.error("About save error:", err);
      setMsg({ text: "Failed to save about info.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setForm({
      photo: saved.photo || "",
      name: saved.name || "",
      tagline: saved.tagline || "",
      bio: saved.bio || "",
    });
    setMsg({ text: "", type: "" });
  };

  const hasChanges = JSON.stringify(form) !== JSON.stringify({
    photo: saved.photo || "",
    name: saved.name || "",
    tagline: saved.tagline || "",
    bio: saved.bio || "",
  });

  if (loading) {
    return (
      <div className="am-loading">
        <span className="am-spinner" />
        Loading about info...
      </div>
    );
  }

  return (
    <div className="am-wrap">

      <div className="am-head">
        <div>
          <p className="am-eyebrow">// about-me</p>
          <h2 className="am-title">About Manager</h2>
        </div>
        {msg.text && (
          <div className={`am-msg am-msg--${msg.type}`}>
            {msg.type === "success" ? "✓" : "✗"} {msg.text}
          </div>
        )}
      </div>

      <div className="am-grid">

        <div className="am-form">
          <div className="am-field">
            <label className="am-label"><span className="am-prompt">$</span> photo-url</label>
            <input
              type="text" name="photo"
              placeholder="https://..."
              value={form.photo} onChange={handleChange}
            />
          </div>

          <div className="am-field">
            <label className="am-label"><span className="am-prompt">$</span> name</label>
            <input
              type="text" name="name"
              placeholder="e.g. Anwar Ali"
              value={form.name} onChange={handleChange}
            />
          </div>

          <div className="am-field">
            <label className="am-label"><span className="am-prompt">$</span> tagline</label>
            <input
              type="text" name="tagline"
              placeholder="e.g. Full Stack Developer"
              value={form.tagline} onChange={handleChange}
            />
          </div>

          <div className="am-field">
            <label className="am-label"><span className="am-prompt">$</span> bio</label>
            <textarea
              name="bio"
              placeholder="Write a short bio about yourself..."
              value={form.bio} onChange={handleChange}
              className="am-textarea"
              rows={6}
            />
          </div>

          <div className="am-actions">
            <button className="am-btn am-btn--reset" onClick={handleReset} disabled={!hasChanges || saving}>
              Reset
            </button>
            <button className="am-btn am-btn--save" onClick={handleSave} disabled={!hasChanges || saving}>
              {saving ? <span className="am-spinner am-spinner--sm" /> : "Save Changes"}
            </button>
          </div>
        </div>

        <div className="am-preview">
          <span className="am-preview__label">Preview</span>
          <div className="am-preview__card">
            <div className="am-preview__avatar">
              {form.photo ? (
                <img src={form.photo} alt="avatar" />
              ) : (
                <span className="am-preview__initials">
                  {form.name ? form.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "??"}
                </span>
              )}
            </div>
            <h3 className="am-preview__name">{form.name || "Your Name"}</h3>
            <p className="am-preview__tagline">{form.tagline || "Your tagline here"}</p>
            <p className="am-preview__bio">{form.bio || "Your bio will appear here..."}</p>
          </div>
        </div>

      </div>

    </div>
  );
}