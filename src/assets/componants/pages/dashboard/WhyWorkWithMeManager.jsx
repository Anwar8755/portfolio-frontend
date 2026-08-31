import React, { useState, useEffect } from "react";
import API from "../../../../services/api";
import "./WhyWorkWithMeManager.css";

const ACCENTS = ["teal", "purple", "green", "amber"];
const DEFAULT_FORM = { title: "", description: "", icon: "", order: 0 };

export default function WhyWorkWithMeManager() {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState({ text: "", type: "" });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await API.get("/why-work-with-me");
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === "order" ? Number(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await API.put(`/why-work-with-me/${editId}`, formData);
      } else {
        await API.post("/why-work-with-me", formData);
      }
      fetchItems();
      setFormData(DEFAULT_FORM);
      setEditId(null);
      setMsg({ text: editId ? "Item updated!" : "Item added!", type: "success" });
      setTimeout(() => setMsg({ text: "", type: "" }), 2500);
    } catch (err) {
      console.error("Error submitting item:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/why-work-with-me/${id}`);
      fetchItems();
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      title: item.title || "",
      description: item.description || "",
      icon: item.icon || "",
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
    <div className="ww-wrap">

      <div className="ww-header">
        <p className="ww-eyebrow">// value-props</p>
        <div className="ww-header-row">
          <h2 className="ww-title">Why Work With Me</h2>
          <span className="ww-count-pill">{items.length} total</span>
        </div>
        <p className="ww-subtitle">Value propositions shown on your home page.</p>
        {msg.text && <div className={`ww-msg ww-msg--${msg.type}`}>✓ {msg.text}</div>}
      </div>

      <div className="terminal-card ww-form-card">
        <div className="terminal-titlebar">
          <div className="terminal-dots">
            <span className="dot dot--red" /><span className="dot dot--yellow" /><span className="dot dot--green" />
          </div>
          <span className="terminal-filename">{editId ? "value.update.js" : "value.create.js"}</span>
          <span className="terminal-lang">{editId ? "editing" : "new"}</span>
        </div>

        <form onSubmit={handleSubmit} className="ww-form">
          <div className="ww-field-row">
            <div className="ww-field">
              <label className="ww-label"><span className="ww-prompt">$</span> title</label>
              <input type="text" name="title" placeholder="e.g. Fast Delivery" value={formData.title} onChange={handleChange} required />
            </div>
            <div className="ww-field">
              <label className="ww-label"><span className="ww-prompt">$</span> icon (emoji/label)</label>
              <input type="text" name="icon" placeholder="e.g. ⚡" value={formData.icon} onChange={handleChange} />
            </div>
          </div>

          <div className="ww-field">
            <label className="ww-label"><span className="ww-prompt">$</span> description</label>
            <textarea name="description" placeholder="Explain this value proposition..." value={formData.description} onChange={handleChange} className="ww-textarea" rows={3} />
          </div>

          <div className="ww-field ww-field--sm">
            <label className="ww-label"><span className="ww-prompt">$</span> order</label>
            <input type="number" name="order" placeholder="0" value={formData.order} onChange={handleChange} />
          </div>

          <div className="ww-form-actions">
            <button type="submit" className="ww-submit">
              {editId ? "Update Item" : "Add Item"}
            </button>
            {editId && <button type="button" className="ww-cancel" onClick={handleCancelEdit}>Cancel</button>}
          </div>
        </form>
      </div>

      {items.length === 0 ? (
        <div className="ww-empty"><p>// no items yet</p></div>
      ) : (
        <div className="ww-grid">
          {items.map((item, index) => (
            <div className={`ww-card ww-card--${ACCENTS[index % ACCENTS.length]}`} key={item._id}>
              <div className="ww-card__icon">{item.icon || "•"}</div>
              <h4 className="ww-card__title">{item.title}</h4>
              {item.description && <p className="ww-card__desc">{item.description}</p>}
              <span className="ww-card__order">order: {item.order}</span>
              <div className="ww-card__actions">
                <button className="ww-edit-btn" onClick={() => handleEdit(item)}>Edit</button>
                <button className="ww-delete-btn" onClick={() => handleDelete(item._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}