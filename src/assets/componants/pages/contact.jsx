import { useState } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import "./contact.css";
import axios from "axios";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: ""
  });
  const [showPopup, setShowPopup] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/contacts`, formData);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
      setFormData({ name: "", phone: "", email: "", subject: "", message: "" });
    } catch (error) {
      alert("Message send failed. Try again.");
      console.error(error);
    }
  };

  return (
    <div className="contact-page">

      <div className="contact-grid-bg" aria-hidden="true" />
      <div className="contact-glow"    aria-hidden="true" />

      <div className="contact-wrapper">

        {/* ── LEFT PANEL ── */}
        <div className="contact-info">

          <div className="info-eyebrow">
            <span className="eyebrow-dot" />
            <span>contact.js</span>
          </div>

          <h2 className="info-heading">
            Let's <span className="heading-accent">work</span>
            <br />together.
          </h2>

          <p className="info-subtext">
            Have a project in mind or just want to say hello?
            Fill out the form and I'll get back to you as soon
            as possible.
          </p>

          <div className="info-links">

            <a
              href="https://github.com/Anwar8755"
              target="_blank"
              rel="noopener noreferrer"
              className="info-link"
            >
              <FaGithub className="link-icon" />
              <div className="link-text">
                <span className="link-label">GitHub</span>
                <span className="link-val">github.com/Anwar8755</span>
              </div>
            </a>
            <a
            
              href="http://linkedin.com/in/anwar-ali-516b861b7"
              target="_blank"
              rel="noopener noreferrer"
              className="info-link"
            >
              <FaLinkedin className="link-icon" />
              <div className="link-text">
                <span className="link-label">LinkedIn</span>
                <span className="link-val">anwar-ali-516b861b7</span>
              </div>
            </a>
            <a
            
              href="mailto:anwarali812632@gmail.com"
              className="info-link"
            >
              <MdEmail className="link-icon" />
              <div className="link-text">
                <span className="link-label">Email</span>
                <span className="link-val">anwarali812632@gmail.com</span>
              </div>
            </a>

          </div>

        </div>

        {/* ── RIGHT PANEL — FORM ── */}
        <div className="contact-form-wrap">

          <div className="form-topbar">
            <span className="dot dot-red"    />
            <span className="dot dot-yellow" />
            <span className="dot dot-green"  />
            <span className="form-filename">message.send()</span>
          </div>

         
          <form className="contact-form" onSubmit={handleSubmit}>

            <div className="form-row">
              <div className="field-wrap">
                <label className="field-label" htmlFor="name">Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field-wrap">
                <label className="field-label" htmlFor="phone">Phone</label>
                <input
                  id="phone"
                  type="text"
                  name="phone"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="field-wrap">
              <label className="field-label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field-wrap">
              <label className="field-label" htmlFor="subject">Subject</label>
              <input
                id="subject"
                type="text"
                name="subject"
                placeholder="What's this about?"
                value={formData.subject}
                onChange={handleChange}
              />
            </div>

            <div className="field-wrap">
              <label className="field-label" htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                placeholder="Tell me about your project…"
                value={formData.message}
                onChange={handleChange}
                required
                rows="4"
              />
            </div>

            <button type="submit" className="submit-btn">
              Send Message
              <span className="submit-arrow">→</span>
            </button>

          </form>

          
          <div className="social-links">
            <a href="https://github.com/Anwar8755"              target="_blank" rel="noopener noreferrer"><FaGithub  /></a>
            <a href="http://linkedin.com/in/anwar-ali-516b861b7" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
            <a href="mailto:anwarali812632@gmail.com"><MdEmail /></a>
          </div>

        </div>

      </div>

      
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <span className="popup-icon">✓</span>
            <h3>Thank You!</h3>
            <p>Your message has been sent successfully.</p>
          </div>
        </div>
      )}

    </div>
  );
}