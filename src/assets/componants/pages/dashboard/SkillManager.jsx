import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./skillManager.css";
import { DashboardContext } from "../dashboard/Dashboard";

const ACCENTS = ["teal", "purple", "green", "amber"];

export default function SkillManager() {
  const [skills, setSkills] = useState([]);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    icon: "",
    color: "#000000",      
    textColor: "#ffffff",   
  });

  const [editId, setEditId] = useState(null);
  const token = localStorage.getItem("token");
  const { refetchCounts } = useContext(DashboardContext);

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/skills`);
      setSkills(res.data);
    } catch (err) {
      console.error("Error fetching skills:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API_BASE_URL}/skills/${editId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${API_BASE_URL}/skills`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchSkills();
      refetchCounts();
      setFormData({ name: "", icon: "", color: "#000000", textColor: "#ffffff" });
      setEditId(null);
    } catch (err) {
      console.error("Error submitting skill:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/skills/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSkills();
      refetchCounts();
    } catch (err) {
      console.error("Error deleting skill:", err);
    }
  };

  const handleEdit = (skill) => {
    setFormData({
      name: skill.name,
      icon: skill.icon,
      color: skill.color || "#000000",
      textColor: skill.textColor || "#ffffff",
    });
    setEditId(skill._id);
  };

  const handleCancelEdit = () => {
    setFormData({ name: "", icon: "", color: "#000000", textColor: "#ffffff" });
    setEditId(null);
  };

  const filteredSkills = skills.filter((skill) =>
    skill.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="skill-manager">
      <div className="sm-header">
        <p className="sm-eyebrow">// skills</p>
        <div className="sm-header-row">
          <h2 className="sm-title">Skill Manager</h2>
          <span className="sm-count-pill">{skills.length} total</span>
        </div>
        <p className="sm-subtitle">Add, edit, and organize the skills shown on your portfolio.</p>
      </div>

      <div className="terminal-card sm-form-card">
        <div className="terminal-titlebar">
          <div className="terminal-dots">
            <span className="dot dot--red" />
            <span className="dot dot--yellow" />
            <span className="dot dot--green" />
          </div>
          <span className="terminal-filename">{editId ? "skill.update.js" : "skill.create.js"}</span>
          <span className="terminal-lang">{editId ? "editing" : "new"}</span>
        </div>

        <form onSubmit={handleAddOrUpdate} className="sm-form">
          <div className="sm-field-row">
            <div className="sm-field">
              <label className="sm-label" htmlFor="name">
                <span className="sm-prompt">$</span> name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="e.g. React"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="sm-field">
              <label className="sm-label" htmlFor="icon">
                <span className="sm-prompt">$</span> icon-url
              </label>
              <input
                id="icon"
                type="text"
                name="icon"
                placeholder="https://..."
                value={formData.icon}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="sm-color-row">
            <label className="sm-color-field">
              <span className="sm-color-label">Background</span>
              <span className="sm-color-swatch" style={{ background: formData.color }}>
                <input
                  type="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                />
              </span>
              <span className="sm-color-hex">{formData.color}</span>
            </label>

            <label className="sm-color-field">
              <span className="sm-color-label">Text</span>
              <span className="sm-color-swatch" style={{ background: formData.textColor }}>
                <input
                  type="color"
                  name="textColor"
                  value={formData.textColor}
                  onChange={handleChange}
                />
              </span>
              <span className="sm-color-hex">{formData.textColor}</span>
            </label>

            <div className="sm-preview-field">
              <span className="sm-color-label">Preview</span>
              <span
                className="sm-preview-chip"
                style={{ background: formData.color, color: formData.textColor }}
              >
                {formData.name || "Skill"}
              </span>
            </div>
          </div>

          <div className="sm-form-actions">
            <button type="submit" className="sm-submit">
              {editId ? "Update Skill" : "Add Skill"}
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {editId && (
              <button type="button" className="sm-cancel" onClick={handleCancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="sm-search-row">
        <span className="sm-search-prompt">$</span>
        <input
          type="text"
          placeholder="grep --skill-name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm-search-input"
        />
      </div>

      {filteredSkills.length === 0 ? (
        <div className="sm-empty">
          <p className="sm-eyebrow">// no results</p>
          <p>No skills match that search.</p>
        </div>
      ) : (
        <div className="sm-grid">
          {filteredSkills.map((skill, index) => (
            <div
              className={`sm-card sm-card--${ACCENTS[index % ACCENTS.length]}`}
              key={skill._id}
            >
              <div className="sm-card-top">
                <span className="sm-card-icon-wrap">
                  <img className="sm-card-icon" src={skill.icon} alt={skill.name} />
                </span>
                <span
                  className="sm-card-badge"
                  style={{ background: skill.color, color: skill.textColor }}
                >
                  {skill.name}
                </span>
              </div>
              <h3 className="sm-card-name">{skill.name}</h3>
              <div className="sm-card-actions">
                <button className="sm-edit-btn" onClick={() => handleEdit(skill)}>
                  Edit
                </button>
                <button className="sm-delete-btn" onClick={() => handleDelete(skill._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}