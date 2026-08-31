import React, { useState, useEffect } from "react";
import API from "../../../../services/api";
import "./TestimonialsManager.css";

const ACCENTS = ["teal", "purple", "green", "amber"];
const DEFAULT_FORM = { name: "", role: "", company: "", photo: "", quote: "", rating: 5, featured: false };

export default function TestimonialsManager() {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState({ text: "", type: "" });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await API.get("/testimonials");
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching testimonials:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : name === "rating" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await API.put(`/testimonials/${editId}`, formData);
      } else {
        await API.post("/testimonials", formData);
      }
      fetchItems();
      setFormData(DEFAULT_FORM);
      setEditId(null);
      setMsg({ text: editId ? "Testimonial updated!" : "Testimonial added!", type: "success" });
      setTimeout(() => setMsg({ text: "", type: "" }), 2500);
    } catch (err) {
      console.error("Error submitting testimonial:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/testimonials/${id}`);
      fetchItems();
    } catch (err) {
      console.error("Error deleting testimonial:", err);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name || "",
      role: item.role || "",
      company: item.company || "",
      photo: item.photo || "",
      quote: item.quote || "",
      rating: item.rating ?? 5,
      featured: item.featured || false,
    });
    setEditId(item._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setFormData(DEFAULT_FORM);
    setEditId(null);
  };

  const getInitials = (name) =>
    name?.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join("") || "?";

  return (
    <div className="ts-wrap">

      <div className="ts-header">
        <p className="ts-eyebrow">// testimonials</p>
        <div className="ts-header-row">
          <h2 className="ts-title">Testimonials Manager</h2>
          <span className="ts-count-pill">{items.length} total</span>
        </div>
        <p className="ts-subtitle">Client reviews shown on your home page.</p>
        {msg.text && <div className={`ts-msg ts-msg--${msg.type}`}>✓ {msg.text}</div>}
      </div>

      <div className="terminal-card ts-form-card">
        <div className="terminal-titlebar">
          <div className="terminal-dots">
            <span className="dot dot--red" /><span className="dot dot--yellow" /><span className="dot dot--green" />
          </div>
          <span className="terminal-filename">{editId ? "testimonial.update.js" : "testimonial.create.js"}</span>
          <span className="terminal-lang">{editId ? "editing" : "new"}</span>
        </div>

        <form onSubmit={handleSubmit} className="ts-form">
          <div className="ts-field-row">
            <div className="ts-field">
              <label className="ts-label"><span className="ts-prompt">$</span> name</label>
              <input type="text" name="name" placeholder="e.g. John Smith" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="ts-field">
              <label className="ts-label"><span className="ts-prompt">$</span> photo-url (optional)</label>
              <input type="text" name="photo" placeholder="https://..." value={formData.photo} onChange={handleChange} />
            </div>
          </div>

          <div className="ts-field-row">
            <div className="ts-field">
              <label className="ts-label"><span className="ts-prompt">$</span> role</label>
              <input type="text" name="role" placeholder="e.g. CEO" value={formData.role} onChange={handleChange} />
            </div>
            <div className="ts-field">
              <label className="ts-label"><span className="ts-prompt">$</span> company</label>
              <input type="text" name="company" placeholder="e.g. TechTom" value={formData.company} onChange={handleChange} />
            </div>
          </div>

          <div className="ts-field">
            <label className="ts-label"><span className="ts-prompt">$</span> quote</label>
            <textarea name="quote" placeholder="What did they say about your work..." value={formData.quote} onChange={handleChange} className="ts-textarea" rows={3} required />
          </div>

          <div className="ts-field-row">
            <div className="ts-field ts-field--sm">
              <label className="ts-label"><span className="ts-prompt">$</span> rating (1-5)</label>
              <input type="number" name="rating" min="1" max="5" value={formData.rating} onChange={handleChange} />
            </div>
            <label className="ts-checkbox">
              <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} />
              <span className="ts-checkbox__box" />
              <span className="ts-checkbox__label">Mark as featured</span>
            </label>
          </div>

          <div className="ts-form-actions">
            <button type="submit" className="ts-submit">
              {editId ? "Update Testimonial" : "Add Testimonial"}
            </button>
            {editId && <button type="button" className="ts-cancel" onClick={handleCancelEdit}>Cancel</button>}
          </div>
        </form>
      </div>

      {items.length === 0 ? (
        <div className="ts-empty"><p>// no testimonials yet</p></div>
      ) : (
        <div className="ts-grid">
          {items.map((item, index) => (
            <div className={`ts-card ts-card--${ACCENTS[index % ACCENTS.length]}`} key={item._id}>
              {item.featured && <span className="ts-featured-tag">★ Featured</span>}

              <div className="ts-card__top">
                <span className="ts-card__avatar">
                  {item.photo ? <img src={item.photo} alt={item.name} /> : getInitials(item.name)}
                </span>
                <div className="ts-card__identity">
                  <h4 className="ts-card__name">{item.name}</h4>
                  <span className="ts-card__role">
                    {item.role}{item.role && item.company ? " · " : ""}{item.company}
                  </span>
                </div>
              </div>

              <p className="ts-card__quote">"{item.quote}"</p>

              <div className="ts-card__rating">
                {"★".repeat(item.rating)}{"☆".repeat(5 - item.rating)}
              </div>

              <div className="ts-card__actions">
                <button className="ts-edit-btn" onClick={() => handleEdit(item)}>Edit</button>
                <button className="ts-delete-btn" onClick={() => handleDelete(item._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}