import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./projectManager.css";
import { DashboardContext } from "../dashboard/Dashboard"; 

const ACCENTS = ["teal", "purple", "green", "amber"];

export default function ProjectManager() {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({ title: "", image: "", link: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [editId, setEditId] = useState(null);
  const token = localStorage.getItem("token");

  const { refetchCounts } = useContext(DashboardContext); 

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/projects`);
      setProjects(res.data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API_BASE_URL}/projects/${editId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEditId(null);
      } else {
        await axios.post(`${API_BASE_URL}/projects`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchProjects();
      refetchCounts(); 
      setFormData({ title: "", image: "", link: "" });
    } catch (err) {
      console.error("Error submitting project:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProjects();
      refetchCounts(); 
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  const handleEdit = (project) => {
    setFormData({ title: project.title, image: project.image, link: project.link });
    setEditId(project._id);
  };

  const handleCancelEdit = () => {
    setFormData({ title: "", image: "", link: "" });
    setEditId(null);
  };

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const shortLink = (url) => {
    if (!url) return "";
    return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  };

  return (
    <div className="project-manager">
      <div className="pm-header">
        <p className="pm-eyebrow">// projects</p>
        <div className="pm-header-row">
          <h2 className="pm-title">Project Manager</h2>
          <span className="pm-count-pill">{projects.length} total</span>
        </div>
        <p className="pm-subtitle">Add, edit, and organize the projects shown on your portfolio.</p>
      </div>

      <div className="terminal-card pm-form-card">
        <div className="terminal-titlebar">
          <div className="terminal-dots">
            <span className="dot dot--red" />
            <span className="dot dot--yellow" />
            <span className="dot dot--green" />
          </div>
          <span className="terminal-filename">{editId ? "project.update.js" : "project.create.js"}</span>
          <span className="terminal-lang">{editId ? "editing" : "new"}</span>
        </div>

        <form onSubmit={handleSubmit} className="pm-form">
          <div className="pm-form-grid">
            <div className="pm-fields">
              <div className="pm-field">
                <label className="pm-label" htmlFor="title">
                  <span className="pm-prompt">$</span> title
                </label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  placeholder="e.g. Portfolio Dashboard"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="pm-field">
                <label className="pm-label" htmlFor="image">
                  <span className="pm-prompt">$</span> image-url
                </label>
                <input
                  id="image"
                  type="text"
                  name="image"
                  placeholder="https://..."
                  value={formData.image}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="pm-field">
                <label className="pm-label" htmlFor="link">
                  <span className="pm-prompt">$</span> project-link
                </label>
                <input
                  id="link"
                  type="text"
                  name="link"
                  placeholder="https://..."
                  value={formData.link}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="pm-form-actions">
                <button type="submit" className="pm-submit">
                  {editId ? "Update Project" : "Add Project"}
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {editId && (
                  <button type="button" className="pm-cancel" onClick={handleCancelEdit}>
                    Cancel
                  </button>
                )}
              </div>
            </div>

            <div className="pm-preview">
              <span className="pm-preview-label">Preview</span>
              <div className="pm-preview-window">
                <div className="pm-preview-titlebar">
                  <span className="dot dot--red" />
                  <span className="dot dot--yellow" />
                  <span className="dot dot--green" />
                  <span className="pm-preview-url">
                    {formData.link ? shortLink(formData.link) : "your-project.dev"}
                  </span>
                </div>
                <div className="pm-preview-body">
                  {formData.image ? (
                    <img src={formData.image} alt="Preview" />
                  ) : (
                    <span className="pm-preview-placeholder">// no image yet</span>
                  )}
                </div>
                <div className="pm-preview-footer">
                  {formData.title || "Untitled project"}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="pm-search-row">
        <span className="pm-search-prompt">$</span>
        <input
          type="text"
          className="pm-search-input"
          placeholder="grep --project-title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredProjects.length === 0 ? (
        <div className="pm-empty">
          <p className="pm-eyebrow">// no results</p>
          <p>No projects match that search.</p>
        </div>
      ) : (
        <div className="pm-grid">
          {filteredProjects.map((project, index) => (
            <div
              className={`pm-card pm-card--${ACCENTS[index % ACCENTS.length]}`}
              key={project._id}
            >
              <div className="pm-card-titlebar">
                <span className="dot dot--red" />
                <span className="dot dot--yellow" />
                <span className="dot dot--green" />
                <span className="pm-card-url">{shortLink(project.link)}</span>
              </div>

              <div className="pm-card-image-wrap">
                <img src={project.image} alt={project.title} />
              </div>

              <div className="pm-card-body">
                <h4 className="pm-card-title">{project.title}</h4>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="pm-card-view"
                >
                  View project
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>

                <div className="pm-card-actions">
                  <button className="pm-edit-btn" onClick={() => handleEdit(project)}>
                    Edit
                  </button>
                  <button className="pm-delete-btn" onClick={() => handleDelete(project._id)}>
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