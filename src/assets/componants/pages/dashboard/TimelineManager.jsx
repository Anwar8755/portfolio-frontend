import React, { useState, useEffect } from "react";
import API from "../../../../services/api";
import "./TimelineManager.css";

const ACCENTS = ["teal", "purple", "green", "amber"];
const DEFAULT_FORM = { title: "", description: "", period: "", icon: "", order: 0 };

export default function TimelineManager() {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState({ text: "", type: "" });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await API.get("/timeline");
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching timeline:", err);
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
        await API.put(`/timeline/${editId}`, formData);
      } else {
        await API.post("/timeline", formData);
      }
      fetchItems();
      setFormData(DEFAULT_FORM);
      setEditId(null);
      setMsg({ text: editId ? "Item updated!" : "Item added!", type: "success" });
      setTimeout(() => setMsg({ text: "", type: "" }), 2500);
    } catch (err) {
      console.error("Error submitting timeline item:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/timeline/${id}`);
      fetchItems();
    } catch (err) {
      console.error("Error deleting timeline item:", err);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      title: item.title || "",
      description: item.description || "",
      period: item.period || "",
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
    <div className="tm-wrap">

      <div className="tm-header">
        <p className="tm-eyebrow">// journey</p>
        <div className="tm-header-row">
          <h2 className="tm-title">Timeline Manager</h2>
          <span className="tm-count-pill">{items.length} total</span>
        </div>
        <p className="tm-subtitle">Add milestones for your journey/experience section.</p>
        {msg.text && <div className={`tm-msg tm-msg--${msg.type}`}>✓ {msg.text}</div>}
      </div>

      <div className="terminal-card tm-form-card">
        <div className="terminal-titlebar">
          <div className="terminal-dots">
            <span className="dot dot--red" /><span className="dot dot--yellow" /><span className="dot dot--green" />
          </div>
          <span className="terminal-filename">{editId ? "timeline.update.js" : "timeline.create.js"}</span>
          <span className="terminal-lang">{editId ? "editing" : "new"}</span>
        </div>

        <form onSubmit={handleSubmit} className="tm-form">
          <div className="tm-field-row">
            <div className="tm-field">
              <label className="tm-label"><span className="tm-prompt">$</span> title</label>
              <input type="text" name="title" placeholder="e.g. Started Learning to Code" value={formData.title} onChange={handleChange} required />
            </div>
            <div className="tm-field">
              <label className="tm-label"><span className="tm-prompt">$</span> period</label>
              <input type="text" name="period" placeholder="e.g. 2023" value={formData.period} onChange={handleChange} />
            </div>
          </div>

          <div className="tm-field-row">
            <div className="tm-field">
              <label className="tm-label"><span className="tm-prompt">$</span> icon (emoji/label)</label>
              <input type="text" name="icon" placeholder="e.g. 🚀" value={formData.icon} onChange={handleChange} />
            </div>
            <div className="tm-field">
              <label className="tm-label"><span className="tm-prompt">$</span> order</label>
              <input type="number" name="order" placeholder="0" value={formData.order} onChange={handleChange} />
            </div>
          </div>

          <div className="tm-field">
            <label className="tm-label"><span className="tm-prompt">$</span> description</label>
            <textarea name="description" placeholder="What happened at this milestone..." value={formData.description} onChange={handleChange} className="tm-textarea" rows={3} />
          </div>

          <div className="tm-form-actions">
            <button type="submit" className="tm-submit">
              {editId ? "Update Item" : "Add Item"}
            </button>
            {editId && <button type="button" className="tm-cancel" onClick={handleCancelEdit}>Cancel</button>}
          </div>
        </form>
      </div>

      {items.length === 0 ? (
        <div className="tm-empty"><p>// no timeline items yet</p></div>
      ) : (
        <div className="tm-list">
          {items.map((item, index) => (
            <div className={`tm-card tm-card--${ACCENTS[index % ACCENTS.length]}`} key={item._id}>
              <div className="tm-card__icon">{item.icon || "•"}</div>
              <div className="tm-card__body">
                <div className="tm-card__top">
                  <h4 className="tm-card__title">{item.title}</h4>
                  {item.period && <span className="tm-card__period">{item.period}</span>}
                </div>
                {item.description && <p className="tm-card__desc">{item.description}</p>}
                <span className="tm-card__order">order: {item.order}</span>
              </div>
              <div className="tm-card__actions">
                <button className="tm-edit-btn" onClick={() => handleEdit(item)}>Edit</button>
                <button className="tm-delete-btn" onClick={() => handleDelete(item._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}