import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import {
  PieChart, Pie, Cell, ResponsiveContainer,
} from "recharts";
import API from "../../../services/api";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./home.css";
import {
  FaGithub, FaLinkedin, FaArrowRight, FaExternalLinkAlt,
  FaChevronLeft, FaChevronRight,
} from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

const CATEGORY_COLORS = {
  Frontend: "#56d4dd",
  Backend: "#3fb950",
  Database: "#bc8cff",
  Tools: "#d29922",
};
const FALLBACK_COLORS = ["#56d4dd", "#3fb950", "#bc8cff", "#d29922", "#f85149", "#f0883e"];

/* ── CHARACTER-BY-CHARACTER TERMINAL TYPEWRITER FOR EDUCATION ── */
function EducationTerminal({ items }) {
  const [displayedText, setDisplayedText] = useState("");
  const [done, setDone] = useState(false);
  const containerRef = useRef(null);
  const [started, setStarted] = useState(false);

  const fullText = items.map((item, i) => {
    let lines = [];
    lines.push("{");
    lines.push(`  "title": "${item.degreeOrCourseName}",`);
    if (item.areaOfStudy) lines.push(`  "field": "${item.areaOfStudy}",`);
    lines.push(`  "type": "${item.type}",`);
    lines.push(`  "institution": "${item.institution}${item.location ? `, ${item.location}` : ""}",`);
    lines.push(`  "duration": "${item.startYear || "----"} - ${item.ongoing ? "Present" : (item.endYear || "----")}",`);
    if (item.percentageOrGrade) lines.push(`  "grade": "${item.percentageOrGrade}",`);
    if (item.description) lines.push(`  "note": "${item.description}",`);
    if (item.certificateUrl) lines.push(`  "certificate": "${item.certificateUrl}"`);
    lines.push(`}${i !== items.length - 1 ? "," : ""}`);
    return lines.join("\n");
  }).join("\n\n");

  useEffect(() => {
    if (!containerRef.current || started) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { setDisplayedText(fullText); setDone(true); return; }

    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayedText(fullText.slice(0, i));
      if (i >= fullText.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, 8);
    return () => clearInterval(interval);
  }, [started, fullText]);

  const renderHighlighted = (text) => {
    const parts = text.split(/(".*?")/g);
    return parts.map((part, idx) => {
      if (part.startsWith('"') && part.endsWith('"')) {
        if (part.match(/^"https?:\/\//)) {
          const url = part.slice(1, -1);
          return (
            <a key={idx} href={url} target="_blank" rel="noreferrer" className="edu-link">
              🔗 view_certificate.pdf
            </a>
          );
        }
        return <span key={idx} className="edu-str">{part}</span>;
      }
      return <span key={idx}>{part}</span>;
    });
  };

  return (
    <div className="edu-body" ref={containerRef}>
      <pre className="edu-pre">
        {renderHighlighted(displayedText)}
        {!done && <span className="edu-caret" />}
      </pre>
    </div>
  );
}

/* ── TYPEWRITER HOOK ── */
function useTypewriter(text, speed = 45, startDelay = 300) {
  const [display, setDisplay] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!text) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { setDisplay(text); setDone(true); return; }

    setDisplay("");
    setDone(false);
    let i = 0;
    let interval;
    const startTimer = setTimeout(() => {
      interval = setInterval(() => {
        i++;
        setDisplay(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
    }, startDelay);

    return () => { clearTimeout(startTimer); clearInterval(interval); };
  }, [text, speed, startDelay]);

  return { display, done };
}

/* ── PROJECT CAROUSEL ── */
function HomeCarousel({ images, title }) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);
  const slides = images && images.length ? images : [];

  useEffect(() => {
    if (slides.length <= 1) return;
    timerRef.current = setInterval(() => setIndex((i) => (i + 1) % slides.length), 3000);
    return () => clearInterval(timerRef.current);
  }, [slides.length]);

  if (slides.length === 0) {
    return <div className="hc-carousel hc-carousel--empty"><span>// no image</span></div>;
  }

  return (
    <div className="hc-carousel">
      {slides.map((src, i) => (
        <img key={i} src={src} alt={`${title} ${i + 1}`} className={`hc-carousel__img ${i === index ? "hc-carousel__img--active" : ""}`} />
      ))}
      {slides.length > 1 && (
        <div className="hc-carousel__dots">
          {slides.map((_, i) => <span key={i} className={`hc-carousel__dot ${i === index ? "hc-carousel__dot--active" : ""}`} />)}
        </div>
      )}
    </div>
  );
}

