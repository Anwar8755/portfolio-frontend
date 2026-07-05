import { useState, useEffect } from "react";
import { FaWhatsapp, FaPhone, FaTimes } from "react-icons/fa";
import "./FloatingContact.css";

const WHATSAPP = "919310575134";
const CALL     = "+919310575134";
const DISPLAY  = "+91 93105 75134";
const WA_MSG   = encodeURIComponent("Hi Anwar Ali, I saw your portfolio and would like to connect!");

export default function FloatingContact() {
  const [open,    setOpen]    = useState(false);
  const [visible, setVisible] = useState(false);

 
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(t);
  }, []);

  /* close on Escape */
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!visible) return null;

  return (
    <>
      {/* backdrop — closes menu on outside click */}
      {open && (
        <div
          className="fc-backdrop"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className={`fc-wrap ${visible ? "fc-wrap--in" : ""}`}>

        {/* ── tooltip label when closed ── */}
        {!open && (
          <div className="fc-tooltip" aria-hidden="true">
            Let's connect!
          </div>
        )}

        {/* ── speed-dial items ── */}
        <div className={`fc-items ${open ? "fc-items--open" : ""}`} role="menu">

          {/* WhatsApp */}
          <a 
            href={`https://wa.me/${WHATSAPP}?text=${WA_MSG}`}
            target="_blank"
            rel="noopener noreferrer"
            className="fc-item fc-item--wa"
            aria-label="Chat on WhatsApp"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            <span className="fc-item__label">
              <span className="fc-item__title">WhatsApp</span>
              <span className="fc-item__sub">{DISPLAY}</span>
            </span>
            <span className="fc-item__icon-wrap fc-item__icon-wrap--wa">
              <FaWhatsapp />
            </span>
          </a>

          {/* Call */}
          <a
            href={`tel:${CALL}`}
            className="fc-item fc-item--call"
            aria-label={`Call ${DISPLAY}`}
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            <span className="fc-item__label">
              <span className="fc-item__title">Call Me</span>
              <span className="fc-item__sub">{DISPLAY}</span>
            </span>
            <span className="fc-item__icon-wrap fc-item__icon-wrap--call">
              <FaPhone />
            </span>
          </a>

        </div>

        {/* ── main trigger ── */}
        <button
          className={`fc-trigger ${open ? "fc-trigger--open" : ""}`}
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close contact options" : "Open contact options"}
          aria-expanded={open}
          aria-haspopup="true"
        >
          <span className="fc-trigger__ring" aria-hidden="true" />
          <span className="fc-trigger__ring fc-trigger__ring--2" aria-hidden="true" />
          <span className="fc-trigger__face">
            <FaWhatsapp className="fc-trigger__wa"  />
            <FaTimes    className="fc-trigger__x"   />
          </span>
        </button>

      </div>
    </>
  );
}