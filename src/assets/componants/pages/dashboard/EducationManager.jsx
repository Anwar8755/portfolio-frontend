import React, { useState, useEffect } from "react";
import API from "../../../../services/api";
import "./EducationManager.css";

const ACCENTS = ["teal", "purple", "green", "amber"];
const TYPES = ["Degree", "Diploma", "Certificate"];

const DEFAULT_FORM = {
  degreeOrCourseName: "",
  areaOfStudy: "",
  type: "Certificate",
  institution: "",
  location: "",
  startYear: "",
  endYear: "",
  ongoing: false,
  percentageOrGrade: "",
  description: "",
  certificateUrl: "",
  featured: false,
  order: 0,
};

export default function EducationManager() {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState({ text: "", type: "" });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await API.get("/education");
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching education:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : name === "order" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await API.put(`/education/${editId}`, formData);
      } else {
        await API.post("/education", formData);
      }
      fetchItems();
      setFormData(DEFAULT_FORM);
      setEditId(null);
      setMsg({ text: editId ? "Entry updated!" : "Entry added!", type: "success" });
      setTimeout(() => setMsg({ text: "", type: "" }), 2500);
    } catch (err) {
      console.error("Error submitting education:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/education/${id}`);
      fetchItems();
    } catch (err) {
      console.error("Error deleting education:", err);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      degreeOrCourseName: item.degreeOrCourseName || "",
      areaOfStudy: item.areaOfStudy || "",
      type: item.type || "Certificate",
      institution: item.institution || "",
      location: item.location || "",
      startYear: item.startYear || "",
      endYear: item.endYear || "",
      ongoing: item.ongoing || false,
      percentageOrGrade: item.percentageOrGrade || "",
      description: item.description || "",
      certificateUrl: item.certificateUrl || "",
      featured: item.featured || false,
      order: item.order ?? 0,
    });
    setEditId(item._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setFormData(DEFAULT_FORM);
    setEditId(null);
  };

  return (
    <div className="ed-wrap">

      <div className="ed-header">
        <p className="ed-eyebrow">// education</p>
        <div className="ed-header-row">
          <h2 className="ed-title">Education & Certifications</h2>
          <span className="ed-count-pill">{items.length} total</span>
        </div>
        <p className="ed-subtitle">Degrees, diplomas, and certifications shown on your portfolio.</p>
        {msg.text && <div className={`ed-msg ed-msg--${msg.type}`}>✓ {msg.text}</div>}
      </div>

      <div className="ed-terminal-card ed-form-card">
        <div className="terminal-titlebar">
          <div className="terminal-dots">
            <span className="dot dot--red" /><span className="dot dot--yellow" /><span className="dot dot--green" />
          </div>
          <span className="terminal-filename">{editId ? "education.update.js" : "education.create.js"}</span>
          <span className="terminal-lang">{editId ? "editing" : "new"}</span>
        </div>

        <form onSubmit={handleSubmit} className="ed-form">

          <div className="ed-grid">

            <div className="ed-fields">

              <div className="ed-field">
                <label className="ed-label"><span className="ed-prompt">$</span> course-name</label>
                <input
                  type="text" name="degreeOrCourseName"
                  placeholder="e.g. Bachelor of Computer Applications"
                  value={formData.degreeOrCourseName} onChange={handleChange} required
                />
              </div>

              <div className="ed-field-row">
                <div className="ed-field">
                  <label className="ed-label"><span className="ed-prompt">$</span> area-of-study</label>
                  <input
                    type="text" name="areaOfStudy"
                    placeholder="e.g. Computer Science"
                    value={formData.areaOfStudy} onChange={handleChange}
                  />
                </div>
                <div className="ed-field">
                  <label className="ed-label"><span className="ed-prompt">$</span> type</label>
                  <select name="type" value={formData.type} onChange={handleChange} className="ed-select">
                    {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="ed-field-row">
                <div className="ed-field">
                  <label className="ed-label"><span className="ed-prompt">$</span> institution</label>
                  <input
                    type="text" name="institution"
                    placeholder="e.g. Delhi University"
                    value={formData.institution} onChange={handleChange} required
                  />
                </div>
                <div className="ed-field">
                  <label className="ed-label"><span className="ed-prompt">$</span> location</label>
                  <input
                    type="text" name="location"
                    placeholder="e.g. New Delhi, India"
                    value={formData.location} onChange={handleChange}
                  />
                </div>
              </div>

              <div className="ed-field-row">
                <div className="ed-field">
                  <label className="ed-label"><span className="ed-prompt">$</span> start-year</label>
                  <input
                    type="text" name="startYear"
                    placeholder="e.g. 2021"
                    value={formData.startYear} onChange={handleChange}
                  />
                </div>
                <div className="ed-field">
                  <label className="ed-label"><span className="ed-prompt">$</span> end-year</label>
                  <input
                    type="text" name="endYear"
                    placeholder="e.g. 2024"
                    value={formData.endYear} onChange={handleChange}
                    disabled={formData.ongoing}
                  />
                </div>
              </div>

              <label className="ed-checkbox">
                <input type="checkbox" name="ongoing" checked={formData.ongoing} onChange={handleChange} />
                <span className="ed-checkbox__box" />
                <span className="ed-checkbox__label">Currently ongoing</span>
              </label>

              <div className="ed-field-row">
                <div className="ed-field">
                  <label className="ed-label"><span className="ed-prompt">$</span> grade / percentage</label>
                  <input
                    type="text" name="percentageOrGrade"
                    placeholder="e.g. 85% or 8.2 CGPA"
                    value={formData.percentageOrGrade} onChange={handleChange}
                  />
                </div>
                <div className="ed-field">
                  <label className="ed-label"><span className="ed-prompt">$</span> order</label>
                  <input
                    type="number" name="order"
                    placeholder="0"
                    value={formData.order} onChange={handleChange}
                  />
                </div>
              </div>

              <div className="ed-field">
                <label className="ed-label"><span className="ed-prompt">$</span> certificate-url (optional)</label>
                <input
                  type="text" name="certificateUrl"
                  placeholder="https://... (link to certificate/degree image or PDF)"
                  value={formData.certificateUrl} onChange={handleChange}
                />
              </div>

              <div className="ed-field">
                <label className="ed-label"><span className="ed-prompt">$</span> description</label>
                <textarea
                  name="description"
                  placeholder="Optional short note about this qualification..."
                  value={formData.description} onChange={handleChange}
                  className="ed-textarea"
                  rows={3}
                />
              </div>

              <label className="ed-checkbox">
                <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} />
                <span className="ed-checkbox__box" />
                <span className="ed-checkbox__label">Mark as featured</span>
              </label>

              <div className="ed-form-actions">
                <button type="submit" className="ed-submit">
                  {editId ? "Update Entry" : "Add Entry"}
                </button>
                {editId && <button type="button" className="ed-cancel" onClick={handleCancelEdit}>Cancel</button>}
              </div>

            </div>

            {/* ── PREVIEW ── */}
            <div className="ed-preview">
              <span className="ed-preview__label">Preview</span>
              <div className="ed-preview__card">
                {formData.featured && <span className="ed-preview__featured">★ Featured</span>}
                <span className="ed-preview__type">{formData.type}</span>
                <h4 className="ed-preview__name">{formData.degreeOrCourseName || "Course / Degree Name"}</h4>
                {formData.areaOfStudy && <p className="ed-preview__area">{formData.areaOfStudy}</p>}
                <p className="ed-preview__institution">
                  {formData.institution || "Institution"}{formData.location ? ` · ${formData.location}` : ""}
                </p>
                <div className="ed-preview__meta">
                  <span className="ed-preview__years">
                    {formData.startYear || "----"} — {formData.ongoing ? "Present" : (formData.endYear || "----")}
                  </span>
                  {formData.percentageOrGrade && (
                    <span className="ed-preview__grade">{formData.percentageOrGrade}</span>
                  )}
                </div>
                {formData.description && <p className="ed-preview__desc">{formData.description}</p>}
                {formData.certificateUrl && (
                  <span className="ed-preview__cert-link">🔗 View Certificate</span>
                )}
              </div>
            </div>

          </div>

        </form>
      </div>

      {items.length === 0 ? (
        <div className="ed-empty"><p>// no education entries yet</p></div>
      ) : (
        <div className="ed-list">
          {items.map((item, index) => (
            <div className={`ed-card ed-card--${ACCENTS[index % ACCENTS.length]}`} key={item._id}>
              {item.featured && <span className="ed-card__featured">★ Featured</span>}

              <div className="ed-card__top">
                <span className="ed-card__type">{item.type}</span>
                {item.certificateUrl && (
                  <a href={item.certificateUrl} target="_blank" rel="noreferrer" className="ed-card__cert-link">
                    🔗 Certificate
                  </a>
                )}
              </div>

              <h4 className="ed-card__name">{item.degreeOrCourseName}</h4>
              {item.areaOfStudy && <p className="ed-card__area">{item.areaOfStudy}</p>}
              <p className="ed-card__institution">
                {item.institution}{item.location ? ` · ${item.location}` : ""}
              </p>

              <div className="ed-card__meta">
                <span className="ed-card__years">
                  {item.startYear || "----"} — {item.ongoing ? "Present" : (item.endYear || "----")}
                </span>
                {item.percentageOrGrade && <span className="ed-card__grade">{item.percentageOrGrade}</span>}
              </div>

              {item.description && <p className="ed-card__desc">{item.description}</p>}

              <div className="ed-card__actions">
                <button className="ed-edit-btn" onClick={() => handleEdit(item)}>Edit</button>
                <button className="ed-delete-btn" onClick={() => handleDelete(item._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}