/* ── TESTIMONIALS ROW — horizontal cards with scroll arrows ── */
function TestimonialsRow({ items }) {
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const getInitials = (n) => n?.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join("") || "?";

  const checkScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    checkScroll();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [items]);

  const scrollBy = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const cardWidth = el.querySelector(".tsr-card")?.offsetWidth || 320;
    el.scrollBy({ left: dir * (cardWidth + 20), behavior: "smooth" });
  };

  return (
    <div className="tsr-wrap">
      {canScrollLeft && (
        <button className="tsr-nav tsr-nav--left" onClick={() => scrollBy(-1)} aria-label="Previous">
          <FaChevronLeft />
        </button>
      )}

      <div className="tsr-track" ref={trackRef}>
        {items.map((t) => (
          <div className="tsr-card" key={t._id}>
            <div className="tsr-card__quote-mark">"</div>
            <p className="tsr-card__quote">{t.quote}</p>
            <div className="tsr-card__rating">
              {"★".repeat(t.rating || 5)}{"☆".repeat(5 - (t.rating || 5))}
            </div>
            <div className="tsr-card__person">
              <span className="tsr-card__avatar">
                {t.photo ? <img src={t.photo} alt={t.name} /> : getInitials(t.name)}
              </span>
              <div className="tsr-card__info">
                <p className="tsr-card__name">{t.name}</p>
                <p className="tsr-card__role">
                  {t.role}{t.role && t.company ? " · " : ""}{t.company}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {canScrollRight && (
        <button className="tsr-nav tsr-nav--right" onClick={() => scrollBy(1)} aria-label="Next">
          <FaChevronRight />
        </button>
      )}
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [availability, setAvailability] = useState({ isAvailable: true, message: "Open to work" });
  const [hoveredCat, setHoveredCat] = useState(null);
  const [about, setAbout] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [whyItems, setWhyItems] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [education, setEducation] = useState([]);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const { display: typedTagline, done: taglineDone } = useTypewriter(about?.tagline || "", 42, 400);

  useEffect(() => { fetchSkills(); }, []);
  useEffect(() => { fetchEducation(); }, []);
  useEffect(() => { fetchProjects(); }, []);
  useEffect(() => { fetchAvailability(); }, []);
  useEffect(() => { fetchAbout(); }, []);
  useEffect(() => { fetchTimeline(); }, []);
  useEffect(() => { fetchWhyItems(); }, []);
  useEffect(() => { fetchTestimonials(); }, []);

  const fetchEducation = async () => {
    try { const res = await API.get("/education"); setEducation(Array.isArray(res.data) ? res.data : []); }
    catch (err) { console.error(err); }
  };

  const fetchSkills = async () => {
    try { const res = await API.get("/skills"); setSkills(Array.isArray(res.data) ? res.data : []); }
    catch (err) { console.error(err); }
  };
  const fetchProjects = async () => {
    try { const res = await axios.get(`${API_BASE_URL}/projects`); setProjects(Array.isArray(res.data) ? res.data.slice(0, 4) : []); }
    catch (err) { console.error(err); }
  };
  const fetchAvailability = async () => {
    try { const res = await axios.get(`${API_BASE_URL}/availability`); setAvailability(res.data); }
    catch (err) { console.error(err); }
  };
  const fetchAbout = async () => {
    try { const res = await API.get("/about"); setAbout(res.data); }
    catch (err) { console.error(err); }
  };
  const fetchTimeline = async () => {
    try { const res = await API.get("/timeline"); setTimeline(Array.isArray(res.data) ? res.data : []); }
    catch (err) { console.error(err); }
  };
  const fetchWhyItems = async () => {
    try { const res = await API.get("/why-work-with-me"); setWhyItems(Array.isArray(res.data) ? res.data : []); }
    catch (err) { console.error(err); }
  };
  const fetchTestimonials = async () => {
    try { const res = await API.get("/testimonials"); setTestimonials(Array.isArray(res.data) ? res.data : []); }
    catch (err) { console.error(err); }
  };

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let ctx;
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        gsap.timeline({ defaults: { ease: "power4.out" } })
          .from(".hero-label", { opacity: 0, y: -12, duration: 0.5 })
          .from(".hero-left h1 .line", { opacity: 0, y: 40, duration: 0.7, stagger: 0.1 }, "-=0.2")
          .from(".hero-sub", { opacity: 0, y: 16, duration: 0.55 }, "-=0.35")
          .from(".hero-actions > *", { opacity: 0, y: 14, duration: 0.45, stagger: 0.1 }, "-=0.3")
          .from(".hero-socials a", { opacity: 0, scale: 0.7, duration: 0.4, stagger: 0.08 }, "-=0.2")
          .from(".code-card", { opacity: 0, x: 50, duration: 0.8 }, "-=0.7")
          .from(".code-card .code-row", { opacity: 0, x: -8, duration: 0.3, stagger: 0.07 }, "-=0.35");

        gsap.utils.toArray(".sr").forEach((el) => {
          gsap.from(el, {
            opacity: 0, y: 44, duration: 0.7, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" }
          });
        });
        gsap.utils.toArray(".sr-stagger").forEach((parent) => {
          gsap.from(parent.children, {
            opacity: 0, y: 28, duration: 0.6, ease: "power3.out", stagger: 0.08,
            scrollTrigger: { trigger: parent, start: "top 88%", toggleActions: "play none none none" }
          });
        });
        gsap.utils.toArray("[data-count]").forEach((el) => {
          const target = parseFloat(el.getAttribute("data-count"));
          const suffix = el.getAttribute("data-suffix") || "";
          const obj = { v: 0 };
          ScrollTrigger.create({
            trigger: el, start: "top 90%", once: true,
            onEnter: () => gsap.to(obj, {
              v: target, duration: 1.4, ease: "power2.out",
              onUpdate: () => { el.textContent = Math.floor(obj.v) + suffix; }
            }),
          });
        });
      });
    }, 50);

    return () => {
      clearTimeout(timer);
      if (ctx) ctx.revert();
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => { ScrollTrigger.refresh(); }, 300);
    return () => clearTimeout(timer);
  }, [projects, skills, about, timeline, whyItems, testimonials, education]);

  useEffect(() => {
    const handleLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", handleLoad);
    return () => window.removeEventListener("load", handleLoad);
  }, []);

  const uniqueCategories = [...new Set(skills.map((s) => s.category || "Frontend"))];
  const categoryGroups = uniqueCategories.map((cat, i) => ({
    name: cat,
    items: skills.filter((s) => (s.category || "Frontend") === cat),
    color: CATEGORY_COLORS[cat] || FALLBACK_COLORS[i % FALLBACK_COLORS.length],
  }));

  const hasTimeline = timeline.length > 0;
  const hasWhy = whyItems.length > 0;

  return (
    <div className="home">
      <div className="home-noise" aria-hidden="true" />

      {/* ═══════ HERO ═══════ */}
      <section className="hero">
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-grid" aria-hidden="true" />
        <div className="container hero-inner">
          <div className="hero-left">
            <div className="hero-label">
              <span className={`label-dot ${availability.isAvailable ? "label-dot--on" : "label-dot--off"}`} />
              <span className="label-mono">$ whoami</span>
              <span className={`label-tag ${availability.isAvailable ? "label-tag--on" : "label-tag--off"}`}>{availability.message}</span>
            </div>
            <h1>
              <span className="line">Building</span>
              <span className="line line--accent">scalable</span>
              <span className="line">digital products.</span>
            </h1>
            <p className="hero-sub">Full-stack MERN developer crafting high-performance web apps with clean architecture and thoughtful UX.</p>
            <div className="hero-actions">
              <a href="/project" className="btn-primary">View Projects <FaArrowRight className="btn-icon" /></a>
              <a href="/contact" className="btn-ghost">Hire Me</a>
            </div>
            <div className="hero-socials">
              <a href="https://github.com/Anwar8755" target="_blank" rel="noreferrer" aria-label="GitHub"><FaGithub /></a>
              <a href="https://linkedin.com/in/anwar-ali-516b861b7" target="_blank" rel="noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
              <span className="social-line" />
              <span className="social-text">anwarali812632@gmail.com</span>
            </div>
          </div>

          <div className="hero-right">
            <div className="code-card">
              <div className="code-card__bar">
                <span /><span /><span />
                <span className="code-card__file">developer.js</span>
                <span className="code-card__lang">JavaScript</span>
              </div>
              <div className="code-card__body">
                <div className="code-row"><span className="ln">1</span><span className="kw">const</span> <span className="fn">developer</span> <span className="op">=</span> <span className="br">{"{"}</span></div>
                <div className="code-row"><span className="ln">2</span><span className="key">  name</span><span className="op">:</span> <span className="str">"Anwar Ali"</span><span className="op">,</span></div>
                <div className="code-row"><span className="ln">3</span><span className="key">  role</span><span className="op">:</span> <span className="str">"Full Stack Dev"</span><span className="op">,</span></div>
                <div className="code-row"><span className="ln">4</span><span className="key">  stack</span><span className="op">:</span> <span className="str">"MERN"</span><span className="op">,</span></div>
                <div className="code-row"><span className="ln">5</span><span className="key">  focus</span><span className="op">:</span> <span className="str">"Web Apps"</span><span className="op">,</span></div>
                <div className="code-row">
                  <span className="ln">6</span><span className="key">  status</span><span className="op">:</span>{" "}
                  <span className={`str ${availability.isAvailable ? "available" : "unavailable"}`}>"{availability.isAvailable ? "available" : "not available"}"</span>
                  <span className="op">,</span>
                </div>
                <div className="code-row"><span className="ln">7</span><span className="br">{"}"}</span><span className="cursor" aria-hidden="true" /></div>
              </div>
              <div className="code-card__footer">
                <span className={`footer-dot ${availability.isAvailable ? "footer-dot--green" : "footer-dot--red"}`} />
                <span>No issues · 7 lines</span>
                <span className="footer-branch">main</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ STATS ═══════ */}
      <section className="stats-strip">
        <div className="container stats-inner sr-stagger">
          <div className="stat"><span className="stat__num" data-count="10" data-suffix="+">10+</span><span className="stat__lbl">Projects Shipped</span></div>
          <div className="stat-sep" aria-hidden="true" />
          <div className="stat"><span className="stat__num" data-count="2" data-suffix="+">2+</span><span className="stat__lbl">Years of Learning</span></div>
          <div className="stat-sep" aria-hidden="true" />
          <div className="stat"><span className="stat__num stat__num--alt">MERN</span><span className="stat__lbl">Core Stack</span></div>
          <div className="stat-sep" aria-hidden="true" />
          <div className="stat"><span className="stat__num stat__num--alt">REST</span><span className="stat__lbl">API Architecture</span></div>
        </div>
      </section>

      {/* ═══════ ABOUT — full width whoami terminal ═══════ */}
      {about && (about.name || about.bio) && (
        <section className="section about-section">
          <div className="container">
            <div className="ab-terminal sr">

              <div className="ab-bar">
                <span className="ab-dot ab-dot--red" />
                <span className="ab-dot ab-dot--yellow" />
                <span className="ab-dot ab-dot--green" />
                <span className="ab-bar__file">whoami.sh</span>
              </div>

              <div className="ab-body">
                <p className="ab-prompt-line">
                  <span className="ab-prompt">$</span> whoami
                </p>

                <div className="ab-profile">
                  <div className="ab-photo">
                    {about.photo ? <img src={about.photo} alt={about.name} /> : (
                      <span className="ab-photo__initials">
                        {about.name ? about.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "??"}
                      </span>
                    )}
                  </div>
                  <div className="ab-info">
                    <h2 className="ab-name">{about.name}</h2>
                    <p className="ab-tagline">
                      <span className="ab-arrow">›</span> {typedTagline}
                      {!taglineDone && <span className="ab-caret" />}
                    </p>
                  </div>
                </div>

                {about.bio && (
                  <>
                    <p className="ab-prompt-line ab-prompt-line--spaced">
                      <span className="ab-prompt">$</span> cat bio.txt
                    </p>
                    <p className="ab-bio">{about.bio}</p>
                  </>
                )}
              </div>

            </div>
          </div>
        </section>
      )}
      {/* ═══════ EDUCATION — cat degrees.json with character typewriter ═══════ */}
      {education.length > 0 && (
        <section className="section education-section">
          <div className="container">
            <div className="sec-head sec-head--center sr">
              <span className="sec-eyebrow">Qualifications</span>
              <h2>Education & Certifications</h2>
            </div>

            <div className="edu-terminal sr">
              <div className="ab-bar">
                <span className="ab-dot ab-dot--red" />
                <span className="ab-dot ab-dot--yellow" />
                <span className="ab-dot ab-dot--green" />
                <span className="ab-bar__file">cat degrees.json</span>
              </div>

              <EducationTerminal items={education} />
            </div>
          </div>
        </section>
      )}

      {/* ═══════ TIMELINE + WHY WORK WITH ME — side by side ═══════ */}
      {(hasTimeline || hasWhy) && (
        <section className="section journey-why-section">
          <div className="container">
            <div className={`jw-grid ${hasTimeline && hasWhy ? "jw-grid--split" : ""}`}>

              {hasTimeline && (
                <div className="jw-col">
                  <div className="sec-head sec-head--center sr">
                    <span className="sec-eyebrow">My journey</span>
                    <h2>How I Got Here</h2>
                  </div>

                  <div className="gl-terminal sr">
                    <div className="ab-bar">
                      <span className="ab-dot ab-dot--red" />
                      <span className="ab-dot ab-dot--yellow" />
                      <span className="ab-dot ab-dot--green" />
                      <span className="ab-bar__file">git log --oneline --graph</span>
                    </div>
                    <div className="gl-body sr-stagger">
                      {timeline.map((item, i) => (
                        <div className="gl-commit" key={item._id}>
                          <div className="gl-commit__graph">
                            <span className="gl-commit__node">{item.icon || "●"}</span>
                            {i !== timeline.length - 1 && <span className="gl-commit__branch" />}
                          </div>
                          <div className="gl-commit__content">
                            <div className="gl-commit__top">
                              <span className="gl-commit__hash">{Math.random().toString(16).slice(2, 9)}</span>
                              <span className="gl-commit__title">{item.title}</span>
                              {item.period && <span className="gl-commit__period">{item.period}</span>}
                            </div>
                            {item.description && <p className="gl-commit__desc">{item.description}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {hasTimeline && hasWhy && (
                <div className="jw-divider" aria-hidden="true">
                  <span className="jw-divider__track" />
                  <span className="jw-divider__glow" />
                </div>
              )}

              {hasWhy && (
                <div className="jw-col">
                  <div className="sec-head sec-head--center sr">
                    <span className="sec-eyebrow">Why work with me</span>
                    <h2>What You Get</h2>
                  </div>

                  <div className="ls-terminal sr">
                    <div className="ab-bar">
                      <span className="ab-dot ab-dot--red" />
                      <span className="ab-dot ab-dot--yellow" />
                      <span className="ab-dot ab-dot--green" />
                      <span className="ab-bar__file">ls -la ./why-work-with-me</span>
                    </div>
                    <div className="ls-body sr-stagger">
                      {whyItems.map((item) => (
                        <div className="ls-row" key={item._id}>
                          <span className="ls-row__perm">drwxr-xr-x</span>
                          <span className="ls-row__icon">{item.icon || "✓"}</span>
                          <div className="ls-row__info">
                            <span className="ls-row__name">{item.title}</span>
                            {item.description && <span className="ls-row__desc">{item.description}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </section>
      )}

      {/* ═══════ PROJECTS ═══════ */}
      <section className="section projects-section">
        <div className="container">
          <div className="sec-head sr">
            <div className="sec-head__left"><span className="sec-eyebrow">Featured work</span><h2>Selected Projects</h2></div>
            <a href="/project" className="sec-head__link">All projects <FaArrowRight /></a>
          </div>
          <div className="hc-grid sr-stagger">
            {projects.map((project) => (
              <article className="hc-card" key={project._id} onClick={() => navigate(`/project/${project._id}`)}>
                {project.featured && <span className="hc-card__featured">★ Featured</span>}
                <HomeCarousel images={project.images} title={project.title} />
                <div className="hc-card__body">
                  <div className="hc-card__top">
                    {project.category && <span className="hc-card__category">{project.category}</span>}
                    <div className="hc-card__links">
                      {project.link && <a href={project.link} target="_blank" rel="noreferrer" aria-label="Live" onClick={(e) => e.stopPropagation()}><FaExternalLinkAlt /></a>}
                      {project.github && <a href={project.github} target="_blank" rel="noreferrer" aria-label="GitHub" onClick={(e) => e.stopPropagation()}><FaGithub /></a>}
                    </div>
                  </div>
                  <h3 className="hc-card__title">{project.title}</h3>
                  {project.description && <p className="hc-card__desc">{project.description}</p>}
                  {project.techStack && project.techStack.length > 0 && (
                    <div className="hc-card__pills">{project.techStack.slice(0, 4).map((t, j) => <span key={j}>{t}</span>)}</div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ SKILLS ═══════ */}
      <section className="section skills-section">
        <div className="container">
          <div className="sec-head sec-head--center sr">
            <span className="sec-eyebrow">Tech stack</span>
            <h2>Tools I Build With</h2>
            <p className="sec-sub">Technologies I reach for when building production-grade apps.</p>
          </div>

          <div className="sm-terminal sr">
            <div className="ab-bar">
              <span className="ab-dot ab-dot--red" />
              <span className="ab-dot ab-dot--yellow" />
              <span className="ab-dot ab-dot--green" />
              <span className="ab-bar__file">stack --summary</span>
              <span className="sm-bar__total">{skills.length} total</span>
            </div>

            <div className="sm-body sr-stagger">
              {categoryGroups.map((group) => {
                const maxCount = Math.max(...categoryGroups.map((g) => g.items.length), 1);
                const pct = Math.round((group.items.length / maxCount) * 100);
                return (
                  <div
                    className="sm-row"
                    key={group.name}
                    onMouseEnter={() => {
                      clearTimeout(window.__skillPopupTimer);
                      setHoveredCat(group.name);
                    }}
                    onMouseLeave={() => {
                      window.__skillPopupTimer = setTimeout(() => setHoveredCat(null), 200);
                    }}
                  >
                    <span className="sm-row__label" style={{ color: group.color }}>{group.name}</span>
                    <div className="sm-row__track">
                      <div
                        className="sm-row__fill"
                        style={{ width: `${pct}%`, background: group.color, boxShadow: `0 0 12px ${group.color}66` }}
                      />
                    </div>
                    <span className="sm-row__count">{group.items.length}</span>

                    {hoveredCat === group.name && (
                      <div
                        className="sm-popup"
                        onMouseEnter={() => clearTimeout(window.__skillPopupTimer)}
                        onMouseLeave={() => {
                          window.__skillPopupTimer = setTimeout(() => setHoveredCat(null), 200);
                        }}
                      >
                        <p className="sm-popup__title">{group.name}</p>
                        <div className="sm-popup__list">
                          {group.items.map((s) => (
                            <div key={s._id} className="sm-popup__item">
                              <img src={s.icon} alt={s.name} />
                              <span>{s.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="skills-view-all">
            <button className="skills-donut-btn" onClick={() => navigate("/skills")}>
              View All Skills <FaArrowRight />
            </button>
          </div>
        </div>
      </section>

      {/* ═══════ TESTIMONIALS ═══════ */}
      {testimonials.length > 0 && (
        <section className="section testimonials-section">
          <div className="container">
            <div className="sec-head sec-head--center sr">
              <span className="sec-eyebrow">Client feedback</span>
              <h2>What People Say</h2>
            </div>
            <TestimonialsRow items={testimonials} />
          </div>
        </section>
      )}

      {/* ═══════ CTA ═══════ */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-box sr">
            <div className="cta-box__glow" aria-hidden="true" />
            <div className="cta-box__corner cta-box__corner--tl" aria-hidden="true" />
            <div className="cta-box__corner cta-box__corner--tr" aria-hidden="true" />
            <div className="cta-box__corner cta-box__corner--bl" aria-hidden="true" />
            <div className="cta-box__corner cta-box__corner--br" aria-hidden="true" />
            <span className="cta-eyebrow">// open to opportunities</span>
            <h2 className="cta-title">Let's build something<br /><em>exceptional</em> together.</h2>
            <p className="cta-sub">Have a project in mind? I'd love to hear about it.</p>
            <a href="/contact" className="btn-primary btn-primary--lg">Start a Conversation <FaArrowRight className="btn-icon" /></a>
          </div>
        </div>
      </section>
    </div>
  );
}