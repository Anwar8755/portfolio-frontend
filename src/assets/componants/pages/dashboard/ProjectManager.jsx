import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./projectManager.css";
import { DashboardContext } from "../dashboard/Dashboard";

const ACCENTS = ["teal", "purple", "green", "amber"];

const DEFAULT_FORM = {
  title: "",
  images: [""],
  link: "",
  github: "",
  description: "",
  longDescription: "",
  techStack: [],
  keyFeatures: [""],
  challenges: [{ problem: "", solution: "" }],
  category: "",
  role: "",
  duration: "",
  order: 0,
  featured: false,
};

export default function ProjectManager() {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [techInput, setTechInput] = useState("");
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
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : name === "order" ? Number(value) : value,
    }));
  };

  const handleImageChange = (index, value) => {
    const updated = [...formData.images];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, images: updated }));
  };
  const addImageField = () => {
    if (formData.images.length >= 6) return;
    setFormData((prev) => ({ ...prev, images: [...prev.images, ""] }));
  };
  const removeImageField = (index) => {
    const updated = formData.images.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, images: updated.length ? updated : [""] }));
  };

  const addTech = () => {
    const val = techInput.trim();
    if (!val || formData.techStack.includes(val)) return;
    setFormData((prev) => ({ ...prev, techStack: [...prev.techStack, val] }));
    setTechInput("");
  };
  const removeTech = (tech) => {
    setFormData((prev) => ({ ...prev, techStack: prev.techStack.filter((t) => t !== tech) }));
  };
  const handleTechKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTech();
    }
  };

  const handleFeatureChange = (index, value) => {
    const updated = [...formData.keyFeatures];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, keyFeatures: updated }));
  };
  const addFeatureField = () => {
    setFormData((prev) => ({ ...prev, keyFeatures: [...prev.keyFeatures, ""] }));
  };
  const removeFeatureField = (index) => {
    const updated = formData.keyFeatures.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, keyFeatures: updated.length ? updated : [""] }));
  };

  const handleChallengeChange = (index, field, value) => {
    const updated = [...formData.challenges];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, challenges: updated }));
  };
  const addChallengeField = () => {
    setFormData((prev) => ({
      ...prev,
      challenges: [...prev.challenges, { problem: "", solution: "" }],
    }));
  };
  const removeChallengeField = (index) => {
    const updated = formData.challenges.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      challenges: updated.length ? updated : [{ problem: "", solution: "" }],
    }));
  };

  const buildPayload = () => ({
    ...formData,
    images: formData.images.filter((i) => i.trim() !== ""),
    keyFeatures: formData.keyFeatures.filter((f) => f.trim() !== ""),
    challenges: formData.challenges.filter((c) => c.problem.trim() !== "" || c.solution.trim() !== ""),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = buildPayload();

      if (editId) {
        await axios.put(`${API_BASE_URL}/projects/${editId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEditId(null);
      } else {
        await axios.post(`${API_BASE_URL}/projects`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchProjects();
      refetchCounts();
      setFormData(DEFAULT_FORM);
      setTechInput("");
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
    setFormData({
      title: project.title || "",
      images: project.images?.length ? project.images : [""],
      link: project.link || "",
      github: project.github || "",
      description: project.description || "",
      longDescription: project.longDescription || "",
      techStack: project.techStack || [],
      keyFeatures: project.keyFeatures?.length ? project.keyFeatures : [""],
      challenges: project.challenges?.length ? project.challenges : [{ problem: "", solution: "" }],
      category: project.category || "",
      role: project.role || "",
      duration: project.duration || "",
      featured: project.featured || false,
      order: project.order ?? 0,
    });
    setEditId(project._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setFormData(DEFAULT_FORM);
    setTechInput("");
    setEditId(null);
  };

  const filteredProjects = projects
    .filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const shortLink = (url) => {
    if (!url) return "no link";
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

      <div className="terminal-card pm-terminal-card pm-form-card">
        <div className="terminal-titlebar">
          <div className="terminal-dots">
            <span className="dot dot--red" />
            <span className="dot dot--yellow" />
            <span className="dot dot--green" />
          </div>
          <span className="terminal-filename">{editId ? "project.update.js" : "project.create.js"}</span>
          <span className="terminal-lang">{editId ? "editing" : "new"}</span>
        </div>

        <form onSubmit={handleSubmit} className="pm-form pm-form--horizontal">

          {/* Column 1: Basic Info */}
          <div className="pm-hcol">
            <span className="pm-hcol__title">Basic Info</span>

            <div className="pm-field">
              <label className="pm-label" htmlFor="title"><span className="pm-prompt">$</span> title</label>
              <input id="title" type="text" name="title" placeholder="e.g. VideoEarningHub" value={formData.title} onChange={handleChange} required />
            </div>
            <div className="pm-field">
              <label className="pm-label" htmlFor="category"><span className="pm-prompt">$</span> category</label>
              <input id="category" type="text" name="category" placeholder="e.g. Web App" value={formData.category} onChange={handleChange} />
            </div>
            <div className="pm-field">
              <label className="pm-label" htmlFor="duration"><span className="pm-prompt">$</span> duration</label>
              <input id="duration" type="text" name="duration" placeholder="e.g. 6 weeks" value={formData.duration} onChange={handleChange} />
            </div>
            <div className="pm-field">
              <label className="pm-label" htmlFor="role"><span className="pm-prompt">$</span> my-role</label>
              <input id="role" type="text" name="role" placeholder="e.g. Solo Full Stack Dev" value={formData.role} onChange={handleChange} />
            </div>
            <div className="pm-field">
              <label className="pm-label" htmlFor="order"><span className="pm-prompt">$</span> order</label>
              <input id="order" type="number" name="order" placeholder="0" value={formData.order} onChange={handleChange} />
            </div>
            <label className="pm-checkbox">
              <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} />
              <span className="pm-checkbox__box" />
              <span className="pm-checkbox__label">Featured project</span>
            </label>
          </div>

          {/* Column 2: Links & Description */}
          <div className="pm-hcol">
            <span className="pm-hcol__title">Links &amp; Description</span>

            <div className="pm-field">
              <label className="pm-label" htmlFor="link"><span className="pm-prompt">$</span> live-link</label>
              <input id="link" type="text" name="link" placeholder="https:// (optional)" value={formData.link} onChange={handleChange} />
            </div>
            <div className="pm-field">
              <label className="pm-label" htmlFor="github"><span className="pm-prompt">$</span> github-link</label>
              <input id="github" type="text" name="github" placeholder="https:// (optional)" value={formData.github} onChange={handleChange} />
            </div>
            <div className="pm-field">
              <label className="pm-label" htmlFor="description"><span className="pm-prompt">$</span> short-description</label>
              <input id="description" type="text" name="description" placeholder="One-line summary" value={formData.description} onChange={handleChange} required maxLength={120} />
            </div>
            <div className="pm-field pm-field--grow">
              <label className="pm-label" htmlFor="longDescription"><span className="pm-prompt">$</span> long-description</label>
              <textarea id="longDescription" name="longDescription" placeholder="Full detailed description" value={formData.longDescription} onChange={handleChange} className="pm-textarea-input" rows={5} />
            </div>
          </div>

          {/* Column 3: Images + Preview */}
          <div className="pm-hcol">
            <span className="pm-hcol__title">Images ({formData.images.length}/6)</span>

            {formData.images.map((img, i) => (
              <div className="pm-repeatable-row" key={i}>
                <input
                  type="text"
                  placeholder={`Image URL ${i + 1}`}
                  value={img}
                  onChange={(e) => handleImageChange(i, e.target.value)}
                />
                <button type="button" className="pm-remove-btn" onClick={() => removeImageField(i)} aria-label="Remove image">✕</button>
              </div>
            ))}
            {formData.images.length < 6 && (
              <button type="button" className="pm-add-btn" onClick={addImageField}>
                + Add another image
              </button>
            )}

            <div className="pm-preview pm-preview--compact">
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
                  {formData.images[0] ? (
                    <img src={formData.images[0]} alt="Preview" />
                  ) : (
                    <span className="pm-preview-placeholder">// no image yet</span>
                  )}
                </div>
                <div className="pm-preview-footer">
                  {formData.title || "Untitled project"}
                </div>
                <div className="pm-preview-order">
                  order: {formData.order}
                </div>
              </div>
            </div>
          </div>

          {/* Column 4: Tech Stack + Key Features */}
          <div className="pm-hcol">
            <span className="pm-hcol__title">Tech Stack</span>

            <div className="pm-tech-input-row">
              <input
                type="text"
                placeholder="Type a technology and press Enter"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={handleTechKeyDown}
              />
              <button type="button" className="pm-add-btn pm-add-btn--inline" onClick={addTech}>
                Add
              </button>
            </div>
            {formData.techStack.length > 0 && (
              <div className="pm-tech-pills">
                {formData.techStack.map((tech) => (
                  <span key={tech} className="pm-tech-pill">
                    {tech}
                    <button type="button" onClick={() => removeTech(tech)}>✕</button>
                  </span>
                ))}
              </div>
            )}

            <span className="pm-hcol__title pm-hcol__title--spaced">Key Features</span>
            {formData.keyFeatures.map((feat, i) => (
              <div className="pm-repeatable-row" key={i}>
                <input
                  type="text"
                  placeholder={`Feature ${i + 1}`}
                  value={feat}
                  onChange={(e) => handleFeatureChange(i, e.target.value)}
                />
                <button type="button" className="pm-remove-btn" onClick={() => removeFeatureField(i)} aria-label="Remove feature">✕</button>
              </div>
            ))}
            <button type="button" className="pm-add-btn" onClick={addFeatureField}>
              + Add another feature
            </button>
          </div>

          {/* Column 5: Challenges + Submit */}
          <div className="pm-hcol">
            <span className="pm-hcol__title">Challenges &amp; Solutions</span>

            {formData.challenges.map((c, i) => (
              <div className="pm-challenge-block" key={i}>
                <div className="pm-challenge-block__head">
                  <span>Challenge {i + 1}</span>
                  <button type="button" className="pm-remove-btn" onClick={() => removeChallengeField(i)} aria-label="Remove challenge">✕</button>
                </div>
                <textarea
                  placeholder="Problem faced..."
                  value={c.problem}
                  onChange={(e) => handleChallengeChange(i, "problem", e.target.value)}
                  className="pm-textarea-input pm-textarea-input--sm"
                  rows={2}
                />
                <textarea
                  placeholder="How I solved it..."
                  value={c.solution}
                  onChange={(e) => handleChallengeChange(i, "solution", e.target.value)}
                  className="pm-textarea-input pm-textarea-input--sm"
                  rows={2}
                />
              </div>
            ))}
            <button type="button" className="pm-add-btn" onClick={addChallengeField}>
              + Add another challenge
            </button>

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
              {project.featured && <span className="pm-card-featured">★ Featured</span>}

              <div className="pm-card-titlebar">
                <span className="dot dot--red" />
                <span className="dot dot--yellow" />
                <span className="dot dot--green" />
                <span className="pm-card-url">{shortLink(project.link)}</span>
              </div>

              <div className="pm-card-image-wrap">
                {project.images?.[0] ? (
                  <img src={project.images[0]} alt={project.title} />
                ) : (
                  <span className="pm-card-noimg">// no image</span>
                )}
                {project.images?.length > 1 && (
                  <span className="pm-card-imgcount">+{project.images.length - 1}</span>
                )}
              </div>

              <div className="pm-card-body">
                <h4 className="pm-card-title">{project.title}</h4>

                {project.category && (
                  <span className="pm-card-category">{project.category}</span>
                )}

                <span className="pm-card-order">order: {project.order ?? 0}</span>

                <div className="pm-card-links">
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noreferrer" className="pm-card-view">
                      Live
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  )}
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noreferrer" className="pm-card-view">
                      GitHub
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  )}
                </div>

